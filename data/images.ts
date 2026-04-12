// /data/images.ts
import { EnemyRank, Suit } from "./types";

export const getCardImage = (rank: EnemyRank, suit: Suit) => {
	return `https://dummyimage.com/300x420/1e293b/ffffff&text=${rank}+${suit}`;
};
