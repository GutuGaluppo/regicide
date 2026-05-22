import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	content: {
		flex: 1,
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
