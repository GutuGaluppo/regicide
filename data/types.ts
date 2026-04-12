// /data/types.ts
export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type EnemyRank = "J" | "Q" | "K";

export interface Enemy {
	id: string;
	suit: Suit;
	rank: EnemyRank;
	health: number;
	attack: number;
}
