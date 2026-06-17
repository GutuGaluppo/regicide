# Estrategia de Implementacao - Escala Vertical do Inimigo Atual

Status: proposta de implementacao. Nenhuma alteracao funcional foi aplicada.

## Objetivo

Adaptar o tamanho visual do inimigo atual conforme a altura util da viewport, evitando overlap com:

- os decks/status cards do topo (`castle`, `tavern`, `discard`)
- a area inferior da mao, acoes e estados auxiliares

## Diagnostico Atual

### 1. O `EnemyCard` usa dimensoes fixas

Hoje o card principal do inimigo em [`components/EnemyCard/EnemyCard.styles.ts`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/EnemyCard/EnemyCard.styles.ts) trabalha com base fixa:

- `imageWrapper`: `210 x 320`
- badges laterais com offsets fixos (`-65`, `-68`)
- pilha de escudo e adornos tambem com medidas fixas

Isso deixa o envelope visual do inimigo rigido em telas baixas.

### 2. A tela do jogo nao calcula um budget vertical real

Em [`screens/GameScreen/GameScreen.tsx`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/GameScreen/GameScreen.tsx), o layout esta dividido em:

- `statusBar` absoluto no topo
- `center` com `flex: 1` e `paddingTop: 90`
- `handSection` abaixo do centro
- `SuitTracker` e `ScreenHeader` tambem absolutos

O inimigo e centralizado visualmente, mas sem conhecer a altura real ocupada por:

- header
- status cards
- tutorial inline
- area de botoes / mao
- safe areas

### 3. A mao responde a largura, nao a altura

O hook [`hooks/useCardSize.ts`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/hooks/useCardSize.ts) escala as cartas da mao apenas pela largura da tela.

Em cenarios de pouca altura util, isso pode manter a regiao inferior "cara" demais, forcando o inimigo a disputar espaco com os decks do topo.

### 4. Ja existe um precedente no tracker

O componente [`screens/TrackerScreen/components/EnemyStatsCard/EnemyStatsCard.tsx`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/TrackerScreen/components/EnemyStatsCard/EnemyStatsCard.tsx) ja usa um calculo baseado em altura disponivel.

Ponto positivo:

- prova que o projeto ja aceita uma abordagem orientada por viewport

Limite da abordagem atual:

- depende de constantes fixas (`TOP_H`, `FOOTER_H`, `SAFE_H`)
- serve como referencia, mas nao deve ser copiada literalmente para `GameScreen`

## Recomendacao

Minha recomendacao e **nao usar `dvh` literal como estrategia principal**.

O caminho mais robusto e usar um **budget vertical medido em runtime**, que funciona como o equivalente pratico de `dvh` para este app React Native / Expo:

- `useWindowDimensions().height` como base de viewport
- `useSafeAreaInsets()` para ajustar areas seguras
- `onLayout` para medir os blocos que realmente consomem altura

### Por que prefiro isso ao `dvh` puro

- React Native nao trabalha com `dvh` de forma cross-platform como CSS tradicional
- o problema nao e apenas "altura da tela", e sim "altura restante depois dos elementos fixos"
- presets baseados so em viewport tendem a quebrar em tutorial, multiplayer, landscape curto e variacoes de safe area

## Estrategia Proposta

### Abordagem recomendada: budget vertical compartilhado

Criar um pequeno sistema de layout para a `GameScreen` em que o inimigo receba uma escala derivada do espaco realmente livre entre topo e base.

### 1. Medir as areas que disputam espaco vertical

Adicionar medicao por `onLayout` para:

- `statusBar`
- bloco central que abriga o inimigo
- `handSection`
- `TutorialStepPanel` quando estiver visivel

Tambem considerar:

- `insets.top`
- `insets.bottom`
- folga de seguranca entre secoes

### 2. Definir o envelope base do inimigo

Importante: calcular a escala pelo **envelope visual completo**, nao apenas pela arte da carta.

Envelope base sugerido:

- card: `210 x 320`
- bleed lateral para badges/jester: aproximadamente `68px` por lado
- folga minima superior/inferior: `12px` a `16px`

### 3. Calcular escala a partir da altura util

Formula conceitual:

```ts
availableHeight =
  viewportHeight
  - topReserved
  - bottomReserved
  - insets.top
  - insets.bottom
  - safetyGap;

availableWidth =
  viewportWidth
  - horizontalPadding
  - enemyHorizontalBleed;

scale = clamp(
  Math.min(
    availableHeight / BASE_ENEMY_HEIGHT,
    availableWidth / BASE_ENEMY_WIDTH,
    1
  ),
  MIN_SCALE,
  1
);
```

Sugestao inicial:

- `MAX_SCALE = 1`
- `MIN_SCALE = 0.75` como ponto de partida visual

### 4. Passar a escala para o `EnemyCard`

Em vez de manter medidas hardcoded no style sheet, o `EnemyCard` deve receber um objeto de layout derivado da escala, por exemplo:

```ts
{
  cardW,
  cardH,
  badgeOffset,
  badgeTop,
  badgeBottom,
  ringSize,
  shieldSize,
  numberHeight,
}
```

Assim:

- a arte da carta escala junto
- os badges continuam proporcionais
- a area medida por `measureInWindow` continua coerente para as animacoes

### 5. Prioridade de compressao

Para preservar legibilidade, a compressao deve seguir esta ordem:

1. usar o espaco real da tela, em vez de offsets fixos genericos
2. reduzir o inimigo progressivamente ate o limite minimo
3. se ainda faltar espaco em telas muito baixas, ativar um modo `short-height`

### 6. Fallback para telas muito baixas

Se a escala do inimigo cair abaixo do minimo aceitavel, o approach mais eficaz e complementar com um ajuste leve na area inferior:

- reduzir `paddingBottom` de `PlayerHand`
- reduzir `paddingTop` da linha de cartas
- opcionalmente descer um degrau no `useCardSize` quando a altura for critica

Isso e mais eficaz do que esmagar apenas o inimigo ate perder legibilidade.

## Alternativa Mais Simples

Se a prioridade for velocidade de entrega, existe uma versao simplificada:

### Presets por altura da viewport

Criar buckets por altura, por exemplo:

- `<= 700`
- `701 a 820`
- `> 820`

Cada faixa escolheria um preset fixo para o `EnemyCard`.

### Vantagens

- implementacao mais curta
- baixo risco de regressao estrutural

### Desvantagens

- menos resiliente a tutorial, multiplayer e safe areas
- exige manutencao por tentativa e erro
- pode resolver um device e quebrar outro com mesma altura, mas layout real diferente

## Arquivos Envolvidos

Arquivos diretamente impactados pela implementacao:

- [`screens/GameScreen/GameScreen.tsx`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/GameScreen/GameScreen.tsx)
- [`screens/GameScreen/GameScreen.styles.ts`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/GameScreen/GameScreen.styles.ts)
- [`components/EnemyCard/EnemyCard.tsx`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/EnemyCard/EnemyCard.tsx)
- [`components/EnemyCard/EnemyCard.styles.ts`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/EnemyCard/EnemyCard.styles.ts)
- [`components/PlayerHand/PlayerHand.tsx`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/PlayerHand/PlayerHand.tsx)
- [`components/PlayerHand/PlayerHand.styles.ts`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/PlayerHand/PlayerHand.styles.ts)
- novo hook sugerido: `hooks/useEnemyViewportBudget.ts` ou `hooks/useEnemyCardScale.ts`

## Criterios de Aceite

A implementacao deve garantir:

- nenhum overlap entre inimigo atual e decks/status cards do topo
- nenhum overlap entre inimigo atual e area da mao/acoes
- manutencao da legibilidade dos badges de HP/ATK/escudo
- manutencao das medicoes usadas em animacoes (`onCardMeasure`, `onShieldPileMeasure`)
- comportamento consistente em portrait e landscape

## Cenarios Minimos de Validacao

Validar pelo menos:

- mobile portrait baixo
- mobile portrait medio
- mobile landscape baixo
- tablet landscape
- desktop com janela baixa
- fluxo com tutorial inline ativo
- fluxo multiplayer em espera e em turno

## Recomendacao Final

Se a decisao for entre:

- "seguir estritamente por `dvh`"
- "resolver de forma mais robusta"

eu recomendo a segunda opcao:

**budget vertical medido + escala proporcional do inimigo + fallback leve para short-height**.

Isso resolve o problema de overlap com mais previsibilidade e menos manutencao futura.

## Pendencias para a proxima coordenada

Antes de implementar, vale fechar 3 decisoes:

1. O ajuste deve cobrir so `GameScreen` ou tambem o `TrackerScreen`?
2. Podemos ativar um modo `short-height` na mao se o inimigo atingir escala minima?
3. Preferem a versao robusta medida em runtime, ou o preset mais simples por altura?
