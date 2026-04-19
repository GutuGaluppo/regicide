import { Dimensions, StyleSheet } from "react-native";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 2 columns with 24px padding each side and 16px gap
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 16) / 2;
const CARD_HEIGHT = CARD_WIDTH / 0.67;
const BG_MAX_SHIFT = 12 * 18;
const BG_WIDTH = SCREEN_WIDTH + BG_MAX_SHIFT;

export const styles = StyleSheet.create({
	root: {
		flex: 1,
		overflow: "hidden",
	},
	bg: {
		position: "absolute",
		top: 0,
		left: 0,
		width: BG_WIDTH,
		height: SCREEN_HEIGHT,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.55)",
		justifyContent: "center",
		alignItems: "center",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: 16,
		paddingHorizontal: 24,
	},
	cell: {
		width: CARD_WIDTH,
		height: CARD_HEIGHT,
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
