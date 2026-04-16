import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "rgba(15,23,42,0.6)",
		borderRadius: 12,
		marginHorizontal: "auto",
		maxWidth: 500,
	},
	label: {
		color: "#94A3B8",
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	suitRow: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
	},
	suitBtn: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: "transparent",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		opacity: 0.5,
	},
	suitWrapper: {
		position: "relative",
	},
	immuneIcon: {
		position: "absolute",
		top: -14,
		left: -14,
		width: 86,
		height: 86,
		opacity: 0.5,
	},
	immuniIconSelected: {
		opacity: 1,
	},
	suitBtnSelected: {
		opacity: 1,
	},
	suitIcon: {
		width: 60,
		height: 60,
	},
	suitSymbol: {
		fontSize: 26,
	},
	rankRow: {
		marginHorizontal: "auto",
		height: 90,
		gap: 8,
		paddingVertical: 4,
	},
	rankBtn: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: "rgba(51,65,85,0.8)",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#334155",
	},
	rankSelected: {
		backgroundColor: "#FBBF24",
		borderColor: "#FBBF24",
	},
	rankText: {
		color: "#CBD5E1",
		fontWeight: "600",
		fontSize: 13,
	},
	rankTextSelected: {
		color: "#0F172A",
	},
	preview: {
		backgroundColor: "rgba(30,41,59,0.8)",
		borderRadius: 8,
		padding: 10,
		gap: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
	},
	previewImmune: {
		borderLeftColor: "#EF4444",
	},
	previewDamage: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 16,
	},
	previewPower: {
		color: "#94A3B8",
		fontSize: 13,
	},
	applyBtn: {
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
	},
	applyDisabled: {
		opacity: 0.35,
	},
	applyText: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 15,
	},
	actionBtnWrapper: {
		width: 40,
		height: 40,
		backgroundColor: "#67826E",
		borderWidth: 2,
		borderColor: "#799881",
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	actionBtn: {
		width: 25,
		height: 35,
	},
	actionBtnActive: {},
	cardBtn: {
		width: 58,
		borderRadius: 10,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "transparent",
	},
	cardBtnSelected: {
		borderColor: "#FBBF24",
	},
	cardBtnDimmed: {
		opacity: 0.25,
	},
	cardBtnLifted: {
		transform: [{ translateY: -10 }],
	},
	cardThumb: {
		width: "100%",
		height: "100%",
	},
	jesterRow: {
		flexDirection: "row",
		justifyContent: "center",
		height: 90,
		gap: 12,
		paddingVertical: 4,
	},
	rankHint: {
		color: "#64748B",
		fontSize: 12,
		textAlign: "center",
		paddingVertical: 10,
	},
});
