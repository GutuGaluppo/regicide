# Variáveis de ambiente

Referência das variáveis usadas pelo app: o que cada uma faz, **onde é consumida no código**, e o que quebra sem ela. O passo a passo de criar o projeto no console (com prints) está no [Guia do Firebase](FIREBASE_GUIDE.md) — aqui é a especificação técnica.

## Arquivos

| Arquivo | Versionado | Uso |
|---------|-----------|-----|
| `.env.example` | sim | Contrato: lista as chaves esperadas, com valores de exemplo |
| `.env.local` | **não** (`.gitignore`) | Suas credenciais reais, em desenvolvimento |

O `.gitignore` bloqueia `.env` e `.env.*`, abrindo exceção só para `.env.example`. Para começar:

```bash
cp .env.example .env.local   # e preencha os valores
```

O Expo carrega `.env.local` automaticamente; reinicie o bundler após alterá-lo.

## `EXPO_PUBLIC_` não é segredo

Tudo com o prefixo `EXPO_PUBLIC_` é **embutido no bundle** em tempo de build — vai para o cliente e é legível por qualquer usuário do app ou do site. Isso é esperado para as chaves do Firebase (o `apiKey` do Firebase é um identificador público, não uma credencial de acesso), mas significa que **nenhum segredo de verdade pode entrar nessas variáveis**.

Quem protege os dados são as regras do Realtime Database (`database.rules.json`), não a chave. Veja "Regras do banco" abaixo.

## Variáveis do Firebase (multiplayer)

Consumidas em [`services/firebase.ts`](../services/firebase.ts), que monta o `firebaseConfig` e inicializa o Realtime Database. Todas vêm do mesmo lugar: console do Firebase → **Configurações do projeto** → seus apps → app **Web** → `firebaseConfig`.

| Variável | Campo no `firebaseConfig` | Observação |
|----------|---------------------------|------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` | Identificador público do projeto |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` | |
| `EXPO_PUBLIC_FIREBASE_DATABASE_URL` | `databaseURL` | **A que realmente importa** — é o banco que o app lê e escreve |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` | |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` | Não usado hoje (sem Storage); mantido por completude do config |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` | Idem |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` | |

**Sem elas:** o jogo digital, o marcador e as regras funcionam normalmente — só o **multiplayer** falha, ao tentar conectar no banco. A inicialização não valida as chaves; o erro só aparece na primeira leitura/escrita (entrar no lobby).

Se o app Web ainda não existir no projeto Firebase, registre um (ícone `</>`); o SDK JavaScript usado pelo Expo exige um app do tipo Web mesmo quando roda em iOS/Android.

## `EXPO_PUBLIC_WEB_URL` (links de convite)

Consumida em [`utils/shareRoom.ts`](../utils/shareRoom.ts). É a origem do **site publicado**, usada para montar o link de convite da sala. Sem barra no final:

```
EXPO_PUBLIC_WEB_URL=https://seu-app.vercel.app
```

O comportamento do link depende da plataforma:

- **Web:** ignora a variável e usa `window.location.origin` — sempre correto, sem configuração.
- **Nativo:** usa `EXPO_PUBLIC_WEB_URL` para gerar um link `https://`, que é clicável em qualquer app de mensagem.
- **Nativo sem a variável:** cai para um deep link `regicidetracker://`, que **não** é clicável fora do dispositivo que já tem o app instalado.

Ou seja: ela não quebra nada, mas sem ela o convite compartilhado de um celular perde utilidade. Em produção (Vercel), defina-a também nas variáveis de ambiente do projeto, já que o bundle web é gerado no build (`npx expo export --platform web`, ver `vercel.json`).

## Regras do banco

As permissões vivem em [`database.rules.json`](../database.rules.json) e são publicadas com o Firebase CLI (o `firebase.json` já aponta para o arquivo):

```bash
npx firebase deploy --only database
```

O modelo atual: leitura e escrita **abertas** em `games/$roomId`, `roomChats/$roomId` e `roomLogs/$roomId` — não há autenticação, e quem souber o id da sala entra nela. O que as regras fazem é **validar o formato** de cada mensagem e entrada de log (campos obrigatórios, tipos, limites de tamanho, `$other: false` para rejeitar campos desconhecidos), o que barra lixo e payloads inflados, não acesso indevido.

Isso é adequado para salas efêmeras entre amigos e para um portfólio. Se o app for exposto de verdade, o próximo passo é autenticação anônima e regras que amarrem escrita ao jogador dono do id.

## Checklist

```bash
cp .env.example .env.local          # 1. preencher com o firebaseConfig do seu projeto
npx firebase deploy --only database # 2. publicar as regras (uma vez)
npx expo start                      # 3. rodar
```

Para conferir se as variáveis chegaram ao bundle, abra o app na web e inspecione uma falha de conexão no console — `databaseURL` indefinida é o sintoma mais comum de `.env.local` ausente ou bundler não reiniciado.
