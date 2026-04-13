// /components/EnemyModal.tsx
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
import { NumberSprite } from "../components/NumberSprite";
import { ProgressRing } from "../components/ProgressRing";
import { getCardImage } from "../data/images";
import { Enemy, Suit } from "../data/types";

const CROWN_ICON = require("../assets/icons/crown_white.png");

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

const SUIT_COLOR: Record<Suit, string> = {
	hearts: "#F87171",
	diamonds: "#F87171",
	clubs: "#94A3B8",
	spades: "#94A3B8",
};

export const EnemyModal = ({
	enemy,
	currentHP,
	effectiveAttack,
	visible,
	onClose,
}: {
	enemy: Enemy;
	currentHP: number;
	effectiveAttack: number;
	visible: boolean;
	onClose: () => void;
}) => {
	const { t } = useTranslation();
	const hpPercent = Math.max(0, currentHP / enemy.health);
	const attackPercent = Math.min(1, effectiveAttack / enemy.attack);
	const hpColor =
		hpPercent > 0.5 ? "#22C55E" : hpPercent > 0.25 ? "#FBBF24" : "#EF4444";

	// Keep Modal in DOM during exit animation
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
					duration: 220,
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
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.timing(slideY, {
					toValue: 500,
					duration: 240,
					useNativeDriver: true,
				}),
			]).start(() => setMounted(false));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	if (!mounted) return null;

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
					{/* Enemy image + stats */}
					<View style={styles.cardRow}>
						<Image
							source={getCardImage(enemy.rank, enemy.suit)}
							style={styles.enemyImage}
							resizeMode="contain"
						/>
						<View style={styles.statsCol}>
							<Text style={styles.enemyName}>
								{t(`ranks.${enemy.rank}`) ?? enemy.rank}
							</Text>
							<Text style={styles.enemySuit}>
								{t(`suitLabels.${enemy.suit}`)}
							</Text>

							<View style={styles.statBlock}>
								<ProgressRing
									percent={hpPercent}
									size={68}
									strokeWidth={5}
									color={hpColor}
								>
									<NumberSprite value={currentHP} type="health" height={26} />
								</ProgressRing>
								<Text style={styles.statLabel}>{t("enemy.health")}</Text>
							</View>

							<View style={styles.statBlock}>
								<ProgressRing
									percent={attackPercent}
									size={68}
									strokeWidth={5}
									color="#b8860a"
								>
									<NumberSprite value={effectiveAttack} type="attack" height={26} />
								</ProgressRing>
								<Text style={styles.statLabel}>{t("enemy.attack")}</Text>
							</View>
						</View>
					</View>

					{/* Suit powers */}
					<View style={styles.divider} />
					<Text style={styles.sectionTitle}>{t("enemy.suitPowers")}</Text>

					{SUITS.map((suit) => {
						const isImmune = suit === enemy.suit;
						const suitLabel = t(`suitLabels.${suit}`);
						return (
							<View
								key={suit}
								style={[styles.powerRow, isImmune && styles.powerRowImmune]}
							>
								<Text style={[styles.suitSymbol, { color: SUIT_COLOR[suit] }]}>
									{suitLabel.charAt(0)}
								</Text>
								<View style={styles.powerTextCol}>
									<Text style={[styles.suitName, isImmune && styles.suitNameImmune]}>
										{suitLabel.slice(2)}
										{isImmune ? ` ${t("enemy.immune")}` : ""}
									</Text>
									<Text style={[styles.powerDesc, isImmune && styles.powerDescImmune]}>
										{isImmune
											? t("enemy.immuneDesc")
											: t(`suitPowers.${suit}`)}
									</Text>
								</View>
							</View>
						);
					})}
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
		paddingBottom: 32,
		maxHeight: "88%",
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
	},
	closeIcon: { width: 22, height: 22 },
	content: {
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 8,
		gap: 14,
	},
	cardRow: {
		flexDirection: "row",
		gap: 20,
		alignItems: "flex-start",
	},
	enemyImage: {
		width: 120,
		height: 168,
		borderRadius: 10,
	},
	statsCol: {
		flex: 1,
		gap: 10,
		paddingTop: 4,
	},
	enemyName: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 22,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	enemySuit: {
		color: "#94A3B8",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 14,
		letterSpacing: 0.5,
	},
	statBlock: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	statLabel: {
		color: "#94A3B8",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 13,
		fontWeight: "600",
		letterSpacing: 0.8,
		textTransform: "uppercase",
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(148,163,184,0.15)",
	},
	sectionTitle: {
		color: "#CBD5E1",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 14,
		fontWeight: "700",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	powerRow: {
		flexDirection: "row",
		gap: 12,
		alignItems: "flex-start",
		paddingVertical: 8,
		paddingHorizontal: 10,
		borderRadius: 10,
	},
	powerRowImmune: {
		backgroundColor: "rgba(239,68,68,0.08)",
		borderWidth: 1,
		borderColor: "rgba(239,68,68,0.25)",
	},
	suitSymbol: {
		fontSize: 22,
		width: 24,
		textAlign: "center",
		marginTop: 1,
	},
	powerTextCol: {
		flex: 1,
		gap: 2,
	},
	suitName: {
		color: "#E2E8F0",
		fontSize: 14,
		fontWeight: "700",
		letterSpacing: 0.3,
	},
	suitNameImmune: {
		color: "#F87171",
	},
	powerDesc: {
		color: "#64748B",
		fontSize: 12,
		lineHeight: 17,
	},
	powerDescImmune: {
		color: "#94A3B8",
	},
});
