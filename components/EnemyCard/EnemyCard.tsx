import MagicShield from "@/assets/icons/shield.png";
import { NumberSprite } from "@/components/NumberSprite";
import { ProgressRing } from "@/components/ProgressRing";
import { useAudio } from "@/contexts/AudioContext";
import { getCardImage, getHandCardImage } from "@/data/images";
import { Card, Enemy } from "@/data/types";
import { getHpColor } from "@/utils/hpColor";
import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { JesterStack } from "./components/JesterStack";
import { styles } from "./EnemyCard.styles";

export const EnemyCard = ({
	enemy,
	currentHP,
	effectiveAttack,
	jesterActive,
	spadesShield,
	shieldCards,
	jestersAvailable,
	jestersUsed,
	autoJesterSignal,
	hidden = false,
	onUseJester,
	onAutoJesterComplete,
	onPress,
	previewDamage = 0,
	previewShieldGain = 0,
	defeated = false,
	hideShieldPile = false,
	onCardMeasure,
	onShieldPileMeasure,
	onJesterAnimationStateChange,
}: {
	enemy: Enemy;
	currentHP: number;
	effectiveAttack: number;
	jesterActive?: boolean;
	spadesShield?: number;
	shieldCards?: Card[];
	jestersAvailable?: number;
	jestersUsed?: number;
	autoJesterSignal?: number;
	hidden?: boolean;
	onUseJester?: () => void;
	onAutoJesterComplete?: (signal: number) => void;
	onPress?: () => void;
	previewDamage?: number;
	previewShieldGain?: number;
	defeated?: boolean;
	hideShieldPile?: boolean;
	onCardMeasure?: (rect: {
		x: number;
		y: number;
		w: number;
		h: number;
	}) => void;
	onShieldPileMeasure?: (rect: {
		x: number;
		y: number;
		w: number;
		h: number;
	}) => void;
	onJesterAnimationStateChange?: (isAnimating: boolean) => void;
}) => {
	const { t } = useTranslation();
	const { playTap } = useAudio();

	const displayHP =
		previewDamage > 0 ? Math.max(0, currentHP - previewDamage) : currentHP;
	const displayAttack =
		previewShieldGain > 0
			? Math.max(0, effectiveAttack - previewShieldGain)
			: effectiveAttack;

	const hpPercent = Math.max(0, displayHP / enemy.health);
	const attackPercent = Math.min(1, displayAttack / enemy.attack);
	const hpColor = getHpColor(hpPercent);
	const shielded = effectiveAttack < enemy.attack;
	const shieldCardsCount = shieldCards?.length ?? 0;
	const previewShielded = previewShieldGain > 0;
	const showShieldArea =
		shieldCardsCount > 0 || (spadesShield ?? 0) > 0 || previewShielded;
	const shieldValue = Math.max(0, enemy.attack - displayAttack);

	// ─── Shared values ────────────────────────────────────────────────────────
	const entryOpacity = useSharedValue(0);
	const entryScale = useSharedValue(0.88);
	const entryY = useSharedValue(20);
	const shakeX = useSharedValue(0);
	const flashOpacity = useSharedValue(0);
	const shieldGlow = useSharedValue(0);

	const prevHP = useRef(currentHP);
	const prevShield = useRef(spadesShield ?? 0);
	const cardBodyRef = useRef<View>(null);
	const shieldPileRef = useRef<View>(null);

	const measureCardBody = () => {
		if (!onCardMeasure) return;

		requestAnimationFrame(() => {
			cardBodyRef.current?.measureInWindow((x, y, w, h) => {
				if (w === 0 || h === 0) return;
				onCardMeasure({ x, y, w, h });
			});
		});
	};

	// ─── Entry animation ──────────────────────────────────────────────────────
	useEffect(() => {
		entryOpacity.value = 0;
		entryScale.value = 0.88;
		entryY.value = 20;
		prevHP.current = currentHP;
		prevShield.current = spadesShield ?? 0;

		entryOpacity.value = withTiming(1, { duration: 450 });
		entryScale.value = withSpring(1, { stiffness: 90, damping: 12 });
		entryY.value = withTiming(0, { duration: 400 });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enemy.id]);

	// ─── Damage animation ─────────────────────────────────────────────────────
	useEffect(() => {
		if (currentHP < prevHP.current) {
			shakeX.value = withSequence(
				withTiming(-10, { duration: 45 }),
				withTiming(10, { duration: 45 }),
				withTiming(-7, { duration: 45 }),
				withTiming(7, { duration: 45 }),
				withTiming(0, { duration: 45 }),
			);

			flashOpacity.value = withSequence(
				withTiming(0.45, { duration: 60 }),
				withTiming(0, { duration: 380 }),
			);
		}
		prevHP.current = currentHP;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentHP]);

	// ─── Shield glow ──────────────────────────────────────────────────────────
	useEffect(() => {
		const shield = spadesShield ?? 0;
		if (shield > prevShield.current) {
			shieldGlow.value = withSequence(
				withTiming(1, { duration: 180 }),
				withTiming(0.3, { duration: 280 }),
				withTiming(1, { duration: 280 }),
				withTiming(0.3, { duration: 280 }),
				withTiming(1, { duration: 280 }),
				withTiming(0, { duration: 400 }),
			);
		}
		prevShield.current = shield;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [spadesShield]);

	useEffect(() => {
		if (!showShieldArea || hideShieldPile) return;

		requestAnimationFrame(() => {
			shieldPileRef.current?.measureInWindow((x, y, w, h) => {
				if (w === 0 || h === 0) return;
				onShieldPileMeasure?.({ x, y, w, h });
			});
		});
	}, [
		hideShieldPile,
		onShieldPileMeasure,
		showShieldArea,
		shieldCardsCount,
		previewShieldGain,
		spadesShield,
	]);

	useEffect(() => {
		measureCardBody();
	}, [enemy.id, onCardMeasure]); // eslint-disable-line react-hooks/exhaustive-deps

	// ─── Animated styles ──────────────────────────────────────────────────────
	const cardAnimStyle = useAnimatedStyle(() => ({
		opacity: hidden ? 0 : defeated ? 0.4 : entryOpacity.value,
		transform: [
			{ scale: entryScale.value },
			{ translateY: entryY.value },
			{ translateX: shakeX.value },
		],
	}));

	const flashStyle = useAnimatedStyle(() => ({
		opacity: flashOpacity.value,
	}));

	const glowStyle = useAnimatedStyle(() => ({
		opacity: shieldGlow.value,
	}));

	return (
		<TouchableOpacity
			onPress={
				onPress
					? () => {
							playTap();
							onPress();
						}
					: undefined
			}
			activeOpacity={onPress ? 0.85 : 1}
			disabled={!onPress}
		>
			<Animated.View style={[styles.card, cardAnimStyle]}>
				<View
					ref={cardBodyRef}
					collapsable={false}
					onLayout={measureCardBody}
					style={styles.imageWrapper}
				>
					<Image
						source={getCardImage(enemy.rank, enemy.suit)}
						style={styles.image}
						contentFit="contain"
					/>

					{/* Jesters — topo esquerdo */}
					{(jestersAvailable !== undefined || jestersUsed !== undefined) && (
						<View style={styles.jesterBadge}>
							<JesterStack
								jestersAvailable={jestersAvailable ?? 0}
								jestersUsed={jestersUsed ?? 0}
								jesterActive={!!jesterActive}
								autoUseSignal={autoJesterSignal}
								onUseJester={onUseJester}
								onAutoUseComplete={onAutoJesterComplete}
								onAnimationStateChange={onJesterAnimationStateChange}
							/>
						</View>
					)}

					{/* Defeated overlay */}
					{defeated && (
						<View style={styles.defeatedOverlay} pointerEvents="none" />
					)}

					{/* Red damage flash */}
					<Animated.View
						style={[styles.damageFlash, flashStyle]}
						pointerEvents="none"
					/>

					{/* Spades shield glow */}
					<Animated.View
						style={[styles.shieldGlowOverlay, glowStyle]}
						pointerEvents="none"
					/>

					{/* ATK — topo direito */}
					<View style={styles.atkBadge}>
						<Text style={styles.badgeLabel}>{t("enemy.attack")}</Text>
						<ProgressRing
							percent={attackPercent}
							size={80}
							strokeWidth={6}
							color="#b8860a"
						>
							<NumberSprite
								value={displayAttack}
								type="deckstatus"
								height={32}
							/>
						</ProgressRing>
						{(shielded || previewShielded) && (
							<View style={styles.shieldedWrapper}>
								<Image
									source={MagicShield}
									style={styles.shieldIconBg}
									contentFit="contain"
								/>
								<NumberSprite
									value={shieldValue}
									type="attack"
									height={20}
									color="#FFFFFF"
								/>
							</View>
						)}
						{showShieldArea && (
							<View
								ref={shieldPileRef}
								collapsable={false}
								style={styles.shieldPileAnchor}
							>
								{!hideShieldPile &&
									shieldCards &&
									shieldCards.length > 0 &&
									(() => {
										const visible = shieldCards.slice(-3);
										const n = visible.length;
										return (
											<View
												style={[
													styles.shieldPile,
													{
														width: 40 + (n - 1) * 6,
														height: 56 + (n - 1) * 6,
													},
												]}
											>
												{visible.map((card, i) => {
													const img = getHandCardImage(
														card.rank,
														card.suit,
														card.id,
													);
													return (
														<View
															key={card.id}
															style={[
																styles.shieldPileCard,
																{ left: i * 6, top: i * 6, zIndex: i },
															]}
														>
															{img ? (
																<Image
																	source={img}
																	style={styles.shieldPileImg}
																	contentFit="cover"
																/>
															) : (
																<Text style={styles.shieldPileFallback}>
																	{card.rank}♠
																</Text>
															)}
														</View>
													);
												})}
											</View>
										);
									})()}
								{!hideShieldPile &&
									shieldCardsCount === 0 &&
									previewShielded && (
										<View style={styles.shieldPilePlaceholder}>
											<Image
												source={require("@/assets/classes/Spades.avif")}
												style={{
													width: 35,
													height: 35,
													margin: "auto",
													opacity: 0.4,
												}}
												contentFit="cover"
											/>
										</View>
									)}
							</View>
						)}
					</View>

					{/* HP — base esquerda */}
					<View style={styles.hpBadge}>
						<ProgressRing
							percent={hpPercent}
							size={80}
							strokeWidth={6}
							color={hpColor}
						>
							<NumberSprite value={displayHP} type="health" height={32} />
						</ProgressRing>
						<Text style={styles.badgeLabel}>{t("enemy.health")}</Text>
					</View>
				</View>
			</Animated.View>
		</TouchableOpacity>
	);
};
