# Plano de Implementação — Tracker de Ações dos Jogadores

Documento técnico para implementar um **registro de ações** (action log) no jogo
digital do Regicide Tracker. O objetivo é registrar, de forma atribuída e
cronológica, o que cada jogador fez no seu turno — em especial:

- **cartas usadas no ataque** (jogadas contra o inimigo atual);
- **cartas descartadas para pagar dano** (fase `suffer_damage`).

O registro serve a dois propósitos:

1. **Histórico consultável** durante e ao fim da partida (quem jogou o quê,
   quando, contra qual inimigo).
2. **Fonte de verdade estável** para a *janela de revelação entre turnos*
   descrita em [turn-reveal-delay-strategy.md](./turn-reveal-delay-strategy.md) —
   que precisa de um registro atribuído e durável das cartas do turno anterior,
   e não apenas do delta efêmero atual.

---

## Objetivo

Adicionar uma trilha de eventos do jogo que:

- registre cada ação relevante de cada jogador (ataque, descarte, jester, yield,
  inimigo derrotado);
- atribua cada ação ao **autor** (`playerId` + snapshot de nome/avatar);
- preserve a **ordem cronológica** e o **inimigo-alvo** de cada ação;
- funcione tanto em **single player** (digital) quanto em **multiplayer**;
- seja **append-only** e barato de sincronizar (não reescreve o blob de estado);
- possa ser exibido em um painel de histórico e reaproveitado pela revelação
  entre turnos.

---

## Estado Atual do Código

Hoje existe captura de estatística **agregada**, mas **não atribuída** e
**não cronológica**, em `GameStats` ([data/types.ts](../data/types.ts)):

```ts
export interface GameStats {
  startTime: number;
  turnsPlayed: number;
  cardsPerTurn: Card[][];     // cartas jogadas por turno — sem autor
  discardedCards: Card[];     // descartes acumulados — sem autor, sem ordem por turno
  enemyKills: { enemy: Enemy; allCards: Card[]; discardedCards: Card[] }[];
}
```

Limitações para o caso de uso pedido:

- **Não há autor.** `cardsPerTurn`/`discardedCards` não sabem *qual jogador*
  jogou/descartou — em multiplayer isso é essencial.
- **Não há timestamp nem alvo.** Não dá para reconstruir a linha do tempo nem
  saber contra qual inimigo a ação ocorreu.
- **`discardedCards` é um flat array.** Perde o agrupamento por evento de
  descarte (um turno pode descartar várias cartas de uma vez).

Há também o efêmero `lastPlayedCards` no
[store/multiplayerStore.ts](../store/multiplayerStore.ts) (linhas ~397–413),
derivado do **delta** de `playedThisFight`. Ele alimenta a prévia
`waitingPlayedCards` em [components/PlayerHand/PlayerHand.tsx](../components/PlayerHand/PlayerHand.tsx)
(linha 127), mas:

- não cobre **descartes** (só ataque);
- é reconstruído por heurística de tamanho de array e some no próximo update;
- não é atribuído nem persistido.

> **Nota sobre o `trackerStore`.** O [store/trackerStore.ts](../store/trackerStore.ts)
> é o *tracker manual* de partida física (mapas de dano/escudo por inimigo) e é
> outro produto. **Este plano não o altera** — o action log é do jogo digital
> (`gameStore` + `multiplayerStore`). Eventualmente o tracker manual pode ganhar
> seu próprio log, mas está fora de escopo aqui.

---

## Decisão de Arquitetura

### Onde mora o log

O log é **append-only** e **atribuído**. Reescrevê-lo dentro do `SharedState`
(que já é um blob grande reserializado a cada jogada via `encodeShared`) seria
caro e sujeito a corrida. A solução espelha o que o **chat** já faz com sucesso:
um nó próprio com `push()`.

```
games/{roomId}        ← estado do jogo (blob reescrito)  — inalterado
roomChats/{roomId}    ← chat (append-only)               — referência de padrão
roomLogs/{roomId}     ← NOVO: action log (append-only)
```

Cada cliente faz `push()` de uma entrada quando executa sua ação local, e todos
assinam `roomLogs/{roomId}` com `limitToLast`. Isso:

- evita corrida com o write de `shared`;
- mantém atribuição confiável (cada jogador escreve a própria ação);
- é barato (um push pequeno por ação, não o blob inteiro);
- já tem padrão de regras/serviço comprovado no chat.

> **Single player.** No `gameStore` local não há Firebase. O mesmo *shape* de
> entrada é mantido em um array em memória (e persistido junto do save via
> `storage.ts`, se desejado). A camada de UI consome a mesma interface,
> independente da origem.

### Shape da entrada de log

Novo tipo em [data/types.ts](../data/types.ts):

```ts
export type GameLogKind =
  | "attack"          // cartas jogadas contra o inimigo
  | "discard"         // cartas descartadas para pagar dano
  | "jester"          // jester usado (cancela imunidade)
  | "yield"           // turno passado sem jogar
  | "enemy_defeated"; // inimigo derrotado (evento marco)

export interface GameLogEntry {
  id: string;            // = chave do push() (RTDB) ou uuid local
  playerId: string;      // autor da ação
  playerName: string;    // snapshot para render histórico
  playerAvatarId?: AvatarId; // snapshot (opcional no fio; fallback ao ler)
  kind: GameLogKind;
  cards?: Card[];        // presente em attack/discard/jester
  enemyId?: string;      // inimigo-alvo no momento da ação
  enemyRank?: EnemyRank; // snapshot p/ render sem cruzar com o castle
  // Derivados úteis p/ render do feed (evita recálculo):
  damage?: number;       // dano aplicado (attack)
  shieldAdded?: number;  // escudo somado (attack com espadas)
  turnIndex?: number;    // stats.turnsPlayed no momento — agrupa por turno
  createdAt: number;     // ServerValue.TIMESTAMP (MP) ou Date.now() (SP)
}
```

Princípios (herdados do plano de avatares):

- **Campos opcionais no fio.** `playerAvatarId`, `enemyRank`, etc. são opcionais
  porque entradas antigas/salas legadas podem não tê-los; normalizar **na
  leitura** com `resolveAvatar`/fallback.
- **Snapshots, não referências.** Nome/avatar/rank do inimigo são copiados para
  a entrada, para o histórico renderizar sem cruzar com estado vivo.

---

## Modelo de Dados

### `data/types.ts`

- Adicionar `GameLogKind` e `GameLogEntry` (acima).
- `GameStats` **permanece** (não quebrar telas de vitória/derrota que já o usam).
  O log é um registro paralelo, mais rico; opcionalmente, `cardsPerTurn` e
  `discardedCards` podem ser **derivados** do log no futuro, mas isso é refator
  separado e fora do MVP.

### Serviço Firebase — novo `services/firebaseLog.ts`

Espelha [services/firebaseChat.ts](../services/firebaseChat.ts):

```ts
const logRef = (roomId: string) => ref(db, `roomLogs/${roomId}`);

export const appendLogEntry = async (
  roomId: string,
  entry: Omit<GameLogEntry, "id" | "createdAt">,
): Promise<void> => {
  await push(logRef(roomId), {
    ...entry,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToRoomLog = (
  roomId: string,
  callback: (entries: GameLogEntry[]) => void,
): (() => void) => {
  const q = query(logRef(roomId), orderByKey(), limitToLast(HISTORY_LIMIT));
  return onValue(q, (snap) => {
    const entries: GameLogEntry[] = [];
    snap.forEach((child) => {
      const parsed = parseLogEntry(child.key ?? "", child.val());
      if (parsed) entries.push(parsed);
      return undefined;
    });
    callback(entries);
  });
};

export const clearRoomLog = (roomId: string) => remove(logRef(roomId));
```

- `HISTORY_LIMIT`: sugerir `200` (uma partida tem muito mais turnos que o chat;
  ainda assim limitado para não crescer sem teto). Avaliar paginação só se preciso.
- `parseLogEntry` (novo, em `utils/log.ts`): valida defensivamente e **descarta
  entradas malformadas** — mas sem exigir campos opcionais (mesma armadilha do
  `parseIncomingMessage` documentada no plano de avatares).

### `database.rules.json`

`roomLogs` precisa de regra própria. Diferente de `games` (permissivo) e igual
ao chat, usar whitelist de campos. **Atenção à mesma armadilha do `$other`:**
qualquer campo novo não declarado é rejeitado e trava o write.

```jsonc
"roomLogs": {
  "$roomId": {
    ".read": true,
    ".write": true,
    "$entryId": {
      ".validate": "newData.hasChildren(['playerId','kind','createdAt'])",
      "playerId":   { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 64" },
      "playerName": { ".validate": "newData.isString() && newData.val().length <= 40" },
      "kind":       { ".validate": "newData.isString()" },
      "createdAt":  { ".validate": "newData.isNumber()" },
      "cards":      { ".validate": "newData.isString() || true" }, // ver nota
      "enemyId":    { ".validate": "newData.isString()" },
      "enemyRank":  { ".validate": "newData.isString()" },
      "damage":     { ".validate": "newData.isNumber()" },
      "shieldAdded":{ ".validate": "newData.isNumber()" },
      "turnIndex":  { ".validate": "newData.isNumber()" },
      "playerAvatarId": { ".validate": "newData.isString() && newData.val().length <= 32" },
      "$other": { ".validate": false }
    }
  }
}
```

> **Cartas: stringificar ou aninhar?** O `SharedState` já guarda arrays como
> `JSON.stringify(...)`. Para o log, recomendo **stringificar `cards` em uma
> string** (`cards: string` = `JSON.stringify(Card[])`) por simetria com o resto
> do projeto e para simplificar a regra de validação (um único `isString()` em
> vez de validar uma sub-árvore de objetos). A UI faz `JSON.parse` na leitura,
> via `parseLogEntry`. Ajustar o tipo de fio (`GameLogEntryWire`) de acordo,
> mantendo `GameLogEntry` (já parseado) para consumo na app.

---

## Pontos de Instrumentação (onde emitir entradas)

Toda emissão acontece **junto** da ação que muda o estado, para o autor ser
sempre o jogador local. Em multiplayer, logo após o `pushToFirebase` da própria
ação; em single player, no ponto equivalente do `gameStore`.

### Multiplayer — [store/multiplayerStore.ts](../store/multiplayerStore.ts)

| Ação na store | Local aprox. | Entrada de log |
|---|---|---|
| `playSelected` (cartas normais) | após resolver `result`, antes/depois do `pushToFirebase` | `kind: "attack"`, `cards: selected`, `damage: result.totalDamage`, `shieldAdded: result.newShield - gameState.spadesShield`, `enemyId/rank` do `enemy` |
| `playSelected` (jester via carta) | ramo `result.isJester` | `kind: "jester"`, `cards: selected` |
| `playSelected` (inimigo derrotado) | ramo `newCurrentDamage >= enemy.health` | além do `attack`, emitir `kind: "enemy_defeated"`, `enemyId/rank` do `enemy` |
| `useJester` | função `useJester` | `kind: "jester"`, sem cartas (uso do jester avulso) |
| `confirmDiscard` | função `confirmDiscard` | `kind: "discard"`, `cards: selected`, `enemyId/rank` do inimigo atual |
| `yieldTurn` | função `yieldTurn` | `kind: "yield"` |

Helper único na store para montar o autor a partir do estado local
(`myPlayerId`, `myDisplayName`, `myAvatarId`) e despachar `appendLogEntry`.

> ⚠️ **Emitir a partir do ator, não do listener.** Não derive entradas de log no
> `onRoomUpdate` a partir de deltas (como o `lastPlayedCards` faz hoje) — isso
> reintroduz o problema de atribuição e de heurística frágil. Cada cliente
> escreve **a própria** ação no momento em que a executa. O `onRoomUpdate` só
> **lê** o log para todos.

### Single player — `gameStore`

Mesmos pontos lógicos (jogar, descartar, jester, yield, kill). Como não há rede,
`appendLogEntry` vira um `set` em um array `gameLog: GameLogEntry[]` no próprio
store, com `id` via uuid e `createdAt: Date.now()`. Autor = jogador único
(pode usar um id/nome fixo, ex.: `"you"` + i18n).

> Para manter a UI agnóstica, ambos os stores expõem `gameLog: GameLogEntry[]`
> já ordenado. O `multiplayerStore` o popula via assinatura do `roomLogs`; o
> `gameStore`, via array local.

---

## Sincronização no Multiplayer Store

- Em `createRoom`/`joinRoom`/`tryReconnect`, **assinar** `subscribeToRoomLog`
  junto da assinatura da sala, guardando o unsubscribe (espelhar
  `_unsubscribeFn`, ex.: `_logUnsubscribeFn`).
- `onRoomUpdate` **não** mexe no log; o callback do log faz seu próprio `set({ gameLog })`.
- Em `leaveRoom`/`finishRoom`/`startGame` (reset), limpar/encerrar a assinatura.
  Avaliar `clearRoomLog` no `finishRoom` análogo ao `clearRoomChat` — **mas** se
  a tela de vitória/derrota exibir o histórico, **não** limpar antes de o
  usuário sair (ver UX abaixo).

> **Ciclo de vida do log vs. fim de partida (implementado).** O chat é limpo ao
> finalizar a sala; o log **não**. Decisão: **não** limpar no `finishRoom` (assim
> as telas de Vitória/Derrota mostram o histórico da partida); limpar a cópia
> local + encerrar a assinatura no `leaveRoom`; e limpar o nó remoto
> (`clearRoomLog`) no `startGame` para que uma nova partida na mesma sala ("jogar
> de novo") comece com o log zerado. O `limitToLast(200)` limita a leitura mesmo
> que algum nó remoto fique órfão.

---

## UX — Exibição do Histórico

### Componente

Criar um feed reutilizável:

- `components/GameLog/GameLog.tsx`
- `components/GameLog/GameLog.styles.ts`
- `components/GameLog/LogEntryRow.tsx`

Cada linha mostra:

- avatar + nome do autor (via `AvatarBadge`, reusando o catálogo de avatares);
- ícone/verbo da ação (atacou / descartou / usou jester / passou / derrotou);
- as **cartas** envolvidas (mini-cartas ou pílulas de naipe+valor);
- alvo (inimigo) quando aplicável;
- dano/escudo derivado quando `attack`.

Agrupar visualmente por `turnIndex`/autor para virar uma "linha do tempo de
turnos". `enemy_defeated` vira um separador de destaque (encerra um duelo).

### Pontos de acesso

- **Durante a partida:** botão/aba para abrir o log (bottom sheet no mobile,
  painel lateral no desktop — reaproveitar o padrão de `ParticipantsSidebar` em
  [screens/GameScreen/components/ParticipantsSidebar.tsx](../screens/GameScreen/components/ParticipantsSidebar.tsx)
  e do chat dockado).
- **Telas de fim:** seção "histórico da partida" em
  [components/VictoryScreen](../components/VictoryScreen) e
  [components/DefeatScreen](../components/DefeatScreen).
- **Revelação entre turnos:** o mesmo feed (ou um recorte das últimas N
  entradas) alimenta a UI da janela de revelação — ver doc separado.

### i18n

Novas chaves em `pt-BR`, `en`, `es`, `fr`:

- `log.title`
- `log.attacked` / `log.discarded` / `log.usedJester` / `log.yielded` /
  `log.defeated`
- `log.empty`
- formatação de "{player} atacou com {cards}" etc.

---

## Estratégia de Implementação

### Etapa 1 — Fundamentos de dados
- `GameLogKind`, `GameLogEntry` (+ wire type) em [data/types.ts](../data/types.ts).
- `utils/log.ts` com `parseLogEntry` (defensivo) e helpers de
  serialização de `cards`.

### Etapa 2 — Backend / sync
- Novo [services/firebaseLog.ts](../services/firebaseLog.ts) (append/subscribe/clear).
- Regra `roomLogs` em [database.rules.json](../database.rules.json) (**obrigatório**).

### Etapa 3 — Instrumentação dos stores
- Emissão nas ações do [store/multiplayerStore.ts](../store/multiplayerStore.ts)
  (`playSelected`, `confirmDiscard`, `useJester`, `yieldTurn`, kills).
- Assinatura do log + `gameLog` no estado.
- Mesma instrumentação no `gameStore` (single player, log em memória).

### Etapa 4 — UI do feed
- `components/GameLog/*` e integração no GameScreen (acesso durante a partida).

### Etapa 5 — Telas de fim + i18n
- Histórico em Victory/Defeat; chaves de i18n nos 4 idiomas.

### Etapa 6 — Polimento
- Limites de histórico, fallbacks (entrada antiga sem avatar/rank), acessibilidade,
  performance do feed (listas longas → `FlatList`/virtualização).

---

## Testes Recomendados

### Lógica (jest-expo, puros)
- `parseLogEntry` aceita entradas **com e sem** campos opcionais e descarta
  malformadas (sem derrubar as válidas).
- Serialização/round-trip de `cards` (stringify → parse) preserva os ids.
- Cada ação do store emite **uma** entrada com o `kind`/autor/alvo corretos
  (mockando `appendLogEntry`).

### Multiplayer
- Jogador A vê no feed a ação de ataque de B com as cartas certas.
- Jogador A vê o descarte de B na fase `suffer_damage`.
- Ordem cronológica consistente entre clientes.
- Atribuição correta quando dois jogadores agem em sequência rápida.

### UI
- Feed agrupa por turno; `enemy_defeated` aparece como marco.
- Acesso durante a partida e nas telas de fim.
- Entrada antiga sem avatar renderiza com fallback.

---

## Critérios de Aceite

- Toda jogada de ataque e todo descarte de dano geram uma entrada atribuída ao
  jogador correto.
- O histórico é consultável durante a partida e nas telas de fim.
- Em multiplayer, todos os clientes convergem para a mesma linha do tempo.
- Entradas antigas/sem campos opcionais não quebram a UI.
- O log não reescreve o blob de `SharedState` (custo de sync proporcional à ação).
- A janela de revelação entre turnos (doc separado) consegue ler do log uma
  representação estável e atribuída do turno anterior.
