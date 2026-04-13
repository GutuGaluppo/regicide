// /components/PlayerHand.tsx
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, GamePhase, Suit } from "../data/types";
import { CardView } from "./CardView";

export const PlayerHand = ({
	hand,
	selectedIds,
	phase,
	immuneSuit,
	onCardPress,
}: {
	hand: Card[];
	selectedIds: Set<string>;
	phase: GamePhase;
	immuneSuit?: Suit | null;
	onCardPress: (card: Card) => void;
}) => {
	const interactive = phase === "player_turn" || phase === "suffer_damage";

	return (
		<View style={styles.container}>
			<Text style={styles.label}>
				{phase === "suffer_damage"
					? "Selecione cartas para descartar"
					: `Mão (${hand.length})`}
			</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scroll}
			>
				{hand.map((card) => (
					<CardView
						key={card.id}
						card={card}
						selected={selectedIds.has(card.id)}
						onPress={() => onCardPress(card)}
						disabled={!interactive}
						immuneSuit={immuneSuit}
					/>
				))}
				{hand.length === 0 && <Text style={styles.empty}>Mão vazia</Text>}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
	},
	label: {
		color: "#94A3B8",
		fontSize: 14,
		textAlign: "center",
		marginBottom: 6,
	},
	scroll: {
		paddingHorizontal: 12,
		paddingTop: 14,
		alignItems: "flex-end",
	},
	empty: {
		color: "#64748B",
		fontStyle: "italic",
		paddingHorizontal: 16,
		alignSelf: "center",
	},
});
