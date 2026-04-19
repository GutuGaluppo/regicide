import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	// ── Layout ────────────────────────────────────────────────────────────────
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.65)",
	},
	scroll: { flex: 1 },
	scrollContent: {
		paddingHorizontal: 16,
		paddingBottom: 16,
		gap: 16,
	},

	// ── Intro block ───────────────────────────────────────────────────────────
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
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.2)",
	},
	gameInfoIcon: { fontSize: 13 },
	gameInfoText: {
		color: "#F1F5F9",
		fontSize: 13,
		fontWeight: "600",
	},

	// ── Section ───────────────────────────────────────────────────────────────
	section: {
		backgroundColor: "rgba(15,23,42,0.8)",
		borderRadius: 14,
		padding: 16,
		gap: 12,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.12)",
	},
	sectionTitle: {
		fontFamily: "IMFellEnglish-Regular",
		color: "#FBBF24",
		fontSize: 17,
		fontWeight: "700",
		letterSpacing: 0.5,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(251,191,36,0.2)",
		paddingBottom: 8,
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(148,163,184,0.15)",
	},

	// ── Text variants ─────────────────────────────────────────────────────────
	bodyText: {
		color: "#CBD5E1",
		fontSize: 14,
		lineHeight: 22,
	},
	stepSubtitle: {
		color: "#F1F5F9",
		fontSize: 14,
		fontWeight: "700",
		fontStyle: "italic",
	},
	labelText: {
		color: "#94A3B8",
		fontSize: 13,
		fontWeight: "600",
		letterSpacing: 0.2,
	},
	noteBlock: {
		backgroundColor: "rgba(251,191,36,0.06)",
		borderRadius: 8,
		padding: 10,
		borderLeftWidth: 3,
		borderLeftColor: "rgba(251,191,36,0.4)",
	},
	noteText: {
		color: "#CBD5E1",
		fontSize: 13,
		lineHeight: 19,
		fontStyle: "italic",
	},

	// ── Setup / enemy table ───────────────────────────────────────────────────
	table: {
		borderRadius: 8,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.15)",
	},
	tableRow: {
		flexDirection: "row",
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	tableRowHeader: {
		backgroundColor: "rgba(251,191,36,0.12)",
	},
	tableRowAlt: {
		backgroundColor: "rgba(255,255,255,0.03)",
	},
	tableCell: {
		flex: 1,
		color: "#CBD5E1",
		fontSize: 13,
	},
	tableCellHeader: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 12,
		letterSpacing: 0.3,
		textTransform: "uppercase",
	},
	tableCellCenter: { textAlign: "center" },
	tableCellRight: { textAlign: "right" },
	tableCellBold: {
		color: "#F1F5F9",
		fontWeight: "600",
	},
	statHp: { color: "#4ADE80", fontWeight: "700" },
	statAtk: { color: "#FBBF24", fontWeight: "700" },

	// ── 4-passos summary ──────────────────────────────────────────────────────
	stepSummaryList: {
		gap: 6,
		paddingLeft: 4,
	},
	stepSummaryText: {
		color: "#F1F5F9",
		fontSize: 14,
		fontWeight: "600",
		fontStyle: "italic",
		lineHeight: 22,
	},
	stepSummaryFirst: {},

	// ── Suit block ────────────────────────────────────────────────────────────
	suitBlock: {
		borderLeftWidth: 3,
		paddingLeft: 12,
		gap: 4,
	},
	suitBlockHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	suitBlockSymbol: {
		fontSize: 18,
		fontWeight: "700",
	},
	suitBlockName: {
		fontSize: 13,
		fontWeight: "800",
		letterSpacing: 0.8,
	},
	suitBlockBody: {
		color: "#CBD5E1",
		fontSize: 13,
		lineHeight: 20,
	},

	// ── Defeat steps (I, II, III, IV) ─────────────────────────────────────────
	defeatStepList: { gap: 8 },
	defeatStepRow: {
		flexDirection: "row",
		gap: 10,
		alignItems: "flex-start",
	},
	defeatStepNum: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 13,
		width: 32,
		flexShrink: 0,
	},
	defeatStepText: {
		flex: 1,
		color: "#CBD5E1",
		fontSize: 13,
		lineHeight: 20,
	},

	// ── Defeated enemy value table ─────────────────────────────────────────────
	defeatedTable: {
		gap: 8,
	},
	defeatedRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	defeatedRankBadge: {
		width: 32,
		height: 32,
		borderRadius: 8,
		backgroundColor: "rgba(251,191,36,0.15)",
		borderWidth: 1,
		borderColor: "rgba(251,191,36,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	defeatedRankText: {
		color: "#FBBF24",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 16,
		fontWeight: "700",
	},
	defeatedLabel: {
		flex: 1,
		color: "#F1F5F9",
		fontWeight: "600",
		fontSize: 14,
	},
	defeatedValue: {
		color: "#FBBF24",
		fontWeight: "800",
		fontSize: 15,
	},

	// ── Communication examples ────────────────────────────────────────────────
	commExample: {
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderLeftWidth: 3,
	},
	commAllowed: {
		backgroundColor: "rgba(74,222,128,0.07)",
		borderLeftColor: "#4ADE80",
	},
	commForbidden: {
		backgroundColor: "rgba(248,113,113,0.07)",
		borderLeftColor: "#F87171",
	},
	commText: {
		fontSize: 13,
		lineHeight: 19,
	},

	// ── Victory / defeat blocks ───────────────────────────────────────────────
	victoryBlock: {
		backgroundColor: "rgba(34,197,94,0.1)",
		borderRadius: 10,
		padding: 12,
		gap: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
	},
	victoryTitle: { color: "#22C55E", fontWeight: "700", fontSize: 15 },
	defeatBlock: {
		backgroundColor: "rgba(239,68,68,0.1)",
		borderRadius: 10,
		padding: 12,
		gap: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#EF4444",
	},
	defeatTitle: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
	endText: { color: "#CBD5E1", fontSize: 13, lineHeight: 20 },

	// ── Solo tiers ────────────────────────────────────────────────────────────
	soloTierList: {
		gap: 6,
	},
	soloTierRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: "rgba(255,255,255,0.04)",
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.1)",
	},
	soloTierLabel: {
		color: "#94A3B8",
		fontSize: 13,
	},
	soloTierValue: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 13,
	},
});
