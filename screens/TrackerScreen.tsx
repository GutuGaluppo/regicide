// /screens/TrackerScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
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
import HospitalIcon from "../assets/icons/hospital.svg";
import { AttackInput } from "../components/AttackInput";
import { DefeatFooter } from "../components/DefeatFooter";
import { NumberSprite } from "../components/NumberSprite";
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
					<Text style={styles.title}>Tracker</Text>
					<TouchableOpacity onPress={resetTracker} style={styles.resetBtn}>
						<Text style={styles.resetText}>Reiniciar</Text>
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
								{/* Barra de HP — esquerda, preenche do topo */}
								<View style={styles.vBarBg}>
									<View
										style={[
											styles.vBarFill,
											{
												height: `${hpPercent * 100}%` as any,
												backgroundColor: hpColor,
											},
										]}
									/>
								</View>
								{/* Barra de Ataque — direita, preenche da base */}
								<View style={[styles.vBarBg, styles.vBarRight]}>
									<View
										style={[
											styles.vBarFill,
											styles.vBarFillBottom,
											{
												height: `${attackPercent * 100}%` as any,
												backgroundColor: "#FBBF24",
											},
										]}
									/>
								</View>
								<Image
									source={getCardImage(currentEnemy.rank, currentEnemy.suit)}
									style={styles.enemyImage}
									resizeMode="contain"
								/>
								{/* ATK — topo direito */}
								<View style={styles.atkBadge}>
									<NumberSprite
										value={effectiveAttack}
										type="attack"
										height={28}
									/>
									{currentShield > 0 && (
										<Text style={styles.shieldBadgeText}>
											🛡️-{currentShield}
										</Text>
									)}
								</View>
								{/* HP — base esquerda */}
								<View
									style={[styles.hpBadge, { backgroundColor: hpColor + "33" }]}
								>
									<HospitalIcon width={14} height={14} color={hpColor} />
									<NumberSprite value={currentHP} type="health" height={28} />
								</View>
							</View>

							{isDead && <Text style={styles.deadBadge}>HP zerado!</Text>}
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
								{lastResult.immune ? "Imunidade — " : ""}Dano: -
								{lastResult.damage}
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
								{isDead ? "💀 Confirmar derrota" : "Derrotar inimigo"}
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
		width: 220,
		height: 309,
		borderRadius: 10,
	},
	atkBadge: {
		position: "absolute",
		top: 8,
		right: -58,
		alignSelf: "flex-start",
		backgroundColor: "rgba(15,23,42,0.82)",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
		alignItems: "flex-end",
		gap: 2,
	},
	shieldBadgeText: {
		color: "#60A5FA",
		fontSize: 13,
		fontWeight: "600",
	},
	hpBadge: {
		position: "absolute",
		bottom: 8,
		left: -68,
		alignSelf: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
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
