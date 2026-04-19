import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	bodyText: {
		color: "#CBD5E1",
		fontSize: 14,
		lineHeight: 22,
	},
	victoryBlock: {
		backgroundColor: "rgba(34,197,94,0.1)",
		borderRadius: 10,
		padding: 12,
		gap: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
	},
	victoryTitle: { color: "#22C55E", fontWeight: "700", fontSize: 15 },
	defeatBlock: {
		backgroundColor: "rgba(239,68,68,0.1)",
		borderRadius: 10,
		padding: 12,
		gap: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#EF4444",
	},
	defeatTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	defeatIcon: {
		width: 20,
		height: 20,
	},
	defeatTitle: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
	endText: { color: "#CBD5E1", fontSize: 13, lineHeight: 20 },
});
