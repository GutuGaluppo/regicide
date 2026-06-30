import MagicShield from "@/assets/icons/shield.png";
import { NumberSprite } from "@/components/NumberSprite";
import { ProgressRing } from "@/components/ProgressRing";
import { useAudio } from "@/contexts/AudioContext";
import { getCardImage, getHandCardImage } from "@/data/images";
import { Card, Enemy } from "@/data/types";
import { EnemyCardLayout, getEnemyCardLayout } from "@/hooks/useEnemyCardScale";
import { getHpColor } from "@/utils/hpColor";
import { TutorialTarget } from "@/components/TutorialOverlay/TutorialTarget";
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
	layout = getEnemyCardLayout(1),
	onCardMeasure,
	onShieldPileMeasure,
	onJesterAnimationStateChange,
	tutorialActive = false,
	tutorialMeasureSignal,
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
	layout?: EnemyCardLayout;
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
	/** Mede os anéis de Vida/Ataque como alvos do tutorial spotlight. */
	tutorialActive?: boolean;
	/** Ao mudar, força nova medição dos anéis (troca de passo do tutorial). */
	tutorialMeasureSignal?: unknown;
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
	const visibleShieldCardsCount = Math.min(3, shieldCardsCount);
	const shieldPileWidth =
		layout.shieldPileCardWidth
		+ Math.max(0, visibleShieldCardsCount - 1) * layout.shieldPileStep;
	const shieldPileHeight =
		layout.shieldPileCardHeight
		+ Math.max(0, visibleShieldCardsCount - 1) * layout.shieldPileStep;

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
		entryScale.value = withSpring(1, { stiffness: 72, damping: 18 });
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
		layout.scale,
		onShieldPileMeasure,
		showShieldArea,
		shieldCardsCount,
		previewShieldGain,
		spadesShield,
	]);

	useEffect(() => {
		measureCardBody();
	}, [enemy.id, layout.scale, onCardMeasure]); // eslint-disable-line react-hooks/exhaustive-deps

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
					style={[
						styles.imageWrapper,
						{
							width: layout.cardWidth,
							height: layout.cardHeight,
						},
					]}
				>
					<Image
						source={getCardImage(enemy.rank, enemy.suit)}
						style={[
							styles.image,
							{
								width: layout.cardWidth,
								height: layout.cardHeight,
								borderRadius: layout.borderRadius,
							},
						]}
						contentFit="contain"
					/>

					{/* Jesters — topo esquerdo */}
					{(jestersAvailable !== undefined || jestersUsed !== undefined) && (
						<View
							style={[
								styles.jesterBadge,
								{
									top: layout.badgeTop - 4,
									left: -layout.jesterOffset,
								},
							]}
						>
							<View
								style={{
									width: layout.jesterStackWidth,
									height: layout.jesterStackHeight,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<View style={{ transform: [{ scale: layout.scale }] }}>
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
							</View>
						</View>
					)}

					{/* Defeated overlay */}
					{defeated && (
						<View
							style={[
								styles.defeatedOverlay,
								{ borderRadius: layout.borderRadius },
							]}
							pointerEvents="none"
						/>
					)}

					{/* Red damage flash */}
					<Animated.View
						style={[
							styles.damageFlash,
							flashStyle,
							{ borderRadius: layout.borderRadius },
						]}
						pointerEvents="none"
					/>

					{/* Spades shield glow */}
					<Animated.View
						style={[
							styles.shieldGlowOverlay,
							glowStyle,
							{
								borderRadius: layout.borderRadius,
							},
						]}
						pointerEvents="none"
					/>

					{/* ATK — topo direito */}
					<View
						style={[
							styles.atkBadge,
							{
								top: layout.badgeTop,
								right: -layout.badgeOffset,
								gap: layout.badgeLabelGap,
							},
						]}
					>
						<Text
							style={[
								styles.badgeLabel,
								{ fontSize: layout.badgeLabelFontSize },
							]}
						>
							{t("enemy.attack")}
						</Text>
						<TutorialTarget
							id="tutorial-enemy-attack"
							active={tutorialActive}
							measureSignal={tutorialMeasureSignal}
						>
							<ProgressRing
								percent={attackPercent}
								size={layout.ringSize}
								strokeWidth={layout.ringStroke}
								color="#b8860a"
							>
								<NumberSprite
									value={displayAttack}
									type="deckstatus"
									height={layout.numberHeight}
								/>
							</ProgressRing>
						</TutorialTarget>
						{(shielded || previewShielded) && (
							<View
								style={[
									styles.shieldedWrapper,
									{
										width: layout.shieldValueSize,
										height: layout.shieldValueSize,
									},
								]}
							>
								<Image
									source={MagicShield}
									style={[
										styles.shieldIconBg,
										{
											width: layout.shieldValueSize,
											height: layout.shieldValueSize,
										},
									]}
									contentFit="contain"
								/>
								<NumberSprite
									value={shieldValue}
									type="attack"
									height={layout.shieldNumberHeight}
									color="#FFFFFF"
								/>
							</View>
						)}
						{showShieldArea && (
							<View
								ref={shieldPileRef}
								collapsable={false}
								style={[
									styles.shieldPileAnchor,
									{
										width: layout.shieldPileAnchorWidth,
										height: layout.shieldPileAnchorHeight,
									},
								]}
							>
								{!hideShieldPile &&
									shieldCards &&
									shieldCards.length > 0 &&
									(() => {
										const visible = shieldCards.slice(-3);
										return (
											<View
												style={[
													styles.shieldPile,
													{
														width: shieldPileWidth,
														height: shieldPileHeight,
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
																{
																	left: i * layout.shieldPileStep,
																	top: i * layout.shieldPileStep,
																	zIndex: i,
																	width: layout.shieldPileCardWidth,
																	height: layout.shieldPileCardHeight,
																	borderRadius: Math.max(
																		4,
																		Math.round(layout.scale * 5),
																	),
																},
															]}
														>
															{img ? (
																<Image
																	source={img}
																	style={styles.shieldPileImg}
																	contentFit="cover"
																/>
															) : (
																<Text
																	style={[
																		styles.shieldPileFallback,
																		{
																			fontSize: Math.max(
																				8,
																				Math.round(layout.scale * 10),
																			),
																		},
																	]}
																>
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
										<View
											style={[
												styles.shieldPilePlaceholder,
												{
													width: layout.shieldPileCardWidth,
													height: layout.shieldPileCardHeight,
													borderRadius: Math.max(
														4,
														Math.round(layout.scale * 5),
													),
												},
											]}
										>
											<Image
												source={require("@/assets/classes/Spades.avif")}
												style={{
													width: layout.shieldPlaceholderIcon,
													height: layout.shieldPlaceholderIcon,
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
					<View
						style={[
							styles.hpBadge,
							{
								bottom: layout.badgeBottom,
								left: -layout.badgeOffset,
								gap: layout.badgeLabelGap,
							},
						]}
					>
						<TutorialTarget
							id="tutorial-enemy-hp"
							active={tutorialActive}
							measureSignal={tutorialMeasureSignal}
						>
							<ProgressRing
								percent={hpPercent}
								size={layout.ringSize}
								strokeWidth={layout.ringStroke}
								color={hpColor}
							>
								<NumberSprite value={displayHP} type="health" height={layout.numberHeight} />
							</ProgressRing>
						</TutorialTarget>
						<Text
							style={[
								styles.badgeLabel,
								{ fontSize: layout.badgeLabelFontSize },
							]}
						>
							{t("enemy.health")}
						</Text>
					</View>
				</View>
			</Animated.View>
		</TouchableOpacity>
	);
};
