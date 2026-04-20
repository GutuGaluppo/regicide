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
		sort: "Trier",
		sortByClass: "Par Couleur",
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
			discarded: "Défaussées",
			defeated: "Vaincu",
			discardPile: "🗑 Défausse",
			hand: "🃏 Main disponible",
			noCards: "Aucune carte",
		},
	},
	settings: {
		title: "Paramètres",
		music: "Musique",
		sfx: "Effets sonores",
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
	modal: {
		ok: "Compris",
		immuneWarning: {
			title: "Ennemi immunisé!",
			body: "Cet ennemi est immunisé contre le pouvoir de cette couleur. Les dégâts s'appliquent quand même, mais le pouvoir spécial n'a aucun effet.",
		},
		hint: {
			title: "Conseil",
			body: "Choisissez une couleur et une carte pour attaquer. Trèfle double les dégâts, Cœur soigne la défausse, Carreau pioche des cartes et Pique accumule un bouclier.",
		},
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
		gameInfo: { players: "1–4", age: "10+", time: "20 min" },
		sections: {
			objective: {
				title: "Objectif du Jeu",
				body: "Regicide est un jeu coopératif où les joueurs unissent leurs forces pour vaincre 12 puissants ennemis. Les joueurs utilisent des cartes à leur tour pour attaquer l'ennemi et, une fois suffisamment de dégâts infligés, l'ennemi est vaincu. Les joueurs gagnent quand le dernier Roi est défait. Mais attention ! L'ennemi contre-attaque à chaque tour. Les joueurs doivent défausser des cartes pour absorber les dégâts — s'ils n'en ont plus, tout le monde perd !",
			},
			setup: {
				title: "Préparation",
				body: "Mélangez les 4 Rois (K) et placez-les face cachée sur la table. Mélangez les 4 Dames (Q) et posez-les dessus. Mélangez les 4 Valets (J) et posez-les dessus. C'est le Deck Château. Placez-le au centre de la table et révélez le Valet du dessus — ce sera l'ennemi actuel.\n\nMélangez ensemble toutes les cartes numérotées (2–10), les 4 Animaux Compagnons (A) et un nombre de Jokers selon le tableau ci-dessous pour former le Deck Taverne.",
				tableHeader: {
					players: "Joueurs",
					jesters: "Jokers",
					hand: "Main max.",
				},
				tableRows: [
					{ players: "1", jesters: "0", hand: "8" },
					{ players: "2", jesters: "0", hand: "7" },
					{ players: "3", jesters: "1", hand: "6" },
					{ players: "4", jesters: "2", hand: "5" },
				],
				startNote:
					"Le joueur ayant le plus récemment commis un régicide commence.",
			},
			howToPlay: {
				title: "Comment Jouer",
				intro:
					"À votre tour, utilisez des cartes de votre main pour infliger des dégâts à l'ennemi actuel et tenter de le vaincre. La valeur des cartes détermine les dégâts, tandis que la couleur octroie un pouvoir spécial.",
				stepsLabel: "Chaque tour comporte quatre étapes :",
				steps: [
					"Étape 1 — Jouez une carte ou passez",
					"Étape 2 — Activez le pouvoir de la couleur",
					"Étape 3 — Infligez des dégâts et vérifiez",
					"Étape 4 — Subissez les dégâts de l'ennemi",
				],
			},
			step1: {
				title: "Étape 1 — Jouer",
				subtitle: "Jouez une carte de votre main pour attaquer l'ennemi",
				body: "Posez une carte de votre main sur la table devant vous. Le numéro de la carte est la valeur d'attaque — p. ex., le 7 de Cœurs inflige 7 dégâts. Au lieu de jouer une carte, vous pouvez choisir de passer (voir Passer ci-dessous).",
			},
			step2: {
				title: "Étape 2 — Pouvoirs des Couleurs",
				subtitle: "Activez le pouvoir de la couleur de la carte jouée",
				intro:
					"Utiliser une carte pour infliger des dégâts octroie également un pouvoir lié à sa couleur. Les pouvoirs des couleurs rouges (♥ ♦) se résolvent immédiatement ; ceux des couleurs noires (♣ ♠) prennent effet lors des étapes suivantes.",
				suits: {
					hearts: {
						name: "CŒURS",
						body: "Soigner depuis la défausse : mélangez la défausse, mettez de côté face cachée un nombre de cartes égal à la valeur d'attaque et placez-les sous le Deck Taverne. Remettez la défausse sur la table face visible.",
					},
					diamonds: {
						name: "CARREAUX",
						body: "Piocher des cartes : le joueur actuel pioche une carte. Les autres joueurs suivent dans le sens horaire, chacun piochant une carte à la fois, jusqu'à ce que le nombre de cartes égal à la valeur d'attaque ait été pioché. Les joueurs ne peuvent pas dépasser la taille maximale de leur main.",
					},
					clubs: {
						name: "TRÈFLES",
						body: "Dégâts doublés : à l'étape 3, les dégâts infligés par les Trèfles comptent double. P. ex. : le 8 de Trèfles inflige 16 dégâts.",
					},
					spades: {
						name: "PIQUES",
						body: "Bouclier : à l'étape 4, réduisez la valeur d'attaque de l'ennemi actuel par la valeur d'attaque jouée. Le bouclier de toutes les Piques jouées contre cet ennemi par n'importe quel joueur est cumulatif et reste en vigueur jusqu'à la défaite de l'ennemi.",
					},
				},
				note: "Les pouvoirs des couleurs sont obligatoires et ne peuvent être ignorés.",
			},
			step3: {
				title: "Étape 3 — Dégâts et Défaite",
				subtitle: "Infligez des dégâts et vérifiez si l'ennemi est vaincu",
				body: "Les dégâts infligés à l'ennemi sont égaux à la valeur d'attaque de la carte jouée. Vérifiez si le total des dégâts infligés jusqu'à présent par tous les joueurs est supérieur ou égal aux points de vie de l'ennemi.",
				enemyHeader: { enemy: "Ennemi", atk: "Attaque", hp: "Vie" },
				enemyRows: [
					{ enemy: "Valet", atk: "10", hp: "20" },
					{ enemy: "Dame", atk: "15", hp: "30" },
					{ enemy: "Roi", atk: "20", hp: "40" },
				],
				defeatTitle: "Si l'ennemi est vaincu, faites ce qui suit :",
				defeatSteps: [
					"Placez l'ennemi sur la défausse. Si les dégâts sont exactement égaux aux points de vie, placez-le face cachée au sommet du Deck Taverne.",
					"Placez dans la défausse toutes les cartes jouées par les joueurs contre l'ennemi.",
					"Révélez la prochaine carte du Deck Château en la retournant.",
					"Le joueur qui vient de vaincre l'ennemi passe l'étape 4 et commence un nouveau tour contre l'ennemi nouvellement révélé, en revenant à l'étape 1.",
				],
			},
			step4: {
				title: "Étape 4 — Subir des Dégâts",
				subtitle: "Subissez les dégâts de l'ennemi en défaussant des cartes",
				body: "Si l'ennemi n'a pas été vaincu, il attaque le joueur actuel en infligeant des dégâts égaux à sa valeur d'attaque — réduite par le bouclier total de Piques. Le joueur doit défausser des cartes dont la valeur totale est au moins égale aux dégâts. En défaussant, les Animaux Compagnons (A) valent 1 et le Joker vaut 0. Si le joueur n'a pas assez de cartes, tous les joueurs perdent.\n\nAprès avoir subi les dégâts, le joueur suivant dans le sens horaire commence un nouveau tour, en revenant à l'étape 1.",
			},
			companions: {
				title: "Animaux Compagnons",
				body: "À l'étape 1, les Animaux Compagnons (As) peuvent être joués seuls ou associés à une autre carte (sauf le Joker). Ils comptent pour 1 dans la valeur totale d'attaque et leur pouvoir de couleur s'applique normalement. Ils peuvent aussi être associés à un autre Animal Compagnon. Si vous associez un Animal Compagnon à une autre carte de la même couleur, le pouvoir ne s'applique qu'une seule fois.",
			},
			combos: {
				title: "Combinaisons",
				body: "À l'étape 1, vous pouvez combiner des cartes du même numéro en groupes de 2, 3 ou 4, à condition que la valeur totale soit inférieure ou égale à 10. Les Animaux Compagnons ne peuvent pas être ajoutés à une combinaison. Les joueurs peuvent jouer des paires de 2–5, des trios de 2–3 ou un carré de 2. Tous les pouvoirs se résolvent en fonction de la valeur totale d'attaque.",
			},
			immunity: {
				title: "Immunité Ennemie",
				body: "Chaque ennemi est immunisé contre le pouvoir de la couleur des cartes jouées contre lui correspondant à sa propre couleur. Les joueurs ne piochent pas de cartes quand des Carreaux sont joués contre le Valet de Carreaux — cependant, leur valeur compte toujours pour les dégâts. Le Joker peut être utilisé pour annuler l'immunité d'un ennemi.",
			},
			jester: {
				title: "Utiliser le Joker",
				body: "À l'étape 1, le Joker peut être joué seul. Il a une valeur d'attaque de 0 et son pouvoir est d'annuler l'immunité de l'ennemi, faisant en sorte que le pouvoir de la couleur correspondant à l'ennemi s'applique normalement. Après avoir joué le Joker, les étapes 3 et 4 sont ignorées ; au lieu de passer au joueur suivant, celui qui a joué le Joker choisit librement qui joue ensuite.",
				note: "Après avoir joué le Joker, les restrictions de communication sont temporairement levées jusqu'à ce que le joueur suivant commence son tour. Les joueurs peuvent exprimer une direction générale, mais ne peuvent pas révéler le contenu de leur main.",
			},
			defeatedEnemy: {
				title: "Exploiter les Ennemis Vaincus",
				body: "Les nobles vaincus en main comptent avec les valeurs ci-dessous, tant pour attaquer que pour défausser en subissant des dégâts. Lorsqu'ils sont utilisés, le pouvoir de la couleur s'applique normalement.",
				tableRows: [
					{ rank: "J", label: "Valet", value: "10" },
					{ rank: "Q", label: "Dame", value: "15" },
					{ rank: "K", label: "Roi", value: "20" },
				],
			},
			pass: {
				title: "Passer",
				body: "Durant l'étape 1, il peut être avantageux de passer plutôt que de jouer une carte. Dites simplement \"Passe\" et allez directement à l'étape 4, en sautant les étapes 2 et 3. Un joueur ne peut pas passer si tous les autres joueurs ont passé lors de leur dernier tour.",
			},
			communication: {
				title: "Communication",
				body: "Les joueurs ne peuvent pas communiquer d'informations pouvant révéler ou suggérer le contenu de leurs mains. Ils peuvent cependant rappeler aux autres joueurs toute information publique.",
				allowed:
					'Autorisé : "J\'ai deux cartes en main" · "Il reste 3 cartes dans la Taverne !"',
				forbidden:
					'Interdit : "J\'ai le 10 de Trèfles" · "J\'espère que quelqu\'un joue des Carreaux bientôt !"',
			},
			endConditions: {
				title: "Fin de Partie",
				body: "La partie se termine en victoire quand tous les Rois sont vaincus, ou en défaite quand un joueur ne peut pas résoudre les dégâts causés par un ennemi. Les joueurs perdent aussi quand un joueur ne peut ni jouer de carte ni passer lors de son tour.",
				victoryTitle: "Victoire",
				victoryText: "Vainquez les 12 nobles du Château.",
				defeatTitle: "Défaite",
				defeatText:
					"Un joueur ne peut pas défausser suffisamment de cartes pour couvrir les dégâts subis, ou doit jouer une carte et n'en a aucune en main.",
			},
			solo: {
				title: "Jeu en Solo",
				body: "Pour une partie solo, mettez les deux Jokers de côté. Vous jouez avec une seule main limitée à 8 cartes. Vous pouvez retourner un Joker pour défausser votre main et en reprendre 8 (cela ne compte pas comme une pioche pour l'immunité aux Carreaux). Vous pouvez le faire au début de l'étape 1 avant de jouer une carte, ou au début de l'étape 4 avant de subir des dégâts. Cette action n'annule pas l'immunité de l'ennemi.",
				tiersLabel: "Niveaux de victoire :",
				tiers: [
					{ label: "2 Jokers utilisés", value: "🥉 Victoire de Bronze" },
					{ label: "1 Joker utilisé", value: "🥈 Victoire d'Argent" },
					{ label: "0 Joker utilisé", value: "🥇 Victoire d'Or" },
				],
			},
		},
	},
};

export default fr;
