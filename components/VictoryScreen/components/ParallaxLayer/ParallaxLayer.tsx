// /components/VictoryScreen/components/ParallaxLayer/ParallaxLayer.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing } from "react-native";

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
	const shift = useRef(new Animated.Value(-amplitude)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(shift, {
					toValue: amplitude,
					duration,
					easing: Easing.inOut(Easing.sin),
					useNativeDriver: true,
				}),
				Animated.timing(shift, {
					toValue: -amplitude,
					duration,
					easing: Easing.inOut(Easing.sin),
					useNativeDriver: true,
				}),
			]),
		);
		loop.start();
		return () => loop.stop();
	}, [shift, amplitude, duration]);

	return (
		<Animated.Image
			source={source}
			style={{
				position: "absolute",
				top: 0,
				width: layerWidth,
				height: SCREEN_H,
				left: -amplitude,
				transform: [{ translateX: shift }],
			}}
			resizeMode="cover"
		/>
	);
};
