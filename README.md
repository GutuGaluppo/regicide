# Regicide Tracker

Aplicativo companion para o jogo de cartas **Regicide**, construído com React Native e Expo. Roda em iOS, Android e web, e oferece quatro modos: um **jogo digital** completo, um **multiplayer online** em tempo real, um **marcador** para partidas com o baralho físico, e as **regras** consultáveis no app.

## Sobre o Regicide

Regicide é um jogo cooperativo (1–4 jogadores) em que se enfrentam os 12 nobres do castelo (Valetes, Rainhas e Reis) usando as cartas da taverna como armas. Cada naipe concede um poder:

| Naipe | Efeito |
|-------|--------|
| Espadas | Reduz o ataque do inimigo atual |
| Copas | Recupera cartas do descarte para a taverna |
| Ouros | Compra cartas extras para a mão |
| Paus | Dobra o dano causado |

Cada inimigo é imune ao seu próprio naipe — exceto quando um Jester é jogado.

## Funcionalidades

### Jogo digital
- Partida completa com todas as regras: combos, Animal Companions (Ás), Jester e imunidade
- Resolução automática dos poderes de naipe e da fase de sofrer dano
- Tutorial guiado com spotlight, incluindo prática das ações
- Detalhes de cada carta em drawer (clique longo na mão)
- Animações de compra, descarte e derrota (Reanimated), trilha sonora e háptico
- Histórico da partida e persistência automática do estado (AsyncStorage)

### Multiplayer online
- Salas com convite por link, lobby e chat em tempo real (Firebase Realtime Database)
- Turnos sincronizados entre os jogadores, com revelação das jogadas e avatares

### Marcador (baralho físico)
- Acompanha HP e ataque do inimigo atual, com registro de dano por naipe e validação de imunidade
- Grade de seleção do próximo nobre; os derrotados aparecem com sua arte de sombra
- Desfazer (undo) da última ação

### Regras no app
- Rulebook completo e ilustrado, com tabelas de preparação e dos nobres

Interface disponível em **português, inglês, espanhol e francês**.

## Estrutura do projeto

Componentes e telas seguem o padrão pasta-por-componente: `Componente.tsx` (composição), `Componente.styles.ts` (StyleSheet) e `index.ts` (barrel), com subcomponentes em `components/`.

```
├── app/                  # Rotas (Expo Router): index, game, multiplayer-game, lobby, tracker, instructions
├── assets/               # Fundos, cartas, ícones, trilhas sonoras
├── components/           # Componentes compartilhados (EnemyCard, PlayerHand, TutorialOverlay, ...)
├── contexts/             # AudioContext e injeção da store de jogo (GameStoreContext)
├── data/                 # Baralho, castelo, inimigos, avatares e mapa de imagens
├── docs/                 # Notas de engenharia e planos de implementação
├── hooks/                # Layout responsivo, escala do inimigo, tutorial, trilha sonora
├── i18n/                 # Traduções (pt-BR, en, es, fr)
├── screens/              # Uma pasta por tela
├── services/             # Firebase (jogo, chat, log), storage, cache de imagens, notificações
├── store/                # Estado com Zustand: game, tracker, multiplayer, chat, tutorial
├── utils/                # gameLogic (validação) e gameEngine (resolução), embaralhamento, log
└── __tests__/            # Testes Jest da lógica pura
```

A regra de negócio vive em `utils/` e `store/` — os componentes não decidem regras.

## Tecnologias

- **React Native** + **Expo** (~54) + **Expo Router** (navegação file-based)
- **Zustand** — estado (uma store por domínio)
- **Firebase Realtime Database** — multiplayer e chat
- **i18next** / **react-i18next** — 4 idiomas
- **react-native-reanimated** — animações
- **expo-av** (trilha sonora), **expo-image**, **expo-haptics**
- **AsyncStorage** — persistência local
- **TypeScript** + **Jest** (`jest-expo`)

## Como rodar

```bash
npm install
npx expo start          # ou: npm run ios | npm run android | npm run web
```

O multiplayer exige credenciais do Firebase: copie `.env.example` para `.env.local` e preencha com as do seu projeto. Cada variável — o que faz, onde é usada e o que quebra sem ela — está em [Variáveis de ambiente](docs/ENVIRONMENT.md); o passo a passo no console, no [Guia do Firebase](docs/FIREBASE_GUIDE.md). Os demais modos funcionam sem configuração.

```bash
npm test                # suíte de testes
npm run lint            # ESLint
npx tsc --noEmit        # checagem de tipos
```

## Documentação técnica

- [Variáveis de ambiente](docs/ENVIRONMENT.md) — o que cada `EXPO_PUBLIC_*` faz e onde é consumida
- [Guia do Firebase](docs/FIREBASE_GUIDE.md) — passo a passo no console, com prints
- [Estratégias de multiplayer](docs/MULTIPLAYER_STRATEGIES.md)
- [Chat em tempo real](docs/real-time-chat-implementation-plan.md) — plano de implementação
- [Plano do tutorial](docs/PLANO_TUTORIAL.md)
- [Persistência](docs/STORAGE.md)
