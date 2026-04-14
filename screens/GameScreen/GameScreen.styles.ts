import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.55)",
		justifyContent: "space-between",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 52,
		paddingHorizontal: 12,
		paddingBottom: 4,
	},
	headerBtn: {
		padding: 8,
	},
	statusBar: {
		position: "absolute",
		top: 50,
		left: "50%",
		transform: [{ translateX: -110 }],
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-end",
		gap: 12,
		paddingHorizontal: 16,
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
	},
	error: {
		color: "#FCA5A5",
		fontSize: 12,
		textAlign: "center",
		marginBottom: 4,
		paddingHorizontal: 16,
	},
});
