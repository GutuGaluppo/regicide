import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	contentLayout: {
		gap: 16,
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
	bodyText: {
		color: "#CBD5E1",
		fontSize: 14,
		lineHeight: 22,
	},
});
