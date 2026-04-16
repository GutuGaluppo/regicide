import cardBack from "@/assets/images/cardBack.png";
import { useAudio } from "@/contexts/AudioContext";
import { useSoundtrack } from "@/hooks/useSoundtrack";
import { ActionBar } from "@/components/ActionBar/ActionBar";
import { CastleFooter } from "@/components/CastleFooter";
import { DefeatScreen } from "@/components/DefeatScreen";
import { EnemyCard } from "@/components/EnemyCard";
import { EnemyModal } from "@/components/EnemyModal";
import { NumberSprite } from "@/components/NumberSprite";
import { PlayerHand } from "@/components/PlayerHand";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { VictoryScreen } from "@/components/VictoryScreen";
import { useGame } from "@/hooks/useGame";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Image,
	ImageBackground,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./GameScreen.styles";

const StatusCard = ({ count, label }: { count: number; label: string }) => (
	<View style={styles.statusItem}>
		<View style={styles.statusCard}>
			<Image
				source={cardBack}
				style={styles.statusCardImg}
				resizeMode="contain"
			/>
			<View style={styles.statusCardOverlay}>
				<NumberSprite value={count} type="deckstatus" height={25} />
			</View>
		</View>
		<Text style={styles.deckLabel}>{label}</Text>
	</View>
);

export const GameScreen = () => {
	const { t } = useTranslation();
	const { playTap, playShuffleCards } = useAudio();
	useSoundtrack(require("@/assets/soundtrack/502_Sentient_Eye.mp3") as import("expo-av").AVPlaybackSource);
	const {
		gameState,
		selectedIds,
		playError,
		currentEnemy,
		currentHP,
		effectiveAttack,
		selectedTotal,
		previewDamage,
		previewShieldGain,
		defeatedEnemies,
		cardsDrawnSignal,
		toggleCard,
		playSelected,
		confirmDiscard,
		useJester,
		sortHand,
		sortHandByClass,
		resetGame,
	} = useGame();

	useEffect(() => {
		if (cardsDrawnSignal === 0) return;
		playShuffleCards();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardsDrawnSignal]);

	const {
		phase,
		spadesShield,
		tavernDeck,
		discardPile,
		pendingDamage,
		jesterActive,
	} = gameState;

	const [modalVisible, setModalVisible] = useState(false);
	const [settingsVisible, setSettingsVisible] = useState(false);
	const [discardingIds, setDiscardingIds] = useState<Set<string>>(new Set());

	const handleConfirmDiscard = () => {
		const toDiscard = new Set(selectedIds);
		setDiscardingIds(toDiscard);
		setTimeout(() => {
			confirmDiscard();
			setDiscardingIds(new Set());
		}, 340);
	};

	if (phase === "victory") return <VictoryScreen onReset={resetGame} />;

	if (phase === "defeat" && currentEnemy) {
		return (
			<DefeatScreen
				enemy={currentEnemy}
				stats={gameState.stats}
				defeatedEnemies={defeatedEnemies}
				playerHand={gameState.playerHand}
				onReset={resetGame}
			/>
		);
	}

	return (
		<ImageBackground
			source={require("@/assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => { playTap(); router.back(); }}
						style={styles.headerBtn}
					>
						<Ionicons name="chevron-back" size={26} color="#F1F5F9" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => { playTap(); setSettingsVisible(true); }}
						style={styles.headerBtn}
					>
						<Ionicons name="settings-outline" size={24} color="#94A3B8" />
					</TouchableOpacity>
				</View>

				{/* Status bar */}
				<View style={styles.statusBar}>
					<StatusCard
						count={gameState.castle.length}
						label={t("game.status.castle")}
					/>
					<StatusCard
						count={tavernDeck.length}
						label={t("game.status.tavern")}
					/>
					<StatusCard
						count={discardPile.length}
						label={t("game.status.discard")}
					/>
				</View>

				{/* Enemy card */}
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
								jestersAvailable={gameState.jestersAvailable}
								jestersUsed={gameState.jestersUsed}
								onUseJester={phase === "player_turn" ? useJester : undefined}
								onPress={() => setModalVisible(true)}
								previewDamage={phase === "player_turn" ? previewDamage : 0}
								previewShieldGain={phase === "player_turn" ? previewShieldGain : 0}
							/>
						)}
				</View>

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
						pendingDamage={pendingDamage}
						selectedTotal={selectedTotal}
						onCardPress={toggleCard}
						onDiscard={handleConfirmDiscard}
						onSort={sortHand}
						onSortByClass={sortHandByClass}
					/>
				)}

				{/* Action buttons (only player_turn) */}
				<ActionBar
					phase={phase}
					onPlay={playSelected}
					// onYield={yieldTurn}
					playDisabled={selectedIds.size === 0}
				/>

				<CastleFooter
					castle={gameState.castle}
					defeatedEnemies={defeatedEnemies}
					currentEnemyId={currentEnemy?.id}
				/>
			</View>

			{/* Enemy modal */}
			{currentEnemy && (
				<EnemyModal
					enemy={currentEnemy}
					currentHP={currentHP}
					effectiveAttack={effectiveAttack}
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
				/>
			)}

			{/* Settings drawer */}
			<SettingsDrawer
				visible={settingsVisible}
				onClose={() => setSettingsVisible(false)}
				onReset={resetGame}
			/>
		</ImageBackground>
	);
};
