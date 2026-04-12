// /data/images.ts
import { ImageSourcePropType } from "react-native";
import { EnemyRank, Suit } from "./types";

const CARD_IMAGES: Record<string, ImageSourcePropType> = {
	"J-hearts":   require("../assets/cards/Letholdus_Outlined.png"),
	"J-diamonds": require("../assets/cards/Kalannar_Outlined.png"),
	"J-clubs":    require("../assets/cards/Tezfur_Outlined.png"),
	"J-spades":   require("../assets/cards/Nobutada_Outlined.png"),
	"Q-hearts":   require("../assets/cards/Catherine_Outlined.png"),
	"Q-diamonds": require("../assets/cards/Malice_Outlined.png"),
	"Q-clubs":    require("../assets/cards/Hostla_Outlined.png"),
	"Q-spades":   require("../assets/cards/Lilith_Outlined.png"),
	"K-hearts":   require("../assets/cards/Edward_Outlined.png"),
	"K-diamonds": require("../assets/cards/Tathzaer_Outlined.png"),
	"K-clubs":    require("../assets/cards/Fyrnod_Outlined.png"),
	"K-spades":   require("../assets/cards/Vexx_Outlined.png"),
};

export const getCardImage = (rank: EnemyRank, suit: Suit): ImageSourcePropType => {
	return CARD_IMAGES[`${rank}-${suit}`];
};
