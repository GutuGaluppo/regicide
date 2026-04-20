import { useEffect } from "react";
import { SharedValue, useSharedValue, withSpring } from "react-native-reanimated";
import { SHIFT_PER_ENEMY } from "../TrackerScreen.constants";

export const useBgShift = (defeatedCount: number): SharedValue<number> => {
	const bgShift = useSharedValue(0);

	useEffect(() => {
		const toValue = defeatedCount === 0 ? 0 : -(defeatedCount * SHIFT_PER_ENEMY);
		bgShift.value = withSpring(toValue, { stiffness: 30, damping: 10 });
	}, [defeatedCount, bgShift]);

	return bgShift;
};
