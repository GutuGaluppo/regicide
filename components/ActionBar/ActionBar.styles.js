import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 10,
		paddingHorizontal: 16,
		paddingVertical: 10,
		justifyContent: "center",
	},
	btn: {
		paddingHorizontal: 28,
		paddingVertical: 11,
		borderRadius: 8,
		minWidth: 110,
		alignItems: "center",
	},
	btnDisabled: { opacity: 0.4 },
	btnText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 14,
	},
});
