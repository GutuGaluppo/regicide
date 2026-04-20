import { useRef } from "react";
import {
	SharedValue,
	runOnJS,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";
import { ScreenState } from "../TrackerScreen.types";

interface Options {
	defeatCurrentEnemy: () => void;
	playTap: () => void;
	setScreenState: (state: ScreenState) => void;
}

export const useDefeatTransition = ({
	defeatCurrentEnemy,
	playTap,
	setScreenState,
}: Options) => {
	const isDefeatingRef = useRef(false);
	const defeatFade = useSharedValue(1);

	const onTransitionComplete = () => {
		isDefeatingRef.current = false;
		defeatCurrentEnemy();
		defeatFade.value = 1;
	};

	const handleDefeatWithTransition = () => {
		playTap();
		isDefeatingRef.current = true;
		setScreenState("ENEMY_DEFEATED_TRANSITION");
		defeatFade.value = 1;
		defeatFade.value = withDelay(
			300,
			withTiming(0, { duration: 500 }, (finished) => {
				if (finished) {
					runOnJS(onTransitionComplete)();
				}
			}),
		);
	};

	return { isDefeatingRef, defeatFade, handleDefeatWithTransition };
};
