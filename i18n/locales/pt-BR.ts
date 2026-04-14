const ptBR = {
  common: {
    attack: "Ataque",
    health: "Vida",
    newGame: "Novo jogo",
    back: "← Voltar",
    home: "← Início",
  },
  suits: {
    hearts: "Copas",
    diamonds: "Ouros",
    clubs: "Paus",
    spades: "Espadas",
  },
  suitLabels: {
    hearts: "♥ Copas",
    diamonds: "♦ Ouros",
    clubs: "♣ Paus",
    spades: "♠ Espadas",
  },
  suitPowers: {
    hearts: "Embaralha o descarte e adiciona N cartas no fundo da taverna.",
    diamonds: "Compra N cartas da taverna para a mão.",
    clubs: "Dobra o dano causado (×2).",
    spades: "Acumula N de escudo que reduz o ataque do inimigo.",
  },
  ranks: {
    J: "Valete",
    Q: "Rainha",
    K: "Rei",
  },
  action: {
    play: "Jogar",
    yield: "Ceder",
    discard: "Descartar ({{current}}/{{needed}})",
    discard_label: "Descartar",
    newGame: "Novo jogo",
  },
  hand: {
    title: "Mão ({{count}})",
    empty: "Mão vazia",
    sufferDiscard: "Selecione cartas para descartar",
    sort: "⇅ Ordenar",
    sortByClass: "⇅ Por Classe",
  },
  footer: {
    jacks: "Valetes",
    queens: "Rainhas",
    kings: "Reis",
  },
  game: {
    status: {
      castle: "Castelo",
      tavern: "Taverna",
      discard: "Descarte",
    },
    sufferDamage: "⚠️ Sofra {{damage}} de dano — descarte cartas suficientes",
    errors: {
      discardNotEnough:
        "Selecione cartas com valor total ≥ {{needed}} (atual: {{current}})",
    },
  },
  enemy: {
    attack: "Ataque",
    health: "Vida",
    suitPowers: "Poderes dos naipes",
    immune: "— Imune",
    immuneDesc: "Este inimigo ignora o poder deste naipe.",
  },
  classes: {
    hearts: {
      name: "Clérigo",
      lore: "Clérigos usam seu profundo conhecimento de cura e alquimia para criar poções e unguentos. Com a chegada da corrupção, seus serviços agora são necessários na linha de frente da batalha.",
    },
    diamonds: {
      name: "Bardo",
      lore: "Bardos são não apenas especialistas musicais, mas também líderes habilidosos. Suas habilidades únicas inspiram aqueles ao redor, garantindo que a linha de frente esteja sempre completa e preparada para o combate.",
    },
    clubs: {
      name: "Guerreiro",
      lore: "Desde as antigas guerras, Guerreiros aperfeiçoaram suas habilidades mesmo em tempos de paz. Agora que a luta recomeçou, eles avançam para a batalha ansiosos por desferir o primeiro e o último golpe.",
    },
    spades: {
      name: "Paladino",
      lore: "Paladinos atuam como guardas reais. São hábeis em dissuadir conflitos e em defender quando o confronto é inevitável. Suas habilidades defensivas serão cruciais nesta guerra.",
    },
    jester: {
      name: "Curinga",
      lore: "O Curinga não pertence a nenhuma classe. Sua presença caótica e imprevisível confunde o inimigo, anulando temporariamente qualquer imunidade que ele possua.",
    },
  },
  cardDetail: {
    value: "Valor: {{value}}",
    suitPower: "Poder do naipe",
    jesterTitle: "Curinga",
    jesterPower:
      "Cancela a imunidade do inimigo atual por um turno. Os poderes dos naipes continuam se aplicando normalmente.",
  },
  defeat: {
    message: "O reino caiu",
    newGame: "Novo jogo",
    stats: {
      time: "Tempo",
      turns: "Turnos",
      enemies: "Inimigos derrotados",
      discarded: "Cartas descartadas",
    },
  },
  settings: {
    title: "Configurações",
    restart: "Reiniciar partida",
    exit: "Sair para o início",
  },
  victory: {
    title: "Vitória!",
    subtitle: "O reino foi salvo",
    playAgain: "Jogar novamente",
    home: "← Início",
  },
  tracker: {
    title: "Tracker",
    reset: "Reiniciar",
    dead: "HP zerado!",
    immune: "Imunidade — ",
    damage: "Dano: -{{value}}",
    confirmDefeat: "💀 Confirmar derrota",
    defeatEnemy: "Derrotar inimigo",
  },
  home: {
    play: {
      title: "PLAY",
      desc: "Versão digital completa — deck, mão e poderes dos naipes",
    },
    tracker: {
      title: "TRACKER",
      desc: "Placar para o baralho físico — rastreie HP e ataque dos inimigos",
    },
    instructions: {
      title: "COMO JOGAR",
      desc: "Regras, poderes dos naipes e tabela dos nobres do castelo",
    },
  },
  instructions: {
    header: "Como Jogar",
    gameName: "REGICIDE",
    gameSubtitle: "Um jogo cooperativo para 1–4 jogadores",
    sections: {
      objective: {
        title: "Objetivo",
        body: "Os jogadores devem trabalhar juntos para derrotar todos os 12 nobres do castelo — 4 Valetes, 4 Rainhas e 4 Reis — antes que o baralho acabe ou a mão dos jogadores esvazie sem poder agir.",
      },
      setup: {
        title: "Preparação",
        body: "Separe os 12 nobres (J, Q, K de cada naipe) formando o Castelo: embaralhe os Valetes e coloque-os no topo, depois as Rainhas, depois os Reis. As demais 40 cartas formam a Taverna (baralho dos jogadores). Compre 8 cartas para a mão inicial (7 se forem 2 jogadores, 6 se forem 3, 5 se forem 4).",
      },
      turn: {
        title: "Estrutura de um Turno",
        steps: [
          {
            title: "Jogar cartas",
            desc: 'Jogue 1 ou mais cartas com o mesmo valor ou um combo ("animal companheiro"). O valor total é o dano causado ao inimigo.',
          },
          {
            title: "Ativar poderes",
            desc: "Cada naipe das cartas jogadas ativa um poder especial (ver tabela abaixo).",
          },
          {
            title: "Sofrer dano",
            desc: "Se o inimigo não foi derrotado, os jogadores devem descartar cartas da mão equivalentes ao ataque do inimigo (reduzido pelo escudo de Espadas).",
          },
          {
            title: "Comprar cartas",
            desc: "Ao final do turno, complete sua mão até o limite máximo.",
          },
        ],
      },
      suitPowersSection: {
        title: "Poderes dos Naipes",
        hearts: {
          name: "Copas — Cura",
          power:
            "Retire cartas do descarte e recoloque-as na Taverna (embaralhe). Quantidade igual ao valor das cartas jogadas.",
        },
        diamonds: {
          name: "Ouros — Compra",
          power:
            "Compre cartas imediatamente. Quantidade igual ao valor das cartas jogadas.",
        },
        clubs: {
          name: "Paus — Força dupla",
          power:
            "O dano causado ao inimigo é dobrado para os outros poderes de Paus. Cartas de Paus contam em dobro no cálculo do dano total.",
        },
        spades: {
          name: "Espadas — Escudo",
          power:
            "Reduza o ataque do inimigo atual pelo valor das cartas de Espadas jogadas. O escudo acumula ao longo dos turnos.",
        },
      },
      immunities: {
        title: "Imunidades dos Nobres",
        body: "Cada nobre é imune ao naipe correspondente ao seu próprio naipe — cartas do mesmo naipe não causam dano nem ativam poderes contra ele. O Curinga (Jester) cancela a imunidade do inimigo atual por um turno.",
        examples: {
          hearts: "Nobre de Copas ignora cartas de ♥",
          diamonds: "Nobre de Ouros ignora cartas de ♦",
          clubs: "Nobre de Paus ignora cartas de ♣",
          spades: "Nobre de Espadas ignora cartas de ♠",
        },
      },
      enemies: {
        title: "Nobres do Castelo",
        ownSuit: "naipe próprio",
        immuneTo: "Imune a: {{suit}}",
        jack: "Valete",
        queen: "Rainha",
        king: "Rei",
      },
      companions: {
        title: "Animais Companheiros (Combos)",
        body: 'Você pode jogar múltiplas cartas de uma vez se elas formarem um "animal companheiro" — combinações cujo valor somado não ultrapasse 10, ou cartas de mesmo valor. O dano total é a soma de todas as cartas jogadas, e todos os poderes de naipe são ativados.',
        examples: {
          fourSix: "= 10 de dano (ambos os naipes)",
          threeThrees: "= 9 de dano (mesmo valor)",
          twoAces: "= 2 de dano (mesmo valor)",
        },
      },
      defeating: {
        title: "Derrotando um Nobre",
        body: "Quando o HP do nobre chega a zero (ou abaixo), ele é derrotado. Coloque as cartas jogadas contra ele embaixo da Taverna (não no descarte). Em seguida, vire o próximo nobre do Castelo e comece um novo combate.",
      },
      endConditions: {
        title: "Vitória e Derrota",
        victoryTitle: "Vitória 👑",
        victoryText: "Derrote todos os 12 nobres do Castelo.",
        defeatTitle: "Derrota 💀",
        defeatText:
          "Um jogador não consegue descartar cartas suficientes para cobrir o dano sofrido, ou precisa jogar uma carta e não tem nenhuma na mão.",
      },
    },
  },
} as const;

export default ptBR;
export type Translations = typeof ptBR;
