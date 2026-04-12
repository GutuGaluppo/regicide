// /components/ActionBar.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GamePhase } from "../data/types";

const Btn = ({
	label,
	onPress,
	variant = "default",
	disabled,
}: {
	label: string;
	onPress: () => void;
	variant?: "default" | "danger" | "warning";
	disabled?: boolean;
}) => {
	const bg =
		variant === "danger"
			? "#683237"
			: variant === "warning"
				? "#D5B377"
				: "#67826E";

	return (
		<TouchableOpacity
			style={[
				styles.btn,
				{ backgroundColor: bg },
				disabled && styles.btnDisabled,
			]}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.8}
		>
			<Text style={styles.btnText}>{label}</Text>
		</TouchableOpacity>
	);
};

export const ActionBar = ({
	phase,
	selectedTotal,
	pendingDamage,
	onPlay,
	onYield,
	onDiscard,
	onReset,
	playDisabled,
}: {
	phase: GamePhase;
	selectedTotal: number;
	pendingDamage: number;
	onPlay: () => void;
	onYield: () => void;
	onDiscard: () => void;
	onReset: () => void;
	playDisabled: boolean;
}) => {
	return (
		<View style={styles.container}>
			{phase === "player_turn" && (
				<>
					<Btn label="Jogar" onPress={onPlay} disabled={playDisabled} />
					<Btn label="Ceder" onPress={onYield} variant="warning" />
				</>
			)}

			{phase === "suffer_damage" && (
				<Btn
					label={`Descartar (${selectedTotal}/${pendingDamage})`}
					onPress={onDiscard}
					variant="danger"
					disabled={selectedTotal < pendingDamage}
				/>
			)}

			{(phase === "victory" || phase === "defeat") && null}

			<Btn label="Novo jogo" onPress={onReset} variant="danger" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		padding: 12,
		justifyContent: "center",
	},
	btn: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
		minWidth: 100,
		alignItems: "center",
	},
	btnDisabled: {
		opacity: 0.4,
	},
	btnText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 14,
	},
});
