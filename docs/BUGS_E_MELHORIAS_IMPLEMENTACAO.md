# Bugs e Melhorias - O que implementar

Baseado em [`BUG&MELHORIAS.md`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/BUG&MELHORIAS.md).

## Gameplay / UI

- No modal de histórico/track da partida, exibir o estado de `exact death`: quando o dano for exato, mostrar que a carta do inimigo foi para o topo do baralho da taverna.
  Onde: `store/gameStore.ts`, `store/multiplayerStore.ts`, `screens/GameScreen`, possivelmente `EnemyCaptureOverlay` e/ou feedback visual de status.
- No modal de histórico/track da partida, atualizar o layout da tabela: avatar + nome na primeira linha; `attack` e `discard` inline na linha seguinte.
  Onde: componente de modal/timeline da partida multiplayer e estrutura de `reveal`.

- Mostrar a primeira carta do descarte com a face para cima.
  Onde: `screens/GameScreen/components/StatusCard.tsx` e ponto de chamada em `screens/GameScreen/GameScreen.tsx`.

- Corrigir o modal de revelação do turno: cartas não podem ficar cortadas; remover o botão `Skip`.
  Onde: `components/TurnRevealOverlay/TurnRevealOverlay.tsx`.

## Multiplayer

- Remover mensagens de sistema `player joined / player left` do chat.
  Onde: `services/firebaseChat.ts` e renderização em `components/RoomChat/RoomChat.tsx`.

- Em `BottomTurnHud`, posicionar o próprio jogador à esquerda.
  Onde: `screens/MultiplayerGameScreen/components/BottomTurnHud.tsx`.

- Em `ParticipantsSidebar`, posicionar o próprio jogador no topo.
  Onde: `screens/GameScreen/components/ParticipantsSidebar.tsx`.

- No modal de turno, mostrar avatar + nome do jogador e ajustar o texto para `Your turn` quando for o jogador ativo, e `Player's turn` para os demais.
  Onde: modal/overlay de turno multiplayer e traduções em `i18n/locales/*`.

## Home / Configurações

- Disponibilizar o botão de `Settings` também na Home, abrindo acesso a volume e demais preferências.
  Onde: `screens/HomeScreen/HomeScreen.tsx` e reaproveitamento de `components/SettingsDrawer`.

## Ordem sugerida

1. Ajustes simples de UI: descarte visível, remover mensagens de chat, botão de settings na Home.
2. Ajustes de ordenação multiplayer: `BottomTurnHud` e `ParticipantsSidebar`.
3. Ajustes de modal: modal de turno e modal de histórico/track.
4. Feedback de regra: `exact death` com indicação visual clara.
