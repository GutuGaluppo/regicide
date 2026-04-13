# Regicide Tracker

Aplicativo mobile companion para o jogo de cartas **Regicide**, construído com React Native e Expo. Oferece dois modos: um **jogo digital** completo com todas as regras implementadas, e um **tracker físico** para acompanhar partidas com o baralho real.

## Sobre o Regicide

Regicide é um jogo cooperativo de cartas em que os jogadores enfrentam os inimigos do castelo (Valetes, Rainhas e Reis) usando as cartas da taverna como armas. Cada naipe concede um poder especial:

| Naipe | Efeito |
|-------|--------|
| Espadas | Reduz o ataque do inimigo atual |
| Copas | Recupera cartas do descarte para a taverna |
| Ouros | Compra cartas extras para a mão |
| Paus | Dobra o dano causado |

Cada inimigo é imune ao naipe correspondente ao seu próprio naipe — exceto quando um Jester é jogado.

## Funcionalidades

### Modo Digital
- Partida completa para 2 jogadores com todas as regras do Regicide
- Mão do jogador interativa com seleção de cartas
- Validação de jogadas (combos, Animal Companions, Jester)
- Resolução automática dos efeitos de naipe
- Fase de sofrer dano com descarte forçado
- Indicadores visuais de imunidade nas cartas da mão
- Barras de HP e Ataque em tempo real sobre a imagem do inimigo
- Footer com progresso das fases (Valetes → Rainhas → Reis)
- Persistência automática do estado via AsyncStorage
- Botões de Jogar, Ceder turno e Reiniciar

### Tracker Físico
- Acompanhamento de HP e ataque do inimigo atual
- Registro de dano por naipe com validação de imunidade
- Seleção do inimigo ativo pelo footer
- Histórico de inimigos derrotados

## Estrutura do projeto

```
├── app/                  # Rotas Expo Router
├── assets/
│   ├── backgrounds/      # Imagens de fundo
│   ├── cards/            # Ilustrações dos inimigos
│   ├── game/             # Cartas da taverna
│   └── icons/            # Ícones SVG/WebP
├── components/
│   ├── ActionBar.tsx     # Botões de ação (jogar, ceder, descartar)
│   ├── AttackInput.tsx   # Input de dano por naipe (tracker)
│   ├── CardView.tsx      # Carta individual da mão do jogador
│   ├── CastleFooter.tsx  # Footer de progresso do castelo
│   ├── DefeatFooter.tsx  # Footer de inimigos (tracker)
│   ├── EnemyCard.tsx     # Card do inimigo com HP/ATK overlay
│   └── PlayerHand.tsx    # Mão do jogador
├── data/
│   ├── deck.ts           # Criação do baralho da taverna
│   ├── enemies.ts        # Deck do castelo (stats dos inimigos)
│   ├── images.ts         # Mapeamento rank/naipe → imagem
│   └── types.ts          # Tipos TypeScript globais
├── hooks/
│   ├── useGame.ts        # Lógica completa do modo digital
│   └── useTracker.ts     # Estado do tracker físico
├── screens/
│   ├── GameScreen.tsx    # Tela do modo digital
│   ├── HomeScreen.tsx    # Tela inicial
│   └── TrackerScreen.tsx # Tela do tracker físico
├── services/
│   └── storage.ts        # Persistência com AsyncStorage
└── utils/
    ├── gameLogic.ts      # Validação e resolução de jogadas
    └── shuffle.ts        # Fisher-Yates shuffle
```

## Tecnologias

- **React Native** + **Expo** (~54)
- **Expo Router** — navegação file-based
- **react-native-svg** + **react-native-svg-transformer** — ícones SVG dinâmicos
- **AsyncStorage** — persistência local do estado de jogo
- **TypeScript**

## Como rodar

```bash
npm install
npx expo start
```

Abra no simulador iOS/Android ou no navegador via Expo Go.
