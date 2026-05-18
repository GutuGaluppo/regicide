import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.65)",
	},
	scroll: { flex: 1 },
	scrollContent: {
		paddingBottom: 16,
	},
	contentColumn: {
		width: "100%",
		alignSelf: "center",
		gap: 16,
	},
	bottomSpacer: {
		height: 32,
	},
});
