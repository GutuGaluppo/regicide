import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	introBlock: {
		alignItems: "center",
		paddingVertical: 20,
		gap: 6,
	},
	crownImage: {
		width: 64,
		height: 64,
		marginBottom: 4,
	},
	gameName: {
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 36,
		fontWeight: "900",
		color: "#FBBF24",
		letterSpacing: 6,
	},
	gameSubtitle: {
		color: "#94A3B8",
		fontSize: 13,
		letterSpacing: 0.5,
	},
	gameInfoRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 10,
	},
	gameInfoBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		backgroundColor: "rgba(15,23,42,0.8)",
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.2)",
	},
	gameInfoIcon: { fontSize: 13 },
	gameInfoText: {
		color: "#F1F5F9",
		fontSize: 16,
		fontWeight: "600",
	},
});
