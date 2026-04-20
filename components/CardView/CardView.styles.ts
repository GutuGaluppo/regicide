import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	wrapper: {
		position: "relative",
	},
	card: {
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "transparent",
		overflow: "hidden",
		backgroundColor: "#F8FAFC",
	},
	cardImage: {
		width: "100%",
		height: "100%",
	},
	cardImmune: {
		borderColor: "#EF4444",
	},
	cardSelected: {
		borderColor: "#FBBF24",
	},
	cardDiscardSelected: {
		borderColor: "#EF4444",
	},
	discardOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(239, 68, 68, 0.28)",
	},
	selectedDotDiscard: {
		backgroundColor: "#EF4444",
	},
	disabled: {
		opacity: 0.4,
	},
	rank: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
	suit: {
		fontSize: 22,
		marginTop: 2,
		textAlign: "center",
	},
	selectedDot: {
		position: "absolute",
		bottom: 4,
		alignSelf: "center",
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#FBBF24",
	},
	immuneIcon: {
		position: "absolute",
		bottom: 2,
		left: 2,
	},
});
