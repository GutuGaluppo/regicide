// /components/DefeatFooter.tsx
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getFooterCardImage } from "../data/images";
import { Enemy, EnemyRank } from "../data/types";

const LetterX = require("../assets/icons/letter-x.png");

const PHASE_LABEL: Record<EnemyRank, string> = {
	J: "Valetes derrotados",
	Q: "Rainhas derrotadas",
	K: "Reis derrotados",
};

export const DefeatFooter = ({
	phase,
	enemies,
	defeatedIds,
	currentEnemyId,
	onSelect,
}: {
	phase: EnemyRank;
	enemies: Enemy[];
	defeatedIds: string[];
	currentEnemyId: string | null;
	onSelect: (id: string) => void;
}) => {
	const defeatedCount = enemies.filter((e) =>
		defeatedIds.includes(e.id),
	).length;

	return (
		<View style={styles.container}>
			<Text style={styles.label}>
				{PHASE_LABEL[phase]} {defeatedCount}/{enemies.length}
			</Text>
			<View style={styles.row}>
				{enemies.map((enemy) => {
					const defeated = defeatedIds.includes(enemy.id);
					const isCurrent = enemy.id === currentEnemyId;
					return (
						<TouchableOpacity
							key={enemy.id}
							style={[styles.slot, isCurrent && styles.slotCurrent]}
							onPress={() => !defeated && onSelect(enemy.id)}
							activeOpacity={defeated ? 1 : 0.7}
							disabled={defeated}
						>
							<Image
								source={getFooterCardImage(enemy.rank, enemy.suit)}
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
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(15,23,42,0.75)",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderTopWidth: 1,
		borderTopColor: "rgba(148,163,184,0.15)",
		gap: 8,
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
		width: 56,
		height: 78,
		borderRadius: 6,
		overflow: "hidden",
		backgroundColor: "rgba(255,255,255,0.9)",
		borderWidth: 2,
		borderColor: "transparent",
	},
	slotCurrent: {
		borderColor: "#FBBF24",
		borderRadius: 7,
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
