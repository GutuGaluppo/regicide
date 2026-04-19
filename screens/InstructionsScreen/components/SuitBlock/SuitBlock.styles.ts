import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	suitClassIcon: {
		width: 22,
		height: 22,
	},
	suitBlock: {
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
