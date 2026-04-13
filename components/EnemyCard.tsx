// /components/EnemyCard.tsx
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import MagicShield from "../assets/icons/shield_03.png";
import { NumberSprite } from "../components/NumberSprite";
import { ProgressRing } from "../components/ProgressRing";
import { getCardImage, getHandCardImage } from "../data/images";
import { Card, Enemy } from "../data/types";

export const EnemyCard = ({
	enemy,
	currentHP,
	effectiveAttack,
	spadesShield,
	shieldCards,
	onPress,
}: {
	enemy: Enemy;
	currentHP: number;
	effectiveAttack: number;
	jesterActive?: boolean;
	spadesShield?: number;
	shieldCards?: Card[];
	onPress?: () => void;
}) => {
	const { t } = useTranslation();
	const hpPercent = Math.max(0, currentHP / enemy.health);
	const attackPercent = Math.min(1, effectiveAttack / enemy.attack);
	const hpColor =
		hpPercent > 0.5 ? "#22C55E" : hpPercent > 0.25 ? "#FBBF24" : "#EF4444";
	const shielded = effectiveAttack < enemy.attack;

	// ─── Entry animation (triggers per enemy) ───────────────────────────────────
	const entryOpacity = useRef(new Animated.Value(0)).current;
	const entryScale = useRef(new Animated.Value(0.88)).current;
	const entryY = useRef(new Animated.Value(20)).current;

	// ─── Damage animation ────────────────────────────────────────────────────────
	const shakeX = useRef(new Animated.Value(0)).current;
	const flashOpacity = useRef(new Animated.Value(0)).current;

	// ─── Shield glow ─────────────────────────────────────────────────────────────
	const shieldGlow = useRef(new Animated.Value(0)).current;

	const prevHP = useRef(currentHP);
	const prevShield = useRef(spadesShield ?? 0);

	// Entry: runs on mount and whenever the enemy changes
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

	// Damage: shake + red flash when HP drops
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

	// Shield: pulse glow when spades shield increases
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
			onPress={onPress}
			activeOpacity={onPress ? 0.85 : 1}
			disabled={!onPress}
		>
			<Animated.View
				style={[
					styles.card,
					{
						opacity: entryOpacity,
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
							<NumberSprite value={effectiveAttack} type="attack" height={32} />
						</ProgressRing>
						{shielded && (
							<View style={styles.shieldedWrapper}>
								<Image source={MagicShield} style={styles.shieldIconBg} />
								<NumberSprite
									value={enemy.attack - effectiveAttack}
									type="attack"
									height={22}
								/>
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
							<NumberSprite value={currentHP} type="health" height={32} />
						</ProgressRing>
						<Text style={styles.badgeLabel}>{t("enemy.health")}</Text>
					</View>
				</View>
			</Animated.View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
	},
	imageWrapper: {
		position: "relative",
		width: 210,
		height: 320,
	},
	image: {
		width: 210,
		height: 320,
		borderRadius: 12,
	},
	damageFlash: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#EF4444",
		borderRadius: 12,
	},
	shieldGlowOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(96,165,250,0.25)",
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "rgba(147,197,253,0.9)",
	},
	atkBadge: {
		position: "absolute",
		top: 20,
		right: -65,
		alignItems: "center",
		gap: 4,
	},
	hpBadge: {
		position: "absolute",
		bottom: 20,
		left: -65,
		alignItems: "center",
		gap: 4,
	},
	badgeLabel: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 0.8,
		textTransform: "uppercase",
		textShadowColor: "rgba(0,0,0,0.8)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
	shieldedWrapper: {
		width: 88,
		height: 88,
		justifyContent: "center",
		alignItems: "center",
	},
	shieldIconBg: {
		position: "absolute",
		top: -8,
		left: 0,
		width: 88,
		height: 88,
	},
	shieldPile: {
		position: "relative",
	},
	shieldPileCard: {
		position: "absolute",
		width: 50,
		height: 66,
		borderRadius: 5,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(96,165,250,0.5)",
	},
	shieldPileImg: {
		width: "100%",
		height: "100%",
	},
	shieldPileFallback: {
		flex: 1,
		color: "#1E293B",
		fontSize: 10,
		fontWeight: "bold",
		textAlign: "center",
		textAlignVertical: "center",
		backgroundColor: "#F8FAFC",
	},
});
