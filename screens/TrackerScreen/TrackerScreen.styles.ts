import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	bg: { flex: 1, overflow: "hidden" },
	bgImage: {
		...StyleSheet.absoluteFillObject,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		flexDirection: "column",
	},
	frame: {
		flex: 1,
		width: "100%",
		alignSelf: "center",
	},
	frameDesktop: {
		backgroundColor: "rgba(2,6,23,0.16)",
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
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		paddingBottom: 8,
	},
});
