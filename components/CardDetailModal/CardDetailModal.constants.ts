import { Suit } from "@/data/types";

export const CROWN_ICON = require("../assets/icons/crown_white.png");

export const SUIT_COLOR: Record<Suit, string> = {
	hearts: "#F87171",
	diamonds: "#F59E0B",
	clubs: "#4ADE80",
	spades: "#60A5FA",
};

export const SUIT_SYMBOL: Record<Suit, string> = {
	hearts: "♥",
	diamonds: "♦",
	clubs: "♣",
	spades: "♠",
};
