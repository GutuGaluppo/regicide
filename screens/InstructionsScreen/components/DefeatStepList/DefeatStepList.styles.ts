import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	defeatStepList: { gap: 8 },
	defeatStepRow: {
		flexDirection: "row",
		gap: 10,
		alignItems: "flex-start",
	},
	defeatStepNum: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 13,
		width: 32,
		flexShrink: 0,
	},
	defeatStepText: {
		flex: 1,
		color: "#CBD5E1",
		fontSize: 13,
		lineHeight: 20,
	},
});
