# Plano de Implementação — Barra de Navegação "Blob" (Command Bar)

Documento técnico para adaptar a *menubar* do vídeo de referência
([Dribbble](https://cdn.dribbble.com/userupload/26066507/file/original-2a6f099b0b8b49e38717925cc01a8b7e.mp4))
à versão mobile do Regicide, respeitando o estilo medieval/pergaminho do jogo.

---

## Referência analisada

Frame representativo extraído do vídeo:

```
        ╭─────╮                                        (a borda de cima "incha"
   ╭────╯     ╰──────────────────────────────────────╮  ao redor do item ativo)
   │   (◉)        ⊙           ⌂              ☰        │
   │  carrinho  perfil      início        menu       │
   ╰──────────────────────────────────────────────────╯
        ▲
   "blob" circular + halo atrás do ícone ativo
```

Elementos da referência:

- **Barra flutuante** em forma de *pill* (cantos bem arredondados), com sombra
  suave, "descolada" do conteúdo.
- **Ícones de linha** (outline) igualmente espaçados: carrinho, perfil, início,
  menu (hambúrguer).
- **Indicador "blob"**: um **círculo de destaque** atrás do ícone ativo, com um
  **halo/ripple** translúcido.
- **Morph da borda superior**: a aresta de cima da barra **deforma** (sobe num
  ressalto suave) exatamente acima do item ativo — efeito "líquido".
- **Animação principal**: ao tocar em outro item, o blob **desliza** para ele e o
  ressalto da borda **acompanha** o movimento (transição elástica).

A identidade visual da referência é **vermelho/coral + ícones brancos**. Vamos
**reinterpretar** essa linguagem (não copiar a cor) para o tema do jogo.

---

## Objetivo da adaptação

Hoje os controles do jogo estão **espalhados**:

- [components/ScreenHeader/ScreenHeader.tsx](../components/ScreenHeader/ScreenHeader.tsx):
  taverna (voltar) à esquerda; engrenagem (ajustes) + ampulheta (histórico) à
  direita via `rightExtra`.
- Botão flutuante de **chat** no multiplayer ([components/RoomChat](../components/RoomChat)).
- **Drawer** de ajustes ([components/SettingsDrawer](../components/SettingsDrawer)),
  **modal** de histórico ([components/GameLog/GameLogModal.tsx](../components/GameLog/GameLogModal.tsx)),
  **sidebar** de participantes ([screens/GameScreen/components/ParticipantsSidebar.tsx](../screens/GameScreen/components/ParticipantsSidebar.tsx)).
- A base da tela é ocupada pela **mão** ([components/PlayerHand](../components/PlayerHand))
  e, no multiplayer, pelo **HUD de turno** (`BottomTurnHud` em
  [screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx)).

A proposta é consolidar os controles secundários numa **única barra coesa e
animada** — a **Command Bar** — usando a linguagem do blob/morph, e reaproveitar
o mesmo componente como **navegação principal** nas telas de menu.

> **Restrição-chave de layout.** Diferente da referência (barra **na base**), no
> Regicide a base já é da **mão**. Logo, **em jogo** a barra vive **no topo**
> (área segura superior) e o ressalto do morph aponta para **baixo** (em direção
> ao tabuleiro). Nas telas **sem jogo** (Início/Lobby/Regras), onde a base está
> livre, ela vira a barra inferior clássica da referência.

---

## Componente reutilizável: `BlobNavBar`

Um único componente cobre os dois contextos. Local sugerido:

- `components/BlobNavBar/BlobNavBar.tsx`
- `components/BlobNavBar/BlobNavBar.styles.ts`
- `components/BlobNavBar/BlobIndicator.tsx` (o blob + halo, animado)
- `components/BlobNavBar/index.ts`

### API

```ts
export interface BlobNavItem {
  key: string;
  icon: ImageSourcePropType;     // PNG de assets/icons (line icons)
  labelKey: string;              // chave i18n (acessibilidade + label opcional)
  badgeCount?: number;          // ex.: mensagens de chat não lidas
  disabled?: boolean;           // ex.: chat só no multiplayer
}

export interface BlobNavBarProps {
  items: BlobNavItem[];
  activeKey: string | null;      // item destacado; null = blob recolhido
  onPress: (key: string) => void;
  placement?: "top" | "bottom";  // direção do morph (default "bottom")
  showLabels?: boolean;          // labels sob os ícones (default no hub, off em jogo)
  edge?: number;                 // respiro p/ safe area
}
```

Princípio: a barra é **controlada** (`activeKey` vem de fora). Quem a usa decide o
que "ativo" significa — uma rota (hub) ou um painel aberto (em jogo).

---

## Aplicação A — Command Bar em jogo (recomendado)

Substitui o cluster direito do `ScreenHeader` (engrenagem + ampulheta) e o botão
flutuante de chat por **uma** barra no topo. O **blob marca o painel aberto**;
quando tudo está fechado, `activeKey = null` (blob recolhido/esmaecido).

### Itens (mapeados a ícones já existentes em `assets/icons/`)

| key | Ícone | Ação | Visível |
|---|---|---|---|
| `history` | `hourglass.png` | abre `GameLogModal` | sempre |
| `chat` | *(falta ícone)* | abre `RoomChat` (+ badge não lidas) | multiplayer |
| `players` | `players.png` | abre participantes | multiplayer |
| `settings` | `gear_flat.png` | abre `SettingsDrawer` | sempre |

> ⚠️ **Falta um ícone de chat** em `assets/icons/`. Opções: adicionar um
> `chat.png` (balão de fala, estilo de linha, coerente com os demais) ou, no MVP,
> reutilizar um glifo textual. Sinalizado em *Pontos em aberto*.

A **taverna/sair** ([tavern_silver.png](../assets/icons/tavern_silver.png))
permanece como botão isolado à **esquerda** (gesto de "voltar" não faz parte do
mesmo grupo de painéis) — igual a hoje no `ScreenHeader`.

### Integração

- Em [screens/GameScreen/GameScreen.tsx](../screens/GameScreen/GameScreen.tsx),
  trocar o `rightExtra` do `ScreenHeader` pela `BlobNavBar`.
- O `activeKey` deriva dos estados já existentes: `logVisible`, `settingsVisible`,
  e (no MP) chat aberto (`useChatStore(s => s.isOpen)`) / sidebar.
- `onPress(key)` faz *toggle* do painel correspondente (abre o tocado, fecha os
  demais) — comportamento de "uma gaveta por vez".

> **Por que isso encaixa nas regras de turno:** a barra é só de **ações
> secundárias** (não joga cartas). Ela não compete com a mão nem com o
> `TurnRevealOverlay`/`BottomTurnHud`, que continuam na base.

---

## Aplicação B — Navegação do hub (reaproveitamento)

Nas telas sem jogo, a **mesma** `BlobNavBar` vira a barra **inferior** clássica
(`placement="bottom"`, `showLabels`), navegando entre as rotas do
[app/](../app) (expo-router): `index` (Início), `game` (Solo), `lobby`
(Multiplayer), `instructions` (Regras), `tracker` (Tracker manual). Aqui o
`activeKey` é a rota atual e `onPress` faz `router.replace(...)`.

> Isso é o uso **mais literal** da referência (barra inferior de seções). É opção
> de escopo: entregar primeiro a Command Bar em jogo (A) e, depois, o hub (B)
> reusando o componente — sem retrabalho visual.

---

## Estilo (reinterpretação para o tema do jogo)

Mantemos a **forma e a animação** da referência; trocamos a **cor** pelo tema
pergaminho/dourado já usado no app (ver
[MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx)
e estilos de HUD):

| Elemento | Referência | Adaptação Regicide |
|---|---|---|
| Fundo da barra | coral sólido | `rgba(18,18,28,0.96)` (escuro), borda `rgba(232,213,163,0.25)` |
| Ícones inativos | branco | dourado esmaecido `rgba(232,213,163,0.6)` |
| Blob | branco translúcido | dourado/pergaminho `#E8D5A3` (ou gradiente âmbar) |
| Ícone ativo | branco (sobre coral) | **escuro** `#12121C` (contraste sobre o blob dourado) |
| Halo/ripple | vermelho claro | âmbar quente `rgba(248,231,188,0.25)` |
| Sombra | suave neutra | suave + leve "brasa" (sombra âmbar discreta) |

Tipografia (labels do hub): **Cinzel** (títulos) já usada no projeto. Sem
`expo-blur` instalado, o fundo é um **View sólido translúcido** (não usar blur no
MVP). Haptics no toque via `expo-haptics` (já é dependência), coerente com o
feedback tátil que o `multiplayerStore` já dispara.

---

## Animação

Stack disponível: **react-native-reanimated ~4.1** e **react-native-svg 15.12**
(ambos já no projeto). Duas estratégias — recomendo entregar a MVP primeiro.

### Estratégia MVP — blob elevado + halo (sem morph de path)

- A barra é um `View` com `borderRadius` grande (sem SVG).
- O **blob** é um círculo absoluto que faz `translateX` (com `withSpring`) até o
  centro do item ativo, levemente **elevado** (`translateY` negativo) para
  "saltar" da barra, com um **halo** (segundo círculo maior, translúcido) atrás.
- Ícone ativo: cor escura; inativos: dourado esmaecido (interpolação de cor).
- Layout dos itens medido com `onLayout` (centros em px) → posições do blob.
- Custo baixo, 60fps tranquilo no celular. Entrega 90% da sensação da referência.

```tsx
// BlobIndicator: x animado entre centros dos itens
const x = useSharedValue(centerOf(activeKey));
useEffect(() => { x.value = withSpring(centerOf(activeKey), { damping: 14, stiffness: 160 }); }, [activeKey]);
const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value - R }, { translateY: -RAISE }] }));
```

### Estratégia alta fidelidade — morph da borda via SVG

- O fundo da barra vira um `<Path>` (react-native-svg) cuja **aresta** (superior
  ou inferior, conforme `placement`) tem um **ressalto** centrado no item ativo.
- `buildBarPath(width, height, radius, bumpCenterX, bumpW, bumpH)` desenha a borda
  com béziers cúbicas formando a "bolha".
- Anima-se `bumpCenterX` com `useDerivedValue` e aplica-se em `animatedProps` do
  `Path` (`d`), via `Animated.createAnimatedComponent(Path)`.
- Fiel ao "líquido" da referência; custo maior (recalcular `d` por frame). Indicado
  como fase 2, atrás de um *flag* de qualidade.

### Acessibilidade de movimento

Respeitar **reduce motion** (`AccessibilityInfo.isReduceMotionEnabled`): com
movimento reduzido, o blob faz *cross-fade* entre posições em vez de deslizar, e o
morph é desativado.

---

## Plano de Arquivos

```
components/BlobNavBar/
  BlobNavBar.tsx          # layout, medição de itens, toque, haptics
  BlobIndicator.tsx       # blob + halo (Reanimated) [+ Path morph na fase 2]
  BlobNavBar.styles.ts
  index.ts
assets/icons/chat.png      # NOVO (ícone de chat de linha) — ver pontos em aberto
```

Integrações:

- [screens/GameScreen/GameScreen.tsx](../screens/GameScreen/GameScreen.tsx):
  `rightExtra` → `BlobNavBar` (Command Bar, `placement="top"`).
- [screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx):
  remover o FAB de chat redundante; estado de chat alimenta `activeKey`.
- (Fase B) [screens/HomeScreen](../screens/HomeScreen) / [app/](../app):
  `BlobNavBar` inferior para navegação de rotas.

---

## Etapas de Implementação

### Etapa 1 — Componente base (MVP)
- `BlobNavBar` + `BlobIndicator` (blob+halo via Reanimated), medição por `onLayout`,
  toque com haptics, tema dourado, labels opcionais, badge.

### Etapa 2 — Command Bar em jogo
- Trocar o cluster direito do `ScreenHeader`/FAB de chat pela barra; ligar
  `activeKey` aos estados de painel (`logVisible`/`settingsVisible`/chat/players);
  `onPress` faz toggle "uma gaveta por vez".
- Ícone de chat (`assets/icons/chat.png`) + badge de não lidas (do `chatStore`).

### Etapa 3 — Polimento de movimento
- Morph SVG opcional (alta fidelidade) atrás de flag; reduce-motion; ajustes de
  spring; sombra/halo âmbar.

### Etapa 4 — Hub (reaproveitamento)
- `BlobNavBar` inferior nas telas de menu, navegando rotas do expo-router.

### Etapa 5 — i18n e acessibilidade
- Chaves `nav.*` (history/chat/players/settings/home/solo/multiplayer/rules) em
  pt-BR/en/es/fr; `accessibilityRole="tab"`/`"button"`, `accessibilityState={{ selected }}`,
  alvos de toque ≥ 44px.

---

## Responsividade

- **Mobile (foco):** barra ocupa ~92% da largura, centralizada; 4 itens em jogo,
  até 5 no hub.
- **Tablet/desktop:** largura máxima fixa (ex.: 520) e centralizada; em desktop o
  jogo já usa sidebars (participantes/chat dockado) — nesses casos a Command Bar
  pode **omitir** itens já visíveis (ex.: `players` quando a sidebar está dockada).

---

## Testes Recomendados

- **Lógica:** mapeamento `activeKey` ↔ painel aberto (toggle "uma gaveta por vez");
  `centerOf(key)` correto após `onLayout`; item `disabled` (chat no solo) não recebe toque.
- **UI:** blob desliza para o item tocado; ícone ativo muda de cor; badge de chat
  reflete não lidas; reduce-motion troca slide por fade.
- **Integração:** abrir histórico/ajustes/chat pela barra fecha os demais; sair
  pela taverna continua funcionando.

---

## Pontos em Aberto (decisão de produto)

- **Ícone de chat:** adicionar `assets/icons/chat.png` (recomendado, coerente com
  o set de linha) ou reutilizar glifo no MVP.
- **Posição em jogo:** topo (recomendado, base é da mão) vs. barra inferior
  *colapsável* (FAB que expande) — qual combina melhor com o ritmo de turno.
- **Escopo do hub (Aplicação B):** migrar a navegação do hub para tabs persistentes
  altera o modelo de stack atual; entregar só a Command Bar em jogo primeiro?
- **Morph SVG:** vale o custo de recalcular o `d` por frame no celular, ou a MVP
  (blob elevado + halo) já entrega a sensação desejada?
```
