import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	sectionIconRow: {
		alignItems: "center",
		paddingVertical: 4,
	},
	sectionIconMd: {
		width: 64,
		height: 64,
	},
	bodyText: {
		color: "#CBD5E1",
		fontSize: 14,
		lineHeight: 22,
	},
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
	},
	tableColumn: {
		flex: 0.85,
		minWidth: 0,
		alignSelf: "stretch",
	},
	noteBlock: {
		backgroundColor: "rgba(251,191,36,0.06)",
		borderRadius: 8,
		padding: 10,
		borderLeftWidth: 3,
		borderLeftColor: "rgba(251,191,36,0.4)",
	},
	noteText: {
		color: "#CBD5E1",
		fontSize: 13,
		lineHeight: 19,
		fontStyle: "italic",
	},
});
