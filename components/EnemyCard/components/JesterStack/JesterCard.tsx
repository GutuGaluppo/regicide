import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { styles } from "./JesterStack.styles";

const CARD_BACK = require("@/assets/images/cards_back.png");
const SWAP_DURATION = 420;
const SWAP_EASING = Easing.bezier(0.22, 0.78, 0.22, 1);

export type JesterSwapAnimation = {
	id: number;
	role: "promote" | "demote";
	deltaX: number;
	deltaY: number;
	notifyOnComplete?: boolean;
};

export const JesterCard = ({
	imageSource,
	isBack,
	animation,
	offsetX,
	offsetY,
	zIndex,
	onAnimationComplete,
}: {
	imageSource: number;
	isBack: boolean;
	animation?: JesterSwapAnimation;
	offsetX: number;
	offsetY: number;
	zIndex: number;
	onAnimationComplete?: (animationId: number) => void;
}) => {
	const progress = useSharedValue(0);
	const rotateY = useSharedValue(isBack ? 180 : 0);
	const animatedZIndex = useSharedValue(zIndex);
	const lastAnimationIdRef = useRef<number | null>(null);
	const isAnimatingRef = useRef(false);

	useEffect(() => {
		if (isAnimatingRef.current) return;

		progress.value = 0;
		rotateY.value = isBack ? 180 : 0;
		animatedZIndex.value = zIndex;
	}, [animatedZIndex, isBack, progress, rotateY, zIndex]);

	useEffect(() => {
		if (!animation || lastAnimationIdRef.current === animation.id) return;

		const finishAnimation = (animationId: number, shouldNotify: boolean) => {
			isAnimatingRef.current = false;
			if (shouldNotify) {
				onAnimationComplete?.(animationId);
			}
		};

		isAnimatingRef.current = true;
		lastAnimationIdRef.current = animation.id;
		progress.value = 0;
		animatedZIndex.value = animation.role === "promote" ? 30 : 2;
		rotateY.value = animation.role === "demote" ? 0 : isBack ? 180 : 0;

		if (animation.role === "demote") {
			rotateY.value = withTiming(180, {
				duration: SWAP_DURATION,
				easing: SWAP_EASING,
			});
		}

		progress.value = withTiming(
			1,
			{ duration: SWAP_DURATION, easing: SWAP_EASING },
			(finished) => {
				"worklet";
				if (!finished) return;
				runOnJS(finishAnimation)(
					animation.id,
					animation.notifyOnComplete ?? false,
				);
			},
		);
	}, [
		animatedZIndex,
		animation,
		isBack,
		onAnimationComplete,
		progress,
		rotateY,
	]);

	const animStyle = useAnimatedStyle(() => {
		const p = animation ? progress.value : 0;
		const translateX = animation ? animation.deltaX * p : 0;
		const travelY = animation ? animation.deltaY * p : 0;
		const arcY =
			animation?.role === "promote"
				? -Math.sin(p * Math.PI) * 18
				: Math.sin(p * Math.PI) * 10;
		const scale =
			animation?.role === "promote"
				? 1 + Math.sin(p * Math.PI) * 0.08
				: 1 - Math.sin(p * Math.PI) * 0.03;

		return {
			zIndex: animatedZIndex.value,
			transform: [
				{ perspective: 900 },
				{ translateX },
				{ translateY: travelY + arcY },
				{ scale },
				{ rotateY: `${rotateY.value}deg` },
			],
		};
	});

	return (
		<Animated.View
			style={[
				styles.card,
				{ left: offsetX, top: offsetY, zIndex },
				animStyle,
			]}
		>
			<Animated.View style={[styles.face, styles.frontFace]}>
				<Image source={imageSource} style={styles.img} contentFit="cover" />
			</Animated.View>
			<Animated.View style={[styles.face, styles.backFace]}>
				<Image source={CARD_BACK} style={styles.img} contentFit="cover" />
			</Animated.View>
		</Animated.View>
	);
};
