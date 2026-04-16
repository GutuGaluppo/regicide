import type { Translations } from "./pt-BR";

const en: Translations = {
  common: {
    attack: "Attack",
    health: "Health",
    newGame: "New game",
    back: "← Back",
    home: "← Home",
  },
  suits: {
    hearts: "Hearts",
    diamonds: "Diamonds",
    clubs: "Clubs",
    spades: "Spades",
  },
  suitLabels: {
    hearts: "♥ Hearts",
    diamonds: "♦ Diamonds",
    clubs: "♣ Clubs",
    spades: "♠ Spades",
  },
  suitPowers: {
    hearts: "Shuffles discard and adds N cards to the bottom of the tavern.",
    diamonds: "Draw N cards from the tavern into your hand.",
    clubs: "Doubles the damage dealt (×2).",
    spades: "Accumulates N shield that reduces enemy attack.",
  },
  ranks: {
    J: "Jack",
    Q: "Queen",
    K: "King",
  },
  action: {
    play: "Play",
    yield: "Yield",
    discard: "Discard ({{current}}/{{needed}})",
    discard_label: "Discard",
    newGame: "New game",
  },
  hand: {
    title: "Hand ({{count}})",
    empty: "Empty hand",
    sufferDiscard: "Select cards to discard",
    sort: "⇅ Sort",
    sortByClass: "⇅ By Suit",
  },
  footer: {
    jacks: "Jacks",
    queens: "Queens",
    kings: "Kings",
  },
  game: {
    status: {
      castle: "Castle",
      tavern: "Tavern",
      discard: "Discard",
    },
    sufferDamage: "⚠️ Suffer {{damage}} damage — discard enough cards",
    errors: {
      discardNotEnough:
        "Select cards with total value ≥ {{needed}} (current: {{current}})",
    },
  },
  enemy: {
    attack: "Attack",
    health: "Health",
    suitPowers: "Suit powers",
    immune: "— Immune",
    immuneDesc: "This enemy ignores the power of this suit.",
  },
  classes: {
    hearts: {
      name: "Cleric",
      lore: "Clerics use their deep knowledge of healing and alchemy to create potions and salves. With the spread of corruption their services are now required on the front lines of battle.",
    },
    diamonds: {
      name: "Bard",
      lore: "Bards are not only musical experts but also skilled leaders. Their unique abilities inspire those around them, ensuring the frontline is always fully manned and prepared for the fight.",
    },
    clubs: {
      name: "Warrior",
      lore: "Ever since the old wars, Warriors have honed their skills even through times of peace. Now that the fighting has begun again they eagerly leap into battle, keen to strike the first and last blow.",
    },
    spades: {
      name: "Paladin",
      lore: "Paladins act as the royal guards. They are adept firstly in dissuading conflict and secondly in defending against attacks. Now fighting has broken out their defensive abilities will prove crucial.",
    },
    jester: {
      name: "Jester",
      lore: "The Jester belongs to no class. Their chaotic and unpredictable presence confuses the enemy, temporarily nullifying any immunity they possess.",
    },
  },
  cardDetail: {
    value: "Value: {{value}}",
    suitPower: "Suit power",
    jesterTitle: "Jester",
    jesterPower:
      "Cancels the current enemy's immunity for one turn. Suit powers still apply normally.",
  },
  defeat: {
    message: "The kingdom has fallen",
    newGame: "New game",
    stats: {
      time: "Time",
      turns: "Turns",
      enemies: "Enemies defeated",
      discarded: "Discarded",
      defeated: "Defeated",
      discardPile: "🗑 Discard pile",
      hand: "🃏 Available hand",
      noCards: "No cards",
    },
  },
  settings: {
    title: "Settings",
    music: "Music",
    sfx: "Sound effects",
    restart: "Restart game",
    exit: "Exit to home",
  },
  victory: {
    title: "Victory!",
    subtitle: "The kingdom is saved",
    playAgain: "Play again",
    home: "← Home",
  },
  tracker: {
    title: "Tracker",
    reset: "Reset",
    dead: "HP zero!",
    immune: "Immunity — ",
    damage: "Damage: -{{value}}",
    confirmDefeat: "💀 Confirm defeat",
    defeatEnemy: "Defeat enemy",
  },
  modal: {
    ok: "Got it",
    immuneWarning: {
      title: "Enemy immune!",
      body: "This enemy is immune to this suit's power. Damage still applies, but the special power has no effect.",
    },
    hint: {
      title: "Hint",
      body: "Select a suit and a card to attack. Clubs double damage, Hearts heal the discard, Diamonds draw cards, and Spades accumulate shield.",
    },
  },
  home: {
    play: {
      title: "PLAY",
      desc: "Full digital version — deck, hand and suit powers",
    },
    tracker: {
      title: "TRACKER",
      desc: "Score tracker for the physical deck — track HP and enemy attack",
    },
    instructions: {
      title: "HOW TO PLAY",
      desc: "Rules, suit powers and castle nobles table",
    },
  },
  instructions: {
    header: "How to Play",
    gameName: "REGICIDE",
    gameSubtitle: "A cooperative game for 1–4 players",
    sections: {
      objective: {
        title: "Objective",
        body: "Players must work together to defeat all 12 castle nobles — 4 Jacks, 4 Queens and 4 Kings — before the deck runs out or the players' hand empties with no ability to act.",
      },
      setup: {
        title: "Setup",
        body: "Separate the 12 nobles (J, Q, K of each suit) forming the Castle: shuffle the Jacks and place them on top, then Queens, then Kings. The remaining 40 cards form the Tavern (players' deck). Draw 8 cards for the starting hand (7 for 2 players, 6 for 3, 5 for 4).",
      },
      turn: {
        title: "Turn Structure",
        steps: [
          {
            title: "Play cards",
            desc: 'Play 1 or more cards of the same value or a combo ("animal companion"). The total value is the damage dealt to the enemy.',
          },
          {
            title: "Activate powers",
            desc: "Each suit of the played cards activates a special power (see table below).",
          },
          {
            title: "Suffer damage",
            desc: "If the enemy was not defeated, players must discard cards from their hand equal to the enemy's attack (reduced by the Spades shield).",
          },
          {
            title: "Draw cards",
            desc: "At the end of your turn, refill your hand up to the maximum limit.",
          },
        ],
      },
      suitPowersSection: {
        title: "Suit Powers",
        hearts: {
          name: "Hearts — Heal",
          power:
            "Remove cards from the discard and put them back in the Tavern (shuffle). Amount equal to the value of the played cards.",
        },
        diamonds: {
          name: "Diamonds — Draw",
          power:
            "Draw cards immediately. Amount equal to the value of the played cards.",
        },
        clubs: {
          name: "Clubs — Double strength",
          power:
            "Damage dealt to the enemy is doubled for other Clubs powers. Clubs cards count double in total damage calculation.",
        },
        spades: {
          name: "Spades — Shield",
          power:
            "Reduce the current enemy's attack by the value of the played Spades cards. Shield accumulates over turns.",
        },
      },
      immunities: {
        title: "Noble Immunities",
        body: "Each noble is immune to the suit matching their own suit — cards of the same suit deal no damage and activate no powers against them. The Jester cancels the current enemy's immunity for one turn.",
        examples: {
          hearts: "Hearts noble ignores ♥ cards",
          diamonds: "Diamonds noble ignores ♦ cards",
          clubs: "Clubs noble ignores ♣ cards",
          spades: "Spades noble ignores ♠ cards",
        },
      },
      enemies: {
        title: "Castle Nobles",
        ownSuit: "own suit",
        immuneTo: "Immune to: {{suit}}",
        jack: "Jack",
        queen: "Queen",
        king: "King",
      },
      companions: {
        title: "Animal Companions (Combos)",
        body: 'You can play multiple cards at once if they form an "animal companion" — combinations whose total value does not exceed 10, or cards of the same value. Total damage is the sum of all played cards, and all suit powers are activated.',
        examples: {
          fourSix: "= 10 damage (both suits)",
          threeThrees: "= 9 damage (same value)",
          twoAces: "= 2 damage (same value)",
        },
      },
      defeating: {
        title: "Defeating a Noble",
        body: "When the noble's HP reaches zero (or below), they are defeated. Place the cards played against them at the bottom of the Tavern (not the discard). Then flip the next noble from the Castle and begin a new fight.",
      },
      endConditions: {
        title: "Victory and Defeat",
        victoryTitle: "Victory 👑",
        victoryText: "Defeat all 12 Castle nobles.",
        defeatTitle: "Defeat 💀",
        defeatText:
          "A player cannot discard enough cards to cover the damage suffered, or needs to play a card and has none in hand.",
      },
    },
  },
};

export default en;
