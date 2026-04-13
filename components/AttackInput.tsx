import React, { useState } from "react";
import {
	Image,
	ImageSourcePropType,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import ClubsIcon from "../assets/classes/Clubs.avif";
import DiamondsIcon from "../assets/classes/Diamonds.avif";
import HeartsIcon from "../assets/classes/Hearts.avif";
import SpadesIcon from "../assets/classes/Spades.avif";

import ClubsIconShadow from "../assets/classes/suits_no_bg/clubs_shadow.png";
import DiamondsIconShadow from "../assets/classes/suits_no_bg/diamonds_shadow.png";
import HeartsIconShadow from "../assets/classes/suits_no_bg/hearts_shadow.png";
import SpadesIconShadow from "../assets/classes/suits_no_bg/spades_shadow.png";
import SpellImmune from "../assets/icons/spellImmune.png";

import { CardRank, Enemy, Suit } from "../data/types";
import { cardValue } from "../utils/gameLogic";

const SUITS: {
	suit: Suit;
	icon: ImageSourcePropType;
	immuneIcon: ImageSourcePropType;
}[] = [
	{ suit: "hearts", icon: HeartsIcon, immuneIcon: HeartsIconShadow },
	{ suit: "diamonds", icon: DiamondsIcon, immuneIcon: DiamondsIconShadow },
	{ suit: "clubs", icon: ClubsIcon, immuneIcon: ClubsIconShadow },
	{ suit: "spades", icon: SpadesIcon, immuneIcon: SpadesIconShadow },
];

const RANKS: CardRank[] = [
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

export const AttackInput = ({
	enemy,
	onApply,
}: {
	enemy: Enemy;
	onApply: (suit: Suit, rank: CardRank) => void;
}) => {
	const [suit, setSuit] = useState<Suit | null>(null);
	const [rank, setRank] = useState<CardRank | null>(null);

	const value = rank ? cardValue(rank) : 0;
	const immune = suit === enemy.suit;
	const damage = value * (!immune && suit === "clubs" ? 2 : 1);

	const powerPreview =
		suit && rank
			? immune
				? `Imunidade: poder de ${suit} não se aplica`
				: suit === "hearts"
					? `♥ Curar ${value} carta(s) do descarte`
					: suit === "diamonds"
						? `♦ Comprar ${value} carta(s)`
						: suit === "clubs"
							? `♣ Dano dobrado → ${damage}`
							: `♠ Escudo +${value}`
			: null;

	const canApply = suit !== null && rank !== null;

	const handleApply = () => {
		if (!suit || !rank) return;
		onApply(suit, rank);
		setSuit(null);
		setRank(null);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Carta jogada</Text>

			{/* Seleção de naipe */}
			<View style={styles.suitRow}>
				{SUITS.map(({ suit: s, icon, immuneIcon }) => {
					const isImmune = s === enemy.suit;
					return (
						<View key={s} style={styles.suitWrapper}>
							{isImmune && (
								<Image source={SpellImmune} style={styles.immuneIcon} />
							)}
							<TouchableOpacity
								style={[styles.suitBtn, suit === s && styles.suitBtnSelected]}
								onPress={() => setSuit((prev) => (prev === s ? null : s))}
								activeOpacity={0.7}
							>
								<Image
									style={styles.suitIcon}
									source={isImmune ? immuneIcon : icon}
									resizeMode="contain"
								/>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>

			{/* Seleção de rank */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.rankRow}
			>
				{RANKS.map((r) => (
					<TouchableOpacity
						key={r}
						style={[styles.rankBtn, rank === r && styles.rankSelected]}
						onPress={() => setRank((prev) => (prev === r ? null : r))}
						activeOpacity={0.7}
					>
						<Text
							style={[styles.rankText, rank === r && styles.rankTextSelected]}
						>
							{r}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>

			{/* Preview */}
			{powerPreview && (
				<View style={[styles.preview, immune && styles.previewImmune]}>
					<Text style={styles.previewDamage}>Dano: {damage}</Text>
					<Text style={styles.previewPower}>{powerPreview}</Text>
				</View>
			)}

			{/* Botão aplicar */}
			<TouchableOpacity
				style={[styles.applyBtn, !canApply && styles.applyDisabled]}
				onPress={handleApply}
				disabled={!canApply}
				activeOpacity={0.8}
			>
				<Text style={styles.applyText}>Aplicar ataque</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "rgba(15,23,42,0.6)",
		borderRadius: 12,
		marginHorizontal: 12,
	},
	label: {
		color: "#94A3B8",
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	suitRow: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
	},
	suitBtn: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	suitWrapper: {
		position: "relative",
	},
	immuneIcon: {
		position: "absolute",
		top: -14,
		left: -14,
		width: 86,
		height: 86,
	},
	suitBtnSelected: {
		borderColor: "#FBBF24",
	},
	suitIcon: {
		width: 60,
		height: 60,
	},
	suitSymbol: {
		fontSize: 26,
	},
	rankRow: {
		gap: 8,
		paddingVertical: 4,
	},
	rankBtn: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: "rgba(51,65,85,0.8)",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#334155",
	},
	rankSelected: {
		backgroundColor: "#FBBF24",
		borderColor: "#FBBF24",
	},
	rankText: {
		color: "#CBD5E1",
		fontWeight: "600",
		fontSize: 13,
	},
	rankTextSelected: {
		color: "#0F172A",
	},
	preview: {
		backgroundColor: "rgba(30,41,59,0.8)",
		borderRadius: 8,
		padding: 10,
		gap: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
	},
	previewImmune: {
		borderLeftColor: "#EF4444",
	},
	previewDamage: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 16,
	},
	previewPower: {
		color: "#94A3B8",
		fontSize: 13,
	},
	applyBtn: {
		backgroundColor: "#67826E",
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
	},
	applyDisabled: {
		opacity: 0.35,
	},
	applyText: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 15,
	},
});
