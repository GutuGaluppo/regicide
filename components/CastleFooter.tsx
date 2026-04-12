// /components/CastleFooter.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const CastleFooter = ({ count }: { count: number }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>🏰 Castelo: {count}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	text: {
		color: "#E5E7EB",
		fontSize: 18,
		textAlign: "center",
	},
});
