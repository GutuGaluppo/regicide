import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		paddingHorizontal: 12,
	},
	sortBtn: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: "rgba(221, 235, 255, 0.69)",
	},
	playBtn: {
		justifyContent: "center",
		alignItems: "center",
	},
	playBtnDisabled: {
		opacity: 0.65,
	},
	playBtnInner: {
		width: 45,
		height: 45,
		backgroundColor: "#67826E",
		borderWidth: 2,
		borderColor: "#799881",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
});
