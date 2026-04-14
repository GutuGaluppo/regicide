import type { Translations } from "./pt-BR";

const fr: Translations = {
  common: {
    attack: "Attaque",
    health: "Vie",
    newGame: "Nouvelle partie",
    back: "← Retour",
    home: "← Accueil",
  },
  suits: {
    hearts: "Cœurs",
    diamonds: "Carreaux",
    clubs: "Trèfles",
    spades: "Piques",
  },
  suitLabels: {
    hearts: "♥ Cœurs",
    diamonds: "♦ Carreaux",
    clubs: "♣ Trèfles",
    spades: "♠ Piques",
  },
  suitPowers: {
    hearts: "Mélange la défausse et ajoute N cartes au bas de la taverne.",
    diamonds: "Piochez N cartes de la taverne dans votre main.",
    clubs: "Double les dégâts infligés (×2).",
    spades: "Accumule N de bouclier qui réduit l'attaque de l'ennemi.",
  },
  ranks: {
    J: "Valet",
    Q: "Dame",
    K: "Roi",
  },
  action: {
    play: "Jouer",
    yield: "Passer",
    discard: "Défausser ({{current}}/{{needed}})",
    discard_label: "Défausser",
    newGame: "Nouvelle partie",
  },
  hand: {
    title: "Main ({{count}})",
    empty: "Main vide",
    sufferDiscard: "Sélectionnez des cartes à défausser",
    sort: "⇅ Trier",
    sortByClass: "⇅ Par Couleur",
  },
  footer: {
    jacks: "Valets",
    queens: "Dames",
    kings: "Rois",
  },
  game: {
    status: {
      castle: "Château",
      tavern: "Taverne",
      discard: "Défausse",
    },
    sufferDamage:
      "⚠️ Subissez {{damage}} dégâts — défaussez suffisamment de cartes",
    errors: {
      discardNotEnough:
        "Sélectionnez des cartes avec une valeur totale ≥ {{needed}} (actuel: {{current}})",
    },
  },
  enemy: {
    attack: "Attaque",
    health: "Vie",
    suitPowers: "Pouvoirs des couleurs",
    immune: "— Immunisé",
    immuneDesc: "Cet ennemi ignore le pouvoir de cette couleur.",
  },
  classes: {
    hearts: {
      name: "Clerc",
      lore: "Les Clercs utilisent leur profonde connaissance de la guérison et de l'alchimie pour créer des potions et des onguents. Avec la propagation de la corruption, leurs services sont désormais requis en première ligne.",
    },
    diamonds: {
      name: "Barde",
      lore: "Les Bardes ne sont pas seulement des experts musicaux, mais aussi des leaders habiles. Leurs capacités uniques inspirent ceux qui les entourent, garantissant que le front est toujours bien garni.",
    },
    clubs: {
      name: "Guerrier",
      lore: "Depuis les anciennes guerres, les Guerriers ont perfectionné leurs compétences même en temps de paix. Maintenant que les combats ont repris, ils se jettent avec impatience dans la bataille.",
    },
    spades: {
      name: "Paladin",
      lore: "Les Paladins agissent comme gardes royaux. Ils sont habiles pour dissuader les conflits et défendre quand l'affrontement est inévitable. Leurs capacités défensives seront cruciales dans cette guerre.",
    },
    jester: {
      name: "Joker",
      lore: "Le Joker n'appartient à aucune classe. Sa présence chaotique et imprévisible confond l'ennemi, annulant temporairement toute immunité qu'il possède.",
    },
  },
  cardDetail: {
    value: "Valeur: {{value}}",
    suitPower: "Pouvoir de la couleur",
    jesterTitle: "Joker",
    jesterPower:
      "Annule l'immunité de l'ennemi actuel pendant un tour. Les pouvoirs des couleurs s'appliquent toujours normalement.",
  },
  defeat: {
    message: "Le royaume est tombé",
    newGame: "Nouvelle partie",
    stats: {
      time: "Temps",
      turns: "Tours",
      enemies: "Ennemis vaincus",
      discarded: "Cartes défaussées",
    },
  },
  settings: {
    title: "Paramètres",
    restart: "Recommencer la partie",
    exit: "Retour à l'accueil",
  },
  victory: {
    title: "Victoire!",
    subtitle: "Le royaume est sauvé",
    playAgain: "Rejouer",
    home: "← Accueil",
  },
  tracker: {
    title: "Suivi",
    reset: "Réinitialiser",
    dead: "PV à zéro!",
    immune: "Immunité — ",
    damage: "Dégâts: -{{value}}",
    confirmDefeat: "💀 Confirmer la défaite",
    defeatEnemy: "Vaincre l'ennemi",
  },
  home: {
    play: {
      title: "JOUER",
      desc: "Version numérique complète — deck, main et pouvoirs des couleurs",
    },
    tracker: {
      title: "SUIVI",
      desc: "Tableau de bord pour le jeu physique — suivez les PV et l'attaque des ennemis",
    },
    instructions: {
      title: "COMMENT JOUER",
      desc: "Règles, pouvoirs des couleurs et tableau des nobles du château",
    },
  },
  instructions: {
    header: "Comment Jouer",
    gameName: "REGICIDE",
    gameSubtitle: "Un jeu coopératif pour 1–4 joueurs",
    sections: {
      objective: {
        title: "Objectif",
        body: "Les joueurs doivent travailler ensemble pour vaincre les 12 nobles du château — 4 Valets, 4 Dames et 4 Rois — avant que le deck soit épuisé ou que la main des joueurs soit vide sans pouvoir agir.",
      },
      setup: {
        title: "Préparation",
        body: "Séparez les 12 nobles (J, Q, K de chaque couleur) pour former le Château : mélangez les Valets et placez-les en haut, puis les Dames, puis les Rois. Les 40 autres cartes forment la Taverne (deck des joueurs). Piochez 8 cartes pour la main initiale (7 pour 2 joueurs, 6 pour 3, 5 pour 4).",
      },
      turn: {
        title: "Structure d'un Tour",
        steps: [
          {
            title: "Jouer des cartes",
            desc: 'Jouez 1 ou plusieurs cartes de même valeur ou un combo ("animal compagnon"). La valeur totale est les dégâts infligés à l\'ennemi.',
          },
          {
            title: "Activer les pouvoirs",
            desc: "Chaque couleur des cartes jouées active un pouvoir spécial (voir tableau ci-dessous).",
          },
          {
            title: "Subir des dégâts",
            desc: "Si l'ennemi n'a pas été vaincu, les joueurs doivent défausser des cartes de leur main équivalentes à l'attaque de l'ennemi (réduite par le bouclier de Piques).",
          },
          {
            title: "Piocher des cartes",
            desc: "À la fin de votre tour, remplissez votre main jusqu'à la limite maximale.",
          },
        ],
      },
      suitPowersSection: {
        title: "Pouvoirs des Couleurs",
        hearts: {
          name: "Cœurs — Soin",
          power:
            "Retirez des cartes de la défausse et replacez-les dans la Taverne (mélangez). Quantité égale à la valeur des cartes jouées.",
        },
        diamonds: {
          name: "Carreaux — Pioche",
          power:
            "Piochez des cartes immédiatement. Quantité égale à la valeur des cartes jouées.",
        },
        clubs: {
          name: "Trèfles — Double force",
          power:
            "Les dégâts infligés à l'ennemi sont doublés pour les autres pouvoirs de Trèfles. Les cartes de Trèfles comptent double dans le calcul des dégâts totaux.",
        },
        spades: {
          name: "Piques — Bouclier",
          power:
            "Réduisez l'attaque de l'ennemi actuel par la valeur des cartes de Piques jouées. Le bouclier s'accumule au fil des tours.",
        },
      },
      immunities: {
        title: "Immunités des Nobles",
        body: "Chaque noble est immunisé contre la couleur correspondant à sa propre couleur — les cartes de la même couleur ne causent ni dégâts ni ne déclenchent de pouvoirs contre lui. Le Joker (Jester) annule l'immunité de l'ennemi actuel pendant un tour.",
        examples: {
          hearts: "Noble de Cœurs ignore les cartes ♥",
          diamonds: "Noble de Carreaux ignore les cartes ♦",
          clubs: "Noble de Trèfles ignore les cartes ♣",
          spades: "Noble de Piques ignore les cartes ♠",
        },
      },
      enemies: {
        title: "Nobles du Château",
        ownSuit: "couleur propre",
        immuneTo: "Immunisé contre: {{suit}}",
        jack: "Valet",
        queen: "Dame",
        king: "Roi",
      },
      companions: {
        title: "Animaux Compagnons (Combos)",
        body: 'Vous pouvez jouer plusieurs cartes à la fois si elles forment un "animal compagnon" — combinaisons dont la valeur totale ne dépasse pas 10, ou cartes de même valeur. Les dégâts totaux sont la somme de toutes les cartes jouées, et tous les pouvoirs de couleur sont activés.',
        examples: {
          fourSix: "= 10 dégâts (les deux couleurs)",
          threeThrees: "= 9 dégâts (même valeur)",
          twoAces: "= 2 dégâts (même valeur)",
        },
      },
      defeating: {
        title: "Vaincre un Noble",
        body: "Quand les PV du noble atteignent zéro (ou moins), il est vaincu. Placez les cartes jouées contre lui sous la Taverne (pas dans la défausse). Ensuite, retournez le prochain noble du Château et commencez un nouveau combat.",
      },
      endConditions: {
        title: "Victoire et Défaite",
        victoryTitle: "Victoire 👑",
        victoryText: "Vainquez les 12 nobles du Château.",
        defeatTitle: "Défaite 💀",
        defeatText:
          "Un joueur ne peut pas défausser suffisamment de cartes pour couvrir les dégâts subis, ou doit jouer une carte et n'en a aucune en main.",
      },
    },
  },
};

export default fr;
