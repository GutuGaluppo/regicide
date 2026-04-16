import { CardSelectionInfo, SUITS } from "@/components/AttackInput/AttackInput.constants";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface ComboBarProps {
	info: CardSelectionInfo | null;
}

export const ComboBar = ({ info }: ComboBarProps) => {
	if (!info) return null;

	const suitIcon = SUITS.find((s) => s.suit === info.suit)?.icon;

	return (
		<View style={[styles.container, info.immune && styles.containerImmune]}>
			<View style={styles.row}>
				{suitIcon && (
					<Image source={suitIcon} style={styles.suitIcon} resizeMode="contain" />
				)}
				<Text style={styles.rank}>{info.rank}</Text>
				{info.rank !== "Jester" && (
					<Text style={styles.damage}>{info.damage}</Text>
				)}
			</View>
			<Text style={styles.power}>{info.powerPreview}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(30,41,59,0.85)",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
		gap: 2,
		marginHorizontal: 4,
	},
	containerImmune: {
		borderLeftColor: "#EF4444",
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
	},
	damage: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 15,
		marginLeft: "auto",
	},
	power: {
		color: "#94A3B8",
		fontSize: 12,
	},
});
