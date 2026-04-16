import { CardSelectionInfo, SUITS } from "@/components/AttackInput/AttackInput.constants";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface ComboBarProps {
	info: CardSelectionInfo | null;
	/** True when a suit has been selected but card hasn't been chosen yet */
	suitSelected?: boolean;
}

export const ComboBar = ({ info, suitSelected }: ComboBarProps) => {
	if (!info) {
		return (
			<View style={styles.container}>
				<Text style={styles.hint}>
					{suitSelected ? "Selecione uma carta" : "Selecione um naipe para atacar"}
				</Text>
			</View>
		);
	}

	const suitIcon = SUITS.find((s) => s.suit === info.suit)?.icon;

	return (
		<View style={[styles.container, info.immune && styles.containerImmune]}>
			<View style={styles.row}>
				{suitIcon && (
					<Image source={suitIcon} style={styles.suitIcon} resizeMode="contain" />
				)}
				<Text style={styles.rank}>{info.rank}</Text>
				{info.rank !== "Jester" && (
					<View style={styles.damageWrapper}>
						<Text style={styles.damageLabel}>DMG</Text>
						<Text style={styles.damage}>{info.damage}</Text>
					</View>
				)}
			</View>
			<Text style={styles.power} numberOfLines={2}>{info.powerPreview}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(30,41,59,0.9)",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderLeftWidth: 3,
		borderLeftColor: "#334155",
		marginHorizontal: 4,
		minHeight: 36,
		justifyContent: "center",
	},
	containerImmune: {
		borderLeftColor: "#EF4444",
	},
	hint: {
		color: "#475569",
		fontSize: 12,
		fontStyle: "italic",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	suitIcon: {
		width: 20,
		height: 20,
	},
	rank: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 15,
		flex: 1,
	},
	damageWrapper: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: 4,
	},
	damageLabel: {
		color: "#64748B",
		fontSize: 10,
		fontWeight: "600",
		textTransform: "uppercase",
	},
	damage: {
		color: "#FBBF24",
		fontWeight: "800",
		fontSize: 17,
	},
	power: {
		color: "#94A3B8",
		fontSize: 12,
		marginTop: 2,
	},
});
