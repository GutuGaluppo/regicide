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
	},
	image: {
		borderRadius: 10,
	},
	skullBtn: {
		position: "absolute",
		padding: 4,
	},
	atkBadge: {
		position: "absolute",
		alignItems: "center",
		gap: 4,
	},
	hpBadge: {
		position: "absolute",
		alignItems: "center",
		gap: 4,
	},
	badgeLabel: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontWeight: "700",
		letterSpacing: 0.8,
		textTransform: "uppercase",
		textShadowColor: "rgba(0,0,0,0.8)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
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
