import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import MagicShield from "../assets/icons/magicShield.png";
import { AttackInput } from "../components/AttackInput/AttackInput";
import { DefeatFooter } from "../components/DefeatFooter";
import { NumberSprite } from "../components/NumberSprite";
import { ProgressRing } from "../components/ProgressRing";
import { VictoryScreen } from "../components/VictoryScreen";
import { getCardImage } from "../data/images";
import { CardRank, Suit } from "../data/types";
import { useTracker } from "../hooks/useTracker";

const BG = require("../assets/backgrounds/bg_cave.webp");
const TOTAL_ENEMIES = 12;
const SHIFT_PER_ENEMY = 18;
const MAX_SHIFT = -(TOTAL_ENEMIES * SHIFT_PER_ENEMY); // -216px
// A imagem precisa ter screen_width + abs(MAX_SHIFT) para cobrir a tela em ambos os extremos
const SCREEN_WIDTH = Dimensions.get("window").width;
const BG_WIDTH = SCREEN_WIDTH + Math.abs(MAX_SHIFT);

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

	// Background dinâmico: desloca para a esquerda a cada inimigo derrotado
	const bgShift = useRef(new Animated.Value(0)).current;
	const prevCount = useRef(defeatedIds.length);

	useEffect(() => {
		const count = defeatedIds.length;
		// Começa em 0 (extremo esquerdo da imagem) e desloca para direita a cada derrota
		const toValue = count === 0 ? 0 : -(count * SHIFT_PER_ENEMY);
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
							source={require("../assets/icons/crown_white.png")}
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
					{/* Card do inimigo atual */}
					{currentEnemy && !isVictory && (
						<View
							style={[styles.enemySection, isDead && styles.enemySectionDead]}
						>
							{/* Imagem com badges sobrepostos */}
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

					{/* Resultado do último ataque */}
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

					{/* Input de ataque */}
					{currentEnemy && !isVictory && (
						<AttackInput enemy={currentEnemy} onApply={handleAttack} />
					)}

					{/* Botão derrotar */}
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

				{/* Footer com inimigos derrotados */}
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

const styles = StyleSheet.create({
	bg: { flex: 1, overflow: "hidden" },
	bgImage: {
		position: "absolute",
		top: 0,
		left: 0,
		width: BG_WIDTH,
		height: "100%",
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 52,
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	backBtn: { padding: 4 },
	backText: { color: "#94A3B8", fontSize: 14 },
	title: { color: "#F1F5F9", fontSize: 18, fontWeight: "700" },
	resetBtn: { padding: 4 },
	resetText: { color: "#683237", fontSize: 14, fontWeight: "600" },
	scroll: { flex: 1 },
	scrollContent: { gap: 14, paddingBottom: 8 },

	// Current enemy card
	enemySection: {
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 16,
	},
	enemySectionDead: {
		opacity: 0.8,
	},
	enemyImageWrapper: {
		position: "relative",
		width: 220,
		height: 309,
	},
	enemyImage: {
		width: 200,
		height: 300,
		borderRadius: 10,
	},
	atkBadge: {
		position: "absolute",
		top: 20,
		right: -65,
		alignItems: "center",
		gap: 4,
	},
	hpBadge: {
		position: "absolute",
		bottom: 20,
		left: -65,
		alignItems: "center",
		gap: 4,
	},
	badgeLabel: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 0.8,
		textTransform: "uppercase",
		textShadowColor: "rgba(0,0,0,0.8)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
	shieldedWrapper: {
		width: 88,
		height: 88,
		justifyContent: "center",
		alignItems: "center",
	},
	shieldIconBg: {
		position: "absolute",
		top: 0,
		left: 0,
		width: 88,
		height: 88,
	},
	hpBarBg: {
		width: 220,
		height: 8,
		backgroundColor: "#1E293B",
		borderRadius: 4,
		overflow: "hidden",
	},
	hpBarFill: {
		height: "100%",
		borderRadius: 4,
	},
	vBarBg: {
		position: "absolute",
		top: 0,
		left: -40,
		width: 5,
		height: "80%",
		backgroundColor: "rgba(0,0,0,0.4)",
		borderRadius: 3,
		overflow: "hidden",
	},
	vBarRight: {
		left: undefined,
		top: 50,
		right: -40,
		justifyContent: "flex-end",
	},
	vBarFill: {
		width: "100%",
		borderRadius: 3,
	},
	vBarFillBottom: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},
	immuneText: { color: "#94A3B8", fontSize: 12 },
	deadBadge: {
		color: "#EF4444",
		fontWeight: "700",
		fontSize: 13,
		backgroundColor: "rgba(239,68,68,0.15)",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#EF4444",
	},

	// Last result
	resultBadge: {
		marginHorizontal: 16,
		backgroundColor: "rgba(30,41,59,0.8)",
		borderRadius: 10,
		padding: 10,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
		gap: 2,
	},
	resultImmune: { borderLeftColor: "#EF4444" },
	resultDamage: { color: "#FBBF24", fontWeight: "700", fontSize: 14 },
	resultPower: { color: "#94A3B8", fontSize: 12 },

	// Defeat button
	defeatBtn: {
		marginHorizontal: 16,
		backgroundColor: "rgba(104,50,55,0.5)",
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#683237",
	},
	defeatBtnActive: {
		backgroundColor: "#683237",
		borderColor: "#EF4444",
	},
	defeatBtnText: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 15,
	},
});
