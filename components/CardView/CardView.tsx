import { useAudio } from "@/contexts/AudioContext";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import SpellIcon from "@/assets/icons/spellImmune_shadow.png";
import { getHandCardImage } from "@/data/images";
import { Card, Suit } from "@/data/types";
import { useCardSize } from "@/hooks/useCardSize";
import { SUIT_COLOR, SUIT_SYMBOL } from "./CardView.constants";
import { styles } from "./CardView.styles";

type CardViewPropsTypes = {
	card: Card;
	selected?: boolean;
	onPress?: () => void;
	onLongPress?: () => void;
	disabled?: boolean;
	dimmed?: boolean;
	immuneSuit?: Suit | null;
	discarding?: boolean;
	sufferMode?: boolean;
};

export const CardView = ({
	card,
	selected,
	onPress,
	onLongPress,
	disabled,
	dimmed,
	immuneSuit,
	discarding,
	sufferMode,
}: CardViewPropsTypes) => {
	const { playTap } = useAudio();
	const isImmune = !!card.suit && card.suit === immuneSuit;
	const cardImage = getHandCardImage(card.rank, card.suit, card.id);
	const { w, h, mx, liftY, icon } = useCardSize();

	const discardOpacity = useSharedValue(1);
	const discardScale = useSharedValue(1);
	const dimOpacity = useSharedValue(1);

	useEffect(() => {
		if (discarding) {
			discardOpacity.value = withTiming(0, { duration: 320 });
			discardScale.value = withTiming(0.55, { duration: 320 });
		} else {
			discardOpacity.value = 1;
			discardScale.value = 1;
		}
	}, [discarding, discardOpacity, discardScale]);

	useEffect(() => {
		dimOpacity.value = withTiming(dimmed ? 0.3 : 1, { duration: 150 });
	}, [dimmed, dimOpacity]);

	const animStyle = useAnimatedStyle(() => ({
		opacity: discardOpacity.value * dimOpacity.value,
		transform: [{ scale: discardScale.value }],
	}));

	return (
		<Animated.View
			style={[
				styles.wrapper,
				{ marginHorizontal: mx },
				animStyle,
			]}
		>
			<TouchableOpacity
				style={[
					styles.card,
					{ width: w, height: h },
					selected &&
						(sufferMode ? styles.cardDiscardSelected : styles.cardSelected),
					selected && { transform: [{ translateY: -liftY }] },
					disabled && styles.disabled,
					isImmune && styles.cardImmune,
				]}
				onPress={onPress ? () => { playTap(); onPress(); } : undefined}
				onLongPress={onLongPress}
				delayLongPress={250}
				activeOpacity={0.7}
				disabled={disabled}
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
