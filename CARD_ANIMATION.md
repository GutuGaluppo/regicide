# Tutorial: Como Implementar as Animações de Cartas Deste Projeto

Este documento explica, passo a passo, como reproduzir o sistema de animações de cartas implementado neste projeto.

O objetivo aqui não é apenas descrever o código existente. A ideia é que, ao final da leitura, você consiga montar a mesma arquitetura em outro projeto React Native usando:

- `react-native-reanimated`
- `expo-image`
- cartas reais renderizadas na interface
- medição de posição com `measureInWindow`

As animações cobertas neste tutorial são:

1. carta saindo do deck e entrando na mão
2. carta saindo da mão e indo para um destino específico
3. cartas de pilha voando via overlay
4. cartas de `spades` indo para a pilha de escudo
5. cartas de `spades` saindo da pilha de escudo para o descarte
6. troca física das duas cartas do `JesterStack`

## 1. Visão Geral da Arquitetura

O sistema funciona bem porque separa responsabilidades de forma clara:

- `GameScreen`: orquestra o fluxo da animação
- `PlayerHand`: renderiza a mão real do jogador
- `CardView`: anima a própria carta da mão
- `EnemyCard`: expõe âncoras visuais, como a pilha de `spades`
- `CardFlightOverlay`: anima cartas que não existem mais na mão
- `JesterStack` e `JesterCard`: implementam a animação premium do Jester

A ideia central é esta:

1. sempre que possível, anime a carta real
2. use overlay só para cartas que já não pertencem mais àquela área visual
3. meça origem e destino na tela
4. passe esses retângulos para a animação
5. só consolide a mudança lógica do jogo depois que a animação terminar

## 2. Pré-requisitos

Você vai precisar destes conceitos:

- `Shared Values`
- `useAnimatedStyle`
- `withTiming`
- `withDelay`
- `runOnJS`
- `measureInWindow`
- controle de estado transitório via `useRef` e `useState`

Também ajuda trabalhar com um tipo comum para qualquer âncora visual:

```ts
type ScreenRect = {
	x: number;
	y: number;
	w: number;
	h: number;
};
```

Esse tipo é a base de toda a movimentação.

## 3. Princípio Mais Importante: Anime a Carta Real

O erro mais comum em animação de cartas é renderizar uma cópia "fantasma" voando enquanto a carta real já aparece no destino. Isso gera:

- cartas duplicadas na tela
- recortes temporários
- sensação de animação falsa

Neste projeto, a mão do jogador renderiza a própria carta final. A animação acontece em cima dela.

Isso só funciona bem se:

- a mão ficar em um `View` estável
- a posição final da carta existir no layout antes da animação começar
- a carta puder medir sua própria posição final

Por isso, a mão foi convertida para um layout fixo, sem `ScrollView`.

## 4. Etapa 1: Crie Uma Carta Capaz de Se Animar Sozinha

Arquivo de referência:

- `components/CardView/CardView.tsx`

Essa carta suporta dois fluxos:

- entrada na mão (`dealAnimation`)
- saída da mão para algum destino (`discardAnimation`)

### 4.1. Modele os tipos de animação

```ts
type DealAnimation = {
	id: number;
	order: number;
	source: ScreenRect;
};

type DiscardAnimation = {
	id: number;
	order: number;
	dest: ScreenRect;
};
```

`id` serve para impedir que a mesma animação rode mais de uma vez na mesma carta.

`order` permite o efeito de distribuição em cascata.

### 4.2. Guarde valores animados separados para entrada e saída

Na implementação atual, a carta usa `Shared Values` diferentes para cada fase:

- `dealProgress`
- `dealStartX`
- `dealStartY`
- `dealStartScale`
- `dealArcHeight`
- `discardProgress`
- `discardTravelX`
- `discardTravelY`
- `discardScaleTarget`
- `discardArcHeight`

Isso permite combinar os dois efeitos sem acoplar a matemática.

### 4.3. Meça a posição final da carta

Cada `CardView` tem um `wrapperRef`:

```ts
const wrapperRef = useRef<View>(null);
```

Quando a animação começa, a carta mede a posição dela no layout final:

```ts
wrapperRef.current?.measureInWindow((x, y, width, height) => {
	// x, y, width, height da posição final
});
```

Com isso, a carta sabe:

- onde ela deve terminar
- de onde ela precisa vir
- qual escala inicial ou final faz sentido

## 5. Etapa 2: Implemente a Entrada do Deck Para a Mão

Ainda em `CardView.tsx`, a lógica é:

1. medir a posição final da carta
2. calcular o centro da origem
3. calcular o centro do destino
4. converter a diferença em `translateX` e `translateY`
5. animar `progress` de `0` para `1`

### 5.1. Fórmula do movimento

O deslocamento base é:

```ts
const translateX = startX * (1 - progress);
const translateY =
	startY * (1 - progress) -
	Math.sin(progress * Math.PI) * arcHeight;
```

O arco é o que tira o efeito do eixo reto e cria a sensação de carta "sobrevoando".

### 5.2. Fórmula da escala

```ts
const scale = startScale + (1 - startScale) * progress;
```

Isso faz a carta sair do tamanho do deck e crescer até o tamanho da mão.

### 5.3. Rotação sutil

```ts
const rotate = -12 * (1 - progress);
```

Essa rotação pequena ajuda a carta parecer "solta" no ar.

### 5.4. Duração usada neste projeto

Valores atuais:

- atraso por carta: `order * 110`
- fade in: `120ms`
- voo: `420ms`
- easing: `Easing.out(Easing.cubic)`

## 6. Etapa 3: Implemente a Saída da Mão Para Um Destino

O mesmo `CardView` também resolve a saída da mão.

Diferença importante:

- na entrada, a carta já existe no destino e "vem" da origem
- na saída, a carta já existe na origem e "vai" até o destino

### 6.1. Cálculo do deslocamento

```ts
const sourceCenterX = x + width / 2;
const sourceCenterY = y + height / 2;
const targetCenterX = dest.x + dest.w / 2;
const targetCenterY = dest.y + dest.h / 2;

discardTravelX = targetCenterX - sourceCenterX;
discardTravelY = targetCenterY - sourceCenterY;
```

### 6.2. Cálculo da escala de pouso

```ts
discardScaleTarget = Math.min(dest.w / width, dest.h / height);
```

Assim a carta encolhe ao pousar em um deck, badge ou pilha menor.

### 6.3. Fórmula animada final

```ts
const discardTranslateX = discardTravelX * discardProgress;
const discardTranslateY =
	discardTravelY * discardProgress -
	Math.sin(discardProgress * Math.PI) * discardArcHeight;
const discardScale =
	1 + (discardScaleTarget - 1) * discardProgress;
```

### 6.4. Duração usada neste projeto

- atraso por carta: `order * 90`
- voo: `380ms`
- fade out final: `90ms`
- easing: `Easing.inOut(Easing.cubic)`

## 7. Etapa 4: Misture Entrada e Saída no Mesmo `AnimatedStyle`

O estilo animado da carta combina os dois fluxos:

```ts
transform: [
	{ translateX: dealTranslateX + discardTranslateX },
	{ translateY: dealTranslateY + discardTranslateY },
	{ scale: dealScale * discardScale },
	{ rotateZ: `${dealRotate - discardRotate}deg` },
]
```

Isso é útil porque:

- uma carta recém-distribuída e depois jogada continua usando o mesmo componente
- não é necessário trocar de componente nem duplicar renderização

## 8. Etapa 5: Faça a `PlayerHand` Ser Um Componente Bobo

Arquivo de referência:

- `components/PlayerHand/PlayerHand.tsx`

`PlayerHand` não decide animação. Ela só recebe:

- `activeDeal`
- `activeDiscard`
- `dealingIds`
- `locked`

### 8.1. Entrada por carta

`activeDeal` contém:

```ts
{
	id,
	source,
	orderById
}
```

### 8.2. Saída por carta com destinos independentes

`activeDiscard` contém:

```ts
{
	id,
	flightById: Map<string, { order: number; dest: ScreenRect }>
}
```

Essa mudança foi essencial para o ataque com `spades`, porque agora:

- algumas cartas podem ir para o descarte
- outras podem ir para a pilha de escudo

na mesma jogada.

## 9. Etapa 6: Orquestre Tudo na Screen

Arquivo de referência:

- `screens/GameScreen/GameScreen.tsx`

Este é o cérebro da animação.

### 9.1. Crie refs para âncoras visuais

Neste projeto, as principais âncoras são:

- `tavernRef`
- `discardRef`
- `shieldPileRectRef`

Além disso, a screen mantém refs para os ids em trânsito:

- `dealingIdsRef`
- `discardingIdsRef`
- `shieldExitIdsRef`

Essas refs evitam bugs de sincronização quando o fim da animação chega via `runOnJS`.

### 9.2. Sempre meça com `requestAnimationFrame`

O helper usado é este:

```ts
const measureRect = (ref, onMeasured, onUnavailable) => {
	const node = ref.current;
	if (!node) {
		onUnavailable?.();
		return;
	}

	requestAnimationFrame(() => {
		node.measureInWindow((x, y, w, h) => {
			if (w === 0 || h === 0) {
				onUnavailable?.();
				return;
			}
			onMeasured({ x, y, w, h });
		});
	});
};
```

Sem esse `requestAnimationFrame`, você corre o risco de medir antes do layout estabilizar.

## 10. Etapa 7: Distribuição Inicial Da Taverna Para a Mão

Fluxo usado:

1. a screen mede `tavernRef`
2. cria um `ActiveDeal`
3. popula `dealingIds`
4. passa tudo para `PlayerHand`
5. cada `CardView` executa sua animação
6. cada carta devolve `onDealComplete`
7. quando o último id sai do conjunto, a animação é encerrada

Esse padrão aparece em:

- `triggerDeal`
- `handleCardDealComplete`

## 11. Etapa 8: Jogue Cartas Reais Da Mão Para Destinos Diferentes

No ataque, a screen precisa decidir para onde cada carta vai.

### 11.1. Regra usada neste projeto

- cartas normais: vão para o descarte
- cartas de `spades` efetivas: vão para a pilha de escudo
- cartas de `spades` imunes: vão direto para o descarte

### 11.2. Como isso é decidido

A screen usa `previewShieldGain`.

Se `previewShieldGain > 0`, então as `spades` da jogada são efetivas.

Se `previewShieldGain === 0`, então:

- ou não há `spades`
- ou o inimigo está imune a `spades`

Nesses casos, elas não entram na pilha de escudo.

### 11.3. Monte um mapa de destinos

A lógica é esta:

```ts
const flightById = new Map<string, { order: number; dest: ScreenRect }>();
```

Para cada carta selecionada:

1. descubra se ela é uma `spade` efetiva
2. se for, calcule o slot de destino na pilha de escudo
3. se não for, mande para o descarte

## 12. Etapa 9: Crie Uma Âncora Estável Para a Pilha de `Spades`

Arquivo de referência:

- `components/EnemyCard/EnemyCard.tsx`

Aqui existe um detalhe importante: a pilha precisa poder ser medida mesmo quando ainda está vazia.

Se você só renderizar a pilha quando já existir carta lá, a animação de chegada da primeira `spade` não terá destino.

### 12.1. Solução aplicada

O `EnemyCard` agora calcula:

```ts
const showShieldArea =
	shieldCardsCount > 0 || (spadesShield ?? 0) > 0 || previewShielded;
```

Quando `previewShielded` é `true`, uma âncora invisível ou placeholder já existe no layout.

### 12.2. Medição da pilha

```ts
shieldPileRef.current?.measureInWindow((x, y, w, h) => {
	onShieldPileMeasure?.({ x, y, w, h });
});
```

Essa posição é enviada para `GameScreen`.

## 13. Etapa 10: Calcule o Slot Exato Dentro Da Pilha

Arquivo de referência:

- `screens/GameScreen/GameScreen.tsx`

Função usada:

```ts
const getShieldPileSlotRect = (anchor, stackIndex, totalCards) => {
	const visibleStart = Math.max(0, totalCards - 3);
	const visibleIndex = Math.min(2, Math.max(0, stackIndex - visibleStart));

	return {
		x: anchor.x + visibleIndex * 6,
		y: anchor.y + visibleIndex * 6,
		w: 50,
		h: 66,
	};
};
```

Isso garante que a carta não voe para o centro genérico do badge, mas sim para a posição real da pilha.

## 14. Etapa 11: Só Commit a Jogada Depois da Animação

Este é um ponto crítico.

Se você chamar `playSelected()` antes do fim do voo:

- a mão muda de estado cedo demais
- a pilha ou o descarte aparecem fora de ordem
- as cartas podem "teleportar"

A solução usada é:

1. guardar uma ação pendente
2. rodar a animação
3. esperar a última carta terminar
4. só então chamar `playSelected()` ou `confirmDiscard()`

Modelo do estado pendente:

```ts
type PendingAction = {
	id: number;
	kind: "play" | "discard";
	awaitShieldExit: boolean;
	incomingShieldCards: Card[];
};
```

## 15. Etapa 12: Cartas Da Pilha Precisam De Overlay

Quando as cartas já estão em uma pilha, você não consegue animá-las pela mão, porque elas não pertencem mais àquela área visual.

Nesse caso, o projeto usa:

- `components/CardFlightOverlay/CardFlightOverlay.tsx`

### 15.1. Quando usar overlay

Use overlay quando:

- a carta não está mais na mão
- a carta está em uma pilha pequena
- você quer animar uma cópia visual temporária

### 15.2. Como funciona

Cada overlay recebe:

```ts
type CardFlight = {
	animationId: number;
	order: number;
	card: Card;
	source: ScreenRect;
	dest: ScreenRect;
};
```

O cálculo do movimento é o mesmo conceito da carta real:

- centro da origem
- centro do destino
- arco vertical
- escala de pouso

## 16. Etapa 13: Saída Das `Spades` Para o Descarte Após Derrotar o Inimigo

Fluxo usado neste projeto:

1. durante o ataque, `spades` efetivas vão para a pilha de escudo
2. se a jogada derrota o inimigo, as `spades` precisam sair da pilha antes da transição
3. a screen esconde temporariamente a pilha real
4. cria voos via `CardFlightOverlay`
5. envia todas as `spades` para o descarte
6. quando a última terminar, executa `playSelected()`

Isso cria duas etapas visuais distintas:

1. mão -> pilha de escudo
2. pilha de escudo -> descarte

## 17. Etapa 14: Faça o Fim da Animação Ser Confiável

Um bug comum é depender de uma variável local dentro de `setState` para saber se a última carta terminou.

Este projeto resolveu isso com conjuntos em `ref`:

- `dealingIdsRef`
- `discardingIdsRef`
- `shieldExitIdsRef`

O padrão é:

1. copiar o conjunto atual
2. remover o `cardId` que terminou
3. sincronizar `ref` e `state`
4. se o conjunto ficou vazio, concluir a ação

Exemplo conceitual:

```ts
const next = new Set(discardingIdsRef.current);
if (!next.delete(cardId)) return;
syncDiscardingIds(next);

if (next.size === 0) {
	// ação concluída
}
```

Esse padrão é mais estável do que depender de callbacks encadeados com closures antigas.

## 18. Etapa 15: Implemente o Swap Premium do Jester

Arquivos de referência:

- `components/EnemyCard/components/JesterStack/JesterStack.tsx`
- `components/EnemyCard/components/JesterStack/JesterCard.tsx`

O Jester usa outra abordagem, porque aqui não existe origem e destino globais na tela. O movimento acontece dentro de uma pilha de duas cartas.

### 18.1. Estado necessário

`JesterStack` mantém:

- `order`
- `backMap`
- `activeSwap`

`activeSwap` define duas cartas:

- `backCardId`
- `frontCardId`

### 18.2. Papel de cada carta

Cada `JesterCard` recebe um papel:

- `promote`
- `demote`

### 18.3. Carta promovida

A carta de trás:

- ganha `zIndex` alto
- cruza por cima
- faz arco para cima
- cresce levemente

### 18.4. Carta rebaixada

A carta da frente:

- vai para baixo
- faz `rotateY`
- termina mostrando o verso
- cruza por baixo

## 19. Etapa 16: Use Frente e Verso Reais No Flip

No `JesterCard`, a carta não troca por fade.

Ela renderiza duas faces:

```tsx
<Animated.View style={[styles.face, styles.frontFace]} />
<Animated.View style={[styles.face, styles.backFace]} />
```

A face de trás tem:

```ts
transform: [{ rotateY: "180deg" }]
```

E a carta inteira usa:

```ts
transform: [
	{ perspective: 900 },
	{ rotateY: `${rotateY.value}deg` },
]
```

Isso cria um flip físico, não uma troca de imagem instantânea.

## 20. Etapa 17: Só Atualize a Ordem Final Quando o Swap Terminar

No `JesterStack`, a ordem é atualizada apenas no callback de fim da animação:

1. a animação visual roda
2. `handleSwapComplete` confirma o `animationId`
3. o componente troca `order`
4. atualiza `backMap`
5. chama `onUseJester()`

Isso evita flicker e impede que a pilha mude de estado no meio do movimento.

## 21. Etapa 18: Valores De Timing Usados Neste Projeto

Resumo prático:

- deal da taverna para a mão: `420ms`
- atraso entre cartas no deal: `110ms`
- saída da mão: `380ms`
- atraso entre cartas na saída: `90ms`
- overlay de pilhas: `360ms`
- swap do Jester: `420ms`
- easing do Jester: `Easing.bezier(0.22, 0.78, 0.22, 1)`

Você pode começar com esses números e depois ajustar a sensação.

## 22. Etapa 19: Checklist de Implementação

Se você quiser reproduzir esse sistema do zero, siga esta ordem:

1. crie `ScreenRect`
2. crie uma `CardView` que se mede com `measureInWindow`
3. implemente `dealAnimation`
4. implemente `discardAnimation`
5. mantenha a mão fixa e anime a carta real
6. adicione uma screen orquestradora com refs para deck, descarte e pilhas
7. adicione estado transitório para ações pendentes
8. só commit o estado do jogo depois do fim da animação
9. crie `CardFlightOverlay` para cartas que saem de pilhas
10. exponha âncoras estáveis em componentes como `EnemyCard`
11. adicione destinos por carta quando a jogada puder se dividir
12. implemente o Jester com dois papéis simultâneos: `promote` e `demote`

## 23. Armadilhas Que Vale Evitar

- Não renderize a carta voando em um overlay se você ainda consegue animar a carta real.
- Não use `ScrollView` na mão se a animação depende de posição estável.
- Não meça a posição cedo demais.
- Não atualize o estado do jogo antes do callback de conclusão.
- Não use `runOnJS` com funções inline instáveis dentro de worklets complexos.
- Não dependa de uma variável local para descobrir se a última carta terminou.

## 24. Resumo Final

O sistema deste projeto funciona porque combina quatro decisões importantes:

1. a carta real é animada sempre que possível
2. a screen centraliza toda a orquestração
3. pilhas usam overlay apenas quando necessário
4. a lógica do jogo só anda depois que a animação acaba

Se você reproduzir esses quatro princípios, mesmo com visuais diferentes, vai conseguir chegar ao mesmo nível de consistência e sensação física das cartas deste projeto.
