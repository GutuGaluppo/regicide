import { AttackResult } from "@/hooks/useTracker";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface LastResultBadgeProps {
	result: AttackResult;
}

export const LastResultBadge = ({ result }: LastResultBadgeProps) => {
	const { t } = useTranslation();

	return (
		<View style={[styles.badge, result.immune && styles.badgeImmune]}>
			<Text style={styles.damage}>
				{result.immune ? t("tracker.immune") : ""}
				{t("tracker.damage", { value: result.damage })}
			</Text>
			<Text style={styles.power}>{result.powerText}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	badge: {
		marginHorizontal: 16,
		backgroundColor: "rgba(30,41,59,0.8)",
		borderRadius: 10,
		padding: 10,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
		gap: 2,
	},
	badgeImmune: {
		borderLeftColor: "#EF4444",
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
});
