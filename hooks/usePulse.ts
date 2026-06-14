import { useEffect, useRef } from "react";
import { Animated } from "react-native";

/**
 * Returns an Animated.Value that loops between 1 and ~0.35 while `active`,
 * and rests at 1 when inactive. Useful for attention-grabbing pulses.
 */
export const usePulse = (active: boolean): Animated.Value => {
	const pulse = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (!active) {
			pulse.setValue(1);
			return;
		}
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(pulse, { toValue: 0.35, duration: 600, useNativeDriver: true }),
				Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
			]),
		);
		loop.start();
		return () => loop.stop();
	}, [active, pulse]);

	return pulse;
};
