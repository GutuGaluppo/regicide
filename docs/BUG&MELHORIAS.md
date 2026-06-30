Ignore commented list was implemented in the codebase.

<!-- - Display “Exact death - card at the top of the Tavern deck”
- Remove the “player joined/player left the room” message from the chat.
- The Discard Deck should display the first card face up.
- The “Settings” button should be available from the Home Screen, providing access to volume control settings, etc.
- Fix cards being cut off in the turn modal for the active player, and remove the “Skip” button from the modal.
- In the game track modal, update the table style. The player’s icon should be displayed with their name to the right, and on a new line, display “attack” and “discard” inline.
- In BottomTurnHud, position the own player on the left side.
- In ParticipantsSidebar, position the own player at the top.
- In the turn modal, display the player’s name and icon, and update the text to say “Your turn” for the active player, and “Player’s turn” for the others.
- Adjust the width of the chat drawer for mobile devices, and ensure the text input is fully visible when the keyboard is open.
- After sending a message, the text input should be cleared and the keyboard should remain open and the input field focused.
- If the player click out of the chat drawer, it should close it.
- In certain screen sizes, the current player's screen is flicking. This may be related to the dynamic layout. This needs to be investigated and fixed. Make sure the mesurements for the current player's screen are consistent and not causing unnecessary re-renders. Keep images smaller to avoid performance issues.
- Include Tooltip with instruction when in mobile view for the acction buttons, since there is no hover state. This will help users understand the purpose of each button. The player should be able to disable the tooltip if they find it intrusive after using it a few times. (Propose a different solution if you think of a better one, the tooltip is just a quick idea to solve the problem of absent of the labels in mobile ).
- The modal with the current player acction (TurnRevealOverlay) must reveal the cards used to attack and received damage, and the card used to defend, if any. Make sure the titles "Attack" and "Defend" are clear (contrasting with the background and a little bigger) and provide more clarity to the players about the actions taken during the turn.
- In the browser, if the player mute the music once, close the window, and then open the game again, the music should remain muted, but it is not persisting (the icon shows that it is muted but it is not actually muted). The same should apply to the sound effects. Root cause: AudioContext loaded the persisted mute flags asynchronously, so the soundtrack was created from a stale (unmuted) closure before hydration completed, and the re-mute effect no-op'd because the sound ref was still null mid-load. Fixed by gating soundtrack creation on hydration and reading mute/volume from refs. -->

<!-- - Passo a passo do tutorial:
  - [x] A primeira etapa com a mensagem "Bem-vindo ao Regicide!..." deve ser dividida entre:
    - [x] Apresentação do inimigo com o foco no inimigo do centro e o resto da tela escurecida.
    - [x] Explicação da imunidade do inimigo através do naipe (foco na carta do inimigo — o naipe está embutido na arte).
    - [x] Apresentar a Vida do inimigo (foco no anel de Vida).
    - [x] Apresentação do ataque do inimigo (foco no anel de Ataque).
  - [x] Apresentação dos decks - Castelo, Taverna, Descarte (um a um).
  - [x] Apresentação do SuitTracker.
  - [x] Explicação dos botões de ação - Organizar por valor, Organizar por naipe, Atacar (Defender é hands-on no contra-ataque, destacando o botão Descartar).
  - [x] Explicação da mão do jogador.
  - [x] Apresentação do botão Histórico.
  - [x] Incluir passo "Skip" (Passar) esclarecendo, por texto, que só aparece em jogo Multiplayer.
- [x] Todos os passos têm explicações baseadas nas regras do jogo - pt-rulebook.pdf.
- [x] Todos os textos traduzidos para todas as línguas suportadas (en, pt-BR, es, fr). -->

TODO:

Ajuste no tutorial.

- [ ] O "buraco de foco" na etapa de apresentação da vida e do ataque do inimigo deve ser ajustado para que o anel de vida e o anel de ataque fiquem totalmente visíveis, centralizados e sem cortes. Atualmente, o buraco de foco está cortando parte dos anéis (lado esquerdo do anel de vida, e lado direito do anel de ataque), dificultando a visualização completa das informações importantes para o jogador.
- [ ] Na etapa Passar a vez, inclua o icone do botão para reforçar a compreensão.
- [ ] Na etapa de Descarte, o buraco mostra apenas o botão de Descartar, e o texto explicando a ação que deve ser tomada (Selecionar cartas para descarte). Porém, não é possível selecionar as cartas (estão na area escurecida). Ajustar o buraco de foco para que o jogador consiga selecionar as cartas para descarte, mantendo a explicação da ação.
