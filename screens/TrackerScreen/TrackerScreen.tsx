// /screens/TrackerScreen/TrackerScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import MagicShield from "@/assets/icons/magicShield.png";
import { AttackInput } from "@/components/AttackInput";
import { DefeatFooter } from "@/components/DefeatFooter";
import { NumberSprite } from "@/components/NumberSprite";
import { ProgressRing } from "@/components/ProgressRing";
import { VictoryScreen } from "@/components/VictoryScreen";
import { getCardImage } from "@/data/images";
import { CardRank, Suit } from "@/data/types";
import { useTracker } from "@/hooks/useTracker";
import { BG_WIDTH, SHIFT_PER_ENEMY_EXPORT, styles } from "./TrackerScreen.styles";

const BG = require("@/assets/backgrounds/bg_cave.webp");

export const TrackerScreen = () => {
	const { t } = useTranslation();
	const {
		currentEnemy,
		currentHP,
		currentShield,
		effectiveAttack,
		defeatedIds,
		footerPhase,
		footerEnemies,
		isVictory,
		lastResult,
		selectEnemy,
		applyAttack,
		defeatCurrentEnemy,
		resetTracker,
	} = useTracker();

	const hpPercent = currentEnemy
		? Math.max(0, currentHP / currentEnemy.health)
		: 0;
	const hpColor =
		hpPercent > 0.5 ? "#22C55E" : hpPercent > 0.25 ? "#FBBF24" : "#EF4444";
	const isDead = currentHP <= 0;

	const attackPercent = currentEnemy
		? Math.min(1, effectiveAttack / currentEnemy.attack)
		: 0;

	const handleAttack = (suit: Suit, rank: CardRank) => {
		applyAttack(suit, rank);
	};

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
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backBtn}
					>
						<Image
							source={require("@/assets/icons/crown_white.png")}
							style={{ width: 30, height: 30 }}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					<Text style={styles.title}>{t("tracker.title")}</Text>
					<TouchableOpacity onPress={resetTracker} style={styles.resetBtn}>
						<Text style={styles.resetText}>{t("tracker.reset")}</Text>
					</TouchableOpacity>
				</View>

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
											value={effectiveAttack}
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
										<NumberSprite value={currentHP} type="health" height={32} />
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

					{currentEnemy && !isVictory && (
						<AttackInput enemy={currentEnemy} onApply={handleAttack} />
					)}

					{currentEnemy && !isVictory && (
						<TouchableOpacity
							style={[styles.defeatBtn, isDead && styles.defeatBtnActive]}
							onPress={defeatCurrentEnemy}
							activeOpacity={0.8}
						>
							<Text style={styles.defeatBtnText}>
								{isDead ? t("tracker.confirmDefeat") : t("tracker.defeatEnemy")}
							</Text>
						</TouchableOpacity>
					)}

					<View style={{ height: 16 }} />
				</ScrollView>

				<DefeatFooter
					phase={footerPhase}
					enemies={footerEnemies}
					defeatedIds={defeatedIds}
					currentEnemyId={currentEnemy?.id ?? null}
					onSelect={selectEnemy}
				/>
			</View>
		</View>
	);
};
