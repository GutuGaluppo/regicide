import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	suitClassIcon: {
		width: 22,
		height: 22,
		flexShrink: 0,
	},
	suitBlock: {
		width: "100%",
		borderLeftWidth: 3,
		paddingLeft: 12,
		gap: 4,
	},
	suitBlockHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	suitBlockSymbol: {
		fontSize: 18,
		fontWeight: "700",
	},
	suitBlockName: {
		flex: 1,
		minWidth: 0,
		fontSize: 13,
		fontWeight: "800",
		letterSpacing: 0.8,
	},
	suitBlockBody: {
		color: "#CBD5E1",
		fontSize: 13,
		lineHeight: 20,
	},
});
