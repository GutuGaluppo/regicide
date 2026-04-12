// /components/CardView.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../data/types";

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
}: {
	card: Card;
	selected?: boolean;
	onPress?: () => void;
	disabled?: boolean;
}) => {
	const symbol = card.suit ? SUIT_SYMBOL[card.suit] : "🃏";
	const color = card.suit ? SUIT_COLOR[card.suit] : "#7C3AED";

	return (
		<TouchableOpacity
			style={[styles.card, selected && styles.selected, disabled && styles.disabled]}
			onPress={onPress}
			activeOpacity={0.7}
			disabled={disabled}
		>
			<Text style={[styles.rank, { color }]}>{card.rank}</Text>
			<Text style={[styles.suit, { color }]}>{symbol}</Text>
			{selected && <View style={styles.selectedDot} />}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		width: 64,
		height: 92,
		backgroundColor: "#F8FAFC",
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "#CBD5E1",
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 4,
	},
	selected: {
		borderColor: "#FBBF24",
		backgroundColor: "#FFFBEB",
		transform: [{ translateY: -10 }],
	},
	disabled: {
		opacity: 0.4,
	},
	rank: {
		fontSize: 18,
		fontWeight: "bold",
	},
	suit: {
		fontSize: 22,
		marginTop: 2,
	},
	selectedDot: {
		position: "absolute",
		bottom: 4,
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#FBBF24",
	},
});
