import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { SHIFT_PER_ENEMY } from "../TrackerScreen.constants";

export const useBgShift = (defeatedCount: number): Animated.Value => {
	const bgShift = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const toValue = defeatedCount === 0 ? 0 : -(defeatedCount * SHIFT_PER_ENEMY);
		Animated.spring(bgShift, {
			toValue,
			useNativeDriver: true,
			tension: 30,
			friction: 10,
		}).start();
	}, [defeatedCount, bgShift]);

	return bgShift;
};
