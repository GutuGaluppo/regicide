import {
	cardValue,
	enemyToCard,
	getCompatibleCardIds,
	resolvePlay,
	validatePlay,
} from "@/utils/gameLogic";
import { card, enemy, gameState, jester } from "./factories";

describe("cardValue", () => {
	it("maps Ace to 1 and face cards to their fixed values", () => {
		expect(cardValue("A")).toBe(1);
		expect(cardValue("J")).toBe(10);
		expect(cardValue("Q")).toBe(15);
		expect(cardValue("K")).toBe(20);
	});

	it("parses numbered ranks", () => {
		expect(cardValue("2")).toBe(2);
		expect(cardValue("10")).toBe(10);
	});
});

describe("enemyToCard", () => {
	it("converts an enemy into a defeated-card with the matching value", () => {
		expect(enemyToCard(enemy("Q", "spades"))).toEqual({
			id: "defeated-Q-spades",
			rank: "Q",
			suit: "spades",
			value: 15,
		});
	});

	it("assigns 10/15/20 for J/Q/K respectively", () => {
		expect(enemyToCard(enemy("J", "hearts")).value).toBe(10);
		expect(enemyToCard(enemy("K", "clubs")).value).toBe(20);
	});
});

describe("validatePlay", () => {
	it("rejects an empty selection", () => {
		expect(validatePlay([])).toEqual({
			valid: false,
			reason: "game.errors.selectAtLeastOne",
		});
	});

	it("accepts any single card", () => {
		expect(validatePlay([card("7", "hearts")])).toEqual({ valid: true });
		expect(validatePlay([jester()])).toEqual({ valid: true });
	});

	it("rejects the Jester combined with another card", () => {
		expect(validatePlay([jester(), card("5", "clubs")])).toEqual({
			valid: false,
			reason: "game.errors.jesterAlone",
		});
	});

	it("accepts an Animal Companion paired with one card", () => {
		expect(validatePlay([card("A", "hearts"), card("8", "spades")])).toEqual({
			valid: true,
		});
	});

	it("accepts two Animal Companions together", () => {
		expect(validatePlay([card("A", "hearts"), card("A", "spades")])).toEqual({
			valid: true,
		});
	});

	it("rejects an Animal Companion with more than one extra card", () => {
		expect(
			validatePlay([card("A", "hearts"), card("5", "clubs"), card("5", "spades")]),
		).toEqual({ valid: false, reason: "game.errors.companionPairOnly" });
	});

	it("accepts a same-rank combo whose total is ≤ 10", () => {
		expect(validatePlay([card("3", "hearts"), card("3", "clubs")])).toEqual({
			valid: true,
		});
		expect(
			validatePlay([card("2", "hearts"), card("2", "clubs"), card("2", "spades")]),
		).toEqual({ valid: true });
	});

	it("rejects a combo of different ranks", () => {
		expect(validatePlay([card("3", "hearts"), card("4", "clubs")])).toEqual({
			valid: false,
			reason: "game.errors.comboSameRank",
		});
	});

	it("rejects a same-rank combo whose total exceeds 10", () => {
		expect(validatePlay([card("6", "hearts"), card("6", "clubs")])).toEqual({
			valid: false,
			reason: "game.errors.comboMaxTotal",
		});
	});

	it("rejects a combo of more than 4 cards", () => {
		const twos = (["hearts", "diamonds", "clubs", "spades"] as const).map((s) =>
			card("2", s),
		);
		// 5 twos: total 10 passes the ≤10 check, then trips the >4 cards rule.
		const fifth = card("2", "hearts", 2, "2-extra");
		expect(validatePlay([...twos, fifth])).toEqual({
			valid: false,
			reason: "game.errors.comboMaxCards",
		});
	});
});

describe("getCompatibleCardIds", () => {
	const hand = [
		card("3", "hearts"),
		card("3", "clubs"),
		card("8", "spades"),
		card("A", "diamonds"),
	];

	it("returns every card id when nothing is selected", () => {
		const ids = getCompatibleCardIds([], hand);
		expect(ids).toEqual(new Set(hand.map((c) => c.id)));
	});

	it("returns only cards that form a valid play with the selection", () => {
		// With a 3 selected, only the other 3 (combo) and the Ace (companion) fit.
		const ids = getCompatibleCardIds([hand[0]], hand);
		expect(ids.has("3-clubs")).toBe(true);
		expect(ids.has("A-diamonds")).toBe(true);
		expect(ids.has("8-spades")).toBe(false);
	});

	it("excludes the already-selected card from the result", () => {
		const ids = getCompatibleCardIds([hand[0]], hand);
		expect(ids.has(hand[0].id)).toBe(false);
	});
});

describe("resolvePlay", () => {
	it("removes played cards from the hand", () => {
		const played = card("5", "hearts");
		const state = gameState({
			castle: [enemy("J", "spades")],
			playerHand: [played, card("9", "clubs")],
		});
		const result = resolvePlay([played], state, 8);
		expect(result.newHand.map((c) => c.id)).toEqual(["9-clubs"]);
	});

	it("plays the Jester: zero damage, cards go to discard, flagged isJester", () => {
		const j = jester();
		const state = gameState({ castle: [enemy("J", "hearts")], playerHand: [j] });
		const result = resolvePlay([j], state, 8);
		expect(result.isJester).toBe(true);
		expect(result.totalDamage).toBe(0);
		expect(result.newDiscardPile).toContainEqual(j);
	});

	it("doubles damage for Clubs", () => {
		const c = card("8", "clubs");
		const state = gameState({ castle: [enemy("J", "hearts")], playerHand: [c] });
		expect(resolvePlay([c], state, 8).totalDamage).toBe(16);
	});

	it("does not double Clubs when the enemy is immune to Clubs", () => {
		const c = card("8", "clubs");
		const state = gameState({ castle: [enemy("J", "clubs")], playerHand: [c] });
		expect(resolvePlay([c], state, 8).totalDamage).toBe(8);
	});

	it("ignores immunity when a Jester is active", () => {
		const c = card("8", "clubs");
		const state = gameState({
			castle: [enemy("J", "clubs")],
			playerHand: [c],
			jesterActive: true,
		});
		expect(resolvePlay([c], state, 8).totalDamage).toBe(16);
	});

	it("accumulates shield for Spades", () => {
		const c = card("7", "spades");
		const state = gameState({
			castle: [enemy("J", "hearts")],
			playerHand: [c],
			spadesShield: 3,
		});
		expect(resolvePlay([c], state, 8).newShield).toBe(10);
	});

	it("draws cards from the tavern for Diamonds, capped by max hand size", () => {
		const c = card("5", "diamonds");
		const tavern = [card("2", "hearts"), card("3", "hearts"), card("4", "hearts")];
		const state = gameState({
			castle: [enemy("J", "hearts")],
			playerHand: [c],
			tavernDeck: tavern,
		});
		// maxHand 2: after playing the 5, hand is empty → can draw up to 2.
		const result = resolvePlay([c], state, 2);
		expect(result.newHand).toHaveLength(2);
		expect(result.newTavernDeck).toHaveLength(1);
	});

	it("moves discard cards to the bottom of the tavern for Hearts", () => {
		const c = card("4", "hearts");
		const discard = [card("2", "clubs"), card("3", "clubs")];
		const state = gameState({
			castle: [enemy("J", "spades")],
			playerHand: [c],
			discardPile: discard,
		});
		const result = resolvePlay([c], state, 8);
		// Up to 4 discard cards returned to the tavern; here both move.
		expect(result.newTavernDeck).toHaveLength(2);
		expect(result.newDiscardPile).toHaveLength(0);
	});
});
