import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	panel: {
		backgroundColor: "rgba(15,23,42,0.75)",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.15)",
		paddingVertical: 12,
		paddingHorizontal: 16,
		gap: 10,
		width: "100%",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	item: {
		alignItems: "center",
		gap: 2,
	},
	itemIcon: { fontSize: 18 },
	itemValue: {
		color: "#F1F5F9",
		fontSize: 18,
		fontWeight: "700",
	},
	itemLabel: {
		color: "#64748B",
		fontSize: 9,
		fontWeight: "600",
		letterSpacing: 0.5,
		textTransform: "uppercase",
		textAlign: "center",
	},
	killList: { marginTop: 2 },
	killChip: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
		backgroundColor: "rgba(239,68,68,0.12)",
		borderWidth: 1,
		borderColor: "rgba(239,68,68,0.3)",
		marginRight: 6,
	},
	killText: {
		color: "#FCA5A5",
		fontSize: 12,
		fontWeight: "700",
	},
});
