// /data/images.ts
import { ImageSourcePropType } from "react-native";
import { EnemyRank, Suit } from "./types";

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
