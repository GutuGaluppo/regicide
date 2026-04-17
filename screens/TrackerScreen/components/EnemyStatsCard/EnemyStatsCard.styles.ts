import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	section: {
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 16,
	},
	sectionDead: {
		opacity: 0.8,
	},
	imageWrapper: {
		position: "relative",
		width: 220,
		height: 309,
	},
	image: {
		width: 200,
		height: 300,
		borderRadius: 10,
	},
	skullBtn: {
		position: "absolute",
		top: 120,
		left: -45,
		padding: 4,
	},
	skullIcon: {
		width: 30,
		height: 30,
	},
	atkBadge: {
		position: "absolute",
		top: 20,
		right: -65,
		alignItems: "center",
		gap: 4,
	},
	hpBadge: {
		position: "absolute",
		bottom: 20,
		left: -65,
		alignItems: "center",
		gap: 4,
	},
	badgeLabel: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 0.8,
		textTransform: "uppercase",
		textShadowColor: "rgba(0,0,0,0.8)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
	shieldWrapper: {
		width: 88,
		height: 88,
		justifyContent: "center",
		alignItems: "center",
	},
	shieldIconBg: {
		position: "absolute",
		top: 0,
		left: 0,
		width: 88,
		height: 88,
	},
	deadBadge: {
		color: "#EF4444",
		fontWeight: "700",
		fontSize: 13,
		backgroundColor: "rgba(239,68,68,0.15)",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#EF4444",
	},
});
