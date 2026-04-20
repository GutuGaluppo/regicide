import crownIcon from "@/assets/icons/crown_white.png";
import { getHeroName } from "@/data/heroes";
import { getHandCardImage } from "@/data/images";
import { Card, Suit } from "@/data/types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Image } from "expo-image";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { SUIT_COLOR, SUIT_SYMBOL } from "./CardDetailModal.constants";
import { styles } from "./CardDetailModal.styles";

export const CardDetailModal = ({
	card,
	visible,
	immuneSuit,
	onClose,
}: {
	card: Card | null;
	visible: boolean;
	immuneSuit?: Suit | null;
	onClose: () => void;
}) => {
	const { t } = useTranslation();

	const [mounted, setMounted] = useState(false);
	const slideY = useSharedValue(500);
	const backdrop = useSharedValue(0);

	useEffect(() => {
		if (visible) {
			setMounted(true);
			slideY.value = 500;
			backdrop.value = 0;
			backdrop.value = withTiming(1, { duration: 200 });
			slideY.value = withSpring(0, { stiffness: 80, damping: 14 });
		} else if (mounted) {
			backdrop.value = withTiming(0, { duration: 180 });
			slideY.value = withTiming(500, { duration: 220 }, () => {
				runOnJS(setMounted)(false);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	const backdropStyle = useAnimatedStyle(() => ({
		opacity: backdrop.value,
	}));

	const panelStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: slideY.value }],
	}));

	if (!mounted || !card) return null;

	const isJester = card.rank === "Jester";
	const cardImage = getHandCardImage(card.rank, card.suit, card.id);
	const suitColor = card.suit ? SUIT_COLOR[card.suit] : "#9F7AEA";
	const suitSymbol = card.suit ? SUIT_SYMBOL[card.suit] : "🃏";
	const isImmune = !!card.suit && card.suit === immuneSuit;

	const classKey = isJester ? "jester" : (card.suit ?? "jester");
	const className = t(`classes.${classKey}.name`);
	const classLore = t(`classes.${classKey}.lore`);
	const heroName = isJester ? null : getHeroName(card.rank, card.suit);

	return (
		<Modal
			transparent
			visible={mounted}
			onRequestClose={onClose}
			statusBarTranslucent
			animationType="none"
		>
			{/* Backdrop */}
			<Animated.View style={[styles.backdrop, backdropStyle]}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
			</Animated.View>

			{/* Panel */}
			<Animated.View
				style={[styles.panel, panelStyle]}
				pointerEvents="box-none"
			>
				{/* Drag handle */}
				<View style={styles.handle} />

				{/* Close button */}
				<TouchableOpacity
					style={styles.closeBtn}
					onPress={onClose}
					activeOpacity={0.7}
				>
					<Image
						source={crownIcon}
						style={styles.closeIcon}
						contentFit="contain"
					/>
				</TouchableOpacity>

				<ScrollView
					contentContainerStyle={styles.content}
					showsVerticalScrollIndicator={false}
				>
					{/* Top row: image + info */}
					<View style={styles.topRow}>
						{/* Card image */}
						<View style={styles.imageWrapper}>
							{cardImage ? (
								<Image
									source={cardImage}
									style={styles.cardImage}
									contentFit="cover"
								/>
							) : (
								<View
									style={[styles.cardImageFallback, { borderColor: suitColor }]}
								>
									<Text style={[styles.fallbackRank, { color: suitColor }]}>
										{card.rank}
									</Text>
									<Text style={[styles.fallbackSuit, { color: suitColor }]}>
										{suitSymbol}
									</Text>
								</View>
							)}

							{/* Value badge */}
							<View style={[styles.valueBadge, { borderColor: suitColor }]}>
								<Text style={[styles.valueText, { color: suitColor }]}>
									{t("cardDetail.value", { value: card.value })}
								</Text>
							</View>
						</View>

						{/* Class identity */}
						<View style={styles.infoCol}>
							{/* Class badge */}
							<View
								style={[
									styles.classBadge,
									{
										borderColor: suitColor + "66",
										backgroundColor: suitColor + "18",
									},
								]}
							>
								{!isJester && (
									<Text style={[styles.suitSymbolSmall, { color: suitColor }]}>
										{suitSymbol}
									</Text>
								)}
								<Text style={[styles.className, { color: suitColor }]}>
									{className}
								</Text>
							</View>

							{/* Hero name */}
							<Text style={styles.heroName}>{heroName ?? className}</Text>

							{/* Rank + suit subtitle */}
							{!isJester && (
								<Text style={styles.rankSubtitle}>
									{card.rank} — {t(`suits.${card.suit}`)}
								</Text>
							)}

							<View style={styles.divider} />

							{/* Power section */}
							<Text style={styles.sectionLabel}>
								{t("cardDetail.suitPower")}
							</Text>

							{isJester ? (
								<Text style={styles.powerDesc}>
									{t("cardDetail.jesterPower")}
								</Text>
							) : (
								<View
									style={[styles.powerBox, isImmune && styles.powerBoxImmune]}
								>
									{isImmune && (
										<Text style={styles.immuneTag}>{t("enemy.immune")}</Text>
									)}
									<Text
										style={[
											styles.powerDesc,
											isImmune && styles.powerDescImmune,
										]}
									>
										{isImmune
											? t("enemy.immuneDesc")
											: t(`suitPowers.${card.suit}`)}
									</Text>
								</View>
							)}
						</View>
					</View>

					{/* Lore block */}
					<View style={[styles.loreBlock, { borderLeftColor: suitColor }]}>
						<Text style={styles.loreLabel}>{heroName ?? className}</Text>
						<Text style={styles.loreText}>{classLore}</Text>
					</View>
				</ScrollView>
			</Animated.View>
		</Modal>
	);
};
