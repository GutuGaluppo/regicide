import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	panel: {
		backgroundColor: "rgba(15,23,42,0.75)",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.15)",
		paddingVertical: 12,
		paddingHorizontal: 16,
		gap: 10,
		width: "100%",
	},

	// ─── Vertical stat list ───────────────────────────────────────────────────
	statList: {
		gap: 6,
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 3,
	},
	itemIcon: {
		width: 22,
		height: 22,
		opacity: 0.85,
	},
	itemValue: {
		color: "#F1F5F9",
		fontSize: 15,
		fontWeight: "700",
		minWidth: 52,
	},
	itemLabel: {
		color: "#64748B",
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 0.3,
	},

	// ─── Accordion ────────────────────────────────────────────────────────────
	accordionItem: {
		borderTopWidth: 1,
		borderTopColor: "rgba(148,163,184,0.1)",
	},
	accordionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingVertical: 12,
	},
	accordionThumb: {
		width: 44,
		height: 62,
		borderRadius: 5,
	},
	accordionLabel: {
		flex: 1,
		color: "#F1F5F9",
		fontSize: 15,
		fontWeight: "700",
	},
	accordionCount: {
		color: "#64748B",
		fontSize: 13,
		fontWeight: "700",
		minWidth: 22,
		textAlign: "right",
	},
	accordionContent: {
		paddingBottom: 14,
		gap: 10,
	},
	accordionEmpty: {
		color: "#475569",
		fontSize: 12,
		fontStyle: "italic",
	},

	// ─── Mini card images inside accordion ───────────────────────────────────
	cardImageRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
	},
	cardImage: {
		width: 52,
		height: 73,
		borderRadius: 4,
	},

	// ─── Non-enemy accordion icon ─────────────────────────────────────────────
	accordionIcon: {
		width: 36,
		height: 36,
		opacity: 0.7,
	},

	// ─── Card sections (attack / discard) inside enemy accordion ─────────────
	cardSection: {
		gap: 8,
	},
	cardSectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	cardSectionIcon: {
		width: 16,
		height: 16,
		opacity: 0.7,
	},
	cardSectionTitle: {
		flex: 1,
		color: "#94A3B8",
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	cardSectionCount: {
		color: "#475569",
		fontSize: 11,
		fontWeight: "700",
	},
});
