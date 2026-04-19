import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	soloTierList: {
		gap: 6,
	},
	soloTierRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: "rgba(255,255,255,0.04)",
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.1)",
	},
	soloTierLabel: {
		color: "#94A3B8",
		fontSize: 13,
	},
	soloTierValue: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 13,
	},
});
