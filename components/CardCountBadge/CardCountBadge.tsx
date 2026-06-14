import { usePulse } from "@/hooks/usePulse";
import React from "react";
import {
	Animated,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	ViewStyle,
} from "react-native";

/** Mão com este número de cartas (ou menos) sinaliza risco de derrota. */
export const LOW_CARDS_THRESHOLD = 3;

interface Props {
	count: number;
	pillStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	/** Sufixo opcional (ex.: "cartas"). Sem ele, exibe só o número. */
	label?: string;
}

/**
 * Pílula com a contagem de cartas do jogador. Quando a mão fica em
 * LOW_CARDS_THRESHOLD ou menos, pulsa em vermelho para alertar os participantes
 * sobre o risco de derrota.
 */
export const CardCountBadge = ({ count, pillStyle, textStyle, label }: Props) => {
	const isLow = count <= LOW_CARDS_THRESHOLD;
	const pulse = usePulse(isLow);

	return (
		<Animated.View style={[pillStyle, isLow && styles.low, isLow && { opacity: pulse }]}>
			<Text style={[textStyle, isLow && styles.lowText]}>
				{label ? `${count} ${label}` : count}
			</Text>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	low: {
		backgroundColor: "rgba(239,68,68,0.9)",
		borderWidth: 1,
		borderColor: "#FCA5A5",
	},
	lowText: {
		color: "#fff",
		fontWeight: "700",
	},
});
