import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 56,
		left: 8,
		gap: 4,
		zIndex: 10,
	},
	row: {
		flexDirection: "row",
		gap: 4,
	},
	cell: {
		width: 32,
		height: 32,
	},
	icon: {
		width: 32,
		height: 32,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.55)",
		borderRadius: 4,
	},
	x: {
		color: "#EF4444",
		fontSize: 16,
		fontWeight: "800",
		lineHeight: 18,
	},
});
