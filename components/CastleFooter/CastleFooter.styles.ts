import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		backgroundColor: "rgba(15,23,42,0.75)",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderTopWidth: 1,
		borderTopColor: "rgba(148,163,184,0.15)",
		gap: 6,
	},
	label: {
		color: "#94A3B8",
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 1,
		textTransform: "uppercase",
		textAlign: "center",
	},
	row: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
	},
	slot: {
		width: 44,
		aspectRatio: 824 / 1156,
		borderRadius: 6,
		overflow: "hidden",
		backgroundColor: "rgba(255,255,255,0.9)",
		borderWidth: 2,
		borderColor: "transparent",
	},
	slotCurrent: {
		borderColor: "#FBBF24",
		borderRadius: 7,
	},
	miniCard: {
		width: "100%",
		height: "100%",
		borderRadius: 6,
	},
	miniCardDefeated: {
		opacity: 0.5,
	},
	crossOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "flex-end",
		alignItems: "flex-start",
		paddingTop: 14,
	},
	crossIcon: {
		width: "90%",
		height: "90%",
	},
});
