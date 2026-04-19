import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	table: {
		borderRadius: 8,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.15)",
	},
	tableRow: {
		flexDirection: "row",
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	tableRowHeader: {
		backgroundColor: "rgba(251,191,36,0.12)",
	},
	tableRowAlt: {
		backgroundColor: "rgba(255,255,255,0.03)",
	},
	tableCell: {
		flex: 1,
		color: "#CBD5E1",
		fontSize: 13,
	},
	tableCellHeader: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 12,
		letterSpacing: 0.3,
		textTransform: "uppercase",
	},
	tableCellCenter: { textAlign: "center" },
	tableCellRight: { textAlign: "right" },
	tableCellBold: {
		color: "#F1F5F9",
		fontWeight: "600",
	},
	statHp: { color: "#4ADE80", fontWeight: "700" },
	statAtk: { color: "#FBBF24", fontWeight: "700" },
});
