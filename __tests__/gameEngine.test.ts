import {
	computeSuitPreview,
	resolveCannotPay,
	resolveEmptyHand,
} from "@/utils/gameEngine";
import { card, enemy, jester } from "./factories";

describe("resolveEmptyHand", () => {
	const tavern = [card("2", "hearts"), card("3", "hearts"), card("4", "hearts")];

	it("spends a Jester to redraw up to maxHand when one is available", () => {
		const r = resolveEmptyHand(2, 0, tavern, [], 2);
		expect(r.phase).toBe("player_turn");
		expect(r.playerHand).toHaveLength(2);
		expect(r.tavernDeck).toHaveLength(1);
		expect(r.jestersAvailable).toBe(1);
		expect(r.jestersUsed).toBe(1);
	});

	it("caps the redraw at the tavern size", () => {
		const r = resolveEmptyHand(1, 0, tavern, [], 8);
		expect(r.playerHand).toHaveLength(3);
		expect(r.tavernDeck).toHaveLength(0);
	});

	it("loses the game when no Jester is available", () => {
		const r = resolveEmptyHand(0, 1, tavern, [], 8);
		expect(r.phase).toBe("defeat");
		expect(r.playerHand).toEqual([]);
		expect(r.jestersUsed).toBe(1);
	});
});

describe("resolveCannotPay", () => {
	const hand = [card("2", "clubs"), card("3", "clubs")];
	const tavern = [card("9", "hearts"), card("10", "hearts")];

	it("discards the whole hand and redraws when a Jester is available", () => {
		const r = resolveCannotPay(hand, tavern, [], 2, 0, 2);
		expect(r.phase).toBe("player_turn");
		expect(r.discardPile).toEqual(hand);
		expect(r.playerHand).toHaveLength(2);
		expect(r.jestersAvailable).toBe(1);
		expect(r.jestersUsed).toBe(1);
	});

	it("loses the game and keeps the hand when no Jester is available", () => {
		const r = resolveCannotPay(hand, tavern, [], 0, 0, 8);
		expect(r.phase).toBe("defeat");
		expect(r.playerHand).toEqual(hand);
		expect(r.discardPile).toEqual([]);
	});
});

describe("computeSuitPreview", () => {
	const target = enemy("J", "hearts"); // immune to Hearts

	it("returns zeros for an empty selection", () => {
		expect(computeSuitPreview([], 0, target, false)).toEqual({
			previewDamage: 0,
			previewShieldGain: 0,
		});
	});

	it("returns zeros when a Jester is part of the selection", () => {
		expect(computeSuitPreview([jester()], 0, target, false)).toEqual({
			previewDamage: 0,
			previewShieldGain: 0,
		});
	});

	it("doubles damage for Clubs", () => {
		const sel = [card("8", "clubs")];
		expect(computeSuitPreview(sel, 8, target, false)).toEqual({
			previewDamage: 16,
			previewShieldGain: 0,
		});
	});

	it("reports shield gain for Spades without changing damage", () => {
		const sel = [card("6", "spades")];
		expect(computeSuitPreview(sel, 6, target, false)).toEqual({
			previewDamage: 6,
			previewShieldGain: 6,
		});
	});

	it("ignores a suit power the enemy is immune to", () => {
		const sel = [card("8", "hearts")]; // enemy immune to hearts
		expect(computeSuitPreview(sel, 8, target, false)).toEqual({
			previewDamage: 8,
			previewShieldGain: 0,
		});
	});

	it("applies the power when a Jester has nullified immunity", () => {
		const clubsEnemy = enemy("J", "clubs");
		const sel = [card("8", "clubs")];
		expect(computeSuitPreview(sel, 8, clubsEnemy, true)).toEqual({
			previewDamage: 16,
			previewShieldGain: 0,
		});
	});
});
