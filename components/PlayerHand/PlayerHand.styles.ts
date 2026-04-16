import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
	},
	labelRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		marginBottom: 6,
		paddingHorizontal: 12,
	},
	label: {
		color: "#94A3B8",
		fontSize: 14,
		textAlign: "center",
	},
	sortBtn: {
		paddingVertical: 3,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: "rgba(100,116,139,0.2)",
		borderWidth: 1,
		borderColor: "rgba(100,116,139,0.4)",
	},
	sortText: {
		color: "#94A3B8",
		fontSize: 12,
		fontWeight: "600",
	},
	scroll: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "flex-end",
		paddingHorizontal: 12,
	},
	empty: {
		color: "#64748B",
		fontStyle: "italic",
		paddingHorizontal: 16,
		alignSelf: "center",
	},
	discardBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		minWidth: 200,
		marginHorizontal: "auto",
		marginBottom: 6,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		backgroundColor: "#68323797",
	},
	discardBtnActive: {
		backgroundColor: "#683237",
	},
	discardLabel: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.5,
		opacity: 1,
	},
	discardSep: {
		color: "#475569",
		fontSize: 18,
		fontWeight: "600",
		marginHorizontal: 2,
	},
});
