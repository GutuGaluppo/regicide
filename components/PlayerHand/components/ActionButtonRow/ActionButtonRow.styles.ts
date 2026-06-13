import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		paddingHorizontal: 12,
	},
	sortBtn: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: "rgba(221, 235, 255, 0.69)",
	},
	playBtn: {
		justifyContent: "center",
		alignItems: "center",
	},
	playBtnDisabled: {
		opacity: 0.65,
	},
	playBtnInner: {
		width: 45,
		height: 45,
		backgroundColor: "#67826E",
		borderWidth: 2,
		borderColor: "#799881",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},

	// ── Desktop: botões com legenda ──────────────────────────────────────────
	desktopRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 4,
	},
	desktopSortGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	textBtn: {
		paddingVertical: 13,
		paddingHorizontal: 26,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	textBtnPrimary: {
		backgroundColor: "#67826E",
		borderColor: "#9DBBA4",
	},
	textBtnSecondary: {
		backgroundColor: "rgba(180,130,60,0.4)",
		borderColor: "rgba(232,213,163,0.7)",
	},
	textBtnGhost: {
		backgroundColor: "rgba(255,255,255,0.06)",
		borderColor: "rgba(232,213,163,0.35)",
		paddingVertical: 11,
		paddingHorizontal: 18,
	},
	textBtnDisabled: {
		opacity: 0.45,
	},
	textBtnLabel: {
		fontFamily: "Cinzel",
		fontSize: 16,
		letterSpacing: 1,
		color: "#F0E0B0",
	},
	textBtnLabelPrimary: {
		color: "#F4FBF5",
		fontSize: 17,
	},
	textBtnLabelGhost: {
		fontFamily: "Cinzel",
		fontSize: 13,
		letterSpacing: 0.8,
		color: "#CBD5E1",
	},
});
