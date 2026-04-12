// /screens/GameScreen.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionBar } from "../components/ActionBar";
import { CastleFooter } from "../components/CastleFooter";
import { EnemyCard } from "../components/EnemyCard";
import { useGame } from "../hooks/useGame";

export const GameScreen = () => {
	const { currentEnemy, castle, defeatEnemy, resetGame } = useGame();

	return (
		<View style={styles.container}>
			<View style={styles.center}>
				{currentEnemy ? (
					<EnemyCard enemy={currentEnemy} />
				) : (
					<Text style={styles.victory}>🏆 Vitória!</Text>
				)}
			</View>

			<ActionBar onDefeat={defeatEnemy} onReset={resetGame} hasEnemy={!!currentEnemy} />
			<CastleFooter count={castle.length} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
		justifyContent: "space-between",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	victory: {
		color: "#22C55E",
		fontSize: 28,
	},
});
