import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	commExample: {
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderLeftWidth: 3,
	},
	commAllowed: {
		backgroundColor: "rgba(74,222,128,0.07)",
		borderLeftColor: "#4ADE80",
	},
	commForbidden: {
		backgroundColor: "rgba(248,113,113,0.07)",
		borderLeftColor: "#F87171",
	},
	commText: {
		fontSize: 13,
		lineHeight: 19,
	},
});
