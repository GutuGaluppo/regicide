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
});
