import { StyleSheet } from "react-native";

const SPACING = { paddingTop: 14, paddingBottom: 44, rowLift: 4 } as const;
const SPACING_COMPACT = { paddingTop: 8, paddingBottom: 24, rowLift: 0 } as const;

/** Folga extra acima das cartas — some no modo compacto. */
export const HAND_ROW_LIFT = SPACING.rowLift;
export const HAND_ROW_LIFT_COMPACT = SPACING_COMPACT.rowLift;

/**
 * Altura que a mão devolve ao centro da tela ao entrar em espaçamento compacto.
 * O cálculo de escala do inimigo usa este valor para decidir a compacidade sobre
 * uma altura normalizada — sem ele a decisão realimenta a própria medição e o
 * inimigo pisca entre as duas escalas.
 */
export const HAND_COMPACT_RECLAIMED_HEIGHT =
	SPACING.paddingTop -
	SPACING_COMPACT.paddingTop +
	SPACING.paddingBottom -
	SPACING_COMPACT.paddingBottom +
	SPACING.rowLift -
	SPACING_COMPACT.rowLift;

export const styles = StyleSheet.create({
	container: {
		paddingTop: SPACING.paddingTop,
		paddingBottom: SPACING.paddingBottom,
		width: "100%",
		maxWidth: 1160,
		alignSelf: "center",
	},
	containerCompact: {
		paddingTop: SPACING_COMPACT.paddingTop,
		paddingBottom: SPACING_COMPACT.paddingBottom,
	},
	label: {
		color: "#94A3B8",
		fontSize: 14,
		textAlign: "center",
	},
	sortText: {
		color: "#191a1c",
		fontSize: 14,
		fontWeight: "600",
	},
	handRow: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-end",
		paddingHorizontal: 12,
		alignSelf: "center",
	},
	empty: {
		color: "#64748B",
		fontStyle: "italic",
		paddingHorizontal: 16,
		alignSelf: "center",
	},
	discardBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		minWidth: 200,
		alignSelf: "center",
		marginBottom: 2,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#F3D6D6",
		backgroundColor: "#5F2830",
	},
	discardBtnActive: {
		backgroundColor: "#76323B",
	},
	discardLabel: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.5,
		opacity: 1,
	},
	discardSep: {
		color: "#475569",
		fontSize: 18,
		fontWeight: "600",
		marginHorizontal: 2,
	},
	waitingBar: {
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 12,
		gap: 10,
	},
	waitingBarDesktop: {
		gap: 12,
	},
	waitingArea: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 4,
	},
	waitingCard: {
		// CardView gerencia suas próprias dimensões via useCardSize
	},
	waitingLabel: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#475569",
		fontStyle: "italic",
		paddingVertical: 14,
		textAlign: "center",
	},
	waitingScroll: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		paddingHorizontal: 4,
		marginVertical: 0,
	},
	waitingSortRow: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
	},
	desktopToolbar: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "center",
		gap: 14,
		paddingHorizontal: 12,
	},
	desktopSortRow: {
		maxWidth: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
});
