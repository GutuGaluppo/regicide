import { Card, Enemy, GameState, Suit } from "../data/types";
import { shuffle } from "./shuffle";

export const cardValue = (rank: string): number => {
	if (rank === "A") return 1;
	if (rank === "J") return 10;
	if (rank === "Q") return 15;
	if (rank === "K") return 20;
	return parseInt(rank, 10);
};

export const enemyToCard = (enemy: Enemy): Card => ({
	id: `defeated-${enemy.id}`,
	rank: enemy.rank,
	suit: enemy.suit,
	value: enemy.rank === "J" ? 10 : enemy.rank === "Q" ? 15 : 20,
});

// ─── Validação ────────────────────────────────────────────────────────────────

export type ValidationResult =
	| { valid: true }
	| { valid: false; reason: string };

export const validatePlay = (cards: Card[]): ValidationResult => {
	if (cards.length === 0)
		return { valid: false, reason: "Selecione pelo menos uma carta" };

	if (cards.length === 1) return { valid: true };

	// Jester sempre sozinho
	if (cards.some((c) => c.rank === "Jester"))
		return { valid: false, reason: "Jester deve ser jogado sozinho" };

	const aces = cards.filter((c) => c.rank === "A");
	const nonAces = cards.filter((c) => c.rank !== "A");

	// Companheiro Animal + uma carta (ou dois Companheiros)
	if (aces.length >= 1) {
		if (aces.length === 1 && nonAces.length === 1) return { valid: true };
		if (aces.length === 2 && nonAces.length === 0) return { valid: true };
		return {
			valid: false,
			reason: "Companheiro Animal só pode ser combinado com uma carta",
		};
	}

	// Combo: 2–4 cartas do mesmo número, total ≤ 10
	const ranks = new Set(cards.map((c) => c.rank));
	if (ranks.size !== 1)
		return { valid: false, reason: "Combo deve usar cartas do mesmo número" };

	const total = cards.reduce((sum, c) => sum + c.value, 0);
	if (total > 10)
		return { valid: false, reason: "Total do combo não pode ultrapassar 10" };

	if (cards.length > 4)
		return { valid: false, reason: "Máximo de 4 cartas no combo" };

	return { valid: true };
};

/**
 * Returns the IDs of hand cards that can still be added to `selected`
 * to form a valid play. Already-selected cards are excluded from the result
 * (the caller is responsible for not dimming them).
 * Returns all IDs when nothing is selected (no dimming state).
 */
export const getCompatibleCardIds = (
	selected: Card[],
	hand: Card[],
): Set<string> => {
	if (selected.length === 0) return new Set(hand.map((c) => c.id));

	const compatible = new Set<string>();
	const unselected = hand.filter((c) => !selected.some((s) => s.id === c.id));

	for (const candidate of unselected) {
		if (validatePlay([...selected, candidate]).valid) {
			compatible.add(candidate.id);
		}
	}

	return compatible;
};

// ─── Resolução de jogada ──────────────────────────────────────────────────────

export interface PlayResult {
	newHand: Card[];
	newTavernDeck: Card[];
	newDiscardPile: Card[];
	newShield: number;
	totalDamage: number;
	isJester: boolean;
}

export const resolvePlay = (
	cards: Card[],
	state: GameState,
	maxHandSize: number
): PlayResult => {
	const enemy = state.castle[0];
	const isJester = cards.length === 1 && cards[0].rank === "Jester";

	const newHand = state.playerHand.filter(
		(c) => !cards.find((s) => s.id === c.id)
	);
	let newTavern = [...state.tavernDeck];
	let newDiscard = [...state.discardPile];
	const newShield = state.spadesShield;

	// Jester: cancela imunidade, pula passos 3 e 4
	if (isJester) {
		return {
			newHand,
			newTavernDeck: newTavern,
			newDiscardPile: [...newDiscard, ...cards],
			newShield,
			totalDamage: 0,
			isJester: true,
		};
	}

	const attackValue = cards.reduce((sum, c) => sum + c.value, 0);

	// Naipes únicos jogados
	const suitsPlayed = new Set(
		cards.map((c) => c.suit).filter((s): s is Suit => s !== null)
	);

	const isImmune = (suit: Suit) => !state.jesterActive && enemy.suit === suit;

	let clubsMultiplier = 1;
	let heartsValue = 0;
	let diamondsValue = 0;
	let spadesValue = 0;

	for (const suit of suitsPlayed) {
		if (isImmune(suit)) continue;
		switch (suit) {
			case "hearts":   heartsValue = attackValue; break;
			case "diamonds": diamondsValue = attackValue; break;
			case "clubs":    clubsMultiplier = 2; break;
			case "spades":   spadesValue = attackValue; break;
		}
	}

	// Copas: embaralha descarte, pega X cartas, coloca no fundo da taverna
	if (heartsValue > 0 && newDiscard.length > 0) {
		const shuffled = shuffle([...newDiscard]);
		const toHeal = shuffled.splice(0, heartsValue);
		newTavern = [...newTavern, ...toHeal];
		newDiscard = shuffled;
	}

	// Ouros: compra X cartas para a mão
	let handAfterDraw = [...newHand];
	if (diamondsValue > 0 && newTavern.length > 0) {
		const canDraw = Math.min(
			diamondsValue,
			newTavern.length,
			maxHandSize - handAfterDraw.length
		);
		if (canDraw > 0) {
			handAfterDraw = [...handAfterDraw, ...newTavern.slice(0, canDraw)];
			newTavern = newTavern.slice(canDraw);
		}
	}

	return {
		newHand: handAfterDraw,
		newTavernDeck: newTavern,
		newDiscardPile: newDiscard,
		newShield: state.spadesShield + spadesValue,
		totalDamage: attackValue * clubsMultiplier,
		isJester: false,
	};
};
