# Plano de Implementação — Avatares de Jogadores

> **Revisão de engenharia incorporada.** Ajustes-chave sobre a 1ª versão:
> regras do Firebase atualizadas para o novo campo de chat; leitura resiliente
> (avatar opcional + fallback ao catálogo); integração com o fluxo de lobby em
> **dois passos** (`entryStep`) já existente; preservação da **cor do jogador**
> como anel no chip; reuso de **arte existente** para o catálogo MVP.

Documento técnico para implementar avatares de jogadores no fluxo multiplayer do
Regicide Tracker, com foco em:

- escolha/definição do avatar no lobby junto com o nome;
- seleção exibida em modal;
- reutilização do avatar no chat;
- substituição do ponto colorido nos chips de jogadores;
- comportamento responsivo para mobile e desktop.

---

## Objetivo

Adicionar uma identidade visual persistente por jogador no multiplayer, sem
introduzir upload de imagem nem dependências externas no MVP.

O avatar deve:

- ser selecionado antes de criar/entrar em uma sala;
- poder ser alterado no lobby antes do início da partida;
- persistir durante a sessão atual;
- aparecer no chat e nos chips de jogadores;
- ser sincronizado entre os participantes da sala.

---

## Recomendação de Escopo MVP

### Decisão principal

Para a primeira versão, usar **catálogo fixo de avatares locais** com
`avatarId`, e não upload de imagem personalizada.

### Motivos

- evita pipeline de upload/storage/moderação;
- simplifica sincronização e cache;
- reduz risco de layout quebrado por imagens arbitrárias;
- é muito mais simples para Expo + Firebase RTDB;
- dá previsibilidade visual para chips e chat.

### Fora do escopo do MVP

- upload de foto;
- crop/edição de imagem;
- avatar animado;
- avatar diferente por sala;
- avatar vinculado a conta persistente entre instalações/dispositivos.

---

## Estado Atual do Código

Hoje a identidade do jogador no multiplayer usa basicamente `displayName`.

### Pontos principais

- O lobby coleta nome em [screens/LobbyScreen/LobbyScreen.tsx](../screens/LobbyScreen/LobbyScreen.tsx).
- O tipo do jogador da sala está em [data/types.ts](../data/types.ts) via
  `RoomPlayer`.
- A criação/entrada em sala usa [services/firebaseGame.ts](../services/firebaseGame.ts).
- O store multiplayer deriva `roomPlayers` em
  [store/multiplayerStore.ts](../store/multiplayerStore.ts).
- O chat renderiza `playerName` em [components/RoomChat/RoomChat.tsx](../components/RoomChat/RoomChat.tsx).
- Os chips de jogadores estão em
  [screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx),
  usando hoje um `dot` colorido.

Hoje **não existe conceito de avatar** nem em `RoomPlayer`, nem em mensagens de
chat.

---

## Proposta de Arquitetura

### 1. Identidade do avatar por `avatarId`

Adicionar um identificador estável do avatar escolhido.

Exemplo:

```ts
export type AvatarId =
  | "knight_01"
  | "bard_01"
  | "cleric_01"
  | "paladin_01"
  | "jester_01"
  | "queen_01"
  | "king_01"
  | "rogue_01";
```

O `avatarId` será a única informação persistida e sincronizada. O mapeamento
`avatarId -> asset/label` fica local no app.

### 2. Catálogo local

Criar um catálogo central, por exemplo:

- `data/avatars.ts`

Esse módulo deve exportar:

- lista ordenada de avatares;
- `DEFAULT_AVATAR_ID`;
- label i18n ou chave de label;
- asset local (`require(...)`);
- metadados opcionais de acessibilidade;
- um resolvedor seguro `resolveAvatar(id): Avatar` (ver abaixo).

> **Reaproveitar arte existente no MVP.** Em vez de exigir 8 PNGs novos em
> `assets/avatars/` (que travariam o bundle se faltarem — mesmo problema dos
> sons placeholder), montar o catálogo a partir de arte que o app já tem:
> `assets/classes/` (Clérigo/Bardo/Guerreiro/Paladino + curinga) e a arte de
> nobres/cartas. Zero assets novos e tematicamente coerente com Regicide.

Exemplo conceitual:

```ts
export const AVATARS = [
  { id: "cleric_01", image: require("@/assets/classes/hearts.png"), labelKey: "avatars.cleric01" },
  // ...
];

export const DEFAULT_AVATAR_ID: AvatarId = AVATARS[0].id;

// Resolvedor defensivo: id desconhecido/antigo/adulterado → default.
export const resolveAvatar = (id: string | undefined): Avatar =>
  AVATARS.find((a) => a.id === id) ?? AVATARS[0];
```

`resolveAvatar` é a **única** porta de entrada usada pela UI — assim um
`avatarId` inválido nunca chega a um `require`/`<Image>` quebrado.

### 3. Componente visual reutilizável

Criar um componente único para exibir avatar, por exemplo:

- `components/AvatarBadge/AvatarBadge.tsx`

Esse componente deve aceitar:

- `avatarId`;
- `size`;
- `highlighted`;
- `ringColor` (opcional) — cor do jogador, ver "Chips de Jogadores";
- `fallbackLabel`.

Regras internas:

- resolve o asset **sempre** via `resolveAvatar(avatarId)` (nunca quebra com id
  inválido);
- usa **`expo-image`** (padrão do projeto) com `contentFit` para cache/perf;
- quando `ringColor` é fornecido, desenha uma borda colorida ao redor.

Ele será reutilizado em:

- lobby;
- chat;
- chips de jogadores;
- sidebar de participantes.

---

## Modelo de Dados

### `data/types.ts`

Adicionar `AvatarId` e incluir avatar em:

> **Regra geral:** nos tipos de "fio" (o que vem do Firebase), `avatarId` é
> **opcional**, porque salas/mensagens antigas não o têm. A normalização para
> `DEFAULT_AVATAR_ID` (via `resolveAvatar`) acontece **na leitura**
> (`decodeShared`/`roomPlayers` e `parseIncomingMessage`), de modo que o restante
> do app trate o avatar como sempre-presente sem risco de dados antigos quebrarem.

#### `RoomPlayer`

```ts
export interface RoomPlayer {
  id: string;
  displayName: string;
  avatarId?: AvatarId; // opcional no fio; normalizado ao ler
  hand: string;
}
```

#### `ChatMessage`

O chat hoje salva snapshot de `playerName`. O avatar deve seguir a mesma lógica.

```ts
export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatarId?: AvatarId; // opcional no fio; fallback ao ler/renderizar
  ...
}
```

> ⚠️ **`parseIncomingMessage` descarta mensagens malformadas.** Em
> [utils/chat.ts](../utils/chat.ts), `playerAvatarId` **não pode** ser exigido na
> validação — senão mensagens antigas (sem avatar) seriam descartadas. Validar
> como opcional e resolver via `resolveAvatar` (id desconhecido → default).

### Store multiplayer

Expandir `MultiplayerRoomPlayer` em [store/multiplayerStore.ts](../store/multiplayerStore.ts):

```ts
export interface MultiplayerRoomPlayer {
  id: string;
  displayName: string;
  avatarId: AvatarId;
  cardCount: number;
}
```

### Sessão local

Hoje a sessão salva:

```ts
type SessionData = { roomId: string; displayName: string; isHost: boolean };
```

Atualizar para:

```ts
type SessionData = {
  roomId: string;
  displayName: string;
  avatarId: AvatarId;
  isHost: boolean;
};
```

Isso evita perder o avatar em reconexão web.

---

## Fluxo de UX

## Entrada no lobby

### Estado atual

O lobby já usa um fluxo em **dois passos** controlado por `entryStep` em
[screens/LobbyScreen/LobbyScreen.tsx](../screens/LobbyScreen/LobbyScreen.tsx):

1. passo **`name`**: informar nome + botão **Confirmar**;
2. passo **`action`**: escolher **Criar** ou **Entrar**;
3. aguardar sala (view `waiting`).

### Fluxo proposto

Como o avatar deve ser escolhido **junto com o nome**, ele entra **no passo
`name`** (não como passo novo): bloco de identidade = campo de nome + preview do
avatar + botão "Escolher avatar" (abre a modal). O passo `action` permanece igual.

1. passo `name`: informar nome **e** escolher avatar (preview + modal);
2. **Confirmar** → passo `action`;
3. escolher Criar ou Entrar;
4. aguardar sala.

### Regra recomendada

O **Confirmar** (que avança de `name` para `action`) só fica habilitado quando:

- `displayName.trim().length > 0`
- `avatarId` válido (já há um default selecionado, então normalmente é sempre
  válido)

### Edição posterior no lobby

Enquanto a sala estiver em `lobby`, o jogador pode reabrir a modal e trocar seu
avatar.

No MVP, a troca pode ser permitida:

- antes de criar/entrar;
- depois que já entrou na sala, enquanto `roomStatus === "lobby"`.

Quando o jogo começar, o avatar fica congelado até sair da sala.

> **Sugestão de corte de escopo:** a edição **depois de já estar na sala**
> exige `updatePlayerProfile` + sincronização para os outros participantes. Para
> um primeiro corte enxuto, dá para entregar só a escolha **antes** de
> criar/entrar e deixar a edição em-sala para uma fase 2 — reduz a superfície de
> sync sem perder o valor principal.

---

## Modal de Avatar

### Requisito funcional

A escolha de avatar deve acontecer em **modal**.

### Estrutura proposta

Criar:

- `components/AvatarPickerModal/AvatarPickerModal.tsx`
- `components/AvatarPickerModal/AvatarPickerModal.styles.ts`

### Conteúdo da modal

- título;
- descrição curta;
- grid de avatares;
- preview do avatar selecionado;
- botão `Confirmar`;
- botão `Cancelar` ou fechar.

### Comportamento

- selecionar um avatar atualiza preview local;
- confirmar grava `avatarId` no estado do lobby;
- se estiver no lobby conectado à sala, confirmar dispara update no Firebase;
- cancelar descarta alterações temporárias.

---

## Responsividade da Modal

### Desktop

No desktop, usar modal centralizada com card fixo.

Recomendação:

- largura entre `560` e `720`;
- grid com `4` colunas;
- preview lateral ou no topo;
- fundo escurecido com overlay.

### Mobile

No mobile, continuar sendo modal, mas com apresentação estilo bottom sheet ou
card grande ancorado embaixo.

Recomendação:

- ocupar `80%` a `90%` da altura útil;
- grid com `3` colunas;
- área de scroll interna;
- footer fixo com ações.

### Tablet

Tablet pode seguir o layout desktop simplificado:

- modal centralizada;
- grid com `3` ou `4` colunas.

### Acessibilidade

- cada avatar precisa de `accessibilityRole="button"`;
- indicar item selecionado por borda + contraste, não só cor;
- permitir navegação por teclado no web;
- garantir alvo de toque confortável.

---

## Persistência e Sincronização

## Firebase — sala

Atualizar [services/firebaseGame.ts](../services/firebaseGame.ts):

- `createRoom(...)`
- `joinRoom(...)`

Para receber `avatarId` além de `displayName`.

Exemplo conceitual:

```ts
createRoom(roomId, hostId, displayName, avatarId)
joinRoom(roomId, playerId, displayName, avatarId)
```

### Atualização de avatar no lobby

Adicionar uma operação dedicada:

```ts
updatePlayerProfile(roomId, playerId, { displayName?, avatarId? })
```

Ela deve escrever apenas no nó do jogador:

`games/{roomId}/players/{playerId}`

Isso evita recrever a sala inteira.

### ⚠️ Atualizar `database.rules.json` (chat)

As regras do chat em [database.rules.json](../database.rules.json) usam
**whitelist de campos** por mensagem, com `"$other": { ".validate": false }`.
Isso **rejeita qualquer campo novo** — ou seja, adicionar `playerAvatarId` à
mensagem faz o write **falhar** e o chat parar de funcionar.

Correção obrigatória: declarar e validar `playerAvatarId` na regra de
`roomChats/{roomId}/{messageId}` (string, comprimento limitado; opcional).

```jsonc
"playerAvatarId": { ".validate": "newData.isString() && newData.val().length <= 32" }
```

O nó `games/{roomId}` é permissivo (`.write: true`), então o `avatarId` em
`RoomPlayer` **não** exige mudança de regra — apenas o chat.

---

## Multiplayer store

Atualizar [store/multiplayerStore.ts](../store/multiplayerStore.ts) para:

- carregar `avatarId` em `roomPlayers`;
- salvar `myAvatarId`;
- persistir `avatarId` na sessão web;
- expor ação de update do perfil no lobby.

Sugestão:

```ts
myAvatarId: AvatarId;
setPendingProfile: (...) => void; // opcional local
updateMyLobbyProfile: (displayName: string, avatarId: AvatarId) => Promise<void>;
```

---

## Chat

## Snapshot do avatar na mensagem

O chat já grava snapshot de `playerName`. O mesmo padrão deve ser aplicado ao
avatar.

### Motivo

Se o jogador trocar o avatar no lobby antes do início da partida, mensagens já
enviadas devem continuar representando o autor no estado em que a mensagem foi
criada.

### Alterações

Atualizar:

- [services/firebaseChat.ts](../services/firebaseChat.ts)
- [utils/chat.ts](../utils/chat.ts)
- [store/chatStore.ts](../store/chatStore.ts)

Para incluir `playerAvatarId`.

### Render

No [components/RoomChat/RoomChat.tsx](../components/RoomChat/RoomChat.tsx):

- exibir avatar ao lado da bubble ou no cabeçalho da mensagem;
- para mensagens próprias, pode manter layout simplificado;
- para mensagens de outros jogadores, mostrar avatar + nome.

### Recomendação visual

- avatar pequeno, `24` a `32px`;
- alinhado ao topo da bubble;
- nome acima do texto continua válido.

---

## Chips de Jogadores

Hoje os chips usam um ponto colorido em
[screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx).

### Mudança proposta

Substituir o `dot` por `AvatarBadge` — **mantendo a cor do jogador como anel**.

> ⚠️ Hoje o `dot` usa `PLAYER_COLORS[index]`: a **cor identifica qual jogador é
> qual** (e o ativo) num relance, no HUD e na `ParticipantsSidebar`. Trocar o
> ponto pelo avatar **sem a cor** perde essa distinção — e nada impede dois
> jogadores de escolherem o **mesmo avatar** (em 18–22px ficam ambíguos).
> Solução: passar a cor do jogador como `ringColor` do `AvatarBadge` (avatar +
> anel colorido). Alternativa: impor avatares únicos por sala. Recomendado o anel.

### Regras visuais

- manter o nome do jogador;
- manter o pill com número de cartas;
- o avatar substitui o marcador circular, **mas a cor vira o anel do avatar**;
- `playerChipActive` continua destacando o turno ativo;
- `playerChipSelf` continua com tratamento visual específico.

### Tamanho sugerido

- `18` a `22px` no chip do HUD inferior;
- `20` a `24px` em contextos mais amplos.

### Outros lugares recomendados

Vale também atualizar o player list do lobby:

- hoje usa `playerDot`;
- pode migrar para o mesmo `AvatarBadge`.

Isso melhora consistência visual desde a sala de espera.

---

## Fluxo Funcional Recomendado

## Criar sala

1. Jogador informa nome.
2. Jogador abre a modal de avatar.
3. Escolhe avatar e confirma.
4. Clica em `Criar sala`.
5. `createRoom` grava `displayName` + `avatarId`.
6. A lista de jogadores no lobby já mostra o avatar.

## Entrar na sala

1. Jogador informa nome.
2. Jogador escolhe avatar pela modal.
3. Informa código.
4. Clica em `Entrar`.
5. `joinRoom` grava `displayName` + `avatarId`.

## Alterar avatar no lobby

1. Jogador abre a modal novamente.
2. Escolhe novo avatar.
3. Confirma.
4. O store atualiza Firebase.
5. Lobby, chat futuro e chips passam a usar o novo avatar.

---

## Estratégia de Implementação

## Etapa 1 — Fundamentos de dados

Arquivos-alvo:

- [data/types.ts](../data/types.ts)
- novo `data/avatars.ts`

Entregas:

- tipo `AvatarId`;
- catálogo local;
- `DEFAULT_AVATAR_ID`;
- `RoomPlayer` com avatar;
- `ChatMessage` com `playerAvatarId`.

## Etapa 2 — Firebase + stores

Arquivos-alvo:

- [services/firebaseGame.ts](../services/firebaseGame.ts)
- [services/firebaseChat.ts](../services/firebaseChat.ts)
- [utils/chat.ts](../utils/chat.ts)
- [store/multiplayerStore.ts](../store/multiplayerStore.ts)
- [store/chatStore.ts](../store/chatStore.ts)
- [database.rules.json](../database.rules.json) **(obrigatório — ver acima)**

Entregas:

- criação/entrada com avatar;
- update de perfil no lobby;
- snapshot de avatar no chat (`playerAvatarId` **opcional** no parse, com fallback);
- normalização na leitura (`decodeShared`/`roomPlayers` → `resolveAvatar`);
- regra do chat aceitando `playerAvatarId`;
- sessão web com `avatarId` (e `myAvatarId` em `AsyncStorage` no nativo, opcional).

## Etapa 3 — UI base de avatar

Arquivos-alvo:

- novo `components/AvatarBadge/...`
- novo `components/AvatarPickerModal/...`

Entregas:

- avatar reutilizável;
- modal de seleção com grid responsivo;
- estados visual/selecionado/desabilitado.

## Etapa 4 — Lobby

Arquivos-alvo:

- [screens/LobbyScreen/LobbyScreen.tsx](../screens/LobbyScreen/LobbyScreen.tsx)
- [screens/LobbyScreen/LobbyScreen.styles.ts](../screens/LobbyScreen/LobbyScreen.styles.ts)

Entregas:

- estado local `avatarId`;
- CTA para abrir modal;
- preview do avatar escolhido;
- edição de avatar antes de criar/entrar;
- edição no lobby de espera.

## Etapa 5 — Chat e chips

Arquivos-alvo:

- [components/RoomChat/RoomChat.tsx](../components/RoomChat/RoomChat.tsx)
- [components/RoomChat/RoomChat.styles.ts](../components/RoomChat/RoomChat.styles.ts)
- [screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx)

Entregas:

- avatar nas mensagens;
- avatar no HUD de jogadores;
- remoção do ponto colorido.

## Etapa 6 — Polimento

Entregas:

- i18n de labels da modal;
- fallback seguro para avatar ausente;
- ajustes de spacing;
- revisão de contraste/acessibilidade.

---

## Fallbacks e Compatibilidade

### Fallback para salas antigas

Se algum `RoomPlayer` chegar sem `avatarId`, usar `DEFAULT_AVATAR_ID`.

### Fallback para mensagens antigas

Se uma mensagem de chat antiga não tiver `playerAvatarId`, renderizar:

- `DEFAULT_AVATAR_ID`, ou
- avatar derivado deterministicamente do `playerId`.

### Regra recomendada

Mesmo com fallback visual, ao tocar no perfil do jogador no lobby o app deve
salvar `avatarId` explicitamente para normalizar dados futuros.

---

## Considerações de UX

### Escolha do avatar junto com o nome

Como o requisito diz que a definição do avatar ocorre junto com o nome, o lobby
deve apresentar nome + avatar como parte do mesmo bloco de identidade, e não
como configuração escondida.

Recomendação:

- campo de nome;
- preview do avatar atual;
- botão `Escolher avatar`;
- CTA principal abaixo.

### Feedback visual

O usuário precisa sair da modal com clareza sobre o avatar escolhido.

Recomendação:

- preview do avatar selecionado no card principal do lobby;
- borda dourada ou destaque claro no avatar ativo;
- label do avatar opcional abaixo do preview.

---

## Impacto em i18n

Adicionar novas chaves em:

- `pt-BR`
- `en`
- `es`
- `fr`

Sugestões:

- `lobby.avatarSection`
- `lobby.avatarPlaceholder`
- `lobby.chooseAvatar`
- `lobby.changeAvatar`
- `lobby.confirmAvatar`
- `lobby.cancelAvatar`
- `avatars.knight01`
- `avatars.bard01`

---

## Testes Recomendados

## Lógica (testes unitários puros — jest-expo)

- `resolveAvatar(id)` retorna o avatar certo para id válido e o **default** para
  id ausente/desconhecido/adulterado;
- `parseIncomingMessage` parseia mensagens **com e sem** `playerAvatarId` (sem
  descartar as antigas);
- catálogo expõe um `DEFAULT_AVATAR_ID` que existe na lista.

## UI

- modal abre/fecha corretamente;
- confirmação grava avatar local;
- avatar aparece no lobby após seleção;
- avatar aparece no chat;
- avatar substitui o ponto no chip.

## Responsividade

- mobile portrait;
- tablet;
- desktop com chat dockado;
- web com navegação por teclado na modal.

## Multiplayer

- jogador A vê o avatar de jogador B no lobby;
- jogador A vê o avatar de jogador B no chat;
- troca de avatar no lobby propaga para todos antes do jogo começar.

---

## Critérios de Aceite

- O jogador não consegue criar/entrar sem nome válido.
- O avatar pode ser escolhido por modal no lobby.
- O avatar escolhido é mostrado no lobby antes do início da partida.
- O avatar persiste durante a sessão da sala.
- O chat mostra avatar + nome do autor.
- Os chips de jogadores usam avatar no lugar do ponto colorido.
- A modal funciona adequadamente em mobile e desktop.
- Salas/mensagens antigas sem avatar não quebram a interface.

---

## Recomendação Final

Implementar em MVP com **avatares predefinidos locais + `avatarId` persistido**.

Isso entrega valor visual alto com baixo risco técnico, encaixa bem na
arquitetura atual de lobby/chat/Firebase e prepara o terreno para evoluções
futuras sem impor upload de mídia logo de início.
