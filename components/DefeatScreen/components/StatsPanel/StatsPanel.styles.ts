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
		gap: 10,
		paddingVertical: 8,
	},
	accordionThumb: {
		width: 36,
		height: 50,
		borderRadius: 4,
	},
	accordionLabel: {
		flex: 1,
		color: "#F1F5F9",
		fontSize: 13,
		fontWeight: "600",
	},
	accordionCount: {
		color: "#64748B",
		fontSize: 12,
		fontWeight: "700",
		minWidth: 20,
		textAlign: "right",
	},
	accordionContent: {
		paddingBottom: 12,
		paddingLeft: 46,
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
		width: 46,
		height: 64,
		borderRadius: 4,
	},

	// ─── Non-enemy accordion icon ─────────────────────────────────────────────
	accordionIcon: {
		width: 36,
		height: 36,
		opacity: 0.7,
	},
});
