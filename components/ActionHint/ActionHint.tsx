import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useActionHints } from "@/store/actionHintsStore";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
	label: string;
	/** Lado em que o balão aparece em relação ao botão. */
	placement?: "below" | "above";
};

/**
 * Rótulo curto ("coachmark") ancorado a um botão só-ícone, mostrado apenas em
 * telas de toque enquanto o guia estiver ligado. Tocar no balão dispensa todos
 * os guias (no desktop não aparece — lá vale o tooltip de hover via `title`).
 */
export const ActionHint = ({ label, placement = "below" }: Props) => {
	const enabled = useActionHints((s) => s.enabled);
	const dismiss = useActionHints((s) => s.dismiss);
	const { isDesktop } = useResponsiveLayout();

	if (!enabled || isDesktop) return null;

	return (
		<Pressable
			style={[styles.wrap, placement === "above" ? styles.above : styles.below]}
			onPress={dismiss}
			accessibilityRole="button"
			accessibilityLabel={label}
			hitSlop={6}
		>
			<View style={styles.bubble}>
				<Text style={styles.text} numberOfLines={1}>
					{label}
				</Text>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	wrap: {
		position: "absolute",
		left: "50%",
		transform: [{ translateX: -44 }],
		width: 88,
		alignItems: "center",
		zIndex: 40,
	},
	below: {
		top: "100%",
		marginTop: 2,
	},
	above: {
		bottom: "100%",
		marginBottom: 2,
	},
	bubble: {
		backgroundColor: "rgba(232,213,163,0.95)",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 3,
	},
	text: {
		fontFamily: "Cinzel",
		fontSize: 10,
		color: "#12121C",
		textAlign: "center",
		letterSpacing: 0.3,
	},
});
