import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.62)",
		justifyContent: "center",
		alignItems: "center",
		gap: 48,
	},
	hero: {
		width: "100%",
		alignItems: "center",
		gap: 32,
	},
	heroDesktop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	// Globe button — top-right corner
	globeBtn: {
		position: "absolute",
		top: 52,
		right: 24,
		padding: 8,
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	globeAbbr: {
		color: "#94A3B8",
		fontFamily: "Cinzel-VariableFont_wght",
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 0.5,
	},

	// Logo
	logo: {
		width: 240,
		height: 240,
		resizeMode: "contain",
	},
	logoDesktop: {
		width: 360,
		height: 360,
	},

	// ── Nav buttons ───────────────────────────────────────────────────────────
	navList: {
		width: "100%",
		gap: 12,
		paddingHorizontal: 24,
		alignItems: "center",
	},
	navListDesktop: {
		maxWidth: 400,
		paddingHorizontal: 0,
		alignItems: "stretch",
	},
	navItemDesktop: {
		width: "100%",
	},
	navBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: 280,
		maxWidth: "100%",
		height: 76,
		paddingHorizontal: 32,
		overflow: "hidden",
	},
	navBtnDesktop: {
		width: "100%",
		maxWidth: "100%",
		height: 96,
		paddingHorizontal: 40,
	},
	navIcon: {
		width: 28,
		height: 28,
	},
	navLabel: {
		fontFamily: "Cinzel-VariableFont_wght",
		fontSize: 24,
		fontWeight: 700,
		textAlign: "center",
		color: "#000",
		letterSpacing: 0.8,
	},
	navLabelDesktop: {
		fontSize: 28,
	},

	// ── Language modal ─────────────────────────────────────────────────────────
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.55)",
		alignItems: "flex-end",
		justifyContent: "flex-start",
		paddingTop: 100,
		paddingRight: 20,
	},
	langDropdown: {
		backgroundColor: "#1a1008",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.25)",
		overflow: "hidden",
		minWidth: 150,
	},
	langOption: {
		paddingHorizontal: 20,
		paddingVertical: 13,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(148,163,184,0.1)",
	},
	langOptionActive: {
		backgroundColor: "rgba(251,191,36,0.1)",
	},
	langOptionText: {
		color: "#94A3B8",
		fontFamily: "Cinzel-VariableFont_wght",
		fontSize: 15,
	},
	langOptionTextActive: {
		color: "#FBBF24",
	},
});
