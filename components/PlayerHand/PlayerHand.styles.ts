import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		paddingVertical: 4,
		width: "100%",
		maxWidth: 1160,
		alignSelf: "center",
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
		marginBottom: 6,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		backgroundColor: "#68323797",
	},
	discardBtnActive: {
		backgroundColor: "#683237",
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
	waitingArea: {
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: -4,
		paddingHorizontal: 12,
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
	},
	waitingScroll: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
		paddingHorizontal: 4,
		marginVertical: -10,
	},
});
