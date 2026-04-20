import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	sliderHitArea: {
		height: 44,
		justifyContent: "center",
	},
	sliderTrack: {
		height: 6,
		borderRadius: 3,
		backgroundColor: "rgba(148,163,184,0.2)",
	},
	sliderFill: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		borderRadius: 3,
		backgroundColor: "#C084FC",
	},
	sliderThumb: {
		position: "absolute",
		width: 18,
		height: 18,
		borderRadius: 9,
		backgroundColor: "#F1F5F9",
		top: -6,
		marginLeft: -9,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 4,
	},
});
