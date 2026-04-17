import { StyleSheet } from "react-native";
import { BG_WIDTH } from "./TrackerScreen.constants";

export const styles = StyleSheet.create({
	bg: { flex: 1, overflow: "hidden" },
	bgImage: {
		position: "absolute",
		top: 0,
		left: 0,
		width: BG_WIDTH,
		height: "100%",
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		flexDirection: "column",
	},
	top: {
		flexShrink: 0,
	},
	center: {
		flex: 1,
	},
	footer: {
		flexShrink: 0,
	},
	backBtn: { padding: 4 },
	scroll: { flex: 1 },
	scrollContent: { gap: 14, paddingBottom: 8 },
});
