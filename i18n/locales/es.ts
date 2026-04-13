import type { Translations } from "./pt-BR";

const es: Translations = {
  common: {
    attack: "Ataque",
    health: "Vida",
    newGame: "Nueva partida",
    back: "← Volver",
    home: "← Inicio",
  },
  suits: {
    hearts: "Corazones",
    diamonds: "Diamantes",
    clubs: "Tréboles",
    spades: "Picas",
  },
  suitLabels: {
    hearts: "♥ Corazones",
    diamonds: "♦ Diamantes",
    clubs: "♣ Tréboles",
    spades: "♠ Picas",
  },
  suitPowers: {
    hearts: "Baraja el descarte y añade N cartas al fondo de la taberna.",
    diamonds: "Roba N cartas de la taberna a tu mano.",
    clubs: "Dobla el daño causado (×2).",
    spades: "Acumula N de escudo que reduce el ataque del enemigo.",
  },
  ranks: {
    J: "Sota",
    Q: "Reina",
    K: "Rey",
  },
  action: {
    play: "Jugar",
    yield: "Ceder",
    discard: "Descartar ({{current}}/{{needed}})",
    newGame: "Nueva partida",
  },
  hand: {
    title: "Mano ({{count}})",
    empty: "Mano vacía",
    sufferDiscard: "Selecciona cartas para descartar",
    sort: "⇅ Ordenar",
    sortByClass: "⇅ Por Palo",
  },
  footer: {
    jacks: "Sotas",
    queens: "Reinas",
    kings: "Reyes",
  },
  game: {
    status: {
      castle: "Castillo",
      tavern: "Taberna",
      discard: "Descarte",
    },
    sufferDamage: "⚠️ Sufre {{damage}} de daño — descarta cartas suficientes",
    errors: {
      discardNotEnough:
        "Selecciona cartas con valor total ≥ {{needed}} (actual: {{current}})",
    },
  },
  enemy: {
    attack: "Ataque",
    health: "Vida",
    suitPowers: "Poderes de palos",
    immune: "— Inmune",
    immuneDesc: "Este enemigo ignora el poder de este palo.",
  },
  classes: {
    hearts: {
      name: "Clérigo",
      lore: "Los Clérigos usan su profundo conocimiento de curación y alquimia para crear pociones y ungüentos. Con la llegada de la corrupción, sus servicios ahora son necesarios en las líneas de batalla.",
    },
    diamonds: {
      name: "Bardo",
      lore: "Los Bardos no son solo expertos musicales, sino también líderes hábiles. Sus habilidades únicas inspiran a los que les rodean, garantizando que el frente de batalla siempre esté completo y preparado.",
    },
    clubs: {
      name: "Guerrero",
      lore: "Desde las guerras antiguas, los Guerreros han perfeccionado sus habilidades incluso en tiempos de paz. Ahora que la lucha ha vuelto a comenzar, se lanzan ansiosamente a la batalla.",
    },
    spades: {
      name: "Paladín",
      lore: "Los Paladines actúan como guardias reales. Son hábiles para disuadir conflictos y defenderse cuando el enfrentamiento es inevitable. Sus habilidades defensivas serán cruciales en esta guerra.",
    },
    jester: {
      name: "Comodín",
      lore: "El Comodín no pertenece a ninguna clase. Su presencia caótica e impredecible confunde al enemigo, anulando temporalmente cualquier inmunidad que posea.",
    },
  },
  cardDetail: {
    value: "Valor: {{value}}",
    suitPower: "Poder del palo",
    jesterTitle: "Comodín",
    jesterPower:
      "Cancela la inmunidad del enemigo actual durante un turno. Los poderes de palo siguen aplicándose normalmente.",
  },
  defeat: {
    message: "El reino ha caído",
    newGame: "Nueva partida",
  },
  victory: {
    title: "¡Victoria!",
    subtitle: "El reino está a salvo",
    playAgain: "Jugar de nuevo",
    home: "← Inicio",
  },
  tracker: {
    title: "Marcador",
    reset: "Reiniciar",
    dead: "¡HP a cero!",
    immune: "Inmunidad — ",
    damage: "Daño: -{{value}}",
    confirmDefeat: "💀 Confirmar derrota",
    defeatEnemy: "Derrotar enemigo",
  },
  home: {
    play: {
      title: "JUGAR",
      desc: "Versión digital completa — mazo, mano y poderes de palos",
    },
    tracker: {
      title: "MARCADOR",
      desc: "Marcador para el mazo físico — rastrea HP y ataque de enemigos",
    },
    instructions: {
      title: "CÓMO JUGAR",
      desc: "Reglas, poderes de palos y tabla de nobles del castillo",
    },
  },
  instructions: {
    header: "Cómo Jugar",
    gameName: "REGICIDE",
    gameSubtitle: "Un juego cooperativo para 1–4 jugadores",
    sections: {
      objective: {
        title: "Objetivo",
        body: "Los jugadores deben trabajar juntos para derrotar a los 12 nobles del castillo — 4 Sotas, 4 Reinas y 4 Reyes — antes de que el mazo se agote o la mano de los jugadores quede vacía sin poder actuar.",
      },
      setup: {
        title: "Preparación",
        body: "Separa los 12 nobles (J, Q, K de cada palo) formando el Castillo: baraja las Sotas y colócalas arriba, luego las Reinas, luego los Reyes. Las otras 40 cartas forman la Taberna (mazo de jugadores). Roba 8 cartas para la mano inicial (7 para 2 jugadores, 6 para 3, 5 para 4).",
      },
      turn: {
        title: "Estructura de un Turno",
        steps: [
          {
            title: "Jugar cartas",
            desc: 'Juega 1 o más cartas del mismo valor o un combo ("animal compañero"). El valor total es el daño causado al enemigo.',
          },
          {
            title: "Activar poderes",
            desc: "Cada palo de las cartas jugadas activa un poder especial (ver tabla abajo).",
          },
          {
            title: "Sufrir daño",
            desc: "Si el enemigo no fue derrotado, los jugadores deben descartar cartas de su mano equivalentes al ataque del enemigo (reducido por el escudo de Picas).",
          },
          {
            title: "Robar cartas",
            desc: "Al final del turno, rellena tu mano hasta el límite máximo.",
          },
        ],
      },
      suitPowersSection: {
        title: "Poderes de Palos",
        hearts: {
          name: "Corazones — Curación",
          power:
            "Retira cartas del descarte y vuélvelas a la Taberna (baraja). Cantidad igual al valor de las cartas jugadas.",
        },
        diamonds: {
          name: "Diamantes — Robo",
          power:
            "Roba cartas inmediatamente. Cantidad igual al valor de las cartas jugadas.",
        },
        clubs: {
          name: "Tréboles — Doble fuerza",
          power:
            "El daño causado al enemigo se dobla para los otros poderes de Tréboles. Las cartas de Tréboles cuentan doble en el cálculo del daño total.",
        },
        spades: {
          name: "Picas — Escudo",
          power:
            "Reduce el ataque del enemigo actual por el valor de las cartas de Picas jugadas. El escudo se acumula a lo largo de los turnos.",
        },
      },
      immunities: {
        title: "Inmunidades de los Nobles",
        body: "Cada noble es inmune al palo correspondiente a su propio palo — las cartas del mismo palo no causan daño ni activan poderes contra él. El Comodín (Jester) cancela la inmunidad del enemigo actual por un turno.",
        examples: {
          hearts: "Noble de Corazones ignora cartas de ♥",
          diamonds: "Noble de Diamantes ignora cartas de ♦",
          clubs: "Noble de Tréboles ignora cartas de ♣",
          spades: "Noble de Picas ignora cartas de ♠",
        },
      },
      enemies: {
        title: "Nobles del Castillo",
        ownSuit: "palo propio",
        immuneTo: "Inmune a: {{suit}}",
        jack: "Sota",
        queen: "Reina",
        king: "Rey",
      },
      companions: {
        title: "Animales Compañeros (Combos)",
        body: 'Puedes jugar múltiples cartas a la vez si forman un "animal compañero" — combinaciones cuyo valor sumado no supere 10, o cartas del mismo valor. El daño total es la suma de todas las cartas jugadas, y todos los poderes de palo se activan.',
        examples: {
          fourSix: "= 10 de daño (ambos palos)",
          threeThrees: "= 9 de daño (mismo valor)",
          twoAces: "= 2 de daño (mismo valor)",
        },
      },
      defeating: {
        title: "Derrotando a un Noble",
        body: "Cuando el HP del noble llega a cero (o baja de cero), es derrotado. Coloca las cartas jugadas contra él debajo de la Taberna (no en el descarte). Luego voltea el siguiente noble del Castillo y comienza un nuevo combate.",
      },
      endConditions: {
        title: "Victoria y Derrota",
        victoryTitle: "Victoria 👑",
        victoryText: "Derrota a los 12 nobles del Castillo.",
        defeatTitle: "Derrota 💀",
        defeatText:
          "Un jugador no puede descartar cartas suficientes para cubrir el daño sufrido, o necesita jugar una carta y no tiene ninguna en la mano.",
      },
    },
  },
};

export default es;
