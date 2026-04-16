import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		gap: 8,
		paddingHorizontal: 16,
		paddingTop: 10,
		paddingBottom: 6,
		backgroundColor: "rgba(15,23,42,0.75)",
		borderTopWidth: 1,
		borderTopColor: "rgba(255,255,255,0.08)",
	},
	actionRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 15,
	},
	actionBtn: {
		borderRadius: 10,
		alignItems: "center",
	},
	actionBtnDisabled: {
		opacity: 0.35,
	},
	actionBtnInner: {
		width: 40,
		height: 40,
		backgroundColor: "#67826E",
		borderWidth: 2,
		borderColor: "#799881",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	actionIcon: {
		width: 25,
		height: 35,
		transform: [{ rotate: "45deg" }],
	},
	jesterIcon: {
		width: 25,
		height: 35,
	},
	suitRow: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
	},
	suitWrapper: {
		position: "relative",
	},
	immuneIcon: {
		position: "absolute",
		top: -14,
		left: -14,
		width: 86,
		height: 86,
		opacity: 0.5,
	},
	immuneIconSelected: {
		opacity: 1,
	},
	suitBtn: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		opacity: 0.5,
	},
	suitBtnSelected: {
		opacity: 1,
	},
	suitIcon: {
		width: 60,
		height: 60,
	},
	rankRow: {
		height: 100,
		gap: 8,
		paddingTop: 14,
		paddingBottom: 4,
	},
	jesterRow: {
		flexDirection: "row",
		justifyContent: "center",
		height: 100,
		gap: 12,
		paddingTop: 14,
		paddingBottom: 4,
	},
	cardBtn: {
		width: 58,
		borderRadius: 10,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "transparent",
	},
	cardThumb: {
		width: "100%",
		height: "100%",
	},
	cardThumbDeck: {
		opacity: 0.7,
	},
	cardBtnSelected: {
		borderColor: "#FBBF24",
	},
	cardBtnDimmed: {
		opacity: 0.25,
	},
	cardBtnDisabled: {
		opacity: 0.35,
	},
	cardBtnLifted: {
		transform: [{ translateY: -10 }],
	},
});
