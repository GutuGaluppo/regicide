# Plano de Implementação — Tutorial Guiado com Spotlight

## Contexto

Testes com jogadores novatos mostraram que o tutorial atual **não está claro**. Hoje o fluxo é:

- [components/TutorialOverlay/TutorialOverlay.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/TutorialOverlay/TutorialOverlay.tsx)
  renderiza um `TutorialWelcomeModal` (modal de boas-vindas) e um `TutorialStepPanel` — um **painel de
  texto inline**, posicionado entre a carta do inimigo e a mão do jogador.
- [hooks/useTutorialFlow.ts](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/hooks/useTutorialFlow.ts)
  é uma **máquina de estados orientada a eventos do jogo**: avança de `select_card → attack → suffer_damage
  → complete` conforme o jogador realmente seleciona carta, ataca e sofre dano (não por botões "Próximo").
- A conclusão é persistida (`regicide_tutorial_done`) em `localStorage`/AsyncStorage.

**Problema central:** o texto explica a ação mas **não mostra onde** ela acontece. Nada escurece a tela nem
aponta para o elemento exato (a carta, o botão Atacar, a área de descarte). O novato lê "toque em uma carta"
mas não sabe qual elemento da tela é a carta nem onde está o botão Atacar.

## Objetivo

Substituir o painel de texto por um **tutorial spotlight**:

1. **Escurecer toda a tela** com um overlay translúcido.
2. **Destacar apenas o elemento-alvo** abrindo um "buraco" (recorte) na camada escura sobre ele, com um anel
   pulsante para chamar atenção.
3. **Texto explicativo** em um balão (callout) ancorado ao alvo, com a ação a executar e um link "Pular".
4. **Apenas o alvo deve ser clicável** — o resto da tela fica bloqueado para toques durante o passo.
5. Manter a lógica de avanço já existente (orientada a eventos do jogo) — o passo avança quando o jogador
   **faz** a ação, não ao clicar "Próximo".

## Abordagem recomendada: implementação própria (sobre libs já instaladas)

O projeto **já tem todas as dependências necessárias**, então não é preciso adicionar pacote nenhum:

- `react-native-svg` (15.12.1) — para a máscara de recorte (dim + buraco arredondado), funciona em nativo e web.
- `react-native-reanimated` (4.1.1) + `react-native-worklets` — para o anel pulsante.
- `react-native-gesture-handler` (2.28.0) — bloqueio/captura de toques.
- `react-native-safe-area-context` — posicionar o balão respeitando notch/áreas seguras.
- `zustand` (5) — registro dos alvos medidos (mesmo padrão de [store/actionHintsStore.ts](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/store/actionHintsStore.ts)).

**Por que próprio e não um pacote pronto?** O ponto decisivo é o modelo de avanço. Bibliotecas de tour
(rn-tourguide, copilot, spotlight-tour) são **lineares por botão "Next"**. O nosso `useTutorialFlow` avança
por **estado do jogo** (selecionou carta → avança; atacou → avança). Forçar uma lib linear exigiria
contornar o controle dela a cada passo, perdendo a vantagem. Uma camada própria reaproveita
`useTutorialFlow` intacto e dá controle total de estilo (tema Cinzel/dourado já usado). Mesmo assim, a seção
[Pacotes alternativos](#pacotes-alternativos-avaliados) compara as libs caso se prefira terceirizar.

## Arquitetura

```
useTutorialFlow (já existe)  ──step──►  mapa step→targetId
        │                                      │
        ▼                                      ▼
TutorialProvider / tutorialTargetStore (zustand)  ◄── registra rect dos alvos
        │
        ▼
SpotlightOverlay  ──►  SVG Mask (dim + buraco)  +  4 blockers de toque  +  anel pulsante (reanimated)
        │
        ▼
TutorialTooltip  ──►  balão de texto posicionado relativo ao buraco (acima/abaixo) + "Pular"
```

### 1. Registro e medição dos alvos (`tutorialTargetStore` + `TutorialTarget`)

Cada elemento que pode ser destacado é envolvido por um wrapper que mede sua posição absoluta na janela e
publica no store.

- **Store** (`store/tutorialTargetStore.ts`, zustand): `targets: Record<string, Rect>`,
  `setTarget(id, rect)`, `clearTarget(id)`. `Rect = { x, y, width, height }`.
- **Wrapper** `components/TutorialOverlay/TutorialTarget.tsx`:
  - Recebe `id` e `children`; renderiza um `<View>` com `ref`.
  - Em `onLayout` e quando `useWindowDimensions()` muda (rotação/resize/web), chama
    `ref.current.measureInWindow((x, y, w, h) => setTarget(id, { x, y, width: w, height: h }))`.
  - `measureInWindow` funciona em nativo **e** em `react-native-web`, retornando coordenadas relativas à
    janela — exatamente o que o overlay precisa.
  - Em `useEffect` de desmontagem chama `clearTarget(id)`.

Alvos a instrumentar (IDs sugeridos): `tutorial-hand-card` (primeira carta jogável da mão), `tutorial-attack`
(botão Atacar), `tutorial-discard` (área/botão de cobrir dano), `tutorial-enemy` (carta do inimigo, usado no
passo de boas-vindas para explicar vida/⚔).

### 2. Overlay com recorte (`SpotlightOverlay.tsx`)

Renderizado em um `<Modal transparent>` ou em um container `position:absolute` de tela cheia com `zIndex`
alto, acima de tudo.

**Visual (SVG, `pointerEvents="none"`):**

```tsx
<Svg width={W} height={H} pointerEvents="none">
  <Defs>
    <Mask id="spot">
      <Rect x={0} y={0} width={W} height={H} fill="white" />
      <Rect x={hole.x-P} y={hole.y-P} width={hole.width+2P} height={hole.height+2P}
            rx={12} fill="black" />
    </Mask>
  </Defs>
  <Rect x={0} y={0} width={W} height={H} fill="rgba(8,8,14,0.78)" mask="url(#spot)" />
</Svg>
```

Isso escurece tudo e abre um buraco arredondado (`rx`) com padding `P` sobre o alvo.

**Bloqueio de toque (4 retângulos):** SVG não consegue, sozinho, "deixar passar" toque só no buraco. Padrão
robusto e multiplataforma: além do SVG visual, renderizar **4 `Pressable` transparentes** (topo, base,
esquerda, direita do buraco) que **absorvem** o toque (`onPress` = no-op ou "balançar" o balão). A região do
buraco fica **sem overlay**, então o toque chega ao alvo real por baixo → só o alvo é clicável.

**Anel pulsante (reanimated):** um `Animated.View` com borda dourada sobre o buraco, animando
`scale`/`opacity` via `withRepeat(withTiming(...))` para guiar o olhar.

### 3. Balão de texto (`TutorialTooltip.tsx`)

- Recebe `hole: Rect`, título, corpo e callbacks (`onSkip`, e `onNext`/`onComplete` quando aplicável).
- **Posicionamento:** se houver espaço abaixo do buraco (`hole.y + hole.height + tooltipH + margem < H - insets.bottom`),
  ancora **abaixo**; senão **acima**. Centraliza horizontalmente no alvo, com clamp nas bordas
  (`insets.left/right` + `screenPadding` de [useResponsiveLayout](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/hooks/useResponsiveLayout.ts)).
- Estilo seguindo o tema existente (Cinzel, dourado `#E8D5A3`, cartão escuro) — reusar tokens de
  `TutorialOverlay.styles.ts`.
- Mantém o link "Pular" (`tutorial.skip`) e, nos passos sem ação de jogo (`welcome`, `complete`), um botão
  primário "Começar"/"Jogar".

### 4. Integração com `useTutorialFlow` (mínima alteração)

`useTutorialFlow` **permanece a fonte da verdade** do passo. Adiciona-se apenas um mapa `step → targetId`:

| step            | alvo destacado        | avança quando…                         |
|-----------------|-----------------------|----------------------------------------|
| `welcome`       | `tutorial-enemy` (ou modal central) | usuário toca "Começar"   |
| `select_card`   | `tutorial-hand-card`  | `selectedIdsSize > 0` (já existe)      |
| `attack`        | `tutorial-attack`     | ataque processado (já existe)         |
| `suffer_damage` | `tutorial-discard`    | volta a `player_turn` (já existe)     |
| `complete`      | — (balão central)     | usuário toca "Jogar"                   |

O `SpotlightOverlay` lê `targets[map[step]]` do store. Enquanto o alvo do passo ainda não foi medido
(`rect` ausente), mostra o dim **sem** buraco + balão central (fallback), e abre o recorte assim que a medição
chega. Quando o passo é `welcome`/`complete`, pode usar o modal central atual em vez do recorte.

## Mudanças por arquivo

**Novos:**
- `store/tutorialTargetStore.ts` — registro de rects dos alvos.
- `components/TutorialOverlay/TutorialTarget.tsx` — wrapper de medição.
- `components/TutorialOverlay/SpotlightOverlay.tsx` — dim + máscara SVG + blockers + anel pulsante.
- `components/TutorialOverlay/TutorialTooltip.tsx` — balão posicionado.

**Alterados:**
- [components/TutorialOverlay/TutorialOverlay.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/TutorialOverlay/TutorialOverlay.tsx)
  — `TutorialStepPanel` deixa de ser texto inline e passa a compor `SpotlightOverlay` + `TutorialTooltip`
  (ou é substituído por um `TutorialSpotlight` exportado pelo `index.ts`). `TutorialWelcomeModal` pode ser
  mantido para `welcome`/`complete`.
- `components/TutorialOverlay/TutorialOverlay.styles.ts` — tokens do balão/anel (reuso dos atuais).
- [components/TutorialOverlay/index.ts](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/TutorialOverlay/index.ts)
  — exportar os novos componentes.
- [screens/GameScreen/GameScreen.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/GameScreen/GameScreen.tsx)
  — (a) envolver a primeira carta jogável, o botão Atacar, a área de descarte e a carta do inimigo com
  `<TutorialTarget id=…>`; (b) renderizar o `SpotlightOverlay` no topo da árvore (após o conteúdo, antes do
  fechamento), em vez do `TutorialStepPanel` inline (linhas ~338-344 e ~458-462).
- [screens/GameScreen/components/PlayerHand](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/GameScreen/components/)
  e o componente do botão Atacar — aceitar/propagar o wrapper de alvo (ou expor um `ref`/`testID` para
  envolver externamente). A primeira carta jogável recebe o `id` de alvo só durante o tutorial.
- `i18n/locales/{en,pt-BR,es,fr}.ts` — o namespace `tutorial.*` **já existe** e cobre os passos; ajustar
  textos para o novo formato (frases curtas e imperativas, ex.: "Toque nesta carta"). Sem novas chaves
  obrigatórias.

## Casos de borda e responsividade

- **Web vs nativo:** `measureInWindow` é suportado nos dois; testar em ambos. Em web, escutar resize via
  `useWindowDimensions` (já reativo) e remedir.
- **Rotação / mudança de layout:** remedir em `onLayout` e quando `width/height` da janela mudarem.
- **Scroll:** a mão e o tabuleiro hoje não rolam durante o turno; se algum alvo ficar dentro de scroll no
  futuro, remedir em `onScroll`.
- **Alvo ainda não montado/medido:** fallback para balão central até o rect chegar (evita buraco no lugar
  errado).
- **Desktop:** o tutorial deve aparecer também no desktop (diferente do `ActionHint`, que é só toque). O
  spotlight é útil para todos os novatos.
- **Carta correta:** destacar a **primeira carta jogável** (não imune ao naipe do inimigo) para o passo
  `select_card`, evitando apontar uma carta que o jogo bloquearia.
- **z-index/Modal:** garantir que o overlay fica acima do HUD, do `TurnRevealOverlay` e dos botões; usar
  `Modal` ou o maior `zIndex` da tela.
- **Acessibilidade:** `accessibilityViewIsModal` no overlay; `accessibilityLabel` no balão; foco no texto.

## Plano de implementação (fases)

1. **Store + medição:** criar `tutorialTargetStore` e `TutorialTarget`; instrumentar 1 alvo (carta) e logar
   o rect para validar `measureInWindow` em web e nativo.
2. **Overlay visual:** `SpotlightOverlay` com SVG Mask (dim + buraco arredondado) seguindo o rect medido.
3. **Bloqueio de toque:** 4 blockers ao redor do buraco; confirmar que só o alvo recebe toque.
4. **Balão:** `TutorialTooltip` com posicionamento acima/abaixo + clamp + "Pular".
5. **Anel pulsante:** animação reanimated sobre o buraco.
6. **Integração:** mapa `step→targetId`, ligar ao `useTutorialFlow`, substituir `TutorialStepPanel`,
   instrumentar todos os alvos (carta, atacar, descarte, inimigo).
7. **Boas-vindas/conclusão:** manter modais centrais para `welcome`/`complete`.
8. **i18n:** revisar textos dos passos para linguagem curta e imperativa nos 4 idiomas.
9. **Polimento:** áreas seguras, desktop, transições suaves entre passos (fade do buraco ao mudar de alvo).

## Verificação

1. `npx tsc --noEmit` e `npx eslint` limpos nos arquivos novos/alterados.
2. **Manual (web):** apagar `regicide_tutorial_done` do `localStorage`, abrir o jogo → tela escurece, carta
   destacada com anel + balão; só a carta é clicável; ao selecionar, passo avança para Atacar; botão Atacar
   destacado; após atacar, passo de dano (se houver) destaca a área de descarte; conclusão; recarregar →
   tutorial não reaparece.
3. **Manual (nativo iOS/Android via Expo Go):** repetir; validar `measureInWindow`, rotação e área segura.
4. **Responsivo:** mobile retrato/paisagem, tablet e desktop — buraco e balão alinhados ao alvo correto.
5. Confirmar que "Pular" encerra e persiste, e que o jogo segue normal sem o tutorial.

## Pacotes alternativos avaliados

Caso se prefira uma biblioteca pronta em vez da implementação própria:

| Pacote | Técnica | Prós | Contras p/ este projeto |
|--------|---------|------|--------------------------|
| **react-native-spotlight-tour** | SVG + reanimated + gesture-handler (deps que já temos) | Moderno, TS, tooltip customizável, recorte animado | Modelo de tour **linear por botão**; conflita com avanço por evento do `useTutorialFlow`; suporte web depende de RNW + svg |
| **rn-tourguide** | `react-native-svg` (máscara SVG, buraco circular/retangular) | Maduro, API simples, máscara nativa | Foco mobile; web não é primário; tour linear; estilo próprio a sobrescrever |
| **react-native-copilot** | SVG + Animated, HOC `copilotStep`/`walkthroughable` | Popular, registro de passos por HOC | Menos ativo; web limitado; linear; acopla a árvore via HOC |
| **driver.js / react-joyride / shepherd.js** | DOM puro | Excelentes na web | **Só web** — não funcionam em React Native nativo; inviável num app Expo cross-platform |

**Recomendação:** implementação própria (sem novas dependências), pois (1) reusa `react-native-svg` +
`reanimated` já instalados, (2) preserva o avanço orientado a eventos do `useTutorialFlow`, (3) garante
paridade web/nativo e (4) mantém o tema visual. Se houver preferência por terceirizar, **react-native-spotlight-tour**
é a opção mais alinhada às libs já presentes — ao custo de adaptar o avanço por evento.
