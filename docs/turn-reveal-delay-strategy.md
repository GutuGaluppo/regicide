# Estratégia — Janela de Revelação entre Turnos (Multiplayer)

Documento de **estratégia** (não de implementação fechada) para introduzir um
**atraso deliberado** entre o fim do turno de um jogador e o início do turno do
próximo. Durante esse intervalo, **todos os jogadores** veem as cartas que o
jogador anterior **usou no ataque** e **descartou para pagar dano**.

Isso reproduz uma dinâmica das regras de mesa: no Regicide, as cartas jogadas e
descartadas ficam visíveis e os jogadores precisam acompanhá-las para coordenar
a estratégia cooperativa (o que já saiu, o que sobra no baralho/descarte). Sem
uma pausa, em uma implementação digital rápida essas cartas "passam batido".

> **Depende do action log.** A revelação consome a representação **atribuída e
> estável** do turno anterior produzida em
> [action-tracker-implementation-plan.md](./action-tracker-implementation-plan.md).
> Recomendo implementar o tracker primeiro; a revelação é a camada de
> apresentação temporizada sobre ele.

---

## Objetivo

Inserir, ao final de um turno, uma **fase de revelação** com duração limitada,
em que:

- as cartas de **ataque** e de **descarte** do jogador que acabou de jogar ficam
  destacadas para todos;
- o próximo jogador **ainda não pode agir** (o turno não avançou de fato);
- ao fim do intervalo (timeout ou confirmação), o turno avança normalmente.

Requisitos não-funcionais:

- robusto a **desconexão** do jogador que acabou de jogar;
- sem servidor autoritativo (continuamos com Firebase RTDB como verdade
  compartilhada e clientes como atores);
- não introduzir travas onde a partida fique presa esperando alguém.

---

## Restrição Arquitetural Atual (por que isto é não-trivial)

Hoje, no [store/multiplayerStore.ts](../store/multiplayerStore.ts), a resolução
da jogada e o **avanço do turno** acontecem no **mesmo write**. Veja
`playSelected`/`confirmDiscard`/`yieldTurn`: o índice do próximo jogador é
calculado e gravado junto do estado, por exemplo:

```ts
const nextIndex = advanceTurn(_currentPlayerIndex, playerCount);
const shared = encodeShared(next, nextIndex, _playerOrder, playerCount);
pushToFirebase(shared, { ... });
```

Ou seja: no instante em que o jogador A termina, `currentPlayerIndex` já aponta
para B, e o cliente de B recebe `isMyTurn = true` imediatamente
(`onRoomUpdate` → `turnJustStarted`). **Não existe janela** entre "A terminou" e
"B começa".

Qualquer estratégia precisa **separar** esses dois momentos:

1. *A resolveu a jogada* (estado do duelo atualizado, mas turno **não** avançado);
2. *o turno avança para B* (após o intervalo de revelação).

Há duas famílias de solução, abaixo.

---

## Decisão-chave: revelação **local** vs. fase **compartilhada**

| Eixo | A) Revelação local (turno avança já) | B) Fase compartilhada (turno avança depois) |
|---|---|---|
| O turno avança | imediatamente (como hoje) | só após o intervalo |
| Próximo jogador pode agir durante a revelação | **sim** (problema) | **não** (correto) |
| Fonte do atraso | timer local em cada cliente | marcador no estado compartilhado |
| Risco de "B joga antes de ver" | alto | nenhum |
| Robustez a desconexão | trivial (nada bloqueia) | exige plano de fallback |
| Fidelidade às regras | parcial | alta |

A pergunta pedida ("o atraso dá espaço para os outros verem as cartas, **antes**
do próximo iniciar a rodada") implica que **B não deve começar durante a
revelação**. Isso aponta para a **família B (fase compartilhada)**. A família A
é mais simples mas não cumpre o requisito central. Documento as duas; recomendo B.

---

## Estratégia A — Revelação local (não recomendada como principal)

Mantém o avanço imediato do turno, mas cada cliente exibe uma sobreposição de
revelação por alguns segundos, lida do action log (últimas entradas do turno que
acabou). O cliente de B atrasa **apenas a UI de ação** localmente.

- **Prós:** mínima mudança no protocolo; sem risco de travamento.
- **Contras:** B pode burlar o atraso (estado já diz que é a vez dele); a
  sincronização da revelação entre clientes é só "best effort"; não cumpre bem o
  requisito de "antes de iniciar a rodada".

Útil como **fase 0 visual** (provar o componente de revelação a partir do log)
antes de investir na fase compartilhada.

---

## Estratégia B — Fase de revelação compartilhada (recomendada)

Introduzir uma **nova fase**/estado intermediário no jogo, em que o turno está
"congelado em revelação" e o estado compartilhado diz claramente: *ninguém deve
agir ainda; estamos mostrando as cartas de quem acabou de jogar*.

### B.1 Modelo de estado

Acrescentar ao `SharedState`/`GameState` um bloco de revelação (campos opcionais,
normalizados na leitura — mesmo padrão dos avatares):

```ts
// em GameState/SharedState
reveal?: {
  byPlayerId: string;     // quem acabou de jogar
  fromIndex: number;      // currentPlayerIndex que estava agindo
  toIndex: number;        // índice do próximo jogador (ainda NÃO efetivado)
  startedAt: number;      // ServerValue.TIMESTAMP do início da revelação
  durationMs: number;     // janela (ex.: 3500)
  logCursor?: string;     // âncora no roomLogs (id da 1ª entrada do turno)
};
```

Enquanto `reveal` estiver presente:

- `isMyTurn` é **forçado a `false`** para todos (ninguém age);
- a UI mostra a revelação (cartas de ataque + descarte do `byPlayerId`),
  lidas do action log a partir de `logCursor`;
- um contador regressivo (derivado de `startedAt + durationMs`) indica quando o
  próximo turno começa.

### B.2 Fluxo de transição

Substituir, nos pontos que hoje fazem `advanceTurn(...)` + write, por **dois
passos**:

1. **Encerrar a ação → entrar em revelação** (quem agiu escreve):
   - resolve o duelo como hoje (dano, descarte, etc.);
   - **não** avança `currentPlayerIndex` ainda (mantém `fromIndex`);
   - grava `reveal = { byPlayerId: me, fromIndex, toIndex: advanceTurn(...), startedAt: serverTimestamp, durationMs }`.

2. **Fechar a revelação → avançar o turno**:
   - quando `now >= startedAt + durationMs`, **efetiva** `currentPlayerIndex = toIndex`
     e remove `reveal`.

A questão central é **quem executa o passo 2** sem servidor. Ver B.3.

### B.3 Quem fecha a revelação (coordenação sem servidor)

O estado compartilhado precisa de **um único** escritor do "fechamento" para
evitar corrida. Opções:

**(i) O próprio ator agenda o fechamento (recomendado, com fallback).**
O jogador que acabou de jogar arma um `setTimeout(durationMs)` e, ao disparar,
escreve o avanço do turno (`currentPlayerIndex = toIndex`, `reveal = null`).
Como o ator já é o escritor natural daquele turno, não há corrida no caminho
feliz.

- **Risco:** o ator desconecta/fecha o app durante a janela → ninguém fecha →
  partida travada.
- **Fallback obrigatório:** o **próximo jogador** (`toIndex`) também observa o
  relógio; se `now > startedAt + durationMs + GRACE` (ex.: +2s) e `reveal` ainda
  existe, **ele** escreve o fechamento. Como `reveal.toIndex === meuIndex`, só um
  cliente assume o fallback → sem corrida. (Em 1P/host-driven a regra degenera
  para o próprio host.)

**(ii) Sempre o próximo jogador fecha.**
O ator só entra em revelação; quem fecha é sempre `toIndex` ao seu relógio
estourar. Conceitualmente limpo (quem vai jogar é quem "aceita" começar), mas
adiciona dependência do próximo cliente estar online. Combinar com fallback para
o host resolve.

**(iii) Cloud Function/onDisconnect.**
Fora do escopo atual (sem backend de funções). Mencionado só para completude:
uma função agendada poderia fechar revelações expiradas de forma autoritativa.

> **Recomendação:** **(i) com fallback do próximo jogador**. Caminho feliz tem um
> único escritor (o ator); o fallback cobre desconexão com um único escritor
> determinístico (o próximo). Ambos idempotentes: o fechamento só age **se**
> `reveal` ainda existir e `toIndex` bater — um write tardio não "desfaz" um
> turno já iniciado.

### B.4 Idempotência e corrida

- O fechamento é um **compare-and-set lógico**: ler `reveal` atual; só escrever o
  avanço se `reveal != null` e `reveal.startedAt` for o mesmo observado. Usar
  `runTransaction` do RTDB no nó de `shared` (ou no sub-campo) para tornar o
  fechamento atômico e evitar dois escritores efetivarem o mesmo avanço duas
  vezes.
- Como cada revelação tem `startedAt` único, um fechamento atrasado de uma
  revelação **já encerrada** falha a checagem e vira no-op.

### B.5 Pular a revelação (UX)

Permitir um botão **"Pular"** que efetiva o fechamento imediatamente.

**Decisão (implementada):** só o **próximo jogador** (`reveal.toIndex`) pode
pular. É a leitura fiel das regras: o `pt-rulebook.pdf` diz que "o próximo
jogador, no sentido dos ponteiros do relógio, **inicia** um novo turno" (Passo 4)
e que "o jogador que acabou de derrotar o inimigo… **inicia** um novo turno" — ou
seja, quem dá início ao próximo turno é o próximo jogador. O ator, que já
terminou, **não** vê o botão. O fechamento automático por timeout (e o fallback)
continua valendo para todos, garantindo o avanço mesmo se ninguém pular. O
fechamento é idempotente, então um "pular" concorrente com o timeout é inócuo.

---

## Interação com casos especiais do jogo

A revelação só faz sentido quando o turno **realmente passa** para outro jogador.
Mapear contra a lógica atual de `playSelected`:

- **Jester encadeia o mesmo jogador** (`result.isJester` mantém
  `currentPlayerIndex`): **sem** revelação — o jogador continua agindo.
- **Inimigo derrotado** sem fim de jogo: há um novo duelo. A revelação mostra as
  cartas do golpe final com a marca `defeatedEnemy`. **Decisão:** a duração é
  **constante** (`REVEAL_DURATION_MS`), igual para jogada normal e para kill — não
  varia por tipo de jogada.
- **Vitória/Derrota** (`phase === "victory" | "defeat"`): **sem** revelação — vai
  direto para a tela de fim (o histórico completo fica no log).
- **`suffer_damage`**: a revelação correta é **após o descarte** (`confirmDiscard`),
  pois é aí que as cartas de descarte existem. Atenção: hoje o jogador entra em
  `suffer_damage` no **mesmo** turno; a revelação dispara no `confirmDiscard`, que
  é o ponto em que o turno fecha de fato.
- **`yieldTurn` com dano 0** (passa sem jogar): turno passa sem cartas.
  **Decisão (implementada):** revela com a mensagem **"{jogador} passou a vez"**
  (`reveal.yielded = true`, sem cartas) — ajuda os demais a acompanhar a mesa. A
  mensagem é traduzida em pt-BR/en/es/fr (`multiplayer.reveal.yielded`). Mesmo
  tratamento no `yieldTurn` que não pôde pagar mas avança (`resolveCannotPay` →
  `player_turn`).
- **`resolveCannotPay` → `defeat`**: vai para tela de derrota; sem revelação.

---

## UI da Revelação

Reusar o componente de feed do action log
([action-tracker-implementation-plan.md](./action-tracker-implementation-plan.md))
em um modo "destaque":

- sobreposição (overlay) não bloqueante de toque para os demais, bloqueante para
  a área de ação do próximo jogador;
- cabeçalho: avatar + nome de quem jogou (via `AvatarBadge`);
- duas seções: **Atacou com** (cartas de ataque) e **Descartou** (cartas de
  dano), renderizadas como mini-cartas;
- contador regressivo + botão **Pular**;
- aproveitar `lastPlayedCards`/`waitingPlayedCards` que já existem em
  [components/PlayerHand/PlayerHand.tsx](../components/PlayerHand/PlayerHand.tsx)
  como base visual, **estendendo** para também cobrir descartes e ler do log
  (estável/atribuído) em vez do delta efêmero.

### Sons/haptics

Reusar `playTurnAlert`/`Haptics` já disparados em `turnJustStarted`
([store/multiplayerStore.ts](../store/multiplayerStore.ts) ~415–420), mas
**mover** o gatilho do "é sua vez" para **o fim** da revelação (quando o turno de
fato avança), não para o início dela.

---

## Impacto no código (resumo de pontos)

- [data/types.ts](../data/types.ts): bloco `reveal` em `GameState`/`SharedState`
  (campos opcionais).
- [store/multiplayerStore.ts](../store/multiplayerStore.ts):
  - `encodeShared`/`decodeShared`: serializar/normalizar `reveal`;
  - `playSelected`/`confirmDiscard`/`yieldTurn`: trocar "avançar turno" por
    "entrar em revelação" (salvo casos especiais acima);
  - novo `closeReveal()` (efetiva `toIndex`, limpa `reveal`) com `runTransaction`;
  - `onRoomUpdate`: enquanto `reveal` ativo, forçar `isMyTurn = false`; armar
    timer local de fechamento (ator) e de fallback (próximo jogador);
  - mover gatilho de alerta de turno para pós-revelação.
- [screens/GameScreen/GameScreen.tsx](../screens/GameScreen/GameScreen.tsx) e
  `MultiplayerGameScreen`: renderizar overlay de revelação; bloquear ação durante
  ele.
- i18n: `reveal.attackedWith`, `reveal.discarded`, `reveal.startingIn`,
  `reveal.skip`.

---

## Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Ator desconecta na janela → trava | Fallback determinístico do próximo jogador (B.3 i) + transação idempotente |
| Dois clientes fecham a revelação | `runTransaction` + checagem de `startedAt` → segundo write vira no-op |
| Relógios dessincronizados entre dispositivos | Usar `startedAt` do **serverTimestamp** como referência única; `GRACE` no fallback absorve skew |
| Revelação atrasa demais o ritmo | Duração curta (3–4s), botão Pular, sem revelação em yield/jester |
| Próximo jogador "vê" sua mão e planeja cedo | Aceitável e até desejável (coordenação cooperativa); a trava é só sobre **agir** |

---

## Faseamento Recomendado

1. **Fase 0 — Componente de revelação (local).** Estratégia A: overlay lido do
   action log, sem mexer no avanço de turno. Valida UI/sons/haptics.
2. **Fase 1 — Estado `reveal` compartilhado.** Estratégia B com fechamento pelo
   ator (caminho feliz), sem fallback. Testar com todos online.
3. **Fase 2 — Robustez.** Fallback do próximo jogador + `runTransaction`
   idempotente; tratar desconexão.
4. **Fase 3 — Casos especiais e polimento.** Kill/yield/jester, durações por
   tipo, botão Pular, i18n, acessibilidade.

---

## Decisões de Produto (resolvidas)

- **Duração da janela:** **constante** (`REVEAL_DURATION_MS`), independente do
  tipo de jogada (normal, kill ou yield).
- **Yield sem cartas:** **revela** a mensagem "{jogador} passou a vez"
  (`reveal.yielded`), com tradução nos 4 idiomas.
- **Quem pode pular:** **só o próximo jogador** (`reveal.toIndex`), conforme o
  rulebook ("o próximo jogador… inicia um novo turno"). O timeout/fallback
  automático continua para todos.
- **Mostrar a mão de quem jogou:** **não** — as mãos são sempre privadas; a
  revelação expõe apenas cartas jogadas/descartadas (informação pública pelas
  regras de Comunicação, p.10 do rulebook).
- **O action log sobrevive ao fim da partida?** **Resolvido** — o tracker
  ([action-tracker-implementation-plan.md](./action-tracker-implementation-plan.md))
  foi implementado: o log **sobrevive** até a tela de fim (mostrado em
  Vitória/Derrota); é limpo no `startGame` (nova partida) e no `leaveRoom`.
