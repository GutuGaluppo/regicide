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
	cellDesktop: {
		width: 52,
		height: 52,
	},
	iconDesktop: {
		width: 52,
		height: 52,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 4,
	},
	// Moeda/token (caveira com cores invertidas) que marca o inimigo derrotado.
	token: {
		width: 26,
		height: 26,
	},
	tokenDesktop: {
		width: 42,
		height: 42,
	},
});
