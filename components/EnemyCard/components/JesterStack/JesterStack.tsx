// /components/EnemyCard/components/JesterStack/JesterStack.tsx
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, TouchableOpacity, View } from "react-native";
import { styles } from "./JesterStack.styles";

const JESTER_IMGS = [
	require("../../../../assets/game/cards/jester_1.png"),
	require("../../../../assets/game/cards/jester_2.png"),
];
const CARD_BACK = require("../../../../assets/images/cards_back.png");

// ─── Jester individual com flip ───────────────────────────────────────────────
const JesterCard = ({
	index,
	startUsed,
	flip,
	offsetX,
	offsetY,
	zIndex,
}: {
	index: number;
	startUsed: boolean;
	flip: boolean;
	offsetX: number;
	offsetY: number;
	zIndex: number;
}) => {
	const [isBack, setIsBack] = useState(startUsed);
	const scaleX = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (flip) {
			Animated.sequence([
				Animated.timing(scaleX, { toValue: 0, duration: 160, useNativeDriver: true }),
				Animated.timing(scaleX, { toValue: 1, duration: 160, useNativeDriver: true }),
			]).start();
			const t = setTimeout(() => setIsBack(true), 160);
			return () => clearTimeout(t);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flip]);

	return (
		<Animated.View
			style={[
				styles.card,
				{ left: offsetX, top: offsetY, zIndex, transform: [{ scaleX }] },
			]}
		>
			<Image
				source={isBack ? CARD_BACK : JESTER_IMGS[index]}
				style={styles.img}
				resizeMode="cover"
			/>
		</Animated.View>
	);
};

// ─── Pilha de Jesters ─────────────────────────────────────────────────────────
export const JesterStack = ({
	jestersAvailable,
	jestersUsed,
	jesterActive,
	onUseJester,
}: {
	jestersAvailable: number;
	jestersUsed: number;
	jesterActive: boolean;
	onUseJester?: () => void;
}) => {
	const prevUsed = useRef(jestersUsed);
	const [flips, setFlips] = useState<[boolean, boolean]>([false, false]);

	useEffect(() => {
		if (jestersUsed > prevUsed.current) {
			const idx = jestersUsed - 1;
			if (idx < 2) {
				setFlips((prev) => {
					const next: [boolean, boolean] = [prev[0], prev[1]];
					next[idx] = true;
					return next;
				});
				const t = setTimeout(() => {
					setFlips((prev) => {
						const next: [boolean, boolean] = [prev[0], prev[1]];
						next[idx] = false;
						return next;
					});
				}, 350);
				return () => clearTimeout(t);
			}
		}
		prevUsed.current = jestersUsed;
	}, [jestersUsed]);

	const totalCards = jestersAvailable + jestersUsed;
	if (totalCards === 0) return null;

	return (
		<TouchableOpacity
			style={[
				styles.stack,
				jesterActive && styles.stackActive,
			]}
			onPress={jestersAvailable > 0 ? onUseJester : undefined}
			activeOpacity={jestersAvailable > 0 ? 0.75 : 1}
			disabled={!onUseJester || jestersAvailable === 0}
		>
			{[0, 1].map((i) => (
				<JesterCard
					key={i}
					index={i}
					startUsed={jestersUsed > i}
					flip={flips[i]}
					offsetX={i * 7}
					offsetY={i * 7}
					zIndex={i}
				/>
			))}
			{jesterActive && <View style={styles.activeDot} />}
		</TouchableOpacity>
	);
};
