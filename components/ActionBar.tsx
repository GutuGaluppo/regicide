// /components/ActionBar.tsx
import React from "react";
import { Button, StyleSheet, View } from "react-native";

export const ActionBar = ({
	onDefeat,
	onReset,
	hasEnemy,
}: {
	onDefeat: () => void;
	onReset: () => void;
	hasEnemy: boolean;
}) => {
	return (
		<View style={styles.container}>
			{hasEnemy && <Button title="Derrotar inimigo" onPress={onDefeat} />}
			<Button title="Novo jogo" onPress={onReset} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 10,
		padding: 10,
	},
});
