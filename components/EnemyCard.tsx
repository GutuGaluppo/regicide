// /components/EnemyCard.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import HospitalIcon from "../assets/icons/hospital.svg";
import { getCardImage } from "../data/images";
import { Enemy } from "../data/types";

export const EnemyCard = ({
	enemy,
	currentHP,
	effectiveAttack,
	jesterActive,
}: {
	enemy: Enemy;
	currentHP: number;
	effectiveAttack: number;
	jesterActive: boolean;
}) => {
	const hpPercent = Math.max(0, currentHP / enemy.health);
	const attackPercent = Math.min(1, effectiveAttack / enemy.attack);
	const hpColor =
		hpPercent > 0.5 ? "#22C55E" : hpPercent > 0.25 ? "#FBBF24" : "#EF4444";
	const attackColor = "#FBBF24";

	return (
		<View style={styles.card}>
			<View style={styles.imageWrapper}>
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
								backgroundColor: attackColor,
							},
						]}
					/>
				</View>

				<Image
					source={getCardImage(enemy.rank, enemy.suit)}
					style={styles.image}
					resizeMode="contain"
				/>

				{/* ATK — topo direito */}
				<View style={styles.atkBadge}>
					<Text style={styles.atkBadgeText}>⚔️ {effectiveAttack}</Text>
					{effectiveAttack < enemy.attack && (
						<Text style={styles.shieldedText}>🛡️ ({enemy.attack})</Text>
					)}
				</View>

				{/* HP — base esquerda */}
				<View style={[styles.hpBadge, { backgroundColor: hpColor + "33" }]}>
					<HospitalIcon width={14} height={14} color={hpColor} />
					<Text style={[styles.hpBadgeText, { color: hpColor }]}>
						{currentHP}/{enemy.health}
					</Text>
				</View>
			</View>

			{/* <Text style={styles.immunity}>
				{jesterActive
					? "⚡ Imunidade cancelada"
					: `🛡️ Imune a ${SUIT_SYMBOL[enemy.suit]}`}
			</Text> */}
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		gap: 8,
	},
	imageWrapper: {
		position: "relative",
		width: 250,
		height: 320,
	},
	image: {
		width: 250,
		height: 320,
		borderRadius: 12,
	},
	vBarBg: {
		position: "absolute",
		top: 0,
		left: -20,
		width: 5,
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.4)",
		borderRadius: 3,
		overflow: "hidden",
		zIndex: 1,
	},
	vBarRight: {
		left: undefined,
		right: -20,
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
	atkBadge: {
		position: "absolute",
		top: 8,
		right: 8,
		alignSelf: "flex-start",
		backgroundColor: "rgba(15,23,42,0.82)",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
		alignItems: "flex-end",
		gap: 2,
		zIndex: 2,
	},
	atkBadgeText: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 16,
	},
	shieldedText: {
		color: "#60A5FA",
		fontSize: 13,
		fontWeight: "600",
	},
	hpBadge: {
		position: "absolute",
		bottom: 8,
		left: 8,
		alignSelf: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
		zIndex: 2,
	},
	hpBadgeText: {
		fontWeight: "700",
		fontSize: 16,
	},
	immunity: {
		color: "#94A3B8",
		fontSize: 12,
	},
});
