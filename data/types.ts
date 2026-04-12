// /data/types.ts
export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type EnemyRank = "J" | "Q" | "K";
export type CardRank =
	| "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"
	| "A"
	| "Jester"
	| EnemyRank;

export interface Enemy {
	id: string;
	suit: Suit;
	rank: EnemyRank;
	health: number;
	attack: number;
}

export interface Card {
	id: string;
	rank: CardRank;
	suit: Suit | null; // null apenas para Jester
	value: number;    // valor de ataque/descarte
}

export type GamePhase = "player_turn" | "suffer_damage" | "victory" | "defeat";

export interface GameState {
	castle: Enemy[];
	tavernDeck: Card[];
	discardPile: Card[];
	playerHand: Card[];
	playedThisFight: Card[];  // cartas jogadas contra o inimigo atual
	currentDamage: number;    // dano acumulado no inimigo atual
	spadesShield: number;     // redução de ataque acumulada por espadas
	jesterActive: boolean;    // imunidade do inimigo cancelada
	pendingDamage: number;    // dano a sofrer na fase suffer_damage
	phase: GamePhase;
}
