import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	bg: {
		flex: 1,
		overflow: "hidden",
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	content: {
		alignItems: "center",
		gap: 12,
		width: "100%",
		maxWidth: 540,
	},
	title: {
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 48,
		fontWeight: "900",
		color: "#FBBF24",
		letterSpacing: 2,
		padding: 15,
	},
	subtitle: {
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 16,
		color: "#CBD5E1",
		fontWeight: "500",
		letterSpacing: 1,
		textTransform: "uppercase",
		marginBottom: 8,
	},
	image: {
		position: "absolute",
		top: -160,
		width: "55%",
		maxWidth: 260,
		height: 180,
	},
	actions: {
		width: "100%",
		gap: 12,
		marginTop: 8,
	},
	btnReset: {
		backgroundColor: "#FBBF24",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	btnResetText: {
		color: "#0F172A",
		fontWeight: "800",
		fontSize: 16,
		letterSpacing: 0.5,
	},
	btnHome: {
		backgroundColor: "rgba(15,23,42,0.75)",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.3)",
	},
	btnHomeText: {
		color: "#94A3B8",
		fontWeight: "600",
		fontSize: 15,
	},
	btnLog: {
		marginTop: 14,
		alignItems: "center",
		paddingVertical: 6,
	},
	btnLogText: {
		color: "#E8D5A3",
		fontSize: 13,
		textDecorationLine: "underline",
		opacity: 0.85,
	},
});
