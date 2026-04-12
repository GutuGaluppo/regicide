// /components/EnemyCard.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getCardImage } from "../data/images";
import { Enemy } from "../data/types";

const SUIT_SYMBOL: Record<string, string> = {
	hearts: "♥",
	diamonds: "♦",
	clubs: "♣",
	spades: "♠",
};

export const EnemyCard = ({
	enemy,
	currentHP,
	effectiveAttack,
	jesterActive,
}: {
	enemy: Enemy;
	currentHP: number;
	effectiveAttack: number;
	jesterActive: boolean;
}) => {
	const hpPercent = Math.max(0, currentHP / enemy.health);

	const hpColor =
		hpPercent > 0.5 ? "#22C55E" : hpPercent > 0.25 ? "#FBBF24" : "#EF4444";

	return (
		<View style={styles.card}>
			<Image
				source={getCardImage(enemy.rank, enemy.suit)}
				style={styles.image}
			/>

			{/* Barra de HP */}
			<View style={styles.hpBarBg}>
				<View
					style={[
						styles.hpBarFill,
						{ width: `${hpPercent * 100}%` as any, backgroundColor: hpColor },
					]}
				/>
			</View>

			<View style={styles.stats}>
				<Text style={styles.hp}>
					❤️ {currentHP}/{enemy.health}
				</Text>
				<Text style={styles.attack}>
					⚔️ {effectiveAttack}
					{effectiveAttack < enemy.attack && (
						<Text style={styles.shielded}> ({enemy.attack})</Text>
					)}
				</Text>
				<Text style={styles.immunity}>
					{jesterActive
						? "⚡ Imunidade cancelada"
						: `🛡️ Imune a ${SUIT_SYMBOL[enemy.suit]}`}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
	},
	image: {
		width: 250,
		height: 392,
		borderRadius: 12,
		marginBottom: 8,
	},
	hpBarBg: {
		width: 180,
		height: 6,
		backgroundColor: "#1E293B",
		borderRadius: 3,
		marginBottom: 8,
		overflow: "hidden",
	},
	hpBarFill: {
		height: "100%",
		borderRadius: 3,
	},
	stats: {
		flexDirection: "row",
		gap: 12,
		alignItems: "center",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	hp: {
		color: "#F87171",
		fontSize: 16,
		fontWeight: "600",
	},
	attack: {
		color: "#FBBF24",
		fontSize: 16,
		fontWeight: "600",
	},
	shielded: {
		color: "#64748B",
		fontSize: 12,
		textDecorationLine: "line-through",
	},
	immunity: {
		color: "#94A3B8",
		fontSize: 12,
	},
});
