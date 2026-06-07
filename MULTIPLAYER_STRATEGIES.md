# Estratégias de Multiplayer — Regicide Tracker

## Contexto

O Regicide Tracker é um app React Native (Expo) que implementa digitalmente o jogo de cartas cooperativo Regicide. Atualmente suporta apenas 1 jogador (modo digital) e rastreamento de partida física (tracker). O jogo original suporta de 1 a 4 jogadores cooperativos — todos trabalham juntos para derrotar os inimigos do castle. Toda a lógica e estado do jogo vivem localmente no dispositivo via Zustand + AsyncStorage, sem qualquer camada de rede.

Para torná-lo multiplayer, o estado do jogo precisa ser **compartilhado em tempo real entre dispositivos**. O desafio central é: quem é a fonte de verdade (authoritative state), como sincronizar ações simultâneas, e como adaptar o modelo de turno para N jogadores.

---

## O que precisa mudar no jogo para N jogadores

Antes de qualquer estratégia de rede, a lógica do jogo precisa ser adaptada:

- **Mão de cada jogador**: Cada jogador tem sua própria mão (tamanho varia: 1P=8, 2P=7, 3P=6, 4P=5)
- **Ordem de turno**: Os jogadores jogam em sequência circular
- **Fase suffer_damage**: Cada jogador escolhe quais cartas descartar para pagar o dano
- **Estado compartilhado**: `castle`, `tavernDeck`, `discardPile` são globais
- **Estado privado**: `playerHand` é por jogador

Esses pontos impactam diretamente a arquitetura escolhida.

---

## Estratégias Propostas

---

### Estratégia 1 — Hotseat Local (Mesmo Dispositivo)

**Descrição**  
Vários jogadores se revezam no mesmo aparelho. A tela "esconde" a mão do jogador atual antes de passar para o próximo.

**Custo**: $0  
**Infraestrutura**: Nenhuma  
**Complexidade**: Baixa

**Por que considerar**  
É o MVP mais rápido de multiplayer. Não exige rede, autenticação, nem backend. Funciona offline. Ideal para jogar com alguém ao lado.

**Implementação estimada**
- Adicionar array `players[]` com hand por índice
- `currentPlayerIndex` no `gameStore`
- Tela de "passe o aparelho para o próximo jogador" entre turnos
- Requer modificar `resolvePlay`, `sufferDamage` e draw para operar por jogador

**Complicações**
- Não é "multiplayer" de rede — cada jogador precisa confiar no outro para não olhar a mão
- Escalabilidade zero: para jogar com amigos remotos, não ajuda
- Pode ser frustrante em partidas longas passar o celular

**Recomendação de uso**  
Válido como **fase 0** (fundação da lógica multi-jogador), pois força a separação `gameState global` vs `playerState privado` — estrutura necessária para qualquer estratégia online.

---

### Estratégia 2 — Firebase Realtime Database

**Descrição**  
Usar Firebase RTDB como backend de sincronização. O estado do jogo é armazenado em um nó JSON na nuvem. Cada cliente ouve mudanças em tempo real via WebSocket gerenciado pelo Firebase.

**Custo**: Gratuito até 1 GB armazenado e 10 GB/mês transferidos (Spark plan). Para um jogo de cartas, está bem dentro do free tier.  
**Infraestrutura**: Gerenciada pelo Google — zero DevOps  
**Complexidade**: Média

**Por que considerar**  
Firebase RTDB é a escolha mais rápida para sincronização em tempo real com Expo. O SDK funciona perfeitamente em React Native. A estrutura do estado do jogo já é um objeto JSON plano (Zustand), o que mapeia diretamente para o nó do RTDB. As subscriptions reativas do Firebase integram bem com o padrão Zustand `set()`.

**Arquitetura proposta**

```
firebase/games/{roomId}/
  ├── castle[]
  ├── tavernDeck[]
  ├── discardPile[]
  ├── currentEnemyDamage
  ├── spadesShield
  ├── phase
  ├── currentPlayerIndex
  └── players/
        ├── {playerId}/hand[]
        └── {playerId}/displayName
```

**Fluxo**
1. Host cria sala → gera `roomId` → grava estado inicial no Firebase
2. Outros jogadores entram com o `roomId`
3. Cada action do Zustand (`playCards`, `yield`, etc.) escreve no Firebase
4. Todos os clientes ouvem o nó via `onValue()` e atualizam o store local

**Complicações**
- **Race conditions**: Dois jogadores podem tentar agir ao mesmo tempo. Resolver com Firebase Transactions (`runTransaction`) para operações atômicas
- **Lock out em fase de sofrimento de dano**: Precisa de lógica de "quem paga primeiro" — controle de estado extra
- **Vendor lock-in**: Firebase é Google; migrar depois é trabalhoso
- **Autenticação**: Precisará de auth anônima ou conta para identificar jogadores e proteger as salas com Security Rules

**Recomendação de uso**  
**Melhor opção para lançamento rápido**. O custo-benefício é o melhor do grupo: zero custo, zero DevOps, SDK maduro para Expo, documentação vasta.

---

### Estratégia 3 — Supabase Realtime

**Descrição**  
Supabase é um backend open-source (BaaS) baseado em PostgreSQL com suporte a canais de broadcast em tempo real via WebSocket (Supabase Realtime). A sincronização acontece por canais de presença e broadcast, não necessariamente por banco de dados.

**Custo**: Gratuito até 500 MB banco de dados, 5 GB transferência, 200 conexões simultâneas (Free tier). Projetos ficam em pausa após 1 semana sem uso no free tier.  
**Infraestrutura**: Gerenciada — menos vendor lock-in que Firebase (open source)  
**Complexidade**: Média-Alta

**Por que considerar**  
Supabase tem dois mecanismos relevantes:
- **Realtime Broadcast**: Canal de eventos sem persistência — ideal para ações de jogo em tempo real (sem escrever no banco)
- **Realtime Postgres**: Ouve mudanças em tabelas do banco — ideal para estado persistente da partida

Para Regicide, a abordagem ideal seria híbrida: **estado do jogo persistido em tabela** + **ações transmitidas via broadcast** para responsividade.

**Arquitetura proposta**

```sql
-- Tabela de salas
games (id, state jsonb, phase, current_player_index, created_at)
players (id, game_id, hand jsonb, display_name)
```

Cada ação atualiza a tabela `games`, e todos os clientes ouvem via `postgres_changes` no canal da sala.

**Complicações**
- **Pausa automática**: No free tier, o projeto hiberna após 7 dias sem acesso — jogadores verão latência na primeira requisição de uma sessão nova
- **Conflitos**: PostgreSQL JSONB não tem transações otimistas nativas para o padrão de jogo; precisaria de Row-Level Locking ou optimistic concurrency
- **Complexidade de setup**: Mais configuração inicial que Firebase (migrations, políticas RLS, tipos)
- **SDK Expo**: Funciona, mas menos testado em React Native que Firebase

**Recomendação de uso**  
Boa escolha se o projeto já usa ou planeja usar banco relacional (ex.: armazenar histórico de partidas, rankings, etc.). Para sincronização de jogo puro, **é mais complexo que Firebase sem vantagem proporcional**.

---

### Estratégia 4 — Node.js + Socket.io + Servidor Gerenciado

**Descrição**  
Servidor próprio com Node.js e Socket.io. O servidor é a única fonte de verdade do estado do jogo. Clientes enviam ações (`PLAY_CARDS`, `YIELD`) e recebem o estado atualizado em broadcast.

**Custo**: $0 no free tier de plataformas como Railway, Render ou Fly.io (com limitações de sleep). ~$5-7/mês para instância always-on em Railway.  
**Infraestrutura**: Semi-gerenciada (você faz o deploy, a plataforma gerencia o servidor)  
**Complexidade**: Alta

**Por que considerar**  
Dá controle total sobre a lógica de autoridade do jogo. O servidor pode validar todas as ações antes de aplicá-las, impedindo cheats e garantindo consistência. A lógica que hoje está em `gameStore.ts` e `gameLogic.ts` migraria para o servidor.

**Arquitetura proposta**

```
Client → Socket.io → Server
         "ACTION:PLAY_CARDS" { cards: [...] }

Server valida a ação (reusa gameLogic.ts)
Server atualiza GameState (em memória ou Redis)
Server emite "STATE_UPDATE" { newState } para todos os clientes da sala
Clients recebem e atualizam o Zustand store
```

**Complicações**
- **Servidor sleeps**: Free tiers fazem o servidor "dormir" após inatividade. Primeiros 30-60s de uma sessão nova podem ter latência
- **Stateful em memória vs. Redis**: Para sobreviver a restarts do servidor, o estado precisaria de Redis ou banco de dados. Redis Cloud tem free tier de 30 MB
- **Duplicação de lógica**: A validação precisa rodar no servidor (autoridade) mas também no cliente (feedback instantâneo) — o "optimistic UI problem". Resolver extraindo `gameLogic.ts` como pacote compartilhado (monorepo com workspace)
- **Reconexão**: Clientes que caem precisam reconectar e receber o estado atual — requer `socket.join(roomId)` + `socket.emit("current_state")`
- **DevOps**: Você gerencia deploys, logs, uptime

**Recomendação de uso**  
**Melhor opção para controle total e jogos competitivos/anti-cheat**. Para um app cooperativo de portfólio, o overhead de manutenção pode não valer. Recomendado se o projeto crescer além de hobby.

---

### Estratégia 5 — PartyKit

**Descrição**  
PartyKit é uma plataforma especializada em multiplayer em tempo real, construída sobre Cloudflare Workers e Durable Objects. Cada "party" (sala de jogo) é um servidor de edge que mantém estado efêmero.

**Custo**: Free tier generoso (10k req/dia, estado em memória). Plano pago começa em ~$9/mês para uso sério.  
**Infraestrutura**: Edge computing (Cloudflare) — zero cold starts, latência baixa globalmente  
**Complexidade**: Média

**Por que considerar**  
PartyKit resolve exatamente o problema de "servidor de jogo com estado". Cada sala vira um `PartyServer` com estado em memória, WebSocket para cada jogador conectado, e lógica de `onConnect/onMessage/onClose`. A lógica do servidor é TypeScript puro — a mesma linguagem do projeto — e `gameLogic.ts` pode ser reutilizado diretamente.

```typescript
// party/game.ts
export default class GameParty implements Party.Server {
  game: GameState;

  onMessage(msg: string, sender: Party.Connection) {
    const action = JSON.parse(msg);
    this.game = applyAction(this.game, action); // reusa gameLogic.ts
    this.party.broadcast(JSON.stringify(this.game));
  }
}
```

**Complicações**
- **Estado efêmero**: Quando todos saem da sala, o estado some. Para partidas longas, precisaria persistir em KV (Cloudflare KV ou banco externo)
- **Plataforma nova**: PartyKit ainda é jovem (lançado 2023); pode ter breaking changes
- **Expo/React Native**: Sem SDK oficial para RN; usa WebSocket padrão diretamente (funciona, mas sem helpers de reconexão automática)
- **Cold start de Durable Objects**: ~200-500ms na primeira conexão de uma sala nova

**Recomendação de uso**  
**Melhor relação custo × latência × simplicidade para jogos em tempo real**. Recomendado se quiser uma arquitetura moderna sem gerenciar servidor próprio. Ideal para portfólio pela elegância técnica.

---

### Estratégia 6 — WebRTC P2P (sem servidor central de estado)

**Descrição**  
Utilizar WebRTC para conexão peer-to-peer direta entre os dispositivos dos jogadores. Um jogador é o "host" (peer autoritativo); os outros se conectam diretamente a ele. Um servidor de sinalização mínimo (STUN/TURN) ajuda no handshake inicial.

**Custo**: $0 com servidores STUN públicos (Google, Cloudflare). TURN server pode ser necessário para NAT traversal (~$0-5/mês no Twilio)  
**Infraestrutura**: Quase zero — apenas servidor de sinalização efêmero  
**Complexidade**: Muito Alta

**Por que considerar**  
Sem custo recorrente de servidor de estado. Os dados do jogo trafegam diretamente entre dispositivos, sem passar por servidor central. Interessante para privacidade e latência em redes locais.

**Complicações**
- **NAT traversal**: Muitas redes bloqueiam conexões P2P. TURN relay pode ser necessário, adicionando custo e latência
- **Expo sem suporte nativo a WebRTC**: Precisaria de `react-native-webrtc` (bare workflow ou custom dev client — sai do managed Expo)
- **Host como autoridade**: Se o host perder conexão, a partida termina. Sem fallback natural
- **Complexidade de implementação**: Signaling server, ICE candidates, DataChannel — curva de aprendizado alta
- **Mobile background**: iOS e Android matam conexões WebRTC quando o app vai para background

**Recomendação de uso**  
**Não recomendada para este projeto**. A complexidade técnica é desproporcional ao benefício, especialmente por exigir sair do managed Expo (quebra o tooling atual).

---

## Matriz Comparativa

| Estratégia | Custo | Infra | Complexidade | Tempo p/ MVP | Recomendação |
|---|---|---|---|---|---|
| Hotseat Local | $0 | Nenhuma | Baixa | 1-2 semanas | Fase 0 / fundação |
| Firebase RTDB | $0 | Gerenciada | Média | 2-3 semanas | ⭐ Melhor para lançar rápido |
| Supabase Realtime | $0\* | Gerenciada | Média-Alta | 3-4 semanas | Bom se precisar de banco relacional |
| Node.js + Socket.io | $0-7/mês | Semi-gerenciada | Alta | 4-6 semanas | Melhor para controle total |
| PartyKit | $0\* | Edge (Cloudflare) | Média | 2-3 semanas | ⭐ Melhor arquitetura moderna |
| WebRTC P2P | $0-5/mês | Mínima | Muito Alta | 6-10 semanas | Não recomendada |

\*com limitações de free tier

---

## Recomendação Final

**Para portfólio e lançamento rápido: Firebase Realtime Database**  
Custo zero, zero DevOps, SDK maduro no Expo, sincronização em tempo real out-of-the-box. O estado do jogo em JSON mapeia naturalmente para o RTDB. A maior parte do trabalho estará na adaptação da lógica do jogo para multi-jogador, não na infra.

**Para arquitetura mais elegante e moderna: PartyKit**  
Permite reutilizar `gameLogic.ts` no servidor sem duplicação. Edge computing garante baixa latência. O código do servidor é TypeScript coeso com o projeto. Impressiona mais em portfólio pela modernidade da stack.

---

## Roadmap Sugerido

1. **Hotseat local** — adaptar `gameStore` para array de jogadores, turnos em sequência. Esta etapa é a fundação reutilizável para qualquer estratégia online.
2. **Escolher Firebase ou PartyKit** — adicionar camada de rede sobre a lógica já adaptada.
3. **Sala com código** — tela de criação/entrada de sala, compartilhar código de 4-6 dígitos.
4. **Reconexão e persistência** — salvar estado no backend para retomar partidas interrompidas.
