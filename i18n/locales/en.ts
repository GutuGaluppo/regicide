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
		sort: "Sort",
		sortByClass: "By Suit",
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
		gameInfo: { players: "1–4", age: "10+", time: "20 min" },
		sections: {
			objective: {
				title: "Objective",
				body: "Regicide is a cooperative game where players join forces to defeat 12 powerful enemies. Players take turns using cards to attack the enemy, and once enough damage is dealt, the enemy is defeated. Players win when the last King is defeated. But beware! The enemy strikes back each turn. Players must discard cards to soak up damage — if they run out, everyone loses!",
			},
			setup: {
				title: "Setup",
				body: "Shuffle the 4 Kings (K) and place them face-down on the table. Shuffle the 4 Queens (Q) and place them on top. Shuffle the 4 Jacks (J) and place them on top. This is the Castle Deck. Place it in the center of the table and reveal the top Jack — this is the current enemy.\n\nShuffle together all number cards (2–10), the 4 Animal Companions (A) and a number of Jesters according to the table below to form the Tavern Deck.",
				tableHeader: {
					players: "Players",
					jesters: "Jesters",
					hand: "Max Hand",
				},
				tableRows: [
					{ players: "1", jesters: "0", hand: "8" },
					{ players: "2", jesters: "0", hand: "7" },
					{ players: "3", jesters: "1", hand: "6" },
					{ players: "4", jesters: "2", hand: "5" },
				],
				startNote:
					"The player who most recently committed regicide goes first.",
			},
			howToPlay: {
				title: "How to Play",
				intro:
					"On your turn, use cards from your hand to deal damage to the current enemy, trying to defeat it. Card values determine damage, while the suit grants a special power.",
				stepsLabel: "Each turn has four steps:",
				steps: [
					"Step 1 — Play a card or pass",
					"Step 2 — Activate the suit power",
					"Step 3 — Deal damage and check the enemy",
					"Step 4 — Suffer damage from the enemy",
				],
			},
			step1: {
				title: "Step 1 — Play",
				subtitle: "Play a card from your hand to attack the enemy",
				body: "Place a card from your hand on the table in front of you. The card's number is the attack value — e.g. the 7 of Hearts deals 7 damage. Instead of playing a card, you may choose to pass (see Pass below).",
			},
			step2: {
				title: "Step 2 — Suit Powers",
				subtitle: "Activate the power of the played card's suit",
				intro:
					"Using a card to deal damage also grants a power based on its suit. Red suit powers (♥ ♦) resolve immediately; black suit powers (♣ ♠) take effect in later steps.",
				suits: {
					hearts: {
						name: "HEARTS",
						body: "Heal from the discard: shuffle the discard pile, set aside face-down a number of cards equal to the attack value, and place them under the Tavern Deck. Put the discard pile back on the table face-up.",
					},
					diamonds: {
						name: "DIAMONDS",
						body: "Draw cards: the current player draws one card. Other players follow clockwise, each drawing one at a time, until a number of cards equal to the attack value have been drawn. Players cannot exceed their maximum hand size.",
					},
					clubs: {
						name: "CLUBS",
						body: "Double damage: during Step 3, damage dealt by Clubs counts double. E.g.: the 8 of Clubs deals 16 damage.",
					},
					spades: {
						name: "SPADES",
						body: "Shield: during Step 4, reduce the current enemy's attack by the played attack value. Shield from all Spades played against this enemy by any player accumulates and persists until the enemy is defeated.",
					},
				},
				note: "Suit powers are mandatory and cannot be ignored.",
			},
			step3: {
				title: "Step 3 — Damage and Defeat",
				subtitle: "Deal damage and check if the enemy is defeated",
				body: "Damage dealt equals the attack value of the played card. Check if the total damage dealt so far by all players is greater than or equal to the enemy's health.",
				enemyHeader: { enemy: "Enemy", atk: "Attack", hp: "Health" },
				enemyRows: [
					{ enemy: "Jack", atk: "10", hp: "20" },
					{ enemy: "Queen", atk: "15", hp: "30" },
					{ enemy: "King", atk: "20", hp: "40" },
				],
				defeatTitle: "If the enemy is defeated, do the following:",
				defeatSteps: [
					"Place the enemy on the discard pile. If damage exactly equals health, place it face-down on top of the Tavern Deck instead.",
					"Place all cards played by players against this enemy on the discard pile.",
					"Reveal the next Castle Deck card, flipping it face-up.",
					"The player who just defeated the enemy skips Step 4 and starts a new turn against the newly revealed enemy, returning to Step 1.",
				],
			},
			step4: {
				title: "Step 4 — Suffer Damage",
				subtitle: "Suffer damage from the enemy by discarding cards",
				body: "If the enemy was not defeated, it attacks the current player dealing damage equal to its attack value — reduced by the total Spades shield. The player must discard cards whose total value is at least equal to the damage. Animal Companions (A) are worth 1 when discarding; the Jester is worth 0. If the player cannot discard enough, all players lose.\n\nAfter suffering damage, the next player clockwise starts a new turn, returning to Step 1.",
			},
			companions: {
				title: "Animal Companions",
				body: "In Step 1, Animal Companions (Aces) may be played alone or paired with one other card (not the Jester). They count as 1 toward the total attack value and their suit power applies normally. They may also pair with another Animal Companion. If you pair an Animal Companion with another card of the same suit, the power applies only once.",
			},
			combos: {
				title: "Combos",
				body: "In Step 1, you may combine cards of the same number in sets of 2, 3, or 4, as long as the total value is 10 or less. Animal Companions cannot be added to a combo. Players may play pairs of 2–5, trios of 2–3, or four-of-a-kind of 2. All powers resolve based on the total attack value.",
			},
			immunity: {
				title: "Enemy Immunity",
				body: "Each enemy is immune to the suit power of cards matching its own suit. Players do not draw cards when Diamonds are played against the Jack of Diamonds — however, their value still counts for damage. The Jester can cancel an enemy's immunity.",
			},
			jester: {
				title: "Using the Jester",
				body: "In Step 1, the Jester may be played alone. It has an attack value of 0 and cancels the enemy's immunity, making the power of the suit matching the enemy's suit apply normally. After playing the Jester, Steps 3 and 4 are skipped; instead of passing to the next player, the Jester player freely chooses who plays next.",
				note: "After playing the Jester, communication restrictions are temporarily lifted until the next player begins their turn. Players may express a general direction, but may not reveal the contents of their hand.",
			},
			defeatedEnemy: {
				title: "Using Defeated Enemies",
				body: "Defeated nobles held in hand count with the values below, both for attacking and for discarding when suffering damage. When used, the suit power applies normally.",
				tableRows: [
					{ rank: "J", label: "Jack", value: "10" },
					{ rank: "Q", label: "Queen", value: "15" },
					{ rank: "K", label: "King", value: "20" },
				],
			},
			pass: {
				title: "Pass",
				body: 'During Step 1, you may pass instead of playing a card. Simply say "Pass" and go directly to Step 4, skipping Steps 2 and 3. A player cannot pass if all other players passed on their last turn.',
			},
			communication: {
				title: "Communication",
				body: "Players may not communicate any information that could reveal or suggest the contents of their hands. They may, however, remind other players of any public information.",
				allowed:
					'Allowed: "I have two cards in hand" · "3 cards left in the Tavern!"',
				forbidden:
					'Forbidden: "I have the 10 of Clubs" · "I hope someone plays Diamonds soon!"',
			},
			endConditions: {
				title: "End of Game",
				body: "The game ends in victory when all Kings are defeated, or in defeat when a player cannot resolve the damage dealt by an enemy. Players also lose when a player cannot play a card or pass on their turn.",
				victoryTitle: "Victory",
				victoryText: "Defeat all 12 Castle nobles.",
				defeatTitle: "Defeat",
				defeatText:
					"A player cannot discard enough cards to cover the damage suffered, or needs to play a card and has none in hand.",
			},
			solo: {
				title: "Solo Game",
				body: "For a single-player game, set the two Jesters aside. You play with a single hand limited to 8 cards. You may flip a Jester to discard your hand and replenish 8 cards (this does not count as a draw for Diamonds immunity). You may do this at the start of Step 1 before playing a card, or at the start of Step 4 before suffering damage. This action does not cancel the enemy's immunity.",
				tiersLabel: "Victory tiers:",
				tiers: [
					{ label: "2 Jesters used", value: "🥉 Bronze Victory" },
					{ label: "1 Jester used", value: "🥈 Silver Victory" },
					{ label: "0 Jesters used", value: "🥇 Gold Victory" },
				],
			},
		},
	},
};

export default en;
