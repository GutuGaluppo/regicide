# Plano de Implementacao: Chat em Tempo Real

## Objetivo

Definir um plano tecnico atualizado para adicionar chat ao multiplayer do
Regicide Tracker sem degradar a performance da partida, sem contrariar as
restricoes de comunicacao do jogo e sem depender de identidade instavel entre
web e nativo.

Este documento foi reajustado apos a revisao em
[real-time-chat-engineering-review.md](real-time-chat-engineering-review.md).
Ele tambem incorpora a **segunda passada** dessa revisao, que elevou a migracao
de identidade a um epico proprio e adicionou exigencias explicitas para
persistencia no React Native, testes e versionamento das regras do Firebase.

## Resumo Executivo

O review mudou tres decisoes centrais do plano anterior:

1. chat nao deve compartilhar estado reativo com o fluxo principal do jogo
2. identidade do jogador precisa ser estabilizada com Firebase Anonymous Auth
3. o MVP recomendado deixa de ser texto livre e passa a ser chat por frases
   pre-definidas

### Mudanca adicional da segunda passada

A revisao v2 mostrou que a migracao para `auth.uid` nao e uma simples "Fase 0"
do chat. Ela precisa ser tratada como um **epico de identidade** separado, com
impacto direto em:

- criacao e entrada em sala
- reconexao
- votos de abandono
- persistencia no React Native
- sessao de sala no nativo

### Recomendacao final de produto

O melhor MVP para este projeto e um **quick chat** com frases curtas e seguras,
nao um chat de texto livre.

Motivos:

- respeita melhor as restricoes de comunicacao do Regicide
- reduz o risco de moderacao para publico 10+
- simplifica i18n, regras, layout e validacao
- reduz drasticamente o risco de abuso

### Itens nao negociaveis para qualquer variante de chat

- usar Firebase Anonymous Auth antes de liberar chat
- manter o chat fora de `games/{roomId}`
- isolar render e estado do chat em store separado
- usar `ServerValue.TIMESTAMP` no write
- ler mensagens com `orderByKey()` + `limitToLast(50)`
- limpar historico ao finalizar a sala
- versionar regras do RTDB no repositorio
- validar a continuidade nativa explicitamente, em vez de assumir que auth
  sozinho resolve tudo

## Decisoes Revisadas

### 1. Store separado para chat

O plano anterior recomendava reaproveitar o `multiplayerStore`. Isso nao se
sustenta com a forma como a tela atual consome Zustand.

Hoje a tela multiplayer usa o store principal de forma ampla em
[store/multiplayerStore.ts](../store/multiplayerStore.ts) e
[screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx).
Se `chatMessages` entrar nesse store, cada nova mensagem pode re-renderizar a
tela inteira do jogo.

### Decisao

Criar um store dedicado:

```text
store/chatStore.ts
```

O `multiplayerStore` continua sendo o estado autoritativo da sala e da partida.
O `chatStore` fica responsavel apenas por:

- mensagens
- unread count
- estado aberto/fechado do painel de chat
- subscribe/unsubscribe do canal de chat
- envio de mensagens

### 2. Auth anonimo antes do chat

O review mostrou que a identidade atual nao e suficiente para chat.

Segundo [STORAGE.md](STORAGE.md), `regicide_player_id` so persiste na web via
`localStorage`. No nativo, o ID e regenerado a cada carga do modulo. Isso
invalida autoria estavel no app nativo e impede regras confiaveis de escrita.

### Decisao

Adicionar **Firebase Anonymous Auth** antes de qualquer entrega de chat.

Consequencias positivas:

- `auth.uid` estavel em web e nativo
- autoria confiavel nas mensagens
- regras de escrita amarradas ao usuario autenticado
- base para rate-limit real e futuras evolucoes

### Impacto no multiplayer atual

`myPlayerId` deve passar a derivar de `auth.uid`, e nao mais de um ID gerado
localmente. O fluxo de criar/entrar em sala deve operar com esse UID.

### Escopo real da migracao

Essa migracao nao e pequena. Hoje `playerId` e usado como chave primaria em
varios pontos do multiplayer:

- `games/{roomId}/players/{playerId}`
- votos de abandono
- ordem e distribuicao de maos
- sessao local da sala

Por isso, a recomendacao passa a ser:

- **separar identidade/auth como epico proprio**
- testar esse epico isoladamente
- somente depois construir o quick chat por cima

### Persistencia do auth no React Native

No React Native, Firebase Auth anonimo nao deve usar a configuracao default.
Para manter `auth.uid` estavel apos reabrir o app, a inicializacao precisa usar
persistencia explicita com AsyncStorage.

Direcao recomendada:

```ts
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

Sem isso, o app pode "funcionar no web" e ainda assim regenerar o usuario
anonimo no nativo, recriando o problema que o epico de identidade quer resolver.

### Auth nao resolve sozinho a continuidade da sala no nativo

Mesmo com `auth.uid` persistente, a sala multiplayer hoje continua dependente de
persistencia de sessao que e web-only, conforme [STORAGE.md](STORAGE.md).

Se o objetivo for reentrar em sala apos matar o app no nativo, sera necessario
persistir tambem a sessao da sala em `AsyncStorage`, nao apenas a identidade do
usuario autenticado.

### 3. MVP recomendado: quick chat, nao texto livre

As instrucoes do proprio jogo deixam claro que os jogadores nao podem sugerir o
conteudo da mao nem orientar por informacao privada em
[i18n/locales/pt-BR.ts](../i18n/locales/pt-BR.ts).

Somado a isso, o app exibe classificacao 10+ nos dados de produto. Texto livre
sem moderacao seria uma escolha de produto arriscada para este contexto.

### Decisao

O MVP recomendado deve usar mensagens estruturadas por `presetId`, com frases
curtas aprovadas previamente.

Exemplos de categoria:

- confirmacao social: "Boa jogada"
- estado publico: "Poucas cartas na taverna"
- acao publica: "Passo"
- lembrete de regra publica: "Lembrem da imunidade"

Mensagens que insinuem estrategia privada ou conteudo de mao nao entram no
conjunto inicial.

### Criterio objetivo para presets

Cada preset do MVP deve obedecer uma regra simples:

- pode expressar apenas **informacao publica**, reacao social neutra ou acao
  publica do turno
- nao pode sugerir conteudo de mao
- nao pode sugerir estrategia privada
- nao pode insinuar o melhor naipe ou melhor jogada escondida

Antes de fechar a lista final, os presets devem ser comparados com a secao de
"Comunicacao" das instrucoes do jogo.

### Texto livre

Texto livre fica como **fase posterior**, dependente de:

- auth anonimo ja implementado
- decisao explicita de produto
- nova rodada de revisao de seguranca e moderacao

## Estado Atual da Arquitetura

O multiplayer ja oferece boa base para o recurso:

- sala em `games/{roomId}` em [services/firebaseGame.ts](../services/firebaseGame.ts)
- listener em tempo real com `subscribeToRoom`
- estado centralizado em [store/multiplayerStore.ts](../store/multiplayerStore.ts)
- reidratacao por subscription da sala

Mas existem limitacoes importantes:

- o listener da sala usa `onValue` no no inteiro `games/{roomId}`
- identidade local persistente so existe na web
- nao ha auth no Firebase hoje
- o fluxo atual nao cobre presenca nem limpeza de historico

## Arquitetura Recomendada

### Paths no Firebase

```text
games/{roomId}
roomChats/{roomId}/{messageId}
roomPresence/{roomId}/{playerId}
```

### Responsabilidades por path

- `games/{roomId}`: estado da sala e da partida
- `roomChats/{roomId}`: historico recente de mensagens
- `roomPresence/{roomId}`: presenca efemera para `onDisconnect()` e eventos de
  saida, se decidirmos incluir isso

### Motivo da separacao

Separar o path de chat evita que novas mensagens:

- re-disparem o listener do jogo
- aumentem o payload da sala
- compliquem o ciclo de vida do estado da partida

## Escopo de Produto Recomendado

### MVP recomendado

- quick chat por frases pre-definidas
- disponivel no lobby e na tela da partida
- ultimas 50 mensagens por sala
- sem input de texto livre
- sem emojis livres
- sem anexos
- sem edicao
- sem exclusao manual
- sem indicacao de digitacao
- sem push notification de chat

### Fora de escopo no MVP

- texto livre
- moderacao de conteudo
- mensagens privadas
- reply/thread
- reacoes
- historico longo
- search no chat

## Modelo de Dados Proposto

### Tipo base

Adicionar tipos em [data/types.ts](../data/types.ts):

```ts
export type ChatMessageKind = "preset" | "system" | "text";

export interface ChatMessageBase {
  id: string;
  playerId: string;
  playerNameSnapshot: string;
  createdAt: number;
  kind: ChatMessageKind;
}

export interface PresetChatMessage extends ChatMessageBase {
  kind: "preset";
  presetId: ChatPresetId;
}

export interface SystemChatMessage extends ChatMessageBase {
  kind: "system";
  systemType: "join" | "leave" | "start" | "finish";
}

export interface TextChatMessage extends ChatMessageBase {
  kind: "text";
  text: string;
}

export type ChatMessage =
  | PresetChatMessage
  | SystemChatMessage
  | TextChatMessage;
```

### Observacoes

- `roomId` nao precisa existir dentro da mensagem, porque ja esta no path
- `playerNameSnapshot` e mantido para render historico mesmo se a pessoa sair
- `kind: "text"` fica reservado para fase posterior

### Estrutura no Firebase para o MVP recomendado

```text
roomChats/
  ROOM123/
    -Oabc123
      playerId: "firebase-uid"
      playerNameSnapshot: "Augusto"
      createdAt: 1760000000000
      kind: "preset"
      presetId: "nice_play"
```

### Mensagens de sistema

Se forem ativadas, devem ser estruturadas, nunca localizadas no payload:

```text
kind: "system"
systemType: "join"
playerNameSnapshot: "Augusto"
```

O texto final fica por conta do cliente, via i18n.

## Ordenacao e Janela de Historico

### Decisao

- escrita com `ServerValue.TIMESTAMP`
- leitura com `orderByKey()` + `limitToLast(50)`
- sem reordenacao manual no cliente

### Motivo

`Date.now()` sofre com clock skew entre clientes. O `push()` do RTDB ja gera
chaves cronologicas, entao ele vira a fonte primaria de ordenacao. O timestamp
de servidor continua util para exibicao e diagnostico.

## Operacoes Firebase Necessarias

Adicionar funcoes em [services/firebaseGame.ts](../services/firebaseGame.ts):

- `sendPresetChatMessage(roomId, payload)`
- `subscribeToRoomChat(roomId, callback)`
- `clearRoomChat(roomId)`
- `registerRoomPresence(roomId, playerId, displayName)`
- `unregisterRoomPresence(roomId, playerId)`

### Futuras

- `sendSystemChatEvent(roomId, payload)`
- `sendTextChatMessage(roomId, payload)` apenas em fase posterior

### Decisoes de implementacao

- o MVP espera o echo do listener em vez de optimistic append
- se texto livre existir depois, considerar `clientNonce` para dedupe
- toda leitura do Firebase deve ser validada defensivamente antes de entrar no
  store

## Auth e Regras do Firebase

### Fase obrigatoria anterior ao chat

Criar uma camada minima de auth anonimo, por exemplo:

```text
services/firebaseAuth.ts
```

Responsabilidades:

- garantir sessao anonima ativa no boot
- expor `auth.uid`
- reusar a sessao em web e nativo
- inicializar persistencia explicita no React Native com AsyncStorage

### Regras versionadas

As regras do Realtime Database nao devem existir apenas no console. O plano
passa a exigir versionamento no repositorio, por exemplo:

```text
database.rules.json
```

E um passo claro de deploy ou sincronizacao dessas regras no ambiente Firebase.

### Regras recomendadas

Exemplo conceitual para `roomChats/{roomId}/{messageId}`:

```text
".write": "auth != null
  && newData.child('playerId').val() === auth.uid
  && newData.child('kind').val() === 'preset'
"
```

As regras finais devem validar:

- `auth != null`
- `playerId === auth.uid`
- shape esperado
- tamanho maximo de campos string
- enums permitidos

Para texto livre posterior, regras devem incluir limite de tamanho do texto.
Se eventos de sistema forem ativados, as regras podem ser expandidas para esse
`kind` de forma explicita.

## Store de Chat

Criar:

```text
store/chatStore.ts
```

### Campos recomendados

- `roomId: string | null`
- `messages: ChatMessage[]`
- `unreadCount: number`
- `isOpen: boolean`
- `isConnected: boolean`
- `error: string | null`
- `lastSeenMessageId: string | null`
- `unsubscribeFn: (() => void) | null`

### Acoes recomendadas

- `connect(roomId, playerId, playerName): Promise<void>`
- `disconnect(): void`
- `openChat(): void`
- `closeChat(): void`
- `markAsRead(): void`
- `sendPreset(presetId): Promise<void>`
- `retryConnection(): Promise<void>`
- `reset(): void`

### Regras de unread

- ignorar mensagens do proprio jogador
- se o chat estiver aberto, novas mensagens entram como lidas
- `lastSeenMessageId` e preferivel a timestamp para esse caso

## Integracao com o Multiplayer

O `multiplayerStore` nao deve guardar o historico do chat.

### Integracao minima permitida

Ele pode fornecer apenas o contexto necessario:

- `roomId`
- `myPlayerId`
- `myDisplayName`
- `roomStatus`

### Pontos de conexao do `chatStore`

- ao criar sala
- ao entrar na sala
- ao reconectar sessao
- ao sair da sala
- ao detectar `roomStatus === "finished"`
- ao resolver abandono localmente como partida finalizada

### AppState

No nativo, o chat nao deve depender de subscription ativa durante background.
Ao ir para background, a implementacao pode:

- desconectar o chat
- ou pausar efeitos locais e reconectar ao voltar para `active`

O comportamento escolhido deve ser explicito e testado.

## Presenca e Eventos de Sistema

Mensagens de sistema ficam fora do nucleo do MVP, mas o desenho deve permitir
isso sem reestruturar tudo depois.

### Recomendacao

- usar `roomPresence/{roomId}/{playerId}`
- registrar presenca ao entrar
- remover com `onDisconnect()`

### Se eventos de sistema forem ativados depois

- eles devem ser emitidos como eventos estruturados
- o texto final deve ser localizado no cliente
- deve existir uma autoridade unica de emissao, preferencialmente o host
- evitar que cada cliente gere o proprio texto localizado no banco
- eventos de `leave` devem considerar `onDisconnect()` e dedupe para evitar
  duplicacao

## Limpeza de Historico

No plano anterior, limpeza era opcional. Isso muda agora.

### Decisao

`clearRoomChat(roomId)` e obrigatorio quando a sala encerra.

### Casos que devem disparar limpeza

- finalizacao normal da partida
- abandono aprovado por todos
- encerramento manual da sala pelo fluxo autoritativo

### Observacoes

- a limpeza principal deve ser explicita
- `onDisconnect()` serve como apoio para presenca e sinalizacao efemera
- nao usar `onDisconnect()` como mecanismo principal para apagar historico
  durante uma partida em andamento
- `limitToLast(50)` limita leitura, nao o crescimento server-side; se a partida
  ficar longa, considerar trim periodico alem da limpeza final

## Proposta de UI

### Lobby

Adicionar componente em:

```text
components/RoomChat/
  RoomChatPanel.tsx
  RoomChat.styles.ts
  QuickChatPicker.tsx
```

Uso em [screens/LobbyScreen/LobbyScreen.tsx](../screens/LobbyScreen/LobbyScreen.tsx):

- lista rolavel das ultimas mensagens
- chips ou botoes de quick chat
- badge simples de novas mensagens, se fizer sentido

### Tela da partida

Uso em [screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx):

#### Mobile

- drawer inferior ou painel recolhivel
- aberto sob demanda
- unread badge quando fechado

#### Tablet e desktop

- painel lateral compacto
- preferencialmente no lado oposto ao bloco de participantes
- scroll proprio

### Renderizacao

- mensagens proprias com destaque discreto
- mensagens de sistema com estilo neutro
- para quick chat, renderizar o texto a partir de `presetId` e i18n local

## Validacao e Seguranca

### Na escrita

- validar `presetId` em lista permitida
- bloquear envio sem `auth.uid`
- bloquear envio sem `roomId`
- bloquear envio se a sala estiver finalizada
- validar que o preset pertence ao conjunto aprovado para informacao publica

### Na leitura

Dados do Firebase sao nao-confiaveis. Antes de entrar no store:

- validar `kind`
- validar chaves obrigatorias
- validar comprimento de strings
- descartar mensagens malformadas

### Spam

Cooldown puramente client-side nao e protecao real. Para o MVP:

- pode existir um cooldown visual simples
- a protecao real deve vir de auth + regras

### Recuperacao de listener

O store de chat deve prever estrategia simples de reconexao:

- marcar `isConnected` com precisao
- expor erro observavel
- permitir retry manual
- considerar backoff simples se a subscription cair repetidamente

## Testes

O plano passa a exigir uma camada minima de testes para a logica pura do chat.

### Escopo minimo de testes

- validacao defensiva de mensagens vindas do Firebase
- allow-list de `presetId`
- calculo de unread ignorando mensagens proprias
- comportamento de `lastSeenMessageId`
- ordenacao e dedupe do historico recebido

### Escopo opcional

- testes de serializacao de mensagens preset
- testes do epico de identidade, principalmente boot sem auth pronto
- testes de reconexao quando a sala finaliza

## Sequencia de Implementacao Recomendada

### Epico A - Identidade e auth

Arquivos principais:

- [services/firebase.ts](../services/firebase.ts)
- `services/firebaseAuth.ts`
- [store/multiplayerStore.ts](../store/multiplayerStore.ts)
- [docs/STORAGE.md](STORAGE.md) para atualizar a documentacao depois

Entregas:

- sessao anonima no Firebase
- `myPlayerId` derivado de `auth.uid`
- persistencia explicita do auth no React Native
- ajuste do boot assincrono do multiplayer
- compatibilidade em web e nativo para identidade
- validacao da reconexao atual com a nova identidade

Entregas opcionais, se continuidade nativa for requisito:

- persistencia da sessao da sala em `AsyncStorage`
- reentrada em sala no nativo apos matar o app

Estimativa:

- 1 a 3 dias

### Fase 1 - Infra de chat

Arquivos principais:

- [data/types.ts](../data/types.ts)
- [services/firebaseGame.ts](../services/firebaseGame.ts)
- `store/chatStore.ts`

Entregas:

- tipos de mensagem
- subscribe separado para chat
- envio de mensagens preset
- `ServerValue.TIMESTAMP`
- `orderByKey()` + `limitToLast(50)`
- validacao defensiva na leitura

Estimativa:

- 4 a 6 horas

### Fase 1.5 - Regras e testes basicos

Arquivos principais:

- `database.rules.json`
- testes de store e parsing

Entregas:

- regras do RTDB versionadas
- validacoes cobertas por testes de logica pura
- documentacao de deploy das regras

Estimativa:

- 4 a 8 horas

### Fase 2 - Lifecycle e limpeza

Arquivos principais:

- `store/chatStore.ts`
- [store/multiplayerStore.ts](../store/multiplayerStore.ts)

Entregas:

- connect/disconnect alinhado ao ciclo da sala
- encerramento do chat quando a sala termina
- limpeza de historico ao finalizar
- unread count correto

Estimativa:

- 3 a 5 horas

### Fase 3 - UI de quick chat no lobby

Arquivos principais:

- [screens/LobbyScreen/LobbyScreen.tsx](../screens/LobbyScreen/LobbyScreen.tsx)
- `components/RoomChat/*`
- `i18n/locales/*`

Entregas:

- lista de mensagens
- chips de quick chat
- empty state
- loading e erro

Estimativa:

- 3 a 5 horas

### Fase 4 - UI de quick chat na partida

Arquivos principais:

- [screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx)
- possivelmente [screens/GameScreen/GameScreen.tsx](../screens/GameScreen/GameScreen.tsx)
- `components/RoomChat/*`

Entregas:

- painel responsivo para mobile e tablet+
- unread badge
- isolamento visual do chat em relacao ao HUD do jogo

Estimativa:

- 4 a 6 horas

### Fase 5 - Opcional: eventos de sistema

Entregas:

- presenca com `onDisconnect()`
- mensagens estruturadas de join/leave/start/finish
- renderizacao localizada

Estimativa:

- 3 a 5 horas

### Fase 6 - Opcional: texto livre

Somente se produto aprovar.

Entregas:

- novo `kind: "text"`
- input de texto
- nova rodada de revisao de seguranca
- regras e UX adicionais

Estimativa:

- 2 a 4 dias adicionais

## Estimativa Consolidada

### MVP recomendado

Quick chat estruturado com auth anonimo:

- total: 3 a 6 dias

Inclui:

- epico de identidade
- store separado
- mensagens preset
- lobby + partida
- limpeza de historico
- regras versionadas
- testes basicos

### Variante com texto livre

Chat de texto livre apos auth:

- total: 5 a 8 dias

Inclui:

- tudo do MVP recomendado
- input de texto
- validacoes extras
- maior risco de produto e moderacao

## Criterios de Aceite

O recurso pode ser considerado pronto quando:

- o jogador possui identidade estavel em web e nativo via `auth.uid`
- a persistencia do auth anonimo no React Native esta configurada explicitamente
- o listener do jogo nao recebe o historico do chat
- novas mensagens nao re-renderizam a raiz do fluxo principal da partida
- duas pessoas na mesma sala trocam mensagens preset em tempo real
- a ordem visual segue a ordem das chaves do RTDB
- o historico e limitado as ultimas 50 mensagens
- mensagens malformadas sao ignoradas na leitura
- ao finalizar a sala, o historico do chat e limpo
- unread badge ignora as proprias mensagens
- as regras do RTDB estao versionadas no repositorio

Se continuidade da sala no nativo fizer parte do escopo:

- a sessao de sala tambem persiste em `AsyncStorage`
- o app consegue reentrar na sala apos encerramento completo no nativo

Se continuidade da sala no nativo nao fizer parte do escopo:

- essa limitacao fica documentada explicitamente em [STORAGE.md](STORAGE.md)

## Riscos Tecnicos

- tentar colocar chat dentro de `Room` e reativar acoplamento de listener
- tentar usar `multiplayerStore` para historico de chat e reativar acoplamento
  de render
- manter identidade local sem auth e quebrar autoria no nativo
- supor que auth persistente resolve sozinho a sessao de sala no nativo
- liberar texto livre cedo demais e conflitar com regras de comunicacao do jogo
- esquecer limpeza e deixar historico indefinidamente no RTDB
- deixar regras do RTDB so no console e perder historico de revisao

## Decisoes em Aberto

Antes de codar, ainda vale confirmar:

- o time quer seguir o MVP recomendado de quick chat ou insistir em texto livre
- mensagens de sistema entram no lancamento ou ficam para depois
- no mobile, o chat deve abrir como drawer inferior ou modal lateral
- o quick chat deve aparecer no lobby, na partida, ou nos dois ja no v1
- a continuidade de sala no nativo apos matar o app faz parte do escopo deste
  ciclo ou fica como limitacao documentada

## Recomendacao Final

O melhor caminho para este projeto e:

1. implementar Firebase Anonymous Auth primeiro
2. tratar isso como epico proprio de identidade, nao como detalhe do chat
3. criar `chatStore` separado
4. entregar quick chat por frases pre-definidas como MVP
5. limpar historico ao encerrar a sala
6. versionar regras e cobrir a logica critica com testes
7. reavaliar texto livre somente depois da primeira entrega

Esse caminho preserva a arquitetura atual, reduz risco de produto, respeita as
regras do Regicide e evita que uma feature social degrade a tela principal da
partida.
