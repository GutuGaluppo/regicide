import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(6,6,12,0.75)",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		paddingVertical: 40,
	},
	panel: {
		width: "100%",
		maxWidth: 480,
		maxHeight: "100%",
		backgroundColor: "rgba(18,18,28,0.98)",
		borderRadius: 18,
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.25)",
		overflow: "hidden",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 18,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(232,213,163,0.15)",
	},
	title: {
		fontFamily: "Cinzel",
		fontSize: 17,
		color: "#F8E7BC",
		letterSpacing: 0.5,
	},
	close: {
		fontSize: 18,
		color: "#94A3B8",
		paddingHorizontal: 6,
	},
	empty: {
		fontFamily: "IMFellEnglish",
		fontSize: 14,
		color: "#64748B",
		textAlign: "center",
		paddingVertical: 40,
	},
	list: {
		paddingVertical: 8,
	},
	// ── Linha padrão ──────────────────────────────────────────────────────────
	row: {
		flexDirection: "column",
		gap: 4,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	// Linha 1: avatar + nome do autor.
	headerLine: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	// Linha 2: verbo + cartas (ataque/descarte) + dano, inline (com wrap).
	actionLine: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 4,
		paddingLeft: 30,
	},
	name: {
		fontFamily: "Cinzel",
		fontSize: 13,
		color: "#E8D5A3",
	},
	verb: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#CBD5E1",
		marginRight: 2,
	},
	damage: {
		fontFamily: "Cinzel",
		fontSize: 11,
		color: "#F87171",
	},
	shield: {
		fontFamily: "Cinzel",
		fontSize: 11,
		color: "#60A5FA",
	},
	// ── Chip de carta ─────────────────────────────────────────────────────────
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 1,
		backgroundColor: "#F5F0E1",
		borderRadius: 5,
		paddingHorizontal: 5,
		paddingVertical: 2,
		minWidth: 24,
		justifyContent: "center",
	},
	chipRank: {
		fontFamily: "Cinzel",
		fontSize: 11,
		fontWeight: "700",
	},
	chipSuit: {
		fontSize: 11,
	},
	chipJester: {
		fontSize: 12,
	},
	// ── Linha de inimigo derrotado (marco) ────────────────────────────────────
	defeatRow: {
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		marginVertical: 2,
		backgroundColor: "rgba(74,222,128,0.08)",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "rgba(74,222,128,0.18)",
	},
	defeatText: {
		fontFamily: "Cinzel",
		fontSize: 12,
		color: "#4ADE80",
		textAlign: "center",
		letterSpacing: 0.3,
	},
	// Aviso de "golpe exato": a carta do inimigo foi ao topo da taverna.
	exactDeathText: {
		fontFamily: "IMFellEnglish",
		fontSize: 11,
		color: "#E8D5A3",
		textAlign: "center",
		marginTop: 3,
	},
});
