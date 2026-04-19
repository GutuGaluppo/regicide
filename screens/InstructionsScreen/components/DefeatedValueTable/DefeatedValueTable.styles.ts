import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	defeatedTable: {
		gap: 8,
	},
	defeatedRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	defeatedRankBadge: {
		width: 32,
		height: 32,
		borderRadius: 8,
		backgroundColor: "rgba(251,191,36,0.15)",
		borderWidth: 1,
		borderColor: "rgba(251,191,36,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	defeatedRankText: {
		color: "#FBBF24",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 16,
		fontWeight: "700",
	},
	defeatedLabel: {
		flex: 1,
		color: "#F1F5F9",
		fontWeight: "600",
		fontSize: 14,
	},
	defeatedValue: {
		color: "#FBBF24",
		fontWeight: "800",
		fontSize: 15,
	},
});
