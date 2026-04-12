// /screens/TrackerScreen.tsx
import { router } from "expo-router";
import React from "react";
import {
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { AttackInput } from "../components/AttackInput";
import { DefeatFooter } from "../components/DefeatFooter";
import { getCardImage } from "../data/images";
import { CardRank, Suit } from "../data/types";
import { useTracker } from "../hooks/useTracker";

const SUIT_SYMBOL: Record<string, string> = {
	hearts: "♥",
	diamonds: "♦",
	clubs: "♣",
	spades: "♠",
};

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

	const handleAttack = (suit: Suit, rank: CardRank) => {
		applyAttack(suit, rank);
	};

	return (
		<ImageBackground
			source={require("../assets/images/bg_cave.webp")}
			style={styles.bg}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backBtn}
					>
						<Text style={styles.backText}>← Voltar</Text>
					</TouchableOpacity>
					<Text style={styles.title}>Tracker</Text>
					<TouchableOpacity onPress={resetTracker} style={styles.resetBtn}>
						<Text style={styles.resetText}>Reiniciar</Text>
					</TouchableOpacity>
				</View>

				{/* Vitória */}
				{isVictory && (
					<View style={styles.victoryBanner}>
						<Text style={styles.victoryText}>
							🏆 Vitória! Todos os inimigos derrotados!
						</Text>
					</View>
				)}

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
								/>
								{/* ATK — topo direito */}
								<View style={styles.atkBadge}>
									<Text style={styles.atkBadgeText}>⚔️ {effectiveAttack}</Text>
									{currentShield > 0 && (
										<Text style={styles.shieldBadgeText}>🛡️-{currentShield}</Text>
									)}
								</View>
								{/* HP — base esquerda */}
								<View style={[styles.hpBadge, { backgroundColor: hpColor + "33" }]}>
									<Text style={[styles.hpBadgeText, { color: hpColor }]}>
										❤️ {currentHP}/{currentEnemy.health}
									</Text>
								</View>
							</View>

							{/* Barra de HP */}
							<View style={styles.hpBarBg}>
								<View
									style={[
										styles.hpBarFill,
										{
											width: `${hpPercent * 100}%` as any,
											backgroundColor: hpColor,
										},
									]}
								/>
							</View>

							<Text style={styles.immuneText}>
								🛡️ Imune a {SUIT_SYMBOL[currentEnemy.suit]}
							</Text>

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
				/>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	bg: { flex: 1 },
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
	victoryBanner: {
		backgroundColor: "rgba(34,197,94,0.2)",
		borderColor: "#22C55E",
		borderWidth: 1,
		marginHorizontal: 16,
		borderRadius: 10,
		padding: 12,
		marginBottom: 8,
	},
	victoryText: {
		color: "#22C55E",
		textAlign: "center",
		fontWeight: "700",
		fontSize: 16,
	},
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
		width: 200,
		height: 280,
	},
	enemyImage: {
		width: 200,
		height: 280,
		borderRadius: 10,
	},
	atkBadge: {
		position: "absolute",
		top: 8,
		right: 8,
		backgroundColor: "rgba(15,23,42,0.82)",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
		alignItems: "flex-end",
		gap: 2,
	},
	atkBadgeText: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 13,
	},
	shieldBadgeText: {
		color: "#60A5FA",
		fontSize: 11,
		fontWeight: "600",
	},
	hpBadge: {
		position: "absolute",
		bottom: 8,
		left: 8,
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
		backgroundColor: "rgba(15,23,42,0.82)",
	},
	hpBadgeText: {
		fontWeight: "700",
		fontSize: 13,
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
