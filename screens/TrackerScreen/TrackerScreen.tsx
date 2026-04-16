import MagicShield from "@/assets/icons/shield.png";
import SkullIcon from "@/assets/icons/skull.png";
import { AttackInput } from "@/components/AttackInput";
import {
	CardSelectionInfo,
	SUITS,
} from "@/components/AttackInput/AttackInput.constants";
import { DefeatFooter } from "@/components/DefeatFooter";
import { NumberSprite } from "@/components/NumberSprite";
import { ProgressRing } from "@/components/ProgressRing";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { VictoryScreen } from "@/components/VictoryScreen";
import { useAudio } from "@/contexts/AudioContext";
import { getCardImage } from "@/data/images";
import { useSoundtrack } from "@/hooks/useSoundtrack";
import { useTracker } from "@/hooks/useTracker";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { AttackControls } from "@/components/AttackControls";
import { SuitTracker } from "@/components/SuitTracker";
import { SHIFT_PER_ENEMY_EXPORT, styles } from "./TrackerScreen.styles";
import { ModalState, ScreenState } from "./TrackerScreen.types";

const BG = require("@/assets/backgrounds/bg_cave.webp");

export const TrackerScreen = () => {
	const { t } = useTranslation();
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
		footerPhase,
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
	// modalState and setModalState are wired in subsequent commits
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [modalState, setModalState] = useState<ModalState>(null);

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
	const isDead = currentHP <= 0;

	const attackPercent = currentEnemy
		? Math.min(1, previewAttack / currentEnemy.attack)
		: 0;

	// Keep screenState in sync with tracker state
	useEffect(() => {
		if (isVictory) return;
		setScreenState(currentEnemy ? "IN_COMBAT" : "ENEMY_SELECTION");
	}, [currentEnemy?.id, isVictory]);

	const bgShift = useRef(new Animated.Value(0)).current;
	const prevCount = useRef(defeatedIds.length);

	useEffect(() => {
		const count = defeatedIds.length;
		const toValue = count === 0 ? 0 : -(count * SHIFT_PER_ENEMY_EXPORT);
		Animated.spring(bgShift, {
			toValue,
			useNativeDriver: true,
			tension: 30,
			friction: 10,
		}).start();
		prevCount.current = count;
	}, [defeatedIds.length, bgShift]);

	if (isVictory) {
		return <VictoryScreen onReset={resetTracker} />;
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
								onPress={() => { playTap(); undo(); }}
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
						{currentEnemy && !isVictory && (
							<View
								style={[styles.enemySection, isDead && styles.enemySectionDead]}
							>
								<View style={styles.enemyImageWrapper}>
									<Image
										source={getCardImage(currentEnemy.rank, currentEnemy.suit)}
										style={styles.enemyImage}
										resizeMode="contain"
									/>
									{currentEnemy && !isVictory && (
										<TouchableOpacity
											style={styles.skullBtn}
											onPress={() => {
												playTap();
												defeatCurrentEnemy();
											}}
											activeOpacity={0.7}
										>
											<Image
												source={SkullIcon}
												style={styles.skullIcon}
												resizeMode="contain"
											/>
										</TouchableOpacity>
									)}
									{/* ATK — topo direito */}
									<View style={styles.atkBadge}>
										<Text style={styles.badgeLabel}>{t("enemy.attack")}</Text>
										<ProgressRing
											percent={attackPercent}
											size={80}
											strokeWidth={6}
											color="#FBBF24"
										>
											<NumberSprite
												value={previewAttack}
												type="attack"
												height={32}
											/>
										</ProgressRing>
										{currentShield > 0 && (
											<View style={styles.shieldedWrapper}>
												<Image source={MagicShield} style={styles.shieldIconBg} />
												<NumberSprite
													value={currentShield}
													type="attack"
													height={22}
												/>
											</View>
										)}
									</View>
									{/* HP — base esquerda */}
									<View style={styles.hpBadge}>
										<ProgressRing
											percent={hpPercent}
											size={80}
											strokeWidth={6}
											color={hpColor}
										>
											<NumberSprite value={previewHP} type="health" height={32} />
										</ProgressRing>
										<Text style={styles.badgeLabel}>{t("enemy.health")}</Text>
									</View>
								</View>

								{isDead && (
									<Text style={styles.deadBadge}>{t("tracker.dead")}</Text>
								)}
							</View>
						)}

						{lastResult && !isVictory && (
							<View
								style={[
									styles.resultBadge,
									lastResult.immune && styles.resultImmune,
								]}
							>
								<Text style={styles.resultDamage}>
									{lastResult.immune ? t("tracker.immune") : ""}
									{t("tracker.damage", { value: lastResult.damage })}
								</Text>
								<Text style={styles.resultPower}>{lastResult.powerText}</Text>
							</View>
						)}

						{selectedCardInfo && (
							<View
								style={[
									styles.cardSelectionInfo,
									selectedCardInfo.immune && styles.cardSelectionInfoImmune,
								]}
							>
								<View style={styles.cardSelectionRow}>
									<Image
										source={
											SUITS.find((s) => s.suit === selectedCardInfo.suit)?.icon
										}
										style={styles.cardSelectionIcon}
										resizeMode="contain"
									/>
									<Text style={styles.cardSelectionRank}>
										{selectedCardInfo.rank}
									</Text>
									{selectedCardInfo.rank !== "Jester" && (
										<Text style={styles.cardSelectionDamage}>
											Dano: {selectedCardInfo.damage}
										</Text>
									)}
								</View>
								<Text style={styles.cardSelectionPower}>
									{selectedCardInfo.powerPreview}
								</Text>
							</View>
						)}

						{currentEnemy && !isVictory && (
							<AttackInput
								enemy={currentEnemy}
								onApply={applyAttack}
								onSelectionChange={setSelectedCardInfo}
								jesterActive={isJesterActive}
							/>
						)}

						<View style={{ height: 16 }} />
					</ScrollView>
				</View>

				{/* ── Footer (fixed) ── */}
				<View style={styles.footer}>
					<AttackControls
						enemy={currentEnemy}
						jesterActive={isJesterActive}
						onApply={applyAttack}
						onSelectionChange={setSelectedCardInfo}
					/>
					<DefeatFooter
						phase={footerPhase}
						enemies={footerEnemies}
						defeatedIds={defeatedIds}
						currentEnemyId={currentEnemy?.id ?? null}
						onSelect={selectEnemy}
					/>
				</View>
			</View>

			<SettingsDrawer
				visible={settingsVisible}
				onClose={() => setSettingsVisible(false)}
				onReset={resetTracker}
			/>
		</View>
	);
};
