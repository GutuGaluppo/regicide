import { Card } from "@/data/types";
import {
	buildLocalLogEntry,
	buildLogWire,
	parseLogEntry,
	serializeLogCards,
} from "@/utils/log";

const card = (id: string, rank: Card["rank"], suit: Card["suit"], value: number): Card => ({
	id,
	rank,
	suit,
	value,
});

const cards: Card[] = [card("c1", "5", "hearts", 5), card("c2", "K", "spades", 20)];

describe("serializeLogCards", () => {
	it("stringifies a non-empty array and round-trips ids", () => {
		const raw = serializeLogCards(cards);
		expect(typeof raw).toBe("string");
		const parsed = JSON.parse(raw as string) as Card[];
		expect(parsed.map((c) => c.id)).toEqual(["c1", "c2"]);
	});

	it("returns undefined for empty/missing arrays", () => {
		expect(serializeLogCards(undefined)).toBeUndefined();
		expect(serializeLogCards([])).toBeUndefined();
	});
});

describe("parseLogEntry", () => {
	const base = { playerId: "p1", playerName: "Augusto", kind: "attack", createdAt: 1000 };

	it("parses a valid attack entry with cards and derived values", () => {
		const entry = parseLogEntry("e1", {
			...base,
			cards: JSON.stringify(cards),
			enemyId: "spades_J",
			enemyRank: "J",
			damage: 25,
			shieldAdded: 0,
			turnIndex: 3,
		});
		expect(entry).toMatchObject({
			id: "e1",
			playerId: "p1",
			kind: "attack",
			enemyId: "spades_J",
			enemyRank: "J",
			damage: 25,
			turnIndex: 3,
		});
		expect(entry?.cards?.map((c) => c.id)).toEqual(["c1", "c2"]);
	});

	it("accepts an entry without optional fields (no avatar/cards)", () => {
		const entry = parseLogEntry("e2", { ...base, kind: "yield" });
		expect(entry).toMatchObject({ id: "e2", kind: "yield" });
		expect(entry?.cards).toBeUndefined();
		expect(entry?.playerAvatarId).toBeUndefined();
	});

	it("keeps the avatar snapshot when present", () => {
		const entry = parseLogEntry("e3", { ...base, playerAvatarId: "knight_01" });
		expect(entry?.playerAvatarId).toBe("knight_01");
	});

	it("rejects malformed entries without dropping valid ones", () => {
		expect(parseLogEntry("", base)).toBeNull();
		expect(parseLogEntry("e", null)).toBeNull();
		expect(parseLogEntry("e", { ...base, kind: "bogus" })).toBeNull();
		expect(parseLogEntry("e", { ...base, playerId: "" })).toBeNull();
		expect(parseLogEntry("e", { ...base, createdAt: "nope" })).toBeNull();
	});

	it("drops an invalid enemyRank but keeps the entry", () => {
		const entry = parseLogEntry("e4", { ...base, enemyRank: "Z" });
		expect(entry).not.toBeNull();
		expect(entry?.enemyRank).toBeUndefined();
	});

	it("ignores corrupt cards json gracefully", () => {
		const entry = parseLogEntry("e5", { ...base, cards: "{not json" });
		expect(entry).not.toBeNull();
		expect(entry?.cards).toBeUndefined();
	});
});

describe("buildLogWire", () => {
	it("omits undefined fields and serializes cards", () => {
		const wire = buildLogWire({
			playerId: "p1",
			playerName: "Augusto",
			kind: "discard",
			cards,
		});
		expect(wire).toMatchObject({ playerId: "p1", kind: "discard" });
		expect(typeof wire.cards).toBe("string");
		expect("enemyId" in wire).toBe(false);
		expect("damage" in wire).toBe(false);
		expect("playerAvatarId" in wire).toBe(false);
	});

	it("round-trips through parseLogEntry", () => {
		const wire = buildLogWire({
			playerId: "p1",
			playerName: "A",
			kind: "attack",
			cards,
			damage: 25,
			enemyId: "spades_J",
			enemyRank: "J",
		});
		const parsed = parseLogEntry("k1", { ...wire, createdAt: 5 });
		expect(parsed?.cards?.map((c) => c.id)).toEqual(["c1", "c2"]);
		expect(parsed?.damage).toBe(25);
	});
});

describe("buildLocalLogEntry", () => {
	it("creates a complete entry with id + createdAt and unique ids", () => {
		const a = buildLocalLogEntry({ playerId: "local", playerName: "You", kind: "yield" });
		const b = buildLocalLogEntry({ playerId: "local", playerName: "You", kind: "yield" });
		expect(a.id).not.toEqual(b.id);
		expect(typeof a.createdAt).toBe("number");
		expect(a.kind).toBe("yield");
	});

	it("keeps provided cards/derived values", () => {
		const e = buildLocalLogEntry({
			playerId: "local",
			playerName: "You",
			kind: "attack",
			cards,
			damage: 25,
		});
		expect(e.cards?.map((c) => c.id)).toEqual(["c1", "c2"]);
		expect(e.damage).toBe(25);
	});
});
