import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
		gap: 48,
	},
	header: { alignItems: "center", gap: 12 },
	langRow: {
		flexDirection: "row",
		gap: 6,
	},
	langBtn: {
		paddingHorizontal: 12,
		paddingVertical: 5,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.3)",
		backgroundColor: "rgba(15,23,42,0.5)",
	},
	langBtnActive: {
		borderColor: "#FBBF24",
		backgroundColor: "rgba(251,191,36,0.15)",
	},
	langText: {
		color: "#94A3B8",
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	langTextActive: {
		color: "#FBBF24",
	},
	cards: { width: "100%", gap: 16 },
	card: {
		borderRadius: 16,
		padding: 24,
		gap: 8,
		borderWidth: 1,
	},
	cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
	cardGame: {
		backgroundColor: "rgba(71,85,105,0.7)",
		borderColor: "#67826E",
	},
	cardTracker: {
		backgroundColor: "rgba(71,85,105,0.7)",
		borderColor: "#D5B377",
	},
	cardInstructions: {
		backgroundColor: "rgba(71,85,105,0.7)",
		borderColor: "#94A3B8",
	},
	cardTitle: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 24,
		fontWeight: "700",
		width: "100%",
	},
	cardDesc: {
		color: "#e4ebfe",
		fontSize: 16,
		lineHeight: 18,
	},
});
