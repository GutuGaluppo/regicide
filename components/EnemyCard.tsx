// /components/EnemyCard.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MagicShield from "../assets/icons/shield_03.png";
// import MagicShield from "../assets/icons/magicShield.png";
import { NumberSprite } from "../components/NumberSprite";
import { ProgressRing } from "../components/ProgressRing";
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
	const shielded = effectiveAttack < enemy.attack;

	return (
		<View style={styles.card}>
			<View style={styles.imageWrapper}>
				<Image
					source={getCardImage(enemy.rank, enemy.suit)}
					style={styles.image}
					resizeMode="contain"
				/>

				{/* ATK — topo direito */}
				<View style={styles.atkBadge}>
					<Text style={styles.badgeLabel}>Attack</Text>
					<ProgressRing
						percent={attackPercent}
						size={80}
						strokeWidth={6}
						color="#b8860a"
					>
						<NumberSprite value={effectiveAttack} type="attack" height={32} />
					</ProgressRing>
					{shielded && (
						<View style={styles.shieldedWrapper}>
							<Image source={MagicShield} style={styles.shieldIconBg} />
							<NumberSprite
								value={enemy.attack - effectiveAttack}
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
					<Text style={styles.badgeLabel}>Health</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
	},
	imageWrapper: {
		position: "relative",
		width: 210,
		height: 320,
	},
	image: {
		width: 210,
		height: 320,
		borderRadius: 12,
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
		top: -8,
		left: 0,
		width: 88,
		height: 88,
	},
});
