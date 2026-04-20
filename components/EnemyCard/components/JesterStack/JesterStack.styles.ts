import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	stack: {
		position: "relative",
		width: 68,
		height: 88,
	},
	stackActive: {
		// glow handled via activeDot
	},
	card: {
		position: "absolute",
		width: 46,
		height: 64,
		borderRadius: 5,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(167,139,250,0.5)",
		backgroundColor: "#0F172A",
	},
	face: {
		...StyleSheet.absoluteFillObject,
		backfaceVisibility: "hidden",
	},
	frontFace: {
		zIndex: 1,
	},
	backFace: {
		transform: [{ rotateY: "180deg" }],
	},
	img: { width: "100%", height: "100%" },
	activeDot: {
		position: "absolute",
		bottom: -6,
		alignSelf: "center",
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#A78BFA",
	},
});
