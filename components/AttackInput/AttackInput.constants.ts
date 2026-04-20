import ClubsIcon from "@/assets/classes/Clubs.avif";
import DiamondsIcon from "@/assets/classes/Diamonds.avif";
import HeartsIcon from "@/assets/classes/Hearts.avif";
import SpadesIcon from "@/assets/classes/Spades.avif";
import ClubsIconShadow from "@/assets/classes/clubs_shadow.png";
import DiamondsIconShadow from "@/assets/classes/diamonds_shadow.png";
import HeartsIconShadow from "@/assets/classes/hearts_shadow.png";
import SpadesIconShadow from "@/assets/classes/spades_shadow.png";
import JesterIcon from "@/assets/icons/jasper_circle.png";
import { CardRank, Suit } from "@/data/types";
import { cardValue } from "@/utils/gameLogic";
export const SUITS: {
	suit: Suit;
	icon: number;
	immuneIcon?: number;
}[] = [
	{ suit: "hearts", icon: HeartsIcon, immuneIcon: HeartsIconShadow },
	{ suit: "diamonds", icon: DiamondsIcon, immuneIcon: DiamondsIconShadow },
	{ suit: "clubs", icon: ClubsIcon, immuneIcon: ClubsIconShadow },
	{ suit: "spades", icon: SpadesIcon, immuneIcon: SpadesIconShadow },
	{ suit: "jester", icon: JesterIcon },
];

export type SuitRank = Exclude<CardRank, "Jester">;

export const RANKS: SuitRank[] = [
	"A",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"J",
	"Q",
	"K",
];

export type RegularSuit = Exclude<Suit, "jester">;

export const CHOSEN_CARDS: Record<
	RegularSuit,
	Record<SuitRank, number>
> = {
	clubs: {
		A: require("@/assets/game/cards/clubs/A_clubs.png"),
		"2": require("@/assets/game/cards/clubs/2_clubs.png"),
		"3": require("@/assets/game/cards/clubs/3_clubs.png"),
		"4": require("@/assets/game/cards/clubs/4_clubs.png"),
		"5": require("@/assets/game/cards/clubs/5_clubs.png"),
		"6": require("@/assets/game/cards/clubs/6_clubs.png"),
		"7": require("@/assets/game/cards/clubs/7_clubs.png"),
		"8": require("@/assets/game/cards/clubs/8_clubs.png"),
		"9": require("@/assets/game/cards/clubs/9_clubs.png"),
		"10": require("@/assets/game/cards/clubs/10_clubs.png"),
		J: require("@/assets/game/cards/clubs/jack_clubs.png"),
		Q: require("@/assets/game/cards/clubs/queen_clubs.png"),
		K: require("@/assets/game/cards/clubs/king_clubs.png"),
	},
	diamonds: {
		A: require("@/assets/game/cards/diamonds/A_diamonds.png"),
		"2": require("@/assets/game/cards/diamonds/2_diamonds.png"),
		"3": require("@/assets/game/cards/diamonds/3_diamonds.png"),
		"4": require("@/assets/game/cards/diamonds/4_diamonds.png"),
		"5": require("@/assets/game/cards/diamonds/5_diamonds.png"),
		"6": require("@/assets/game/cards/diamonds/6_diamonds.png"),
		"7": require("@/assets/game/cards/diamonds/7_diamonds.png"),
		"8": require("@/assets/game/cards/diamonds/8_diamonds.png"),
		"9": require("@/assets/game/cards/diamonds/9_diamonds.png"),
		"10": require("@/assets/game/cards/diamonds/10_diamonds.png"),
		J: require("@/assets/game/cards/diamonds/jack_diamonds.png"),
		Q: require("@/assets/game/cards/diamonds/queen_diamonds.png"),
		K: require("@/assets/game/cards/diamonds/king_diamonds.png"),
	},
	hearts: {
		A: require("@/assets/game/cards/hearts/A_hearts.png"),
		"2": require("@/assets/game/cards/hearts/2_hearts.png"),
		"3": require("@/assets/game/cards/hearts/3_hearts.png"),
		"4": require("@/assets/game/cards/hearts/4_hearts.png"),
		"5": require("@/assets/game/cards/hearts/5_hearts.png"),
		"6": require("@/assets/game/cards/hearts/6_hearts.png"),
		"7": require("@/assets/game/cards/hearts/7_hearts.png"),
		"8": require("@/assets/game/cards/hearts/8_hearts.png"),
		"9": require("@/assets/game/cards/hearts/9_hearts.png"),
		"10": require("@/assets/game/cards/hearts/10_hearts.png"),
		J: require("@/assets/game/cards/hearts/jack_hearts.png"),
		Q: require("@/assets/game/cards/hearts/queen_hearts.png"),
		K: require("@/assets/game/cards/hearts/king_hearts.png"),
	},
	spades: {
		A: require("@/assets/game/cards/spades/A_spades.png"),
		"2": require("@/assets/game/cards/spades/2_spades.png"),
		"3": require("@/assets/game/cards/spades/3_spades.png"),
		"4": require("@/assets/game/cards/spades/4_spades.png"),
		"5": require("@/assets/game/cards/spades/5_spades.png"),
		"6": require("@/assets/game/cards/spades/6_spades.png"),
		"7": require("@/assets/game/cards/spades/7_spades.png"),
		"8": require("@/assets/game/cards/spades/8_spades.png"),
		"9": require("@/assets/game/cards/spades/9_spades.png"),
		"10": require("@/assets/game/cards/spades/10_spades.png"),
		J: require("@/assets/game/cards/spades/jack_spades.png"),
		Q: require("@/assets/game/cards/spades/queen_spades.png"),
		K: require("@/assets/game/cards/spades/king_spades.png"),
	},
};

export const JESTER_CARDS: { image: number }[] = [
	{ image: require("@/assets/game/cards/jester_1.png") },
	{ image: require("@/assets/game/cards/jester_2.png") },
];

export function getCardsForSuit(
	suit: RegularSuit,
): { rank: SuitRank; image: number }[] {
	return RANKS.map((rank) => ({ rank, image: CHOSEN_CARDS[suit][rank] }));
}

export type CardSelectionInfo = {
	suit: Suit;
	rank: SuitRank | "Jester";
	damage: number;
	shieldAdded: number;
	powerPreview: string;
	immune: boolean;
};

// Playable non-jester ranks (player hand cards)
const PLAYER_RANKS: SuitRank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
export const REGULAR_SUITS: RegularSuit[] = ["hearts", "diamonds", "clubs", "spades"];

export type ComboOption = {
	suit: RegularSuit;
	rank: SuitRank;
	image: number;
};

/**
 * Returns true if `candidateRank` can be added to `[mainRank, ...alreadyComboRanks]`
 * to form a valid combo per rulebook page 7.
 *
 * Rules:
 * - Ace (Animal Companion) pairs with exactly 1 other card (can be another Ace).
 * - Same-rank combos: 2–4 cards of identical rank, total value ≤ 10. No Aces allowed.
 */
function isValidComboAddition(
	mainRank: SuitRank,
	alreadyComboRanks: SuitRank[],
	candidateRank: SuitRank,
): boolean {
	const allRanks = [mainRank, ...alreadyComboRanks, candidateRank];
	const aces = allRanks.filter((r) => r === "A");
	const nonAces = allRanks.filter((r) => r !== "A");

	if (aces.length >= 1) {
		// Ace pairing: Ace + 1 card, or Ace + Ace
		if (aces.length === 1 && nonAces.length === 1) return true;
		if (aces.length === 2 && nonAces.length === 0) return true;
		return false;
	}

	// Same-rank combination
	const rankSet = new Set(allRanks);
	if (rankSet.size !== 1) return false;
	const total = allRanks.reduce((sum, r) => sum + cardValue(r), 0);
	return total <= 10 && allRanks.length <= 4;
}

/**
 * Returns cards that can still be added to the current selection to form a valid combo.
 * Already-selected cards are excluded from the result.
 */
export function getComboOptions(
	mainSuit: RegularSuit,
	mainRank: SuitRank,
	comboCards: Array<{ suit: RegularSuit; rank: SuitRank }>,
): ComboOption[] {
	const alreadySelected = new Set([
		`${mainSuit}-${mainRank}`,
		...comboCards.map((c) => `${c.suit}-${c.rank}`),
	]);
	const comboRanks = comboCards.map((c) => c.rank);
	const result: ComboOption[] = [];

	for (const suit of REGULAR_SUITS) {
		for (const rank of PLAYER_RANKS) {
			if (alreadySelected.has(`${suit}-${rank}`)) continue;
			if (isValidComboAddition(mainRank, comboRanks, rank)) {
				result.push({ suit, rank, image: CHOSEN_CARDS[suit][rank] });
			}
		}
	}

	return result;
}
