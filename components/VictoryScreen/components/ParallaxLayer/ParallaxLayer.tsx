import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { Image as ExpoImage } from "expo-image";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(ExpoImage);
const { height: SCREEN_H } = Dimensions.get("window");

export const ParallaxLayer = ({
	source,
	amplitude,
	duration,
	layerWidth,
}: {
	source: number;
	amplitude: number;
	duration: number;
	layerWidth: number;
}) => {
	const shift = useSharedValue(-amplitude);

	useEffect(() => {
		shift.value = withRepeat(
			withSequence(
				withTiming(amplitude, {
					duration,
					easing: Easing.inOut(Easing.sin),
				}),
				withTiming(-amplitude, {
					duration,
					easing: Easing.inOut(Easing.sin),
				}),
			),
			-1,
		);
	}, [shift, amplitude, duration]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: shift.value }],
	}));

	return (
		<AnimatedImage
			source={source}
			style={[
				{
					position: "absolute",
					top: 0,
					width: layerWidth,
					height: SCREEN_H,
					left: -amplitude,
				},
				animStyle,
			]}
			contentFit="cover"
		/>
	);
};
