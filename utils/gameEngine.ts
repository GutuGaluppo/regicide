import { Card, Enemy, GamePhase, GameState, Suit } from "@/data/types";

/**
 * Pure turn-resolution helpers shared between the single-player (`gameStore`)
 * and multiplayer (`multiplayerStore`) stores.
 *
 * These functions are deterministic and side-effect free — they take the
 * relevant slices of game state and return the resulting slices, leaving
 * orchestration (animations, persistence, network sync) to each store.
 */

// ─── Resolução de mão / pagamento ──────────────────────────────────────────────

export type JesterResolution = Pick<
	GameState,
	"playerHand" | "tavernDeck" | "discardPile" | "jestersAvailable" | "jestersUsed" | "phase"
>;

/**
 * Resolves an empty hand: if a Jester is available, the player auto-discards
 * nothing and redraws up to `maxHand`; otherwise the game is lost.
 */
export const resolveEmptyHand = (
	jestersAvailable: number,
	jestersUsed: number,
	tavernDeck: Card[],
	discardPile: Card[],
	maxHand: number,
): JesterResolution => {
	if (jestersAvailable > 0) {
		const canDraw = Math.min(maxHand, tavernDeck.length);
		return {
			playerHand: tavernDeck.slice(0, canDraw),
			tavernDeck: tavernDeck.slice(canDraw),
			discardPile,
			jestersAvailable: jestersAvailable - 1,
			jestersUsed: jestersUsed + 1,
			phase: "player_turn",
		};
	}
	return {
		playerHand: [],
		tavernDeck,
		discardPile,
		jestersAvailable: 0,
		jestersUsed,
		phase: "defeat",
	};
};

/**
 * Resolves the case where the player cannot pay the incoming damage: if a
 * Jester is available, the whole hand is discarded and refilled up to
 * `maxHand`; otherwise the game is lost.
 */
export const resolveCannotPay = (
	hand: Card[],
	tavernDeck: Card[],
	discardPile: Card[],
	jestersAvailable: number,
	jestersUsed: number,
	maxHand: number,
): JesterResolution => {
	if (jestersAvailable > 0) {
		const newDiscard = [...discardPile, ...hand];
		const canDraw = Math.min(maxHand, tavernDeck.length);
		return {
			playerHand: tavernDeck.slice(0, canDraw),
			tavernDeck: tavernDeck.slice(canDraw),
			discardPile: newDiscard,
			jestersAvailable: jestersAvailable - 1,
			jestersUsed: jestersUsed + 1,
			phase: "player_turn",
		};
	}
	return {
		playerHand: hand,
		tavernDeck,
		discardPile,
		jestersAvailable: 0,
		jestersUsed,
		phase: "defeat",
	};
};

// ─── Preview de poderes de naipe ────────────────────────────────────────────────

export interface SuitPreview {
	previewDamage: number;
	previewShieldGain: number;
}

/**
 * Computes the damage and shield preview for a tentative selection during the
 * player's turn. Clubs double the damage; Spades accumulate shield. A suit the
 * enemy is immune to grants no power (unless a Jester has nullified immunity).
 * Returns zeros when a Jester is selected or nothing is selected.
 */
export const computeSuitPreview = (
	selectedCards: Card[],
	selectedTotal: number,
	enemy: Enemy,
	jesterActive: boolean,
): SuitPreview => {
	if (selectedCards.length === 0) return { previewDamage: 0, previewShieldGain: 0 };
	if (selectedCards.some((c) => c.rank === "Jester"))
		return { previewDamage: 0, previewShieldGain: 0 };

	const suitsPlayed = new Set(
		selectedCards.map((c) => c.suit).filter((s): s is Suit => s !== null),
	);
	const isImmune = (s: Suit) => !jesterActive && enemy.suit === s;

	let clubsMultiplier = 1;
	let previewShieldGain = 0;
	for (const s of suitsPlayed) {
		if (isImmune(s)) continue;
		if (s === "clubs") clubsMultiplier = 2;
		if (s === "spades") previewShieldGain = selectedTotal;
	}

	return { previewDamage: selectedTotal * clubsMultiplier, previewShieldGain };
};

// Re-export for callers that need the phase union alongside the resolutions.
export type { GamePhase };
