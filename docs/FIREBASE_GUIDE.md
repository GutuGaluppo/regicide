# Guia de Integração Firebase — Regicide Multiplayer

## Pré-requisitos

- Conta Google (qualquer Gmail serve)
- Node.js instalado
- Projeto já clonado e com `npm install` executado

---

## 1. Criar o projeto Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"**

   ![Tela inicial do console Firebase com o botão "Adicionar projeto" em destaque]

3. Dê um nome ao projeto — ex.: `regicide-tracker` — e clique em **Continuar**
4. Desative o Google Analytics (desnecessário aqui) e clique em **Criar projeto**
5. Aguarde a criação e clique em **Continuar**

---

## 2. Registrar o app Web e obter as credenciais

O SDK JavaScript do Firebase (usado pelo Expo) exige um app do tipo **Web**.

### 2.1 Registrar o app

1. Na tela inicial do projeto, localize a seção **"Comece adicionando o Firebase ao seu app"**
2. Clique no ícone **`</>`** (Web)

   > É o terceiro ícone da linha, após iOS e Android.

3. No campo **"Apelido do app"**, digite `regicide-web` (só para identificação interna)
4. **Não** marque a opção "Configurar o Firebase Hosting"
5. Clique em **"Registrar app"**

### 2.2 Copiar o `firebaseConfig`

Após o registro, o console exibe um bloco de código como este:

```js
const firebaseConfig = {
  apiKey: "AIzaSyD_EXEMPLO_AQUI",
  authDomain: "regicide-tracker.firebaseapp.com",
  projectId: "regicide-tracker",
  storageBucket: "regicide-tracker.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Mantenha essa tela aberta** (ou copie os valores em um bloco de notas) — você vai precisar deles no passo 4.

> `databaseURL` **não aparece aqui** ainda. Ela só estará disponível após ativar o Realtime Database no passo 3.

6. Clique em **"Continuar para o console"**

---

## 3. Ativar o Realtime Database

1. No menu lateral esquerdo, clique em **Build → Realtime Database**

   > Se não encontrar, clique em **"Todos os produtos"** no final do menu para ver a lista completa.

2. Clique em **"Criar banco de dados"**
3. Escolha a localização:
   - Recomendado para Brasil: **United States (us-central1)**
   - O Realtime Database não tem datacenter na América do Sul
4. Clique em **Avançar**
5. Na tela de regras, escolha **"Iniciar no modo de teste"** e clique em **Ativar**

   > O modo de teste permite leitura e escrita livres por 30 dias — suficiente para desenvolvimento.

### 3.1 Copiar a URL do banco

Após a ativação, você verá a tela do banco com uma URL no topo:

```
https://regicide-tracker-default-rtdb.firebaseio.com/
```

**Copie essa URL** — ela é o valor de `EXPO_PUBLIC_FIREBASE_DATABASE_URL`.

> A URL sempre termina com `.firebaseio.com` e **não** inclui a barra `/` no final quando usada nas credenciais.

---

## 4. Preencher o arquivo `.env`

### 4.1 Criar o arquivo

Na raiz do projeto, crie o arquivo `.env` a partir do modelo:

```bash
cp .env.example .env
```

> O arquivo `.env` já está no `.gitignore` — suas credenciais não serão commitadas.

### 4.2 Mapeamento: `firebaseConfig` → `.env`

Abra o `.env` e preencha cada variável com o valor correspondente do `firebaseConfig`:

| Variável no `.env` | Campo no `firebaseConfig` | Exemplo de valor |
|---|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` | `AIzaSyD_abc123...` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` | `regicide-tracker.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_DATABASE_URL` | *(URL do Realtime Database — passo 3.1)* | `https://regicide-tracker-default-rtdb.firebaseio.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` | `regicide-tracker` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` | `regicide-tracker.firebasestorage.app` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` | `123456789012` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` | `1:123456789012:web:abcdef...` |

### 4.3 Exemplo preenchido

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD_abc123xyz456
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=regicide-tracker.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://regicide-tracker-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=regicide-tracker
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=regicide-tracker.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 4.4 Onde encontrar as credenciais depois

Se precisar recuperar os valores no futuro:

1. Acesse o [console Firebase](https://console.firebase.google.com) → seu projeto
2. Clique no ícone de engrenagem ⚙️ ao lado de **"Visão geral do projeto"** → **Configurações do projeto**
3. Role até a seção **"Seus apps"** → selecione o app `regicide-web`
4. O bloco `firebaseConfig` estará visível na aba **"SDK setup and configuration"**
5. A URL do Realtime Database está em **Build → Realtime Database** (topo da página)

---

## 5. Iniciar o projeto

Após preencher o `.env`, **reinicie o servidor** para que o Expo carregue as variáveis:

```bash
npx expo start
```

> O Metro Bundler não detecta mudanças em arquivos `.env` automaticamente — sempre reinicie após editar.

Toque em **MULTIPLAYER** na tela inicial. Se a tela de lobby abrir sem erros no terminal, a conexão está funcionando.

**Confirmação no Firebase Console:** acesse **Realtime Database → Dados**. Ao criar uma sala no app, um nó `games/{CÓDIGO}` aparecerá em tempo real.

---

## 6. Regras de segurança (produção)

O modo de teste expira após 30 dias. Para renovar ou ajustar, acesse **Realtime Database → Regras** e substitua por:

```json
{
  "rules": {
    "games": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

> Para portfólio, `.write: true` é aceitável. Para produção real com usuários reais, integre o **Firebase Authentication** (auth anônima) e restrinja a escrita por `auth.uid`.

---

## 7. Limpeza de salas antigas (opcional)

Salas antigas acumulam no banco indefinidamente. Para limpeza manual, acesse **Realtime Database → Dados**, selecione o nó `games` e exclua as entradas antigas pelo console.

---

## Estrutura dos dados no Firebase

Após uma partida iniciada, a árvore de dados fica assim:

```
games/
  ABC123/                          ← código da sala (6 caracteres)
    hostId: "a1b2c3d4..."
    status: "playing"
    createdAt: 1717600000000
    players/
      a1b2c3d4.../
        id: "a1b2c3d4..."
        displayName: "Gutu"
        hand: "[{\"id\":\"5-hearts\",...}]"    ← mão privada (JSON)
      e5f6g7h8.../
        id: "e5f6g7h8..."
        displayName: "Player2"
        hand: "[{\"id\":\"8-clubs\",...}]"
    shared/                        ← estado compartilhado da partida
      castle: "[...]"
      currentPlayerIndex: 0
      playerOrder: "[\"a1b2c3...\",\"e5f6g7...\"]"
      playerCount: 2
      phase: "player_turn"
      currentDamage: 0
      ...
```

---

## Solução de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| `FirebaseError: PERMISSION_DENIED` | Regras do banco bloqueando | Verifique se está no modo de teste ou ajuste as regras |
| `FirebaseError: Cannot parse Firebase url` | `EXPO_PUBLIC_FIREBASE_DATABASE_URL` incorreta ou vazia | Copie a URL exata da tela do Realtime Database (sem `/` no final) |
| Tela de lobby trava ao criar sala | Variáveis não carregadas pelo Metro | Pare e reinicie `npx expo start` após editar o `.env` |
| `undefined` em qualquer variável Firebase | Prefixo `EXPO_PUBLIC_` ausente | Confirme que todas as variáveis no `.env` têm o prefixo correto |
| Sala criada mas outros jogadores não veem | `DATABASE_URL` diferente entre máquinas | Compartilhe o mesmo `.env` com todos os devs da equipe |
| Dados aparecem no console mas o app não reage | Listener WebSocket caiu | Feche e reabra o app — a reconexão é automática |
