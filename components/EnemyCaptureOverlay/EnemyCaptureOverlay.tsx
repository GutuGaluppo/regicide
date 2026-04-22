import { ScreenRect } from "@/components/CardFlightOverlay/CardFlightOverlay";
import { getCardImage, getHandCardImage } from "@/data/images";
import { Card, Enemy } from "@/data/types";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	Extrapolation,
	interpolate,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withTiming,
} from "react-native-reanimated";

export type EnemyCaptureFlight = {
	animationId: number;
	enemy: Enemy;
	card: Card;
	source: ScreenRect;
	dest: ScreenRect;
};

const CAPTURE_DURATION = 320;
const SHAKE_STEP_DURATION = 54;
const SHAKE_DURATION = SHAKE_STEP_DURATION * 6;
const TRANSFORM_DURATION = 220;
const FLIGHT_DURATION = 420;
const IMPACT_EASING = Easing.bezier(0.22, 0.7, 0.2, 1);

export const EnemyCaptureOverlay = ({
	capture,
	onCaptureComplete,
}: {
	capture: EnemyCaptureFlight;
	onCaptureComplete?: (animationId: number) => void;
}) => {
	const captureProgress = useSharedValue(0);
	const impactProgress = useSharedValue(0);
	const transformProgress = useSharedValue(0);
	const flightProgress = useSharedValue(0);
	const opacity = useSharedValue(1);
	const enemyImage = getCardImage(capture.enemy.rank, capture.enemy.suit);
	const capturedCardImage =
		getHandCardImage(capture.card.rank, capture.card.suit, capture.card.id) ??
		enemyImage;

	useEffect(() => {
		captureProgress.value = 0;
		impactProgress.value = 0;
		transformProgress.value = 0;
		flightProgress.value = 0;
		opacity.value = 1;

		captureProgress.value = withTiming(1, {
			duration: CAPTURE_DURATION,
			easing: Easing.out(Easing.cubic),
		});

		impactProgress.value = withDelay(
			CAPTURE_DURATION,
			withSequence(
				withTiming(0.62, {
					duration: SHAKE_STEP_DURATION,
					easing: IMPACT_EASING,
				}),
				withTiming(-0.44, {
					duration: SHAKE_STEP_DURATION,
					easing: IMPACT_EASING,
				}),
				withTiming(0.32, {
					duration: SHAKE_STEP_DURATION,
					easing: IMPACT_EASING,
				}),
				withTiming(-0.18, {
					duration: SHAKE_STEP_DURATION,
					easing: IMPACT_EASING,
				}),
				withTiming(0.08, {
					duration: SHAKE_STEP_DURATION,
					easing: IMPACT_EASING,
				}),
				withTiming(0, {
					duration: SHAKE_STEP_DURATION,
					easing: IMPACT_EASING,
				}),
			),
		);

		transformProgress.value = withDelay(
			CAPTURE_DURATION + SHAKE_DURATION,
			withTiming(1, {
				duration: TRANSFORM_DURATION,
				easing: Easing.inOut(Easing.cubic),
			}),
		);

		flightProgress.value = withDelay(
			CAPTURE_DURATION + SHAKE_DURATION + TRANSFORM_DURATION,
			withTiming(
				1,
				{
					duration: FLIGHT_DURATION,
					easing: Easing.inOut(Easing.cubic),
				},
				(finished) => {
					"worklet";
					if (finished && onCaptureComplete) {
						runOnJS(onCaptureComplete)(capture.animationId);
					}
				},
			),
		);

		opacity.value = withDelay(
			CAPTURE_DURATION +
				SHAKE_DURATION +
				TRANSFORM_DURATION +
				FLIGHT_DURATION -
				80,
			withTiming(0, { duration: 80 }),
		);
	}, [
		capture.animationId,
		captureProgress,
		flightProgress,
		impactProgress,
		onCaptureComplete,
		opacity,
		transformProgress,
	]);

	const rootStyle = useAnimatedStyle(() => {
		const sourceCenterX = capture.source.x + capture.source.w / 2;
		const sourceCenterY = capture.source.y + capture.source.h / 2;
		const targetCenterX = capture.dest.x + capture.dest.w / 2;
		const targetCenterY = capture.dest.y + capture.dest.h / 2;
		const translateX = (targetCenterX - sourceCenterX) * flightProgress.value;
		const translateY =
			(targetCenterY - sourceCenterY) * flightProgress.value -
			Math.sin(flightProgress.value * Math.PI) *
				Math.max(
					18,
					Math.min(54, Math.abs(targetCenterY - sourceCenterY) * 0.12),
				);
		const scale =
			1 +
			(Math.min(
				capture.dest.w / capture.source.w,
				capture.dest.h / capture.source.h,
			) -
				1) *
				flightProgress.value;

		return {
			opacity: opacity.value,
			transform: [
				{ translateX },
				{ translateY },
				{ scale },
				{ rotateZ: `${-8 * flightProgress.value}deg` },
			],
		};
	});

	const shellStyle = useAnimatedStyle(() => {
		const width = interpolate(
			captureProgress.value,
			[0, 1],
			[capture.source.w * 0.52, capture.source.w],
			Extrapolation.CLAMP,
		);
		const height = interpolate(
			captureProgress.value,
			[0, 1],
			[capture.source.h * 0.52, capture.source.h],
			Extrapolation.CLAMP,
		);
		const borderRadius = interpolate(
			captureProgress.value,
			[0, 1],
			[24, 12],
			Extrapolation.CLAMP,
		);
		const pulse = Math.sin(captureProgress.value * Math.PI) * 0.03;

		return {
			width,
			height,
			left: (capture.source.w - width) / 2,
			top: (capture.source.h - height) / 2,
			borderRadius,
			transform: [
				{
					scale:
						1 +
						pulse +
						interpolate(
							impactProgress.value,
							[-1, 0, 1],
							[-0.007, 0, 0.012],
							Extrapolation.CLAMP,
						),
				},
			],
		};
	});

	const pastedEnemyStyle = useAnimatedStyle(() => ({
		opacity: 1 - transformProgress.value,
		transform: [
			{
				translateY: interpolate(
					impactProgress.value,
					[-1, 0, 1],
					[5, 0, -8],
					Extrapolation.CLAMP,
				),
			},
			{
				scale:
					interpolate(
						impactProgress.value,
						[-1, 0, 1],
						[0.982, 1, 1.055],
						Extrapolation.CLAMP,
					) -
					transformProgress.value * 0.035,
			},
		],
	}));

	const transformedCardStyle = useAnimatedStyle(() => ({
		opacity: transformProgress.value,
		transform: [
			{
				scale: interpolate(
					transformProgress.value,
					[0, 1],
					[0.985, 1],
					Extrapolation.CLAMP,
				),
			},
		],
	}));

	return (
		<View pointerEvents="none" style={StyleSheet.absoluteFill}>
			<Animated.View
				style={[
					styles.root,
					{
						left: capture.source.x,
						top: capture.source.y,
						width: capture.source.w,
						height: capture.source.h,
					},
					rootStyle,
				]}
			>
				<Animated.View style={[styles.captureShell, shellStyle]}>
					<View style={styles.captureInner} />
				</Animated.View>

				<Animated.View style={[styles.figureLayer, pastedEnemyStyle]}>
					<Image
						source={enemyImage}
						style={styles.captureImage}
						contentFit="contain"
					/>
				</Animated.View>

				<Animated.View
					style={[styles.cardRevealShell, shellStyle, transformedCardStyle]}
				>
					<View style={styles.captureInner}>
						<Image
							source={capturedCardImage}
							style={styles.captureImage}
							contentFit="cover"
						/>
					</View>
				</Animated.View>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		position: "absolute",
		zIndex: 60,
	},
	captureShell: {
		position: "absolute",
		padding: 8,
		backgroundColor: "#F8FAFC",
		borderWidth: 2,
		borderColor: "rgba(255,255,255,0.98)",
		shadowColor: "#FFFFFF",
		shadowOpacity: 0.32,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 0 },
		elevation: 12,
		overflow: "hidden",
	},
	cardRevealShell: {
		position: "absolute",
		padding: 8,
		overflow: "hidden",
	},
	figureLayer: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
	captureInner: {
		flex: 1,
		borderRadius: 8,
		overflow: "hidden",
		backgroundColor: "#FFFFFF",
	},
	captureImage: {
		width: "100%",
		height: "100%",
	},
});
