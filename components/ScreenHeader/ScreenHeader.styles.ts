import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	header: {
		position: "absolute",
		top: 10,
		left: 0,
		width: "100%",
		zIndex: 1000,
	},
	headerInner: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		alignSelf: "center",
		paddingBottom: 4,
	},
	btn: {
		padding: 6,
	},
	icon: {
		width: 30,
		height: 30,
	},
	rightGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
});
