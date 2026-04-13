// /components/CastleFooter.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getCardImage } from "../data/images";
import { Enemy, EnemyRank } from "../data/types";

const LetterX = require("../assets/icons/letter-x.png");

const PHASE_LABEL: Record<EnemyRank, string> = {
	J: "Valetes",
	Q: "Rainhas",
	K: "Reis",
};

export const CastleFooter = ({
	castle,
	defeatedEnemies,
}: {
	castle: Enemy[];
	defeatedEnemies: Enemy[];
}) => {
	const allEnemies = [...defeatedEnemies, ...castle];
	const defeatedIds = defeatedEnemies.map((e) => e.id);

	const jEnemies = allEnemies.filter((e) => e.rank === "J");
	const qEnemies = allEnemies.filter((e) => e.rank === "Q");
	const jAllDefeated =
		jEnemies.length > 0 && jEnemies.every((e) => defeatedIds.includes(e.id));
	const qAllDefeated =
		qEnemies.length > 0 && qEnemies.every((e) => defeatedIds.includes(e.id));
	const footerPhase: EnemyRank = jAllDefeated
		? qAllDefeated
			? "K"
			: "Q"
		: "J";

	const phaseEnemies = allEnemies.filter((e) => e.rank === footerPhase);
	const defeatedCount = phaseEnemies.filter((e) =>
		defeatedIds.includes(e.id),
	).length;

	return (
		<View style={styles.container}>
			<Text style={styles.label}>
				{PHASE_LABEL[footerPhase]} {defeatedCount}/{phaseEnemies.length}
			</Text>
			<View style={styles.row}>
				{phaseEnemies.map((enemy) => {
					const defeated = defeatedIds.includes(enemy.id);
					return (
						<View key={enemy.id} style={styles.slot}>
							<Image
								source={getCardImage(enemy.rank, enemy.suit)}
								style={[styles.miniCard, defeated && styles.miniCardDefeated]}
								resizeMode="contain"
							/>
							{defeated && (
								<View style={styles.crossOverlay}>
									<Image
										source={LetterX}
										style={styles.crossIcon}
										resizeMode="contain"
									/>
								</View>
							)}
						</View>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(15,23,42,0.75)",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderTopWidth: 1,
		borderTopColor: "rgba(148,163,184,0.15)",
		gap: 6,
	},
	label: {
		color: "#94A3B8",
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 1,
		textTransform: "uppercase",
		textAlign: "center",
	},
	row: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
	},
	slot: {
		width: 44,
		aspectRatio: 824 / 1156,
		borderRadius: 6,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "transparent",
	},
	miniCard: {
		width: "100%",
		height: "100%",
		borderRadius: 6,
	},
	miniCardDefeated: {
		opacity: 0.5,
	},
	crossOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "flex-end",
		alignItems: "flex-start",
		paddingTop: 14,
	},
	crossIcon: {
		width: "90%",
		height: "90%",
	},
});
