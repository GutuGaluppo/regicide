import { Dimensions, StyleSheet } from "react-native";

const TOTAL_ENEMIES = 12;
const SHIFT_PER_ENEMY = 18;
const MAX_SHIFT = -(TOTAL_ENEMIES * SHIFT_PER_ENEMY);
const SCREEN_WIDTH = Dimensions.get("window").width;
export const BG_WIDTH = SCREEN_WIDTH + Math.abs(MAX_SHIFT);
export const SHIFT_PER_ENEMY_EXPORT = SHIFT_PER_ENEMY;

export const styles = StyleSheet.create({
	bg: { flex: 1, overflow: "hidden" },
	bgImage: {
		position: "absolute",
		top: 0,
		left: 0,
		width: BG_WIDTH,
		height: "100%",
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 12,
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	backBtn: { padding: 4 },
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
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
	backText: { color: "#94A3B8", fontSize: 14 },
	title: { color: "#F1F5F9", fontSize: 18, fontWeight: "700" },
	resetBtn: { padding: 4 },
	resetText: { color: "#683237", fontSize: 14, fontWeight: "600" },
	scroll: { flex: 1 },
	scrollContent: { gap: 14, paddingBottom: 8 },

	enemySection: {
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 16,
	},
	enemySectionDead: {
		opacity: 0.8,
	},
	enemyImageWrapper: {
		position: "relative",
		width: 220,
		height: 309,
	},
	enemyImage: {
		width: 200,
		height: 300,
		borderRadius: 10,
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
	shieldedWrapper: {
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
	resultBadge: {
		marginHorizontal: 16,
		backgroundColor: "rgba(30,41,59,0.8)",
		borderRadius: 10,
		padding: 10,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
		gap: 2,
	},
	resultImmune: { borderLeftColor: "#EF4444" },
	resultDamage: { color: "#FBBF24", fontWeight: "700", fontSize: 14 },
	resultPower: { color: "#94A3B8", fontSize: 12 },
	cardSelectionInfo: {
		marginHorizontal: 16,
		backgroundColor: "rgba(30,41,59,0.8)",
		borderRadius: 10,
		padding: 10,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
		gap: 4,
	},
	cardSelectionInfoImmune: {
		borderLeftColor: "#EF4444",
	},
	cardSelectionRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	cardSelectionIcon: {
		width: 24,
		height: 24,
	},
	cardSelectionRank: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 16,
	},
	cardSelectionDamage: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 16,
		marginLeft: "auto",
	},
	cardSelectionPower: {
		color: "#94A3B8",
		fontSize: 13,
	},
	defeatBtn: {
		marginHorizontal: 16,
		backgroundColor: "rgba(104,50,55,0.5)",
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#683237",
	},
	defeatBtnActive: {
		backgroundColor: "#683237",
		borderColor: "#EF4444",
	},
	defeatBtnText: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 15,
	},
});
