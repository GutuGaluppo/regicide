import { useRef } from "react";
import { Animated } from "react-native";
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
	const defeatFade = useRef(new Animated.Value(1)).current;

	const handleDefeatWithTransition = () => {
		playTap();
		isDefeatingRef.current = true;
		setScreenState("ENEMY_DEFEATED_TRANSITION");
		defeatFade.setValue(1);
		Animated.sequence([
			Animated.delay(300),
			Animated.timing(defeatFade, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true,
			}),
		]).start(() => {
			isDefeatingRef.current = false;
			defeatCurrentEnemy();
			defeatFade.setValue(1);
		});
	};

	return { isDefeatingRef, defeatFade, handleDefeatWithTransition };
};
