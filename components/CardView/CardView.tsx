import SpellIcon from "@/assets/icons/spellImmune_shadow.png";
import { useAudio } from "@/contexts/AudioContext";
import { getHandCardImage } from "@/data/images";
import { Card, Suit } from "@/data/types";
import { useCardSize } from "@/hooks/useCardSize";
import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
	Easing,
	LinearTransition,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";
import { SUIT_COLOR, SUIT_SYMBOL } from "./CardView.constants";
import { styles } from "./CardView.styles";

type ScreenRect = {
	x: number;
	y: number;
	w: number;
	h: number;
};

type DealAnimation = {
	id: number;
	order: number;
	source: ScreenRect;
};

type DiscardAnimation = {
	id: number;
	order: number;
	dest: ScreenRect;
};

type CardViewPropsTypes = {
	card: Card;
	selected?: boolean;
	onPress?: () => void;
	onLongPress?: () => void;
	onDealComplete?: (dealId: number, cardId: string) => void;
	dealAnimation?: DealAnimation;
	onDiscardComplete?: (discardId: number, cardId: string) => void;
	discardAnimation?: DiscardAnimation;
	pressDisabled?: boolean;
	dimmed?: boolean;
	immuneSuit?: Suit | null;
	sufferMode?: boolean;
};

export const CardView = ({
	card,
	selected,
	onPress,
	onLongPress,
	onDealComplete,
	dealAnimation,
	onDiscardComplete,
	discardAnimation,
	pressDisabled,
	dimmed,
	immuneSuit,
	sufferMode,
}: CardViewPropsTypes) => {
	const { playTap } = useAudio();
	const isImmune = !!card.suit && card.suit === immuneSuit;
	const cardImage = getHandCardImage(card.rank, card.suit, card.id);
	const { w, h, liftY, icon } = useCardSize();

	const discardOpacity = useSharedValue(1);
	const discardProgress = useSharedValue(0);
	const discardTravelX = useSharedValue(0);
	const discardTravelY = useSharedValue(0);
	const discardScaleTarget = useSharedValue(1);
	const discardArcHeight = useSharedValue(0);
	const dimOpacity = useSharedValue(1);
	const dealOpacity = useSharedValue(1);
	const dealProgress = useSharedValue(1);
	const dealStartX = useSharedValue(0);
	const dealStartY = useSharedValue(0);
	const dealStartScale = useSharedValue(1);
	const dealArcHeight = useSharedValue(0);
	const wrapperRef = useRef<View>(null);
	const lastDealIdRef = useRef<number | null>(null);
	const lastDiscardIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!dealAnimation || lastDealIdRef.current === dealAnimation.id) {
			return;
		}

		dealOpacity.value = 0;

		requestAnimationFrame(() => {
			wrapperRef.current?.measureInWindow((x, y, width, height) => {
				if (width === 0 || height === 0) {
					dealOpacity.value = 1;
					lastDealIdRef.current = dealAnimation.id;
					onDealComplete?.(dealAnimation.id, card.id);
					return;
				}

				const sourceCenterX = dealAnimation.source.x + dealAnimation.source.w / 2;
				const sourceCenterY = dealAnimation.source.y + dealAnimation.source.h / 2;
				const targetCenterX = x + width / 2;
				const targetCenterY = y + height / 2;
				const delay = dealAnimation.order * 110;

				dealStartX.value = sourceCenterX - targetCenterX;
				dealStartY.value = sourceCenterY - targetCenterY;
				dealStartScale.value = Math.min(
					dealAnimation.source.w / width,
					dealAnimation.source.h / height,
				);
				dealArcHeight.value = Math.max(
					24,
					Math.min(78, Math.abs(targetCenterY - sourceCenterY) * 0.18),
				);
				dealProgress.value = 0;

				dealOpacity.value = withDelay(delay, withTiming(1, { duration: 120 }));
				dealProgress.value = withDelay(
					delay,
					withTiming(
						1,
						{ duration: 420, easing: Easing.out(Easing.cubic) },
						(finished) => {
							"worklet";
							if (finished && onDealComplete) {
								runOnJS(onDealComplete)(dealAnimation.id, card.id);
							}
						},
					),
				);
				lastDealIdRef.current = dealAnimation.id;
			});
		});
	}, [
		card.id,
		dealAnimation,
		dealArcHeight,
		dealOpacity,
		dealProgress,
		dealStartScale,
		dealStartX,
		dealStartY,
		onDealComplete,
	]);

	useEffect(() => {
		if (!discardAnimation || lastDiscardIdRef.current === discardAnimation.id) {
			return;
		}

		requestAnimationFrame(() => {
			wrapperRef.current?.measureInWindow((x, y, width, height) => {
				if (width === 0 || height === 0) {
					lastDiscardIdRef.current = discardAnimation.id;
					onDiscardComplete?.(discardAnimation.id, card.id);
					return;
				}

				const sourceCenterX = x + width / 2;
				const sourceCenterY = y + height / 2;
				const targetCenterX =
					discardAnimation.dest.x + discardAnimation.dest.w / 2;
				const targetCenterY =
					discardAnimation.dest.y + discardAnimation.dest.h / 2;
				const delay = discardAnimation.order * 90;

				discardTravelX.value = targetCenterX - sourceCenterX;
				discardTravelY.value = targetCenterY - sourceCenterY;
				discardScaleTarget.value = Math.min(
					discardAnimation.dest.w / width,
					discardAnimation.dest.h / height,
				);
				discardArcHeight.value = Math.max(
					18,
					Math.min(64, Math.abs(targetCenterY - sourceCenterY) * 0.12),
				);
				discardProgress.value = 0;
				discardOpacity.value = 1;

				discardProgress.value = withDelay(
					delay,
					withTiming(
						1,
						{ duration: 380, easing: Easing.inOut(Easing.cubic) },
						(finished) => {
							"worklet";
							if (finished && onDiscardComplete) {
								runOnJS(onDiscardComplete)(discardAnimation.id, card.id);
							}
						},
					),
				);
				discardOpacity.value = withDelay(
					delay + 300,
					withTiming(0, { duration: 90 }),
				);
				lastDiscardIdRef.current = discardAnimation.id;
			});
		});
	}, [
		card.id,
		discardAnimation,
		discardArcHeight,
		discardOpacity,
		discardProgress,
		discardScaleTarget,
		discardTravelX,
		discardTravelY,
		onDiscardComplete,
	]);

	useEffect(() => {
		dimOpacity.value = withTiming(dimmed ? 0.3 : 1, { duration: 150 });
	}, [dimmed, dimOpacity]);

	const animStyle = useAnimatedStyle(() => {
		const dealTranslateX = dealStartX.value * (1 - dealProgress.value);
		const dealTranslateY =
			dealStartY.value * (1 - dealProgress.value) -
			Math.sin(dealProgress.value * Math.PI) * dealArcHeight.value;
		const dealScale =
			dealStartScale.value + (1 - dealStartScale.value) * dealProgress.value;
		const dealRotate = -12 * (1 - dealProgress.value);
		const discardTranslateX = discardTravelX.value * discardProgress.value;
		const discardTranslateY =
			discardTravelY.value * discardProgress.value -
			Math.sin(discardProgress.value * Math.PI) * discardArcHeight.value;
		const discardScale =
			1 + (discardScaleTarget.value - 1) * discardProgress.value;
		const discardRotate = 8 * discardProgress.value;
		const isFlyingOut = discardProgress.value > 0 && discardOpacity.value > 0;

		return {
			opacity: discardOpacity.value * dimOpacity.value * dealOpacity.value,
			transform: [
				{ translateX: dealTranslateX + discardTranslateX },
				{ translateY: dealTranslateY + discardTranslateY },
				{ scale: dealScale * discardScale },
				{ rotateZ: `${dealRotate - discardRotate}deg` },
			],
			zIndex: dealProgress.value < 1 || isFlyingOut ? 10 : 1,
		};
	});

	return (
		<Animated.View
			ref={wrapperRef}
			layout={LinearTransition.springify().damping(18).stiffness(180)}
			collapsable={false}
			style={[styles.wrapper, { marginHorizontal: -12 }, animStyle]}
		>
			<TouchableOpacity
				style={[
					styles.card,
					{ width: w, height: h },
					selected &&
						(sufferMode ? styles.cardDiscardSelected : styles.cardSelected),
					selected && { transform: [{ translateY: -liftY }] },
					isImmune && styles.cardImmune,
				]}
				onPress={
					onPress
						? () => {
								playTap();
								onPress();
							}
						: undefined
				}
				onLongPress={onLongPress}
				delayLongPress={250}
				activeOpacity={0.7}
				disabled={pressDisabled}
			>
				{cardImage ? (
					<Image
						source={cardImage}
						style={styles.cardImage}
						contentFit="cover"
					/>
				) : (
					<>
						<Text
							style={[
								styles.rank,
								{ color: card.suit ? SUIT_COLOR[card.suit] : "#7C3AED" },
							]}
						>
							{card.rank}
						</Text>
						<Text
							style={[
								styles.suit,
								{ color: card.suit ? SUIT_COLOR[card.suit] : "#7C3AED" },
							]}
						>
							{card.suit ? SUIT_SYMBOL[card.suit] : "🃏"}
						</Text>
					</>
				)}
				{selected && sufferMode && <View style={styles.discardOverlay} />}
				{selected && (
					<View
						style={[
							styles.selectedDot,
							sufferMode && styles.selectedDotDiscard,
						]}
					/>
				)}
			</TouchableOpacity>
			{isImmune && (
				<Image
					source={SpellIcon}
					style={[styles.immuneIcon, { width: icon, height: icon }]}
				/>
			)}
		</Animated.View>
	);
};
