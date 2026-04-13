// /components/NumberSprite.tsx
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const ATTACK_DIGITS: Record<string, number> = {
	"0": require("../assets/images/numbers/attack/0.png"),
	"1": require("../assets/images/numbers/attack/1.png"),
	"2": require("../assets/images/numbers/attack/2.png"),
	"3": require("../assets/images/numbers/attack/3.png"),
	"4": require("../assets/images/numbers/attack/4.png"),
	"5": require("../assets/images/numbers/attack/5.png"),
	"6": require("../assets/images/numbers/attack/6.png"),
	"7": require("../assets/images/numbers/attack/7.png"),
	"8": require("../assets/images/numbers/attack/8.png"),
	"9": require("../assets/images/numbers/attack/9.png"),
};

const HEALTH_DIGITS: Record<string, number> = {
	"0": require("../assets/images/numbers/health/0.png"),
	"1": require("../assets/images/numbers/health/1.png"),
	"2": require("../assets/images/numbers/health/2.png"),
	"3": require("../assets/images/numbers/health/3.png"),
	"4": require("../assets/images/numbers/health/4.png"),
	"5": require("../assets/images/numbers/health/5.png"),
	"6": require("../assets/images/numbers/health/6.png"),
	"7": require("../assets/images/numbers/health/7.png"),
	"8": require("../assets/images/numbers/health/8.png"),
	"9": require("../assets/images/numbers/health/9.png"),
};

interface NumberSpriteProps {
	value: number;
	type: "attack" | "health";
	/** Altura de cada dígito em dp. Largura é calculada pela proporção 193/300. */
	height?: number;
}

export const NumberSprite = ({
	value,
	type,
	height = 32,
}: NumberSpriteProps) => {
	const digits = String(Math.max(0, Math.floor(value))).split("");
	const map = type === "attack" ? ATTACK_DIGITS : HEALTH_DIGITS;
	const width = Math.round(height * (193 / 300));

	return (
		<View style={styles.row}>
			{digits.map((d, i) => (
				<Image
					key={i}
					source={map[d]}
					style={{ width, height }}
					resizeMode="contain"
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		// backgroundColor: "white",
		// padding: 4,
		// borderRadius: 10,
	},
});
