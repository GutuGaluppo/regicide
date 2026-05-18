import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.55)",
		justifyContent: "space-between",
	},
	frame: {
		flex: 1,
		width: "100%",
		alignSelf: "center",
	},
	frameDesktop: {
		backgroundColor: "rgba(2,6,23,0.16)",
	},
	statusBar: {
		position: "absolute",
		top: 50,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-end",
		gap: 12,
		zIndex: 10,
	},
	statusItem: { alignItems: "center", gap: 5 },
	statusCard: {
		width: 49,
		height: 70,
		borderColor: "rgb(5, 71, 84)",
		borderWidth: 3,
		borderRadius: 8,
		overflow: "hidden",
	},
	statusCardImg: { width: "100%", height: "100%" },
	statusCardOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
	deckLabel: {
		color: "rgba(148,163,184,0.8)",
		fontSize: 9,
		fontWeight: "600",
		letterSpacing: 0.8,
		textTransform: "uppercase",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 90,
	},
	handSection: {
		width: "100%",
		alignSelf: "center",
	},
	error: {
		color: "#FCA5A5",
		fontSize: 12,
		textAlign: "center",
		marginBottom: 4,
		paddingHorizontal: 16,
	},
});
