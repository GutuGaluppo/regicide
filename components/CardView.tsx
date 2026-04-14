// /components/CardView.tsx
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import SpellIcon from "../assets/icons/spellImmune_shadow.png";
import { getHandCardImage } from "../data/images";
import { Card, Suit } from "../data/types";
import { useCardSize } from "../utils/responsive";

const SUIT_SYMBOL: Record<string, string> = {
	hearts: "♥",
	diamonds: "♦",
	clubs: "♣",
	spades: "♠",
};

const SUIT_COLOR: Record<string, string> = {
	hearts: "#DC2626",
	diamonds: "#DC2626",
	clubs: "#1E293B",
	spades: "#1E293B",
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
}: {
	card: Card;
	selected?: boolean;
	onPress?: () => void;
	onLongPress?: () => void;
	disabled?: boolean;
	dimmed?: boolean;
	immuneSuit?: Suit | null;
	discarding?: boolean;
	sufferMode?: boolean;
}) => {
	const isImmune = !!card.suit && card.suit === immuneSuit;
	const cardImage = getHandCardImage(card.rank, card.suit, card.id);
	const { w, h, mx, liftY, icon } = useCardSize();

	const discardOpacity = useRef(new Animated.Value(1)).current;
	const discardScale = useRef(new Animated.Value(1)).current;
	const dimOpacity = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (discarding) {
			Animated.parallel([
				Animated.timing(discardOpacity, {
					toValue: 0,
					duration: 320,
					useNativeDriver: true,
				}),
				Animated.timing(discardScale, {
					toValue: 0.55,
					duration: 320,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			discardOpacity.setValue(1);
			discardScale.setValue(1);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [discarding]);

	useEffect(() => {
		Animated.timing(dimOpacity, {
			toValue: dimmed ? 0.3 : 1,
			duration: 150,
			useNativeDriver: true,
		}).start();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dimmed]);

	return (
		<Animated.View
			style={[
				styles.wrapper,
				{ marginHorizontal: mx },
				{ opacity: Animated.multiply(discardOpacity, dimOpacity), transform: [{ scale: discardScale }] },
			]}
		>
			<TouchableOpacity
				style={[
					styles.card,
					{ width: w, height: h },
					selected && (sufferMode ? styles.cardDiscardSelected : styles.cardSelected),
					selected && { transform: [{ translateY: -liftY }] },
					disabled && styles.disabled,
					isImmune && styles.cardImmune,
				]}
				onPress={onPress}
				onLongPress={onLongPress}
				delayLongPress={250}
				activeOpacity={0.7}
				disabled={disabled}
			>
				{cardImage ? (
					<Image
						source={cardImage}
						style={styles.cardImage}
						resizeMode="cover"
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
				{selected && <View style={[styles.selectedDot, sufferMode && styles.selectedDotDiscard]} />}
			</TouchableOpacity>
			{isImmune && (
				<Image source={SpellIcon} style={[styles.immuneIcon, { width: icon, height: icon }]} />
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		position: "relative",
	},
	card: {
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "transparent",
		overflow: "hidden",
		backgroundColor: "#F8FAFC",
	},
	cardImage: {
		width: "100%",
		height: "100%",
	},
	cardImmune: {
		borderColor: "#EF4444",
	},
	cardSelected: {
		borderColor: "#FBBF24",
	},
	cardDiscardSelected: {
		borderColor: "#EF4444",
	},
	discardOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(239, 68, 68, 0.28)",
	},
	selectedDotDiscard: {
		backgroundColor: "#EF4444",
	},
	disabled: {
		opacity: 0.4,
	},
	rank: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
	suit: {
		fontSize: 22,
		marginTop: 2,
		textAlign: "center",
	},
	selectedDot: {
		position: "absolute",
		bottom: 4,
		alignSelf: "center",
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#FBBF24",
	},
	immuneIcon: {
		position: "absolute",
		top: -2,
		right: -2,
	},
});
