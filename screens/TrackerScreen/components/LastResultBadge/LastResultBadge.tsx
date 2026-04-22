import { AttackResult } from "@/store/trackerStore";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LastResultBadgeProps {
	result: AttackResult;
	onDismiss: () => void;
}

export const LastResultBadge = ({ result, onDismiss }: LastResultBadgeProps) => {
	const { t } = useTranslation();

	return (
		<View style={[styles.badge, result.immune && styles.badgeImmune]}>
			<View style={styles.content}>
				<Text style={styles.damage}>
					{result.immune ? t("tracker.immune") : ""}
					{t("tracker.damage", { value: result.damage })}
				</Text>
				<Text style={styles.power}>{result.powerText}</Text>
			</View>
			<TouchableOpacity onPress={onDismiss} style={styles.closeBtn} hitSlop={8}>
				<Text style={styles.closeIcon}>✕</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	badge: {
		marginHorizontal: 4,
		backgroundColor: "rgba(30,41,59,0.9)",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 7,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	badgeImmune: {
		borderLeftColor: "#EF4444",
	},
	content: {
		flex: 1,
		gap: 2,
	},
	damage: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 14,
	},
	power: {
		color: "#94A3B8",
		fontSize: 12,
	},
	closeBtn: {
		padding: 4,
	},
	closeIcon: {
		color: "#475569",
		fontSize: 14,
		fontWeight: "700",
	},
});
