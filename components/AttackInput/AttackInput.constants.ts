import { CardRank, Suit } from "@/data/types";
import ClubsIcon from "@/assets/classes/Clubs.avif";
import DiamondsIcon from "@/assets/classes/Diamonds.avif";
import HeartsIcon from "@/assets/classes/Hearts.avif";
import SpadesIcon from "@/assets/classes/Spades.avif";

import { ImageSourcePropType } from "react-native";
import ClubsIconShadow from "@/assets/classes/suits_no_bg/clubs_shadow.png";
import DiamondsIconShadow from "@/assets/classes/suits_no_bg/diamonds_shadow.png";
import HeartsIconShadow from "@/assets/classes/suits_no_bg/hearts_shadow.png";
import SpadesIconShadow from "@/assets/classes/suits_no_bg/spades_shadow.png";

export const SUITS: {
	suit: Suit;
	icon: ImageSourcePropType;
	immuneIcon: ImageSourcePropType;
}[] = [
	{ suit: "hearts", icon: HeartsIcon, immuneIcon: HeartsIconShadow },
	{ suit: "diamonds", icon: DiamondsIcon, immuneIcon: DiamondsIconShadow },
	{ suit: "clubs", icon: ClubsIcon, immuneIcon: ClubsIconShadow },
	{ suit: "spades", icon: SpadesIcon, immuneIcon: SpadesIconShadow },
];

export const RANKS: CardRank[] = [
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
