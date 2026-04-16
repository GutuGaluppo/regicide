import { useAudio } from "@/contexts/AudioContext";
import MagicShield from "@/assets/icons/shield.png";
import { getCardImage, getHandCardImage } from "@/data/images";
import { Card, Enemy } from "@/data/types";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { NumberSprite } from "../NumberSprite";
import { ProgressRing } from "../ProgressRing";
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
	onUseJester,
	onPress,
	previewDamage = 0,
	previewShieldGain = 0,
	defeated = false,
}: {
	enemy: Enemy;
	currentHP: number;
	effectiveAttack: number;
	jesterActive?: boolean;
	spadesShield?: number;
	shieldCards?: Card[];
	jestersAvailable?: number;
	jestersUsed?: number;
	onUseJester?: () => void;
	onPress?: () => void;
	previewDamage?: number;
	previewShieldGain?: number;
	defeated?: boolean;
}) => {
	const { t } = useTranslation();
	const { playTap } = useAudio();

	const displayHP = previewDamage > 0 ? Math.max(0, currentHP - previewDamage) : currentHP;
	const displayAttack = previewShieldGain > 0
		? Math.max(0, effectiveAttack - previewShieldGain)
		: effectiveAttack;

	const hpPercent = Math.max(0, displayHP / enemy.health);
	const attackPercent = Math.min(1, displayAttack / enemy.attack);
	const hpColor =
		hpPercent > 0.5 ? "#22C55E" : hpPercent > 0.25 ? "#FBBF24" : "#EF4444";
	const shielded = effectiveAttack < enemy.attack;

	// ─── Entry animation ──────────────────────────────────────────────────────
	const entryOpacity = useRef(new Animated.Value(0)).current;
	const entryScale = useRef(new Animated.Value(0.88)).current;
	const entryY = useRef(new Animated.Value(20)).current;

	// ─── Damage animation ─────────────────────────────────────────────────────
	const shakeX = useRef(new Animated.Value(0)).current;
	const flashOpacity = useRef(new Animated.Value(0)).current;

	// ─── Shield glow ──────────────────────────────────────────────────────────
	const shieldGlow = useRef(new Animated.Value(0)).current;

	const prevHP = useRef(currentHP);
	const prevShield = useRef(spadesShield ?? 0);

	useEffect(() => {
		entryOpacity.setValue(0);
		entryScale.setValue(0.88);
		entryY.setValue(20);
		prevHP.current = currentHP;
		prevShield.current = spadesShield ?? 0;

		Animated.parallel([
			Animated.timing(entryOpacity, {
				toValue: 1,
				duration: 450,
				useNativeDriver: true,
			}),
			Animated.spring(entryScale, {
				toValue: 1,
				tension: 90,
				friction: 12,
				useNativeDriver: true,
			}),
			Animated.timing(entryY, {
				toValue: 0,
				duration: 400,
				useNativeDriver: true,
			}),
		]).start();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enemy.id]);

	useEffect(() => {
		if (currentHP < prevHP.current) {
			Animated.sequence([
				Animated.timing(shakeX, {
					toValue: -10,
					duration: 45,
					useNativeDriver: true,
				}),
				Animated.timing(shakeX, {
					toValue: 10,
					duration: 45,
					useNativeDriver: true,
				}),
				Animated.timing(shakeX, {
					toValue: -7,
					duration: 45,
					useNativeDriver: true,
				}),
				Animated.timing(shakeX, {
					toValue: 7,
					duration: 45,
					useNativeDriver: true,
				}),
				Animated.timing(shakeX, {
					toValue: 0,
					duration: 45,
					useNativeDriver: true,
				}),
			]).start();

			Animated.sequence([
				Animated.timing(flashOpacity, {
					toValue: 0.45,
					duration: 60,
					useNativeDriver: true,
				}),
				Animated.timing(flashOpacity, {
					toValue: 0,
					duration: 380,
					useNativeDriver: true,
				}),
			]).start();
		}
		prevHP.current = currentHP;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentHP]);

	useEffect(() => {
		const shield = spadesShield ?? 0;
		if (shield > prevShield.current) {
			Animated.sequence([
				Animated.timing(shieldGlow, {
					toValue: 1,
					duration: 180,
					useNativeDriver: true,
				}),
				Animated.timing(shieldGlow, {
					toValue: 0.3,
					duration: 280,
					useNativeDriver: true,
				}),
				Animated.timing(shieldGlow, {
					toValue: 1,
					duration: 280,
					useNativeDriver: true,
				}),
				Animated.timing(shieldGlow, {
					toValue: 0.3,
					duration: 280,
					useNativeDriver: true,
				}),
				Animated.timing(shieldGlow, {
					toValue: 1,
					duration: 280,
					useNativeDriver: true,
				}),
				Animated.timing(shieldGlow, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}),
			]).start();
		}
		prevShield.current = shield;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [spadesShield]);

	return (
		<TouchableOpacity
			onPress={onPress ? () => { playTap(); onPress(); } : undefined}
			activeOpacity={onPress ? 0.85 : 1}
			disabled={!onPress}
		>
			<Animated.View
				style={[
					styles.card,
					{
						opacity: defeated ? 0.4 : entryOpacity,
						transform: [
							{ scale: entryScale },
							{ translateY: entryY },
							{ translateX: shakeX },
						],
					},
				]}
			>
				<View style={styles.imageWrapper}>
					<Image
						source={getCardImage(enemy.rank, enemy.suit)}
						style={styles.image}
						resizeMode="contain"
					/>

					{/* Jesters — topo esquerdo */}
					{(jestersAvailable !== undefined || jestersUsed !== undefined) && (
						<View style={styles.jesterBadge}>
							<JesterStack
								jestersAvailable={jestersAvailable ?? 0}
								jestersUsed={jestersUsed ?? 0}
								jesterActive={!!jesterActive}
								onUseJester={onUseJester}
							/>
						</View>
					)}

					{/* Defeated overlay */}
					{defeated && (
						<View style={styles.defeatedOverlay} pointerEvents="none" />
					)}

					{/* Red damage flash */}
					<Animated.View
						style={[styles.damageFlash, { opacity: flashOpacity }]}
						pointerEvents="none"
					/>

					{/* Spades shield glow */}
					<Animated.View
						style={[styles.shieldGlowOverlay, { opacity: shieldGlow }]}
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
						{shielded && (
							<View style={styles.shieldedWrapper}>
								<Image source={MagicShield} style={styles.shieldIconBg} />
								<View style={styles.shieldNumber}>
									<NumberSprite
										value={enemy.attack - effectiveAttack}
										type="shield"
										height={22}
									/>
								</View>
							</View>
						)}
						{shieldCards &&
							shieldCards.length > 0 &&
							(() => {
								const visible = shieldCards.slice(-3);
								const n = visible.length;
								return (
									<View
										style={[
											styles.shieldPile,
											{ width: 40 + (n - 1) * 6, height: 56 + (n - 1) * 6 },
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
															resizeMode="cover"
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
