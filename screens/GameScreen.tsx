// /screens/GameScreen.tsx
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { ActionBar } from "../components/ActionBar";
import { CastleFooter } from "../components/CastleFooter";
import { EnemyCard } from "../components/EnemyCard";
import { PlayerHand } from "../components/PlayerHand";
import { useGame } from "../hooks/useGame";

export const GameScreen = () => {
	const {
		gameState,
		selectedIds,
		playError,
		currentEnemy,
		currentHP,
		effectiveAttack,
		selectedTotal,
		toggleCard,
		playSelected,
		yieldTurn,
		confirmDiscard,
		resetGame,
	} = useGame();

	const { phase, spadesShield, tavernDeck, discardPile, pendingDamage, jesterActive } = gameState;

	return (
		<ImageBackground
			source={require("../assets/images/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
		>
			<View style={styles.overlay}>

				{/* Status superior */}
				<View style={styles.statusBar}>
					<Text style={styles.statusText}>🏰 {gameState.castle.length}</Text>
					<Text style={styles.statusText}>🃏 {tavernDeck.length}</Text>
					<Text style={styles.statusText}>🗑️ {discardPile.length}</Text>
					{spadesShield > 0 && (
						<Text style={styles.statusText}>🛡️ -{spadesShield}</Text>
					)}
				</View>

				{/* Centro: inimigo ou mensagem final */}
				<View style={styles.center}>
					{phase === "victory" && (
						<Text style={styles.endText}>🏆 Vitória!</Text>
					)}
					{phase === "defeat" && (
						<Text style={[styles.endText, styles.defeatText]}>💀 Derrota</Text>
					)}
					{(phase === "player_turn" || phase === "suffer_damage") && currentEnemy && (
						<EnemyCard
							enemy={currentEnemy}
							currentHP={currentHP}
							effectiveAttack={effectiveAttack}
							jesterActive={jesterActive}
						/>
					)}
				</View>

				{/* Fase: sofrer dano */}
				{phase === "suffer_damage" && (
					<View style={styles.phaseBar}>
						<Text style={styles.phaseText}>
							⚠️ Sofra {pendingDamage} de dano — descarte cartas suficientes
						</Text>
					</View>
				)}

				{/* Erro de jogada */}
				{playError && (
					<Text style={styles.error}>{playError}</Text>
				)}

				{/* Mão do jogador */}
				{(phase === "player_turn" || phase === "suffer_damage") && (
					<PlayerHand
						hand={gameState.playerHand}
						selectedIds={selectedIds}
						phase={phase}
						onCardPress={toggleCard}
					/>
				)}

				{/* Botões de ação */}
				<ActionBar
					phase={phase}
					selectedTotal={selectedTotal}
					pendingDamage={pendingDamage}
					onPlay={playSelected}
					onYield={yieldTurn}
					onDiscard={confirmDiscard}
					onReset={resetGame}
					playDisabled={selectedIds.size === 0}
				/>

				<CastleFooter count={gameState.castle.length} />
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.55)",
		justifyContent: "space-between",
	},
	statusBar: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 16,
		paddingTop: 52,
		paddingHorizontal: 16,
	},
	statusText: {
		color: "#CBD5E1",
		fontSize: 13,
		fontWeight: "600",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	endText: {
		color: "#22C55E",
		fontSize: 32,
		fontWeight: "bold",
	},
	defeatText: {
		color: "#EF4444",
	},
	phaseBar: {
		backgroundColor: "rgba(239,68,68,0.2)",
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginHorizontal: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#EF4444",
		marginBottom: 4,
	},
	phaseText: {
		color: "#FCA5A5",
		fontSize: 13,
		textAlign: "center",
	},
	error: {
		color: "#FCA5A5",
		fontSize: 12,
		textAlign: "center",
		marginBottom: 4,
		paddingHorizontal: 16,
	},
});
