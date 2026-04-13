// /screens/GameScreen.tsx
import { router } from "expo-router";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActionBar } from "../components/ActionBar";
import { CastleFooter } from "../components/CastleFooter";
import { EnemyCard } from "../components/EnemyCard";
import { PlayerHand } from "../components/PlayerHand";
import { VictoryScreen } from "../components/VictoryScreen";
import { useGame } from "../hooks/useGame";

const CARD_BACK = require("../assets/images/cards_back.png");

const StatusCard = ({ count }: { count: number }) => (
	<View style={styles.statusCard}>
		<Image source={CARD_BACK} style={styles.statusCardImg} resizeMode="contain" />
		<View style={styles.statusCardOverlay}>
			<Text style={styles.statusCardNumOutline}>{count}</Text>
			<Text style={styles.statusCardNum}>{count}</Text>
		</View>
	</View>
);

export const GameScreen = () => {
	const {
		gameState,
		selectedIds,
		playError,
		currentEnemy,
		currentHP,
		effectiveAttack,
		selectedTotal,
		defeatedEnemies,
		toggleCard,
		playSelected,
		yieldTurn,
		confirmDiscard,
		resetGame,
	} = useGame();

	const {
		phase,
		spadesShield,
		tavernDeck,
		discardPile,
		pendingDamage,
		jesterActive,
	} = gameState;

	if (phase === "victory") {
		return <VictoryScreen onReset={resetGame} />;
	}

	return (
		<ImageBackground
			source={require("../assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
						<Text style={styles.backBtnText}>← Voltar</Text>
					</TouchableOpacity>
				</View>

				{/* Status superior */}
				<View style={styles.statusBar}>
					<StatusCard count={gameState.castle.length} />
					<StatusCard count={tavernDeck.length} />
					<StatusCard count={discardPile.length} />
					{spadesShield > 0 && <StatusCard count={spadesShield} />}
				</View>

				{/* Centro: inimigo ou mensagem final */}
				<View style={styles.center}>
					{phase === "defeat" && (
						<Text style={[styles.endText, styles.defeatText]}>💀 Derrota</Text>
					)}
					{(phase === "player_turn" || phase === "suffer_damage") &&
						currentEnemy && (
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
				{playError && <Text style={styles.error}>{playError}</Text>}

				{/* Mão do jogador */}
				{(phase === "player_turn" || phase === "suffer_damage") && (
					<PlayerHand
						hand={gameState.playerHand}
						selectedIds={selectedIds}
						phase={phase}
						immuneSuit={jesterActive ? null : currentEnemy?.suit}
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

				<CastleFooter
					castle={gameState.castle}
					defeatedEnemies={defeatedEnemies}
				/>
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
		alignItems: "flex-end",
		gap: 12,
		paddingHorizontal: 16,
	},
	statusCard: {
		width: 36,
		height: 50,
	},
	statusCardImg: {
		width: "100%",
		height: "100%",
	},
	statusCardOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
	statusCardNumOutline: {
		position: "absolute",
		fontSize: 22,
		fontWeight: "900",
		color: "#FFFFFF",
		textShadowColor: "#FFFFFF",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 6,
	},
	statusCardNum: {
		position: "absolute",
		fontSize: 22,
		fontWeight: "900",
		color: "#000000",
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
	header: {
		paddingTop: 52,
		paddingHorizontal: 16,
		paddingBottom: 4,
	},
	backBtn: {
		alignSelf: "flex-start",
		paddingVertical: 6,
		paddingHorizontal: 12,
		backgroundColor: "rgba(15,23,42,0.75)",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.3)",
	},
	backBtnText: {
		color: "#94A3B8",
		fontSize: 13,
		fontWeight: "600",
	},
});
