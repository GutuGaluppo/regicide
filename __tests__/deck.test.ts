import { createTavernDeck, HAND_SIZE, JESTER_COUNT } from "@/data/deck";

describe("HAND_SIZE / JESTER_COUNT tables", () => {
	it("matches the official per-player-count values", () => {
		expect(HAND_SIZE).toEqual({ 1: 8, 2: 7, 3: 6, 4: 5 });
		expect(JESTER_COUNT).toEqual({ 1: 0, 2: 0, 3: 1, 4: 2 });
	});
});

describe("createTavernDeck", () => {
	it("contains 36 number cards, 4 companions and the right Jester count", () => {
		const deck = createTavernDeck(4);
		const numbers = deck.filter((c) => !["A", "Jester"].includes(c.rank));
		const aces = deck.filter((c) => c.rank === "A");
		const jesters = deck.filter((c) => c.rank === "Jester");

		expect(numbers).toHaveLength(36); // 9 ranks × 4 suits
		expect(aces).toHaveLength(4);
		expect(jesters).toHaveLength(JESTER_COUNT[4]);
		expect(deck).toHaveLength(36 + 4 + 2);
	});

	it("omits Jesters for 1 and 2 player games", () => {
		expect(createTavernDeck(1).filter((c) => c.rank === "Jester")).toHaveLength(0);
		expect(createTavernDeck(2).filter((c) => c.rank === "Jester")).toHaveLength(0);
	});

	it("gives every number card a value equal to its rank", () => {
		const deck = createTavernDeck(1);
		for (const c of deck) {
			if (c.rank === "A") expect(c.value).toBe(1);
			else if (c.rank === "Jester") expect(c.value).toBe(0);
			else expect(c.value).toBe(Number(c.rank));
		}
	});

	it("assigns null suit only to Jesters", () => {
		const deck = createTavernDeck(4);
		for (const c of deck) {
			if (c.rank === "Jester") expect(c.suit).toBeNull();
			else expect(c.suit).not.toBeNull();
		}
	});
});
