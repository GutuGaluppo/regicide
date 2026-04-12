// /components/EnemyCard.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getCardImage } from "../data/images";
import { Enemy } from "../data/types";

export const EnemyCard = ({ enemy }: { enemy: Enemy }) => {
	return (
		<View style={styles.card}>
			<Image
				source={{ uri: getCardImage(enemy.rank, enemy.suit) }}
				style={styles.image}
			/>

			<View style={styles.stats}>
				<Text style={styles.health}>❤️ {enemy.health}</Text>
				<Text style={styles.attack}>⚔️ {enemy.attack}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
	},
	image: {
		width: 200,
		height: 280,
		borderRadius: 12,
		marginBottom: 12,
	},
	stats: {
		flexDirection: "row",
		gap: 16,
	},
	health: {
		color: "#DC2626",
		fontSize: 20,
	},
	attack: {
		color: "#FBBF24",
		fontSize: 20,
	},
});
