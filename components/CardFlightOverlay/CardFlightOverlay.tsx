import { getHandCardImage } from "@/data/images";
import { Card } from "@/data/types";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";

export type ScreenRect = {
	x: number;
	y: number;
	w: number;
	h: number;
};

export type CardFlight = {
	animationId: number;
	order: number;
	card: Card;
	source: ScreenRect;
	dest: ScreenRect;
};

const OverlayCard = ({
	flight,
	onFlightComplete,
}: {
	flight: CardFlight;
	onFlightComplete?: (animationId: number, cardId: string) => void;
}) => {
	const progress = useSharedValue(0);
	const opacity = useSharedValue(1);
	const image = getHandCardImage(
		flight.card.rank,
		flight.card.suit,
		flight.card.id,
	);

	useEffect(() => {
		const delay = flight.order * 90;
		progress.value = 0;
		opacity.value = 1;
		progress.value = withDelay(
			delay,
			withTiming(
				1,
				{ duration: 360, easing: Easing.inOut(Easing.cubic) },
				(finished) => {
					"worklet";
					if (finished && onFlightComplete) {
						runOnJS(onFlightComplete)(flight.animationId, flight.card.id);
					}
				},
			),
		);
		opacity.value = withDelay(delay + 300, withTiming(0, { duration: 90 }));
	}, [flight, onFlightComplete, opacity, progress]);

	const animStyle = useAnimatedStyle(() => {
		const sourceCenterX = flight.source.x + flight.source.w / 2;
		const sourceCenterY = flight.source.y + flight.source.h / 2;
		const targetCenterX = flight.dest.x + flight.dest.w / 2;
		const targetCenterY = flight.dest.y + flight.dest.h / 2;
		const translateX = (targetCenterX - sourceCenterX) * progress.value;
		const translateY =
			(targetCenterY - sourceCenterY) * progress.value -
			Math.sin(progress.value * Math.PI) *
				Math.max(18, Math.min(54, Math.abs(targetCenterY - sourceCenterY) * 0.12));
		const scale =
			1 + (Math.min(flight.dest.w / flight.source.w, flight.dest.h / flight.source.h) - 1) * progress.value;

		return {
			opacity: opacity.value,
			transform: [
				{ translateX },
				{ translateY },
				{ scale },
				{ rotateZ: `${-8 * progress.value}deg` },
			],
		};
	});

	return (
		<Animated.View
			pointerEvents="none"
			style={[
				styles.card,
				{
					left: flight.source.x,
					top: flight.source.y,
					width: flight.source.w,
					height: flight.source.h,
					zIndex: 20 + flight.order,
				},
				animStyle,
			]}
		>
			{image ? (
				<Image source={image} style={styles.image} contentFit="cover" />
			) : (
				<View style={styles.fallback}>
					<Text style={styles.fallbackText}>
						{flight.card.rank}
						{flight.card.suit === "spades" ? "♠" : ""}
					</Text>
				</View>
			)}
		</Animated.View>
	);
};

export const CardFlightOverlay = ({
	flights,
	onFlightComplete,
}: {
	flights: CardFlight[];
	onFlightComplete?: (animationId: number, cardId: string) => void;
}) => (
	<View pointerEvents="none" style={StyleSheet.absoluteFill}>
		{flights.map((flight) => (
			<OverlayCard
				key={`${flight.animationId}-${flight.card.id}`}
				flight={flight}
				onFlightComplete={onFlightComplete}
			/>
		))}
	</View>
);

const styles = StyleSheet.create({
	card: {
		position: "absolute",
		borderRadius: 5,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(96,165,250,0.45)",
		backgroundColor: "#F8FAFC",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	fallback: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F8FAFC",
	},
	fallbackText: {
		color: "#1E293B",
		fontSize: 10,
		fontWeight: "700",
	},
});
