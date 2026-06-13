import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		paddingHorizontal: 12,
	},
	sortBtn: {
		minWidth: 42,
		minHeight: 42,
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "rgba(245, 231, 187, 0.42)",
		backgroundColor: "rgba(11, 14, 20, 0.92)",
		alignItems: "center",
		justifyContent: "center",
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
		backgroundColor: "#314B3B",
		borderWidth: 1,
		borderColor: "#D5E6D4",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},

	// ── Desktop: botões com legenda ──────────────────────────────────────────
	desktopRow: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		flexWrap: "wrap",
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 4,
	},
	desktopActionGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	desktopSortGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	textBtn: {
		flexDirection: "row",
		gap: 8,
		minHeight: 48,
		paddingVertical: 13,
		paddingHorizontal: 22,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	btnIcon: {
		width: 20,
		height: 20,
	},
	btnIconGhost: {
		width: 18,
		height: 18,
	},
	textBtnPrimary: {
		backgroundColor: "#314B3B",
		borderColor: "#D5E6D4",
	},
	textBtnSecondary: {
		backgroundColor: "#2F2417",
		borderColor: "#E8D5A3",
	},
	textBtnGhost: {
		backgroundColor: "#141A24",
		borderColor: "rgba(245,231,187,0.44)",
		paddingVertical: 11,
		paddingHorizontal: 18,
	},
	textBtnDisabled: {
		opacity: 0.52,
	},
	textBtnLabel: {
		fontFamily: "Cinzel",
		fontSize: 16,
		letterSpacing: 1,
		color: "#FFF4D6",
	},
	textBtnLabelPrimary: {
		color: "#F5F8F3",
		fontSize: 17,
	},
	textBtnLabelGhost: {
		fontFamily: "Cinzel",
		fontSize: 14,
		letterSpacing: 0.8,
		color: "#F5E7BB",
	},
});
