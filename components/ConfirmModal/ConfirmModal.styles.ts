import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.65)",
		justifyContent: "center",
		alignItems: "center",
		padding: 28,
	},
	card: {
		width: "100%",
		maxWidth: 420,
		backgroundColor: "rgba(10,7,3,0.98)",
		borderRadius: 18,
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.45)",
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 18,
		gap: 12,
	},
	title: {
		fontFamily: "Cinzel",
		fontSize: 19,
		color: "#E8D5A3",
		textAlign: "center",
		letterSpacing: 0.5,
	},
	body: {
		fontFamily: "IMFellEnglish",
		fontSize: 15,
		lineHeight: 22,
		color: "#CBD5E1",
		textAlign: "center",
	},
	buttonRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 8,
	},
	button: {
		flex: 1,
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
		borderWidth: 1,
	},
	cancelButton: {
		backgroundColor: "rgba(255,255,255,0.04)",
		borderColor: "rgba(148,163,184,0.35)",
	},
	confirmButton: {
		backgroundColor: "rgba(180,130,60,0.5)",
		borderColor: "rgba(232,213,163,0.8)",
	},
	confirmButtonDanger: {
		backgroundColor: "rgba(180,60,60,0.5)",
		borderColor: "rgba(248,113,113,0.8)",
	},
	cancelText: {
		fontFamily: "Cinzel",
		fontSize: 14,
		color: "#94A3B8",
		letterSpacing: 0.5,
	},
	confirmText: {
		fontFamily: "Cinzel",
		fontSize: 14,
		color: "#F0E0B0",
		letterSpacing: 0.5,
	},
});
