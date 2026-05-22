import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	bodyText: {
		color: "#CBD5E1",
		fontSize: 14,
		lineHeight: 22,
	},
	labelText: {
		color: "#94A3B8",
		fontSize: 13,
		fontWeight: "600",
		letterSpacing: 0.2,
	},
	contentLayout: {
		gap: 26,
		alignItems: "flex-start",
	},
	contentLayoutColumn: {
		flexDirection: "column",
	},
	contentLayoutRow: {
		flexDirection: "row",
	},
	textColumn: {
		flex: 1.1,
		minWidth: 0,
	},
	tableColumn: {
		flex: 0.9,
		minWidth: 0,
		alignSelf: "stretch",
	},
});
