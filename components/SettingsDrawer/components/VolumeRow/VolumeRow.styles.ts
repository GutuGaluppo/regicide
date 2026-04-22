import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	volumeRow: {
		gap: 10,
		paddingVertical: 12,
	},
	volumeRowMuted: {
		opacity: 0.6,
	},
	volumeHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	volumeLabel: {
		color: "#F1F5F9",
		fontSize: 15,
		fontWeight: "600",
		flex: 1,
	},
	volumeLabelMuted: {
		color: "#475569",
	},
	volumePct: {
		color: "#64748B",
		fontSize: 13,
		fontWeight: "600",
		minWidth: 36,
		textAlign: "right",
	},
	muteBtn: {
		paddingLeft: 8,
	},
});
