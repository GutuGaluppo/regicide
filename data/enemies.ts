// /data/enemies.ts
import { Enemy, EnemyRank, Suit } from "./types";

export const createCastleDeck = (): Enemy[] => {
	const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
	const ranks: EnemyRank[] = ["J", "Q", "K"];

	const stats = {
		J: { health: 20, attack: 10 },
		Q: { health: 30, attack: 15 },
		K: { health: 40, attack: 20 },
	};

	return suits.flatMap((suit) =>
		ranks.map((rank) => ({
			id: `${rank}-${suit}`,
			suit,
			rank,
			health: stats[rank].health,
			attack: stats[rank].attack,
		})),
	);
};
