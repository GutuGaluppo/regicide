// /components/CardView.tsx
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SpellIcon from "../assets/icons/spellImmune_shadow.png";
import { getHandCardImage } from "../data/images";
import { Card, Suit } from "../data/types";

const SUIT_SYMBOL: Record<string, string> = {
	hearts: "♥",
	diamonds: "♦",
	clubs: "♣",
	spades: "♠",
};

const SUIT_COLOR: Record<string, string> = {
	hearts: "#DC2626",
	diamonds: "#DC2626",
	clubs: "#1E293B",
	spades: "#1E293B",
};

export const CardView = ({
	card,
	selected,
	onPress,
	disabled,
	immuneSuit,
}: {
	card: Card;
	selected?: boolean;
	onPress?: () => void;
	disabled?: boolean;
	immuneSuit?: Suit | null;
}) => {
	const isImmune = !!card.suit && card.suit === immuneSuit;
	const cardImage = getHandCardImage(card.rank, card.suit, card.id);

	return (
		<View style={styles.wrapper}>
			<TouchableOpacity
				style={[
					styles.card,
					selected && styles.selected,
					disabled && styles.disabled,
					isImmune && styles.cardImmune,
				]}
				onPress={onPress}
				activeOpacity={0.7}
				disabled={disabled}
			>
				{cardImage ? (
					<Image
						source={cardImage}
						style={styles.cardImage}
						resizeMode="cover"
					/>
				) : (
					<>
						<Text
							style={[
								styles.rank,
								{ color: card.suit ? SUIT_COLOR[card.suit] : "#7C3AED" },
							]}
						>
							{card.rank}
						</Text>
						<Text
							style={[
								styles.suit,
								{ color: card.suit ? SUIT_COLOR[card.suit] : "#7C3AED" },
							]}
						>
							{card.suit ? SUIT_SYMBOL[card.suit] : "🃏"}
						</Text>
					</>
				)}
				{selected && <View style={styles.selectedDot} />}
			</TouchableOpacity>
			{isImmune && <Image source={SpellIcon} style={styles.immuneIcon} />}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		position: "relative",
		marginHorizontal: 4,
	},
	card: {
		width: 64,
		height: 92,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "transparent",
		overflow: "hidden",
		backgroundColor: "#F8FAFC",
	},
	cardImage: {
		width: "100%",
		height: "100%",
	},
	cardImmune: {
		borderColor: "#EF4444",
	},
	selected: {
		borderColor: "#FBBF24",
		transform: [{ translateY: -10 }],
	},
	disabled: {
		opacity: 0.4,
	},
	rank: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
	suit: {
		fontSize: 22,
		marginTop: 2,
		textAlign: "center",
	},
	selectedDot: {
		position: "absolute",
		bottom: 4,
		alignSelf: "center",
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#FBBF24",
	},
	immuneIcon: {
		position: "absolute",
		top: -2,
		right: -2,
		width: 26,
		height: 26,
	},
});
