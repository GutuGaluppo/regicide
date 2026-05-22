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
		flex: 1.15,
		minWidth: 0,
		gap: 12,
	},
	tableColumn: {
		flex: 0.85,
		minWidth: 0,
		alignSelf: "stretch",
	},
	stepSubtitle: {
		color: "#F1F5F9",
		fontSize: 14,
		fontWeight: "700",
		fontStyle: "italic",
	},
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
});
