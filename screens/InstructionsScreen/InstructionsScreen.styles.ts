import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.65)",
	},
	scroll: { flex: 1 },
	scrollContent: {
		paddingHorizontal: 16,
		paddingBottom: 16,
		gap: 16,
	},
});
