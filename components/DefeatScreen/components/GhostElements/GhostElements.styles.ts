import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	statusRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 12,
		paddingVertical: 4,
	},
	statusCard: { width: 36, height: 50 },
	handRow: { flexDirection: "row", gap: 6, justifyContent: "center" },
	handCard: { width: 52, height: 75 },
	actionsRow: { flexDirection: "row", gap: 10, justifyContent: "center" },
	btnPrimary: {
		width: 160,
		height: 44,
		borderRadius: 10,
		backgroundColor: "rgba(103,130,110,0.6)",
	},
	btnSecondary: {
		width: 100,
		height: 44,
		borderRadius: 10,
		backgroundColor: "rgba(51,65,85,0.5)",
	},
	footerRow: { flexDirection: "row", gap: 10, justifyContent: "center" },
	footerCard: { width: 44, height: 62 },
});
