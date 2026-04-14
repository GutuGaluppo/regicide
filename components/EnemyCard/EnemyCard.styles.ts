import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	card: {
		alignItems: "center",
	},
	imageWrapper: {
		position: "relative",
		width: 210,
		height: 320,
	},
	image: {
		width: 210,
		height: 320,
		borderRadius: 12,
	},
	damageFlash: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#EF4444",
		borderRadius: 12,
	},
	shieldGlowOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(96,165,250,0.25)",
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "rgba(147,197,253,0.9)",
	},
	atkBadge: {
		position: "absolute",
		top: 20,
		right: -65,
		alignItems: "center",
		gap: 4,
	},
	jesterBadge: {
		position: "absolute",
		top: 16,
		left: -68,
		alignItems: "center",
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
	shieldedWrapper: {
		width: 88,
		height: 88,
		justifyContent: "center",
		alignItems: "center",
	},
	shieldIconBg: {
		position: "absolute",
		top: -8,
		left: 0,
		width: 88,
		height: 88,
	},
	shieldNumber: {
		position: "absolute",
		top: 25, // (88/2 - 8) - 22/2 = center of shifted shield image
		alignSelf: "center",
	},
	shieldPile: {
		position: "relative",
	},
	shieldPileCard: {
		position: "absolute",
		width: 50,
		height: 66,
		borderRadius: 5,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(96,165,250,0.5)",
	},
	shieldPileImg: {
		width: "100%",
		height: "100%",
	},
	shieldPileFallback: {
		flex: 1,
		color: "#1E293B",
		fontSize: 10,
		fontWeight: "bold",
		textAlign: "center",
		textAlignVertical: "center",
		backgroundColor: "#F8FAFC",
	},
});
