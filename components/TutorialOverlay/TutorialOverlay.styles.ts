import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	// ── Welcome modal ───────────────────────────────────────────────────────────
	modalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.85)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	modalCard: {
		width: "100%",
		maxWidth: 400,
		backgroundColor: "rgba(10, 7, 3, 0.98)",
		borderWidth: 1,
		borderColor: "rgba(232, 213, 163, 0.55)",
		borderRadius: 14,
		paddingHorizontal: 28,
		paddingVertical: 28,
		gap: 16,
	},
	modalTitle: {
		fontFamily: "Cinzel",
		fontSize: 20,
		color: "#E8D5A3",
		textAlign: "center",
		letterSpacing: 1,
	},
	modalBody: {
		fontFamily: "IMFellEnglish",
		fontSize: 15,
		color: "#C8BAA0",
		lineHeight: 24,
		textAlign: "center",
	},

	// ── Step panel (inline) ─────────────────────────────────────────────────────
	panel: {
		marginHorizontal: 16,
		marginVertical: 6,
		backgroundColor: "rgba(10, 7, 3, 0.96)",
		borderWidth: 1,
		borderColor: "rgba(232, 213, 163, 0.45)",
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 10,
		gap: 5,
	},
	panelHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	panelTitle: {
		fontFamily: "Cinzel",
		fontSize: 13,
		color: "#E8D5A3",
		letterSpacing: 0.8,
		flex: 1,
	},
	panelBody: {
		fontFamily: "IMFellEnglish",
		fontSize: 14,
		color: "#C8BAA0",
		lineHeight: 20,
	},

	// ── Shared buttons ──────────────────────────────────────────────────────────
	primaryBtn: {
		backgroundColor: "rgba(180, 130, 60, 0.5)",
		borderWidth: 1,
		borderColor: "rgba(232, 213, 163, 0.8)",
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: "center",
		marginTop: 8,
	},
	primaryBtnText: {
		fontFamily: "Cinzel",
		fontSize: 14,
		color: "#E8D5A3",
		letterSpacing: 1,
	},
	skipBtn: {
		paddingHorizontal: 4,
		paddingVertical: 2,
	},
	skipLink: {
		alignItems: "center",
	},
	skipText: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "rgba(148, 163, 184, 0.65)",
	},
});
