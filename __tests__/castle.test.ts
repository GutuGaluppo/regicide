import { buildCastle } from "@/data/buildCastle";
import { createCastleDeck } from "@/data/enemies";

describe("createCastleDeck", () => {
	it("creates 12 enemies: one of each rank per suit", () => {
		const deck = createCastleDeck();
		expect(deck).toHaveLength(12);
		expect(deck.filter((e) => e.rank === "J")).toHaveLength(4);
		expect(deck.filter((e) => e.rank === "Q")).toHaveLength(4);
		expect(deck.filter((e) => e.rank === "K")).toHaveLength(4);
	});

	it("assigns the official health/attack per rank", () => {
		const deck = createCastleDeck();
		const byRank = (r: string) => deck.find((e) => e.rank === r)!;
		expect(byRank("J")).toMatchObject({ health: 20, attack: 10 });
		expect(byRank("Q")).toMatchObject({ health: 30, attack: 15 });
		expect(byRank("K")).toMatchObject({ health: 40, attack: 20 });
	});
});

describe("buildCastle", () => {
	it("orders the deck as all Jacks, then all Queens, then all Kings", () => {
		const castle = buildCastle();
		const ranks = castle.map((e) => e.rank);
		expect(ranks).toEqual([
			"J", "J", "J", "J",
			"Q", "Q", "Q", "Q",
			"K", "K", "K", "K",
		]);
	});

	it("includes all 12 unique enemies", () => {
		const ids = new Set(buildCastle().map((e) => e.id));
		expect(ids.size).toBe(12);
	});
});
