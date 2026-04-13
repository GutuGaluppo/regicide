// /data/images.ts
import { ImageSourcePropType } from "react-native";
import { CardRank, EnemyRank, Suit } from "./types";

const HAND_CARD_IMAGES: Record<string, ImageSourcePropType> = {
	"2-hearts": require("../assets/game/cards/hearts/2_hearts.png"),
	"2-diamonds": require("../assets/game/cards/diamonds/2_diamonds.png"),
	"2-clubs": require("../assets/game/cards/clubs/2_clubs.png"),
	"2-spades": require("../assets/game/cards/spades/2_spades.png"),
	"3-hearts": require("../assets/game/cards/hearts/3_hearts.png"),
	"3-diamonds": require("../assets/game/cards/diamonds/3_diamonds.png"),
	"3-clubs": require("../assets/game/cards/clubs/3_clubs.png"),
	"3-spades": require("../assets/game/cards/spades/3_spades.png"),
	"4-hearts": require("../assets/game/cards/hearts/4_hearts.png"),
	"4-diamonds": require("../assets/game/cards/diamonds/4_diamonds.png"),
	"4-clubs": require("../assets/game/cards/clubs/4_clubs.png"),
	"4-spades": require("../assets/game/cards/spades/4_spades.png"),
	"5-hearts": require("../assets/game/cards/hearts/5_hearts.png"),
	"5-diamonds": require("../assets/game/cards/diamonds/5_diamonds.png"),
	"5-clubs": require("../assets/game/cards/clubs/5_clubs.png"),
	"5-spades": require("../assets/game/cards/spades/5_spades.png"),
	"6-hearts": require("../assets/game/cards/hearts/6_hearts.png"),
	"6-diamonds": require("../assets/game/cards/diamonds/6_diamonds.png"),
	"6-clubs": require("../assets/game/cards/clubs/6_clubs.png"),
	"6-spades": require("../assets/game/cards/spades/6_spades.png"),
	"7-hearts": require("../assets/game/cards/hearts/7_hearts.png"),
	"7-diamonds": require("../assets/game/cards/diamonds/7_diamonds.png"),
	"7-clubs": require("../assets/game/cards/clubs/7_clubs.png"),
	"7-spades": require("../assets/game/cards/spades/7_spades.png"),
	"8-hearts": require("../assets/game/cards/hearts/8_hearts.png"),
	"8-diamonds": require("../assets/game/cards/diamonds/8_diamonds.png"),
	"8-clubs": require("../assets/game/cards/clubs/8_clubs.png"),
	"8-spades": require("../assets/game/cards/spades/8_spades.png"),
	"9-hearts": require("../assets/game/cards/hearts/9_hearts.png"),
	"9-diamonds": require("../assets/game/cards/diamonds/9_diamonds.png"),
	"9-clubs": require("../assets/game/cards/clubs/9_clubs.png"),
	"9-spades": require("../assets/game/cards/spades/9_spades.png"),
	"10-hearts": require("../assets/game/cards/hearts/10_hearts.png"),
	"10-diamonds": require("../assets/game/cards/diamonds/10_diamonds.png"),
	"10-clubs": require("../assets/game/cards/clubs/10_clubs.png"),
	"10-spades": require("../assets/game/cards/spades/10_spades.png"),
	"A-hearts": require("../assets/game/cards/hearts/A_hearts.png"),
	"A-diamonds": require("../assets/game/cards/diamonds/A_diamonds.png"),
	"A-clubs": require("../assets/game/cards/clubs/A_clubs.png"),
	"A-spades": require("../assets/game/cards/spades/A_spades.png"),
	"Jester-1": require("../assets/game/cards/jester_1.png"),
	"Jester-2": require("../assets/game/cards/jester_2.png"),
	"J-hearts": require("../assets/game/cards/hearts/jack_hearts.png"),
	"J-diamonds": require("../assets/game/cards/diamonds/jack_diamonds.png"),
	"J-clubs": require("../assets/game/cards/clubs/jack_clubs.png"),
	"J-spades": require("../assets/game/cards/spades/jack_spades.png"),
	"Q-hearts": require("../assets/game/cards/hearts/queen_hearts.png"),
	"Q-diamonds": require("../assets/game/cards/diamonds/queen_diamonds.png"),
	"Q-clubs": require("../assets/game/cards/clubs/queen_clubs.png"),
	"Q-spades": require("../assets/game/cards/spades/queen_spades.png"),
	"K-hearts": require("../assets/game/cards/hearts/king_hearts.png"),
	"K-diamonds": require("../assets/game/cards/diamonds/king_diamonds.png"),
	"K-clubs": require("../assets/game/cards/clubs/king_clubs.png"),
	"K-spades": require("../assets/game/cards/spades/king_spades.png"),
};

// Jesters are tracked by id to distinguish the two
export const getHandCardImage = (
	rank: CardRank,
	suit: Suit | null,
	cardId?: string,
): ImageSourcePropType | null => {
	if (rank === "Jester") {
		// Use id suffix to alternate between the two jester images
		const n = cardId?.endsWith("2") ? "2" : "1";
		return HAND_CARD_IMAGES[`Jester-${n}`] ?? HAND_CARD_IMAGES["Jester-1"];
	}
	if (!suit) return null;
	return HAND_CARD_IMAGES[`${rank}-${suit}`] ?? null;
};

const CARD_IMAGES: Record<string, ImageSourcePropType> = {
	"J-hearts": require("../assets/cards/outlined/Letholdus_Outlined.png"),
	"J-diamonds": require("../assets/cards/outlined/Kalannar_Outlined.png"),
	"J-clubs": require("../assets/cards/outlined/Tezfur_Outlined.png"),
	"J-spades": require("../assets/cards/outlined/Nobutada_Outlined.png"),
	"Q-hearts": require("../assets/cards/outlined/Catherine_Outlined.png"),
	"Q-diamonds": require("../assets/cards/outlined/Malice_Outlined.png"),
	"Q-clubs": require("../assets/cards/outlined/Hostla_Outlined.png"),
	"Q-spades": require("../assets/cards/outlined/Lilith_Outlined.png"),
	"K-hearts": require("../assets/cards/outlined/Edward_Outlined.png"),
	"K-diamonds": require("../assets/cards/outlined/Tathzaer_Outlined.png"),
	"K-clubs": require("../assets/cards/outlined/Fyrnod_Outlined.png"),
	"K-spades": require("../assets/cards/outlined/Vexx_Outlined.png"),
};

const FOOTER_CARD_IMAGES: Record<string, ImageSourcePropType> = {
	"J-hearts": require("../assets/cards/Letholdus_01.png"),
	"J-diamonds": require("../assets/cards/Kalannar_01.png"),
	"J-clubs": require("../assets/cards/Tezfur_01.png"),
	"J-spades": require("../assets/cards/Nobutada_01.png"),
	"Q-hearts": require("../assets/cards/Catherine_01.png"),
	"Q-diamonds": require("../assets/cards/Malice_01.png"),
	"Q-clubs": require("../assets/cards/Hostla_01.png"),
	"Q-spades": require("../assets/cards/Lilith_01.png"),
	"K-hearts": require("../assets/cards/Edward_Shadow.png"),
	"K-diamonds": require("../assets/cards/Tathzaer_Shadow.png"),
	"K-clubs": require("../assets/cards/Fyrnod_Shadow.png"),
	"K-spades": require("../assets/cards/Vexx_Shadow.png"),
};

export const getCardImage = (
	rank: EnemyRank,
	suit: Suit,
): ImageSourcePropType => {
	return CARD_IMAGES[`${rank}-${suit}`];
};

export const getFooterCardImage = (
	rank: EnemyRank,
	suit: Suit,
): ImageSourcePropType => {
	return FOOTER_CARD_IMAGES[`${rank}-${suit}`];
};
