import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.65)",
	},
	backdropCenter: {
		justifyContent: "center",
		alignItems: "center",
		padding: 28,
	},
	backdropBottom: {
		justifyContent: "flex-end",
	},
	card: {
		backgroundColor: "rgba(10,7,3,0.98)",
		borderColor: "rgba(232,213,163,0.45)",
		borderWidth: 1,
		padding: 22,
		gap: 12,
	},
	cardDesktop: {
		width: "100%",
		maxWidth: 640,
		borderRadius: 18,
		maxHeight: "86%",
	},
	cardMobile: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: "88%",
	},
	title: {
		fontFamily: "Cinzel",
		fontSize: 18,
		color: "#E8D5A3",
		textAlign: "center",
		letterSpacing: 0.5,
	},
	description: {
		fontFamily: "IMFellEnglish",
		fontSize: 14,
		color: "#CBD5E1",
		textAlign: "center",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: 16,
		paddingVertical: 8,
	},
	gridItem: {
		alignItems: "center",
		gap: 6,
		padding: 6,
		borderRadius: 12,
	},
	gridItemSelected: {
		backgroundColor: "rgba(232,213,163,0.12)",
	},
	gridLabel: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#94A3B8",
	},
	gridLabelSelected: {
		color: "#F0E0B0",
	},
	footer: {
		flexDirection: "row",
		gap: 12,
		marginTop: 4,
	},
	btn: {
		flex: 1,
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
		borderWidth: 1,
	},
	btnCancel: {
		backgroundColor: "rgba(255,255,255,0.04)",
		borderColor: "rgba(148,163,184,0.35)",
	},
	btnConfirm: {
		backgroundColor: "rgba(180,130,60,0.5)",
		borderColor: "rgba(232,213,163,0.8)",
	},
	btnCancelText: {
		fontFamily: "Cinzel",
		fontSize: 14,
		color: "#94A3B8",
		letterSpacing: 0.5,
	},
	btnConfirmText: {
		fontFamily: "Cinzel",
		fontSize: 14,
		color: "#F0E0B0",
		letterSpacing: 0.5,
	},
});
