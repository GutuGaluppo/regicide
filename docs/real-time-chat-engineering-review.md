# Revisão de Engenharia — Plano de Chat em Tempo Real

Revisão técnica (perspectiva de engenharia sênior) do
[real-time-chat-implementation-plan.md](real-time-chat-implementation-plan.md).
Foca em **complicações** e **melhorias** ancoradas no código atual, antes de
iniciar a implementação.

## Veredito

O plano está **sólido e maduro**: escopo de MVP bem delimitado, a decisão de
separar `roomChats/{roomId}` do nó da sala está **correta** (o `subscribeToRoom`
usa `onValue` no nó inteiro `games/{roomId}`, então chat embutido re-dispararia o
listener do jogo), e a seção de segurança é honesta sobre a falta de auth.

Recomendo, porém, **rever três decisões antes de codar** (ver "Recomendação
final") e tornar duas práticas **não-negociáveis** já no MVP (limpeza de
histórico e `ServerValue.TIMESTAMP`).

---

## 🔴 Alto impacto

### 1. Separar o *listener* não elimina o acoplamento de *render*

**Complicação.** O plano separa o listener do Firebase (ótimo), mas recomenda
reaproveitar o `multiplayerStore` colocando `chatMessages` no mesmo store.
Acontece que [MultiplayerGameScreen](../screens/MultiplayerGameScreen/MultiplayerGameScreen.tsx)
e a `TurnHud` consomem o store **inteiro** (`const store = useMultiplayerStore()`
e destructuring sem selector). Em Zustand, qualquer `set({ chatMessages })`
re-renderiza **toda a tela de jogo** a cada mensagem — reintroduzindo, no nível
do React, o custo que a separação no Firebase tentou evitar.

**Melhoria.**
- Opção A: um **`chatStore` Zustand separado**.
- Opção B: subscriptions por **selector** (`useMultiplayerStore(s => s.chatMessages)`)
  e isolar o chat num componente dedicado que só ele assina.

Sem isso, o critério de aceite "novas mensagens não quebram o fluxo do jogo"
passa funcionalmente, mas falha em performance.

### 2. Identidade: web-only no nativo + não verificável sem auth

**Complicação.** O plano apoia-se em "`playerId` persiste no `localStorage`".
Mas (ver [STORAGE.md](STORAGE.md)) isso é **só web** — no **nativo o `playerId`
é regenerado a cada abertura do app**. Para o chat isso significa autoria
instável no nativo, e a regra proposta ("validar que o autor está listado na
sala") não garante nada: o cliente envia `playerId`/`playerName` arbitrários.

**Melhoria.** Adotar **Firebase Anonymous Auth *antes* do chat**, não depois. O
projeto já está no Firebase; é barato, fornece um `auth.uid` estável e permite
**regras que amarram `auth.uid` à autoria**:

```text
// regra conceitual em roomChats/{roomId}/{messageId}
".write": "auth != null && newData.child('playerId').val() === auth.uid"
```

Resolve impersonação, rate-limit confiável e identidade no nativo de uma vez.

### 3. Game design + público 10+: texto livre é discutível

**Complicação (nível de produto).**
- O Regicide tem **regras de comunicação restrita** (jogadores não podem revelar
  o conteúdo da mão) — a própria tela de instruções documenta isso. Um chat de
  texto livre **viola o design cooperativo** do jogo.
- O app é classificado **10+**. Chat de texto livre sem moderação é risco real
  de segurança/produto.

**Melhoria.** Considerar **frases pré-definidas / emotes** (estilo Hearthstone)
em vez de texto livre. Vantagens:
- respeita as regras de comunicação do Regicide;
- **elimina** moderação, profanidade e problemas de layout/XSS;
- simplifica i18n (chaves fixas, localizadas por viewer);
- **reduz** o escopo do MVP.

Texto livre fica como evolução pós-auth. Aqui, frases prontas podem ser a opção
*mais correta*, não apenas a mais simples.

---

## 🟠 Técnico concreto

### 4. Ordenação por `createdAt: Date.now()` sofre com clock skew

**Complicação.** Dois clientes com relógios dessincronizados podem **intercalar
mensagens fora de ordem**.

**Melhoria.** Usar **`ServerValue.TIMESTAMP`** para `createdAt` e ordenar pela
**chave do `push()`** (já cronológica) com `orderByKey()` + `limitToLast(50)`.
Remove a necessidade de "normalização crescente no cliente".

### 5. Vazamento de dados: RTDB não tem TTL

**Complicação.** `roomChats/{roomId}` **acumula para sempre** — o `clearRoomChat`
está marcado como "opcional". Salas órfãs deixam histórico permanente (o mesmo já
ocorre com `games/{roomId}`, mas o chat agrava).

**Melhoria.** Tornar a limpeza **não-opcional**, disparada no encerramento.
Amarrar ao caminho de status `"finished"` — **incluindo a resolução local** que
foi adicionada no fix de abandono em
[multiplayerStore.ts](../store/multiplayerStore.ts) — e usar `onDisconnect()`
para limpeza best-effort.

### 6. Mensagens de sistema não são localizáveis por viewer

**Complicação.** Armazenar `text: "Fulano entrou na sala"` grava o texto **no
idioma de quem enviou**; os demais veem nesse idioma. Além disso, **quem emite**
o evento? Se cada cliente emite o próprio "entrei", há corrida/duplicação; "saiu"
é indetectável sem presença.

**Melhoria.** Armazenar **evento estruturado**
(`kind: "system", systemType: "join", playerName`) e renderizar localizado no
cliente. Emitir por uma **autoridade** (host) e usar `onDisconnect()` para "saiu".

### 7. Ciclo de vida da subscription tem buracos

**Complicação.** O plano lista criar/entrar/reconectar/sair, mas falta:
- **desinscrever quando a sala vira `"finished"`** (inclusive na resolução local
  do abandono);
- desinscrever no **`AppState` background** (nativo);
- a reconexão hoje é **web-only e por aba** — o chat herda essa limitação.

---

## 🟡 Menores

- **Unread count por timestamp** (`_lastChatReadAt`) é frágil com skew + janela do
  `limitToLast`; precisa ignorar as próprias mensagens e auto-marcar lido com o
  chat aberto.
- **Cooldown anti-spam (800–1500 ms)** é client-side → **trivialmente burlável**.
  Rate-limit real só com auth + regras.
- **Validação defensiva na leitura**: mensagens vindas do Firebase são
  **não-confiáveis** (qualquer cliente pode escrever lixo); validar
  shape/length/enum **na entrada**, não só na saída.
- **`roomId` dentro da mensagem** é redundante (já está no path) — bloat
  desnecessário.
- **Echo da própria mensagem**: com `limitToLast`, a própria mensagem volta pelo
  listener; decidir entre optimistic-append (com dedupe por id) ou esperar o echo.

---

## Matriz de priorização

| # | Item | Severidade | Esforço | Quando |
|---|---|---|---|---|
| 1 | Isolar render do chat (store/selector) | Alta | Baixo | MVP |
| 2 | Firebase Anonymous Auth + regras por `auth.uid` | Alta | Médio | Antes do MVP |
| 3 | Frases predefinidas vs. texto livre | Alta (produto) | Baixo | Decisão pré-MVP |
| 4 | `ServerValue.TIMESTAMP` + `orderByKey` | Média | Baixo | MVP |
| 5 | Limpeza de histórico no encerramento | Média | Baixo | MVP |
| 6 | Mensagens de sistema estruturadas/localizadas | Média | Médio | Pós-MVP |
| 7 | Cobertura do ciclo de subscription | Média | Baixo | MVP |
| — | Itens menores | Baixa | Baixo | Polimento |

---

## Segunda passada (revisão do plano v2)

Após a v1 desta revisão, o plano foi reescrito para a
[v2](real-time-chat-implementation-plan.md) e **incorporou praticamente tudo**:
`chatStore` separado, auth anônimo primeiro, quick-chat por presets,
`ServerValue.TIMESTAMP` + `orderByKey`, limpeza obrigatória, eventos de sistema
estruturados, validação defensiva na leitura e tratamento de `AppState`.

Aplicando os **mesmos critérios** sobre a v2, restam os pontos abaixo — quase
todos concentrados no que a v2 introduziu: a **migração de identidade**.

### 🔴 Alto impacto

#### 8. A migração para `auth.uid` é maior que a "Fase 0"
O `playerId` é hoje a **chave primária de identidade** em todo o multiplayer:
`games/{roomId}/players/{playerId}`, `votes/{playerId}`, `players/{pid}/hand`
(distribuição round-robin de Ouros), a sessão `regicide_room`, e o
`getOrCreatePlayerId()` **síncrono** no carregamento do módulo em
[multiplayerStore.ts](../store/multiplayerStore.ts).

Trocar para `auth.uid` é **breaking** e **assíncrono** (`onAuthStateChanged`): o
`SESSION_PLAYER_ID` atual existe antes de qualquer render, enquanto auth
introduz um estado "ainda não autenticado" no boot que o store inteiro precisa
aguardar — afetando criar/entrar em sala, reconexão e os votos de abandono.

**Melhoria.** Tratar como **épico próprio de identidade**, separado do chat, com
estimativa revisada (a "4–8h" da Fase 0 é otimista) e testado isoladamente
**antes** de construir o chat por cima.

#### 9. Persistência do Auth no React Native (armadilha silenciosa)
"Reusar a sessão em web e nativo" esconde uma armadilha: o Firebase JS SDK **não
persiste** a sessão anônima no RN por padrão. Sem
`initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })`,
o `auth.uid` **é regenerado a cada abertura no nativo** — recriando exatamente o
problema que a Fase 0 quer resolver.

**Melhoria.** Tornar o `getReactNativePersistence(AsyncStorage)` explícito no
plano; é fácil "funcionar no web" e quebrar silenciosamente no build nativo.

#### 10. Auth corrige identidade, mas não restaura a sessão de sala no nativo
O critério "identidade estável em web e nativo" é **necessário, não suficiente**
para chat contínuo no nativo: a sessão da sala (`regicide_room`) vive em
`sessionStorage` — **web-only e por aba** (ver [STORAGE.md](STORAGE.md)). Mesmo
com `auth.uid` estável, o nativo **não reentra** numa sala após o app ser morto,
então o chat também não reconecta lá.

**Melhoria.** Reconhecer isso no plano e, para continuidade no nativo, persistir
a **sessão da sala em `AsyncStorage`** (pré-requisito da promessa "web e nativo",
fora do escopo do chat em si).

### 🟠 Médio

#### 11. Falta seção de testes
O repo passou a ter `jest-expo` + testes de lógica pura. O chat tem peças puras
e testáveis que o plano não cita: validação defensiva na leitura, allow-list de
`presetId`, lógica de unread (`lastSeenMessageId`, ignorar próprias),
normalização/ordenação.

**Melhoria.** Adicionar uma fase/critério de teste para a lógica pura do chat,
mantendo a consistência com o resto do código.

#### 12. Regras do Firebase não são versionadas
O plano dá regras conceituais, mas não há `database.rules.json` no repo nem
processo de deploy — as regras vivem só no console (drift, sem review, sem
histórico).

**Melhoria.** Versionar `database.rules.json` e citar o passo de deploy.

#### 13. Codificar o critério de "preset permitido"
Alguns exemplos de preset tangenciam coaching ("Lembrem da imunidade").

**Melhoria.** Definir critério objetivo: presets só expressam **informação
pública** (contagem de taverna, "Passo", reações sociais) — nunca sugerir
conteúdo de mão/estratégia privada. A lista final deve ser checada contra a seção
"Comunicação" das instruções do jogo.

### 🟡 Menores (v2)

- **Auth anônimo limita, não elimina abuso:** limpar storage/reinstalar gera novo
  `uid` (ban-evasion). É um *piso* de proteção, não um teto.
- **Autoridade dos eventos de sistema:** join/start/finish precisam de um emissor
  único (host) para evitar duplicação/corrida; `onDisconnect` para "leave" pode
  duplicar se vários clientes reagirem.
- **Crescimento server-side durante a partida:** `limitToLast(50)` limita a
  *leitura*, mas `roomChats/{roomId}` cresce ilimitado no servidor até a limpeza
  no `finished` (pequeno com presets + cooldown; considerar trim periódico).
- **Recuperação do listener:** `isConnected`/`error` existem, mas falta
  estratégia de retry/backoff para queda da subscription.

### Conclusão da segunda passada

A v2 resolveu quase tudo da primeira passada. O risco remanescente **não é o
chat — é a migração de identidade** (itens 8–10): mais profunda, assíncrona, com
uma armadilha de persistência no RN, e ainda assim sem continuidade total no
nativo sem persistir a sessão de sala. Recomendo **separar o épico de
auth/identidade do chat**, com estimativa e testes próprios, e só então construir
o quick-chat por cima — somando uma **seção de testes** e **regras versionadas**.

---

## Recomendação final

O plano está pronto para um MVP, mas eu ajustaria **três decisões antes de
codar**:

1. **Auth anônimo primeiro** — destrava identidade no nativo + regras reais.
2. **Isolar o render do chat** (store/selector separado) — senão o "não impacta o
   jogo" não se sustenta no React.
3. **Reavaliar texto livre vs. frases predefinidas** — dado o design do Regicide
   e o público 10+, frases prontas podem ser a escolha mais correta.

E tornar **limpeza de histórico** e **`ServerValue.TIMESTAMP`** não-negociáveis já
no MVP.
