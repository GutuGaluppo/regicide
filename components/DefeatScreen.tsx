// /components/DefeatScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Easing,
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { getCardImage } from "../data/images";
import { Enemy } from "../data/types";

const BG = require("../assets/backgrounds/bg_cave.webp");
const CARD_BACK = require("../assets/images/cards_back.png");
const CROWN = require("../assets/images/crown.png");
const CROWN_ICON = require("../assets/icons/crown_white.png");

const LINEAR = Easing.linear;

// ─── Ghost elements (mimic game layout to shrink out) ───────────────────────

const GhostStatusBar = () => (
	<View style={ghost.statusRow}>
		{[0, 1, 2].map((i) => (
			<Image key={i} source={CARD_BACK} style={ghost.statusCard} resizeMode="contain" />
		))}
	</View>
);

const GhostHand = () => (
	<View style={ghost.handRow}>
		{[0, 1, 2, 3, 4, 5, 6].map((i) => (
			<Image key={i} source={CARD_BACK} style={ghost.handCard} resizeMode="contain" />
		))}
	</View>
);

const GhostActions = () => (
	<View style={ghost.actionsRow}>
		<View style={ghost.btnPrimary} />
		<View style={ghost.btnSecondary} />
	</View>
);

const GhostFooter = () => (
	<View style={ghost.footerRow}>
		{[0, 1, 2, 3].map((i) => (
			<Image key={i} source={CARD_BACK} style={ghost.footerCard} resizeMode="contain" />
		))}
	</View>
);

// ─── Main component ──────────────────────────────────────────────────────────

export const DefeatScreen = ({ enemy }: { enemy: Enemy }) => {
	// Phase 1 – outros elementos encolhem (0 → 700ms)
	const othersScale = useRef(new Animated.Value(1)).current;
	const othersOpacity = useRef(new Animated.Value(1)).current;

	// Phase 1 – carta cresce (0 → 900ms)
	const cardScale = useRef(new Animated.Value(0.65)).current;
	const cardOpacity = useRef(new Animated.Value(0.7)).current;

	// Phase 2 – coroa desce (900 → 1900ms)
	const crownY = useRef(new Animated.Value(-340)).current;
	const crownOpacity = useRef(new Animated.Value(0)).current;

	// Phase 2 – mensagem aparece (1100 → 1700ms)
	const msgOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.sequence([
			// Fase 1 — simultânea
			Animated.parallel([
				Animated.timing(othersScale, {
					toValue: 0,
					duration: 700,
					easing: LINEAR,
					useNativeDriver: true,
				}),
				Animated.timing(othersOpacity, {
					toValue: 0,
					duration: 500,
					easing: LINEAR,
					useNativeDriver: true,
				}),
				Animated.timing(cardScale, {
					toValue: 1,
					duration: 900,
					easing: LINEAR,
					useNativeDriver: true,
				}),
				Animated.timing(cardOpacity, {
					toValue: 1,
					duration: 600,
					easing: LINEAR,
					useNativeDriver: true,
				}),
			]),
			// Fase 2 — coroa desce + mensagem aparece
			Animated.parallel([
				Animated.timing(crownY, {
					toValue: 0,
					duration: 1000,
					easing: LINEAR,
					useNativeDriver: true,
				}),
				Animated.timing(crownOpacity, {
					toValue: 1,
					duration: 1000,
					easing: LINEAR,
					useNativeDriver: true,
				}),
				Animated.timing(msgOpacity, {
					toValue: 1,
					duration: 700,
					easing: LINEAR,
					useNativeDriver: true,
				}),
			]),
		]).start();
	}, []);

	return (
		<ImageBackground
			source={BG}
			style={styles.bg}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>

				{/* Header — sempre visível */}
				<View style={styles.header}>
					<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
						<Image source={CROWN_ICON} style={styles.backIcon} resizeMode="contain" />
					</TouchableOpacity>
				</View>

				{/* Ghost status bar — encolhe */}
				<Animated.View
					style={[
						styles.ghostTop,
						{ transform: [{ scale: othersScale }], opacity: othersOpacity },
					]}
				>
					<GhostStatusBar />
				</Animated.View>

				{/* Centro — carta cresce + coroa desce */}
				<View style={styles.center}>
					<View style={styles.cardStack}>
						{/* Coroa desce de cima */}
						<Animated.Image
							source={CROWN}
							style={[
								styles.crown,
								{
									transform: [{ translateY: crownY }],
									opacity: crownOpacity,
								},
							]}
							resizeMode="contain"
						/>

						{/* Carta do inimigo */}
						<Animated.View
							style={{
								transform: [{ scale: cardScale }],
								opacity: cardOpacity,
							}}
						>
							<Image
								source={getCardImage(enemy.rank, enemy.suit)}
								style={styles.enemyCard}
								resizeMode="contain"
							/>
						</Animated.View>
					</View>

					{/* Mensagem de derrota */}
					<Animated.Text style={[styles.defeatMsg, { opacity: msgOpacity }]}>
						O reino caiu
					</Animated.Text>
				</View>

				{/* Ghost mão + botões — encolhe */}
				<Animated.View
					style={[
						styles.ghostBottom,
						{ transform: [{ scale: othersScale }], opacity: othersOpacity },
					]}
				>
					<GhostHand />
					<GhostActions />
					<GhostFooter />
				</Animated.View>

			</View>
		</ImageBackground>
	);
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	bg: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.65)",
	},
	header: {
		paddingTop: 52,
		paddingHorizontal: 16,
		paddingBottom: 4,
	},
	backBtn: {
		alignSelf: "flex-start",
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	backIcon: { width: 30, height: 30 },
	ghostTop: {
		alignItems: "center",
		paddingHorizontal: 16,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 20,
	},
	cardStack: {
		alignItems: "center",
		// overflow visible para a coroa aparecer acima do container
	},
	crown: {
		width: 110,
		height: 80,
		// Posição natural: acima do topo da carta (–80px)
		// A animação translateY parte de –340 e chega a 0
		marginBottom: -80,
		zIndex: 10,
	},
	enemyCard: {
		width: 240,
		height: 336,
		borderRadius: 12,
	},
	defeatMsg: {
		fontFamily: "IMFellEnglish-Regular",
		color: "#EF4444",
		fontSize: 28,
		fontWeight: "900",
		letterSpacing: 2,
		textShadowColor: "#7F1D1D",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 12,
	},
	ghostBottom: {
		paddingHorizontal: 12,
		paddingBottom: 8,
		gap: 8,
	},
});

const ghost = StyleSheet.create({
	statusRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 12,
		paddingVertical: 4,
	},
	statusCard: { width: 36, height: 50 },
	handRow: {
		flexDirection: "row",
		gap: 6,
		justifyContent: "center",
	},
	handCard: { width: 52, height: 75 },
	actionsRow: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
	},
	btnPrimary: {
		width: 160,
		height: 44,
		borderRadius: 10,
		backgroundColor: "rgba(103,130,110,0.6)",
	},
	btnSecondary: {
		width: 100,
		height: 44,
		borderRadius: 10,
		backgroundColor: "rgba(51,65,85,0.5)",
	},
	footerRow: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "center",
	},
	footerCard: { width: 44, height: 62 },
});
