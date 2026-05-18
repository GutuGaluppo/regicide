import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	root: {
		flex: 1,
		overflow: "hidden",
	},
	bg: {
		position: "absolute",
		top: 0,
		left: 0,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.55)",
		justifyContent: "center",
		alignItems: "center",
	},
	grid: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignSelf: "center",
	},
	cell: {
		position: "relative",
	},
	card: {
		width: "100%",
		height: "100%",
		borderRadius: 10,
	},
	cardDefeated: {
		opacity: 0.3,
	},
	defeatedOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 10,
	},
});
