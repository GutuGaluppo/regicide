import { useEffect, useRef, useState } from "react";
import { Animated, Image } from "react-native";
import { styles } from "./JesterStack.styles";

const JESTER_IMGS = [
	require("@/assets/game/cards/jester_1.png"),
	require("@/assets/game/cards/jester_2.png"),
];
const CARD_BACK = require("@/assets/images/cards_back.png");

// ─── Jester individual com flip ───────────────────────────────────────────────
export const JesterCard = ({
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
				Animated.timing(scaleX, {
					toValue: 0,
					duration: 160,
					useNativeDriver: true,
				}),
				Animated.timing(scaleX, {
					toValue: 1,
					duration: 160,
					useNativeDriver: true,
				}),
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
