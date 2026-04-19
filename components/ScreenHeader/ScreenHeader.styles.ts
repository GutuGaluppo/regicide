import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	header: {
		width: "100%",
		position: "fixed",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 12,
		paddingHorizontal: 12,
		paddingBottom: 4,
	},
	btn: {
		padding: 6,
	},
	icon: {
		width: 30,
		height: 30,
	},
	rightGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
});
