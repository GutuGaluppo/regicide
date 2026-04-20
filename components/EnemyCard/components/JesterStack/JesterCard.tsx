import { useEffect, useState } from "react";
import { Image } from "expo-image";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { styles } from "./JesterStack.styles";

const JESTER_IMGS = [
	require("@/assets/game/cards/jester_1.png"),
	require("@/assets/game/cards/jester_2.png"),
];
const CARD_BACK = require("@/assets/images/cards_back.png");

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
	const scaleX = useSharedValue(1);

	useEffect(() => {
		if (flip) {
			scaleX.value = withSequence(
				withTiming(0, { duration: 160 }, (finished) => {
					if (finished) {
						runOnJS(setIsBack)(true);
					}
				}),
				withTiming(1, { duration: 160 }),
			);
		}
	}, [flip, scaleX]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: scaleX.value }],
	}));

	return (
		<Animated.View
			style={[
				styles.card,
				{ left: offsetX, top: offsetY, zIndex },
				animStyle,
			]}
		>
			<Image
				source={isBack ? CARD_BACK : JESTER_IMGS[index]}
				style={styles.img}
				contentFit="cover"
			/>
		</Animated.View>
	);
};
