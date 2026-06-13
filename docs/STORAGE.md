# Persistência de Dados — Reinício / Fechamento da Página

Como o app guarda (ou não) o estado quando o jogador **atualiza**, **fecha** ou
**reabre** a página/aplicativo. Cobre os modos single-player, multiplayer,
tracker, além de configurações e tutorial.

---

## Backends de armazenamento

| Backend | Plataforma | Escopo | Tempo de vida |
|---|---|---|---|
| **AsyncStorage** (`@react-native-async-storage/async-storage`) | iOS / Android | App | Persistente |
| **localStorage** | Web | Origem (domínio) | Persistente até ser limpo |
| **sessionStorage** | Web | **Aba** do navegador | Some ao fechar a aba |
| **Firebase Realtime Database** | Todas | Sala (nuvem) | Enquanto a sala existir |

> ⚠️ **Detalhe importante:** no build **web**, o `AsyncStorage` é implementado
> **sobre o `localStorage`**. Ou seja, na web, dados gravados via `AsyncStorage`
> e via `localStorage` direto vivem no mesmo lugar (localStorage da origem).
>
> Consequência: `localStorage` e `sessionStorage` **não existem no nativo**.
> Qualquer recurso que dependa deles é, na prática, **exclusivo da web**.

---

## O que é armazenado

### 1. Partida single-player (jogo digital completo)

| | |
|---|---|
| **Onde** | `AsyncStorage` (→ `localStorage` na web) |
| **Chave** | `regicide_save` |
| **Conteúdo** | `GameState` inteiro em JSON: castelo, mão, taverna, descarte, dano atual, escudo, fase, estatísticas, coringas, etc. |
| **Quando grava** | Após **cada ação** (jogar, ceder, descartar, usar coringa) — `persist()` no `gameStore` chama `saveGame()` |
| **Quando lê** | Ao montar a `GameScreen`: `gameStore.initialize()` → `loadGame()` |
| **Código** | [services/storage.ts](../services/storage.ts), [store/gameStore.ts](../store/gameStore.ts) |

**Resultado:** atualizar ou fechar/reabrir a página do single-player **retoma a
partida exatamente de onde parou**. A persistência sobrevive a reinício e
fechamento, em web e nativo. Começar um "Novo jogo" sobrescreve o save.

---

### 2. Partida multiplayer

O **estado autoritativo da partida vive no Firebase**, não localmente. No
dispositivo guardamos apenas o necessário para **re-entrar** na sala após um
reload. O estado do jogo é re-hidratado pela subscription do Firebase.

#### 2a. Identidade do jogador

| | |
|---|---|
| **Onde** | `localStorage` (**somente web**) |
| **Chave** | `regicide_player_id` |
| **Conteúdo** | ID estável do jogador, gerado uma vez por origem e reutilizado |
| **Código** | `getOrCreatePlayerId()` em [store/multiplayerStore.ts](../store/multiplayerStore.ts) |

No **nativo** não há `localStorage`, então o ID é **regenerado a cada carga do
módulo** (`generatePlayerId()`). Isso significa que, no nativo, após o app ser
encerrado, o jogador recebe um **ID novo** e não consegue reocupar seu lugar na
sala.

#### 2b. Sessão da sala

| | |
|---|---|
| **Onde** | `sessionStorage` (**somente web**) |
| **Chave** | `regicide_room` |
| **Conteúdo** | `{ roomId, displayName, isHost }` |
| **Quando grava** | Após `createRoom` / `joinRoom` (`saveSession`) |
| **Quando lê** | Na reconexão (`tryReconnect`) ao montar a tela multiplayer |
| **Quando limpa** | Ao sair da sala, ou se a reconexão achar a sala finalizada / o jogador fora dela |

Como é `sessionStorage` (escopo de **aba**):

- **Atualizar a página (mesma aba)** → a sessão sobrevive → **reconecta**.
- **Fechar a aba / abrir em outra aba** → a sessão some → **vai para a home**
  (precisa re-entrar com o código).

#### 2c. Fluxo de reconexão (`tryReconnect`)

```
loadSession()                       → sem sessão? retorna false (vai pra home)
  ↓
fetchRoom(roomId)                   → sala inexistente ou "finished"? limpa sessão, false
  ↓
room.players[myPlayerId] existe?    → não? limpa sessão, false
  ↓
subscribeToRoom(...)                → re-inscreve; estado do jogo passa a fluir do Firebase
set({ roomId, displayName, isHost, roomStatus })  → true
```

**Resultado por cenário:**

| Cenário | Reconecta? |
|---|---|
| Web — atualizar a página (mesma aba) | ✅ Sim |
| Web — fechar a aba e reabrir | ❌ Não (sessão da aba perdida) |
| Nativo — app em background → foreground | ✅ (estado em memória; nada foi perdido) |
| Nativo — app **encerrado** e reaberto | ❌ Não (sem `sessionStorage` e ID regenerado) |

> 📌 **Resumo:** a retomada de partida multiplayer após reload é, hoje, um
> recurso **da web** (e apenas dentro da mesma aba). No nativo, uma partida
> multiplayer **não é retomada** se o app for encerrado.

---

### 3. Configurações de áudio

| | |
|---|---|
| **Onde** | `AsyncStorage` (→ `localStorage` na web) |
| **Chaves** | `audio_music_volume`, `audio_sfx_volume`, `audio_music_muted`, `audio_sfx_muted` |
| **Quando grava** | Ao ajustar volume / alternar mudo |
| **Quando lê** | Ao montar o `AudioProvider` |
| **Código** | [contexts/AudioContext.tsx](../contexts/AudioContext.tsx) |

Persistem em web e nativo, sobrevivendo a reinício e fechamento.

---

### 4. Conclusão do tutorial

| | |
|---|---|
| **Onde** | Web: `localStorage` · Nativo: `AsyncStorage` (branch explícito por `Platform.OS`) |
| **Chave** | `regicide_tutorial_done` (valor `"1"`) |
| **Função** | Evita reexibir o tutorial após concluí-lo ou pulá-lo |
| **Código** | [hooks/useTutorialFlow.ts](../hooks/useTutorialFlow.ts) |

---

### 5. Cache de imagens (auxiliar, não é dado de jogo)

| | |
|---|---|
| **Onde** | `AsyncStorage` |
| **Chaves** | prefixo `image_cache_<imageId>` |
| **Função** | Cache de URIs de imagens resolvidas (performance) |
| **Código** | [services/imageCache.ts](../services/imageCache.ts) |

---

### 6. Tracker (modo baralho físico)

**Sem persistência.** O `trackerStore` é totalmente em memória. Atualizar ou
fechar a página **reseta** o tracker.

---

## Matriz geral

| Dado | Nativo | Web | Sobrevive a *refresh* | Sobrevive a *fechar/reabrir* |
|---|---|---|---|---|
| Save single-player | AsyncStorage | localStorage | ✅ | ✅ |
| ID do jogador (MP) | ❌ regenerado | localStorage | web ✅ | web ✅ / nativo ❌ |
| Sessão da sala (MP) | ❌ inexistente | sessionStorage | web ✅ | ❌ (aba/app) |
| Estado da partida (MP) | Firebase | Firebase | via reconexão | via reconexão |
| Configurações de áudio | AsyncStorage | localStorage | ✅ | ✅ |
| Flag do tutorial | AsyncStorage | localStorage | ✅ | ✅ |
| Tracker | — | — | ❌ | ❌ |

---

## Por que essas escolhas

- **Single-player em `AsyncStorage`/`localStorage`:** a partida é local e deve
  durar indefinidamente entre sessões — armazenamento persistente é o correto.
- **ID do jogador em `localStorage`:** a identidade precisa ser **estável** entre
  reloads da mesma origem.
- **Sessão da sala em `sessionStorage`:** participar de uma sala é **efêmero** e
  ligado à aba atual; não deve "vazar" para novas abas nem persistir após fechar.
- **Estado MP no Firebase:** é a fonte de verdade compartilhada entre jogadores;
  o cliente apenas re-assina e re-hidrata.

---

## Limitações conhecidas / oportunidades

1. **Retomada MP no nativo não funciona após o app ser encerrado** — depende de
   `localStorage`/`sessionStorage` (web). Para suportar nativo seria preciso
   persistir o ID do jogador e a sessão da sala em `AsyncStorage`.
2. **Sessão MP é por aba (web)** — fechar a aba perde a sessão. Migrar de
   `sessionStorage` para `localStorage` permitiria retomar em nova aba (com o
   trade-off de a sessão "vazar" entre abas).
3. **Tracker não persiste** — uma partida física longa é perdida ao recarregar.
