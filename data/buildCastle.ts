import { Enemy } from "@/data/types";
import { createCastleDeck } from "@/data/enemies";
import { shuffle } from "@/utils/shuffle";

/**
 * Builds the castle deck: shuffled Jacks, then Queens, then Kings.
 * Shared between the tracker store and the full-game store.
 */
export const buildCastle = (): Enemy[] => {
	const all = createCastleDeck();
	return [
		...shuffle(all.filter((e) => e.rank === "J")),
		...shuffle(all.filter((e) => e.rank === "Q")),
		...shuffle(all.filter((e) => e.rank === "K")),
	];
};
