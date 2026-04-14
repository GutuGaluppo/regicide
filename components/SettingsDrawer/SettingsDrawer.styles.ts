import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.6)",
	},
	backdropFill: {
		...StyleSheet.absoluteFillObject,
	},
	panel: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#0F172A",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderTopWidth: 1,
		borderColor: "rgba(148,163,184,0.2)",
		paddingBottom: 48,
		paddingHorizontal: 24,
	},
	handle: {
		alignSelf: "center",
		width: 36,
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(148,163,184,0.35)",
		marginTop: 10,
		marginBottom: 20,
	},
	title: {
		color: "#94A3B8",
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 16,
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(148,163,184,0.12)",
		marginVertical: 4,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		paddingVertical: 14,
	},
	rowIcon: {
		color: "#F1F5F9",
		fontSize: 20,
		width: 24,
		textAlign: "center",
	},
	rowLabel: {
		color: "#F1F5F9",
		fontSize: 16,
		fontWeight: "600",
	},
	rowLabelMuted: {
		color: "#64748B",
	},
});
