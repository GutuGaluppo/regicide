// /screens/GameScreen.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { ActionBar } from "../components/ActionBar";
import { CastleFooter } from "../components/CastleFooter";
import { DefeatScreen } from "../components/DefeatScreen";
import { EnemyCard } from "../components/EnemyCard";
import { EnemyModal } from "../components/EnemyModal";
import { NumberSprite } from "../components/NumberSprite";
import { PlayerHand } from "../components/PlayerHand";
import { VictoryScreen } from "../components/VictoryScreen";
import { useGame } from "../hooks/useGame";

const CARD_BACK = require("../assets/images/cards_back.png");

const StatusCard = ({ count, label }: { count: number; label: string }) => (
	<View style={styles.statusItem}>
		<View style={styles.statusCard}>
			<Image
				source={CARD_BACK}
				style={styles.statusCardImg}
				resizeMode="contain"
			/>
			<View style={styles.statusCardOverlay}>
				<NumberSprite value={count} type="attack" height={25} />
			</View>
		</View>
		<Text style={styles.deckLabel}>{label}</Text>
	</View>
);

export const GameScreen = () => {
	const { t } = useTranslation();
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
		sortHand,
		sortHandByClass,
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

	// ─── Modal ────────────────────────────────────────────────────────────────────
	const [modalVisible, setModalVisible] = useState(false);

	// ─── Discard animation: mark cards before committing ──────────────────────────
	const [discardingIds, setDiscardingIds] = useState<Set<string>>(new Set());

	const handleConfirmDiscard = () => {
		const toDiscard = new Set(selectedIds);
		setDiscardingIds(toDiscard);
		setTimeout(() => {
			confirmDiscard();
			setDiscardingIds(new Set());
		}, 340);
	};

	if (phase === "victory") {
		return <VictoryScreen onReset={resetGame} />;
	}

	if (phase === "defeat" && currentEnemy) {
		return <DefeatScreen enemy={currentEnemy} onReset={resetGame} />;
	}

	return (
		<ImageBackground
			source={require("../assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backBtn}
					>
						<Image
							source={require("../assets/icons/crown_white.png")}
							style={{ width: 30, height: 30 }}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</View>

				{/* Status bar with labeled deck piles */}
				<View style={styles.statusBar}>
					<StatusCard count={gameState.castle.length} label={t("game.status.castle")} />
					<StatusCard count={tavernDeck.length} label={t("game.status.tavern")} />
					<StatusCard count={discardPile.length} label={t("game.status.discard")} />
				</View>

				{/* Center: enemy card */}
				<View style={styles.center}>
					{(phase === "player_turn" || phase === "suffer_damage") &&
						currentEnemy && (
							<EnemyCard
								enemy={currentEnemy}
								currentHP={currentHP}
								effectiveAttack={effectiveAttack}
								jesterActive={jesterActive}
								spadesShield={spadesShield}
								shieldCards={gameState.playedThisFight.filter(
									(c) => c.suit === "spades",
								)}
								onPress={() => setModalVisible(true)}
							/>
						)}
				</View>

				{/* Suffer damage banner */}
				{phase === "suffer_damage" && (
					<View style={styles.phaseBar}>
						<Text style={styles.phaseText}>
							{t("game.sufferDamage", { damage: pendingDamage })}
						</Text>
					</View>
				)}

				{/* Play error */}
				{playError && <Text style={styles.error}>{playError}</Text>}

				{/* Player hand */}
				{(phase === "player_turn" || phase === "suffer_damage") && (
					<PlayerHand
						hand={gameState.playerHand}
						selectedIds={selectedIds}
						phase={phase}
						immuneSuit={jesterActive ? null : currentEnemy?.suit}
						discardingIds={discardingIds}
						onCardPress={toggleCard}
						onSort={sortHand}
						onSortByClass={sortHandByClass}
					/>
				)}

				{/* Action buttons */}
				<ActionBar
					phase={phase}
					selectedTotal={selectedTotal}
					pendingDamage={pendingDamage}
					onPlay={playSelected}
					onYield={yieldTurn}
					onDiscard={handleConfirmDiscard}
					onReset={resetGame}
					playDisabled={selectedIds.size === 0}
				/>

				<CastleFooter
					castle={gameState.castle}
					defeatedEnemies={defeatedEnemies}
					currentEnemyId={currentEnemy?.id}
				/>
			</View>

			{/* Enemy detail modal */}
			{currentEnemy && (
				<EnemyModal
					enemy={currentEnemy}
					currentHP={currentHP}
					effectiveAttack={effectiveAttack}
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
				/>
			)}
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.55)",
		justifyContent: "space-between",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 52,
		paddingHorizontal: 16,
		paddingBottom: 4,
	},
	backBtn: {
		alignSelf: "flex-start",
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	statusBar: {
		position: "absolute",
		top: 50,
		left: "50%",
		transform: [{ translateX: -110 }],
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-end",
		gap: 12,
		paddingHorizontal: 16,
	},
	statusItem: {
		alignItems: "center",
		gap: 4,
	},
	statusCard: {
		width: 56,
		height: 70,
		borderRadius: 8,
		overflow: "hidden",
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
	deckLabel: {
		color: "rgba(148,163,184,0.8)",
		fontSize: 9,
		fontWeight: "600",
		letterSpacing: 0.8,
		textTransform: "uppercase",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
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
	// Shield pile
	shieldStack: {
		position: "relative",
	},
	shieldCard: {
		position: "absolute",
		width: 56,
		height: 70,
		borderRadius: 6,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(96,165,250,0.5)",
	},
	shieldCardImg: {
		width: "100%",
		height: "100%",
	},
	shieldCardFallback: {
		flex: 1,
		backgroundColor: "#F8FAFC",
		justifyContent: "center",
		alignItems: "center",
	},
	shieldCardRank: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#1E293B",
	},
	shieldCardSuit: {
		fontSize: 16,
		color: "#1E293B",
	},
	deckLabelShield: {
		color: "rgba(96,165,250,0.9)",
	},
});
