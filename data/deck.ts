// /data/deck.ts
import { Card, Suit } from "./types";
import { shuffle } from "@/utils/shuffle";

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

export const HAND_SIZE: Record<1 | 2 | 3 | 4, number> = { 1: 8, 2: 7, 3: 6, 4: 5 };
export const JESTER_COUNT: Record<1 | 2 | 3 | 4, number> = { 1: 0, 2: 0, 3: 1, 4: 2 };

export const createTavernDeck = (playerCount: 1 | 2 | 3 | 4 = 2): Card[] => {
	const cards: Card[] = [];

	// Cartas numeradas 2–10
	for (const suit of SUITS) {
		for (let n = 2; n <= 10; n++) {
			const rank = `${n}` as Card["rank"];
			cards.push({ id: `${rank}-${suit}`, rank, suit, value: n });
		}
	}

	// Companheiros Animais (Ases)
	for (const suit of SUITS) {
		cards.push({ id: `A-${suit}`, rank: "A", suit, value: 1 });
	}

	// Jesters
	for (let i = 0; i < JESTER_COUNT[playerCount]; i++) {
		cards.push({ id: `Jester-${i}`, rank: "Jester", suit: null, value: 0 });
	}

	return shuffle(cards);
};
