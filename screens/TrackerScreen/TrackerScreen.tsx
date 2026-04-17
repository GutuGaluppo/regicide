import { AttackFooter } from "@/components/AttackFooter";
import { CardSelectionInfo } from "@/components/AttackInput/AttackInput.constants";
import { GameModal } from "@/components/GameModal";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { SuitTracker } from "@/components/SuitTracker";
import { VictoryScreen } from "@/components/VictoryScreen";
import { useAudio } from "@/contexts/AudioContext";
import { useSoundtrack } from "@/hooks/useSoundtrack";
import { useTracker } from "@/hooks/useTracker";
import { EnemySelectionScreen } from "@/screens/EnemySelectionScreen/EnemySelectionScreen";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Animated, ScrollView, TouchableOpacity, View } from "react-native";
import { EnemyStatsCard } from "./components/EnemyStatsCard/EnemyStatsCard";
import { LastResultBadge } from "./components/LastResultBadge/LastResultBadge";
import { useBgShift } from "./hooks/useBgShift";
import { useDefeatTransition } from "./hooks/useDefeatTransition";
import { styles } from "./TrackerScreen.styles";
import { ModalState, ScreenState } from "./TrackerScreen.types";

const BG = require("@/assets/backgrounds/bg_cave.webp");

export const TrackerScreen = () => {
	const { playTap } = useAudio();
	useSoundtrack(
		require("@/assets/soundtrack/502_Sentient_Eye.mp3") as import("expo-av").AVPlaybackSource,
	);

	const {
		currentEnemy,
		currentHP,
		currentShield,
		effectiveAttack,
		defeatedIds,
		footerEnemies,
		isVictory,
		isJesterActive,
		canUndo,
		lastResult,
		undo,
		selectEnemy,
		applyAttack,
		defeatCurrentEnemy,
		resetTracker,
	} = useTracker();

	const [settingsVisible, setSettingsVisible] = useState(false);
	const [selectedCardInfo, setSelectedCardInfo] =
		useState<CardSelectionInfo | null>(null);
	const [screenState, setScreenState] = useState<ScreenState>(
		currentEnemy ? "IN_COMBAT" : "ENEMY_SELECTION",
	);
	const [modalState, setModalState] = useState<ModalState>(null);

	const bgShift = useBgShift(defeatedIds.length);
	const { isDefeatingRef, defeatFade, handleDefeatWithTransition } =
		useDefeatTransition({
			defeatCurrentEnemy,
			playTap,
			setScreenState,
		});

	// Keep screenState in sync with tracker state (dep on id, not object reference)
	useEffect(() => {
		if (isVictory) return;
		if (isDefeatingRef.current) return;
		setScreenState(currentEnemy ? "IN_COMBAT" : "ENEMY_SELECTION");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentEnemy?.id, isVictory]);

	// ── Derived display values ────────────────────────────────────────────────
	const previewHP = selectedCardInfo
		? Math.max(0, currentHP - selectedCardInfo.damage)
		: currentHP;
	const previewAttack = selectedCardInfo
		? Math.max(0, effectiveAttack - selectedCardInfo.shieldAdded)
		: effectiveAttack;
	const hpPercent = currentEnemy
		? Math.max(0, previewHP / currentEnemy.health)
		: 0;
	const hpColor =
		hpPercent > 0.5 ? "#22C55E" : hpPercent > 0.25 ? "#FBBF24" : "#EF4444";
	const attackPercent = currentEnemy
		? Math.min(1, previewAttack / currentEnemy.attack)
		: 0;
	const isDead = currentHP <= 0;

	// ── Early returns ─────────────────────────────────────────────────────────
	if (isVictory) {
		return <VictoryScreen onReset={resetTracker} />;
	}

	if (screenState === "ENEMY_SELECTION") {
		return (
			<EnemySelectionScreen
				enemies={footerEnemies}
				defeatedIds={defeatedIds}
				bgShift={bgShift}
				onSelectEnemy={(id) => {
					playTap();
					selectEnemy(id);
				}}
			/>
		);
	}

	return (
		<View style={styles.bg}>
			<Animated.Image
				source={BG}
				style={[styles.bgImage, { transform: [{ translateX: bgShift }] }]}
				resizeMode="cover"
			/>
			<View style={styles.overlay}>
				{/* ── Top (fixed) ── */}
				<View style={styles.top}>
					<SuitTracker enemies={footerEnemies} defeatedIds={defeatedIds} />
					<ScreenHeader
						onSettingsPress={() => setSettingsVisible(true)}
						rightExtra={
							<TouchableOpacity
								onPress={() => {
									playTap();
									undo();
								}}
								style={[styles.backBtn, !canUndo && { opacity: 0.3 }]}
								disabled={!canUndo}
							>
								<Ionicons name="arrow-undo" size={26} color="#F1F5F9" />
							</TouchableOpacity>
						}
					/>
				</View>

				{/* ── Center (flex) ── */}
				<View style={styles.center}>
					<ScrollView
						style={styles.scroll}
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						{currentEnemy && (
							<EnemyStatsCard
								enemy={currentEnemy}
								isDead={isDead}
								defeatFade={defeatFade}
								isDefeatingTransition={
									screenState === "ENEMY_DEFEATED_TRANSITION"
								}
								previewHP={previewHP}
								hpPercent={hpPercent}
								hpColor={hpColor}
								previewAttack={previewAttack}
								attackPercent={attackPercent}
								currentShield={currentShield}
								onDefeat={handleDefeatWithTransition}
							/>
						)}

						{lastResult && <LastResultBadge result={lastResult} />}

						<View style={{ height: 16 }} />
					</ScrollView>
				</View>

				{/* ── Footer (fixed) ── */}
				<View style={styles.footer}>
					<AttackFooter
						enemy={currentEnemy}
						jesterActive={isJesterActive}
						onApply={(cards) => {
							applyAttack(cards);
							setSelectedCardInfo(null);
						}}
						onSelectionChange={setSelectedCardInfo}
						onImmuneWarning={() => setModalState("IMMUNE_WARNING")}
					/>
				</View>
			</View>

			<SettingsDrawer
				visible={settingsVisible}
				onClose={() => setSettingsVisible(false)}
				onReset={resetTracker}
			/>

			<GameModal
				modalState={modalState}
				onClose={() => setModalState(null)}
				enemy={currentEnemy}
				currentHP={currentHP}
				effectiveAttack={effectiveAttack}
			/>
		</View>
	);
};
