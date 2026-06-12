import { Card, CardRank, Enemy, EnemyRank, GameState, GameStats, Suit } from "@/data/types";

/** Builds a numbered/face card. `value` defaults to the numeric rank when omitted. */
export const card = (
	rank: CardRank,
	suit: Suit | null,
	value?: number,
	id?: string,
): Card => ({
	id: id ?? `${rank}-${suit ?? "x"}`,
	rank,
	suit,
	value: value ?? (rank === "A" ? 1 : Number(rank) || 0),
});

export const jester = (id = "Jester-0"): Card => ({
	id,
	rank: "Jester",
	suit: null,
	value: 0,
});

export const enemy = (
	rank: EnemyRank,
	suit: Suit,
	overrides: Partial<Enemy> = {},
): Enemy => {
	const stats = {
		J: { health: 20, attack: 10 },
		Q: { health: 30, attack: 15 },
		K: { health: 40, attack: 20 },
	}[rank];
	return {
		id: `${rank}-${suit}`,
		rank,
		suit,
		health: stats.health,
		attack: stats.attack,
		...overrides,
	};
};

export const emptyStats = (): GameStats => ({
	startTime: 0,
	turnsPlayed: 0,
	cardsPerTurn: [],
	discardedCards: [],
	enemyKills: [],
});

/** Minimal GameState; pass overrides for the slices a test cares about. */
export const gameState = (overrides: Partial<GameState> = {}): GameState => ({
	castle: [enemy("J", "hearts")],
	defeatedEnemies: [],
	tavernDeck: [],
	discardPile: [],
	playerHand: [],
	playedThisFight: [],
	discardedThisFight: [],
	currentDamage: 0,
	spadesShield: 0,
	jesterActive: false,
	pendingDamage: 0,
	phase: "player_turn",
	jestersAvailable: 2,
	jestersUsed: 0,
	stats: emptyStats(),
	...overrides,
});
