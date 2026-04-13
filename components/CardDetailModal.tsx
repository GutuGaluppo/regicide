// /components/CardDetailModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Image,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { getHandCardImage } from "../data/images";
import { getHeroName } from "../data/heroes";
import { Card, Suit } from "../data/types";

const CROWN_ICON = require("../assets/icons/crown_white.png");

const SUIT_COLOR: Record<Suit, string> = {
	hearts: "#F87171",
	diamonds: "#F59E0B",
	clubs: "#4ADE80",
	spades: "#60A5FA",
};

const SUIT_SYMBOL: Record<Suit, string> = {
	hearts: "♥",
	diamonds: "♦",
	clubs: "♣",
	spades: "♠",
};

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
	const slideY = useRef(new Animated.Value(500)).current;
	const backdropOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			setMounted(true);
			slideY.setValue(500);
			backdropOpacity.setValue(0);
			Animated.parallel([
				Animated.timing(backdropOpacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.spring(slideY, {
					toValue: 0,
					tension: 80,
					friction: 14,
					useNativeDriver: true,
				}),
			]).start();
		} else if (mounted) {
			Animated.parallel([
				Animated.timing(backdropOpacity, {
					toValue: 0,
					duration: 180,
					useNativeDriver: true,
				}),
				Animated.timing(slideY, {
					toValue: 500,
					duration: 220,
					useNativeDriver: true,
				}),
			]).start(() => setMounted(false));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	if (!mounted || !card) return null;

	const isJester = card.rank === "Jester";
	const cardImage = getHandCardImage(card.rank, card.suit, card.id);
	const suitColor = card.suit ? SUIT_COLOR[card.suit] : "#9F7AEA";
	const suitSymbol = card.suit ? SUIT_SYMBOL[card.suit] : "🃏";
	const isImmune = !!card.suit && card.suit === immuneSuit;

	const classKey = isJester ? "jester" : card.suit ?? "jester";
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
			<Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
			</Animated.View>

			{/* Panel */}
			<Animated.View
				style={[styles.panel, { transform: [{ translateY: slideY }] }]}
				pointerEvents="box-none"
			>
				{/* Drag handle */}
				<View style={styles.handle} />

				{/* Close button */}
				<TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
					<Image source={CROWN_ICON} style={styles.closeIcon} resizeMode="contain" />
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
									resizeMode="cover"
								/>
							) : (
								<View style={[styles.cardImageFallback, { borderColor: suitColor }]}>
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
							<View style={[styles.classBadge, { borderColor: suitColor + "66", backgroundColor: suitColor + "18" }]}>
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
							<Text style={styles.heroName}>
								{heroName ?? className}
							</Text>

							{/* Rank + suit subtitle */}
							{!isJester && (
								<Text style={styles.rankSubtitle}>
									{card.rank} — {t(`suits.${card.suit}`)}
								</Text>
							)}

							<View style={styles.divider} />

							{/* Power section */}
							<Text style={styles.sectionLabel}>{t("cardDetail.suitPower")}</Text>

							{isJester ? (
								<Text style={styles.powerDesc}>{t("cardDetail.jesterPower")}</Text>
							) : (
								<View style={[styles.powerBox, isImmune && styles.powerBoxImmune]}>
									{isImmune && (
										<Text style={styles.immuneTag}>{t("enemy.immune")}</Text>
									)}
									<Text style={[styles.powerDesc, isImmune && styles.powerDescImmune]}>
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

const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.6)",
	},
	panel: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#0F172A",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderTopWidth: 1,
		borderColor: "rgba(148,163,184,0.2)",
		paddingBottom: 36,
		maxHeight: "80%",
	},
	handle: {
		alignSelf: "center",
		width: 36,
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(148,163,184,0.35)",
		marginTop: 10,
		marginBottom: 6,
	},
	closeBtn: {
		position: "absolute",
		top: 12,
		right: 16,
		padding: 6,
		zIndex: 1,
	},
	closeIcon: { width: 22, height: 22 },
	content: {
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 8,
		gap: 16,
	},
	topRow: {
		flexDirection: "row",
		gap: 18,
		alignItems: "flex-start",
	},
	imageWrapper: {
		alignItems: "center",
		gap: 8,
	},
	cardImage: {
		width: 120,
		height: 168,
		borderRadius: 10,
	},
	cardImageFallback: {
		width: 120,
		height: 168,
		borderRadius: 10,
		borderWidth: 2,
		backgroundColor: "#F8FAFC",
		justifyContent: "center",
		alignItems: "center",
		gap: 4,
	},
	fallbackRank: {
		fontSize: 28,
		fontWeight: "bold",
	},
	fallbackSuit: {
		fontSize: 34,
	},
	valueBadge: {
		paddingHorizontal: 14,
		paddingVertical: 4,
		borderRadius: 20,
		borderWidth: 1,
		backgroundColor: "rgba(15,23,42,0.6)",
	},
	valueText: {
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 0.3,
	},
	infoCol: {
		flex: 1,
		gap: 10,
		paddingTop: 2,
	},
	classBadge: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
		borderWidth: 1,
	},
	suitSymbolSmall: {
		fontSize: 14,
		fontWeight: "700",
	},
	className: {
		fontSize: 12,
		fontWeight: "800",
		letterSpacing: 0.8,
		textTransform: "uppercase",
	},
	heroName: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 22,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	rankSubtitle: {
		color: "#64748B",
		fontSize: 13,
		fontWeight: "500",
		letterSpacing: 0.3,
		marginTop: -6,
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(148,163,184,0.15)",
	},
	sectionLabel: {
		color: "#64748B",
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	powerBox: {
		gap: 4,
	},
	powerBoxImmune: {
		backgroundColor: "rgba(239,68,68,0.08)",
		borderWidth: 1,
		borderColor: "rgba(239,68,68,0.25)",
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 10,
	},
	immuneTag: {
		color: "#F87171",
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 0.3,
	},
	powerDesc: {
		color: "#94A3B8",
		fontSize: 13,
		lineHeight: 19,
	},
	powerDescImmune: {
		color: "#CBD5E1",
	},
	loreBlock: {
		borderLeftWidth: 3,
		paddingLeft: 12,
		paddingVertical: 4,
		gap: 4,
	},
	loreLabel: {
		color: "#CBD5E1",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	loreText: {
		color: "#64748B",
		fontSize: 12,
		lineHeight: 18,
		fontStyle: "italic",
	},
});
