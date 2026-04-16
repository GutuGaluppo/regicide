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

	// ── Nav buttons ───────────────────────────────────────────────────────────
	navList: {
		width: "100%",
		gap: 12,
		paddingHorizontal: 24,
	},
	navBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: 280,
		marginHorizontal: "auto",
		paddingVertical: 22,
		paddingHorizontal: 32,
		overflow: "hidden",
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
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.5,
		shadowRadius: 12,
		elevation: 10,
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
