import { useAudio } from "@/contexts/AudioContext";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Easing,
	Image,
	ImageBackground,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { getCardImage } from "@/data/images";
import { Enemy, GameStats, Card } from "@/data/types";
import { styles } from "./DefeatScreen.styles";
import {
	GhostActions,
	GhostFooter,
	GhostHand,
	GhostStatusBar,
} from "./components/GhostElements";
import { StatsPanel } from "./components/StatsPanel/StatsPanel";

const BG = require("@/assets/backgrounds/bg_cave.webp");
const CROWN_ICON = require("@/assets/icons/crown_white.png");

type DefeatScreenPropsType = {
	enemy: Enemy;
	stats?: GameStats;
	defeatedEnemies?: Enemy[];
	playerHand?: Card[];
	onReset: () => void;
};

export const DefeatScreen = ({
	enemy,
	stats,
	defeatedEnemies,
	playerHand,
	onReset,
}: DefeatScreenPropsType) => {
	const { t } = useTranslation();
	const { playTap } = useAudio();

	const [ghostsVisible, setGhostsVisible] = useState(true);
	const othersScale = useRef(new Animated.Value(1)).current;
	const othersOpacity = useRef(new Animated.Value(1)).current;
	const cardScale = useRef(new Animated.Value(0.6)).current;
	const cardOpacity = useRef(new Animated.Value(0.6)).current;
	const msgOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.sequence([
			Animated.parallel([
				Animated.timing(othersScale, {
					toValue: 0,
					duration: 700,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(othersOpacity, {
					toValue: 0,
					duration: 500,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(cardScale, {
					toValue: 1,
					duration: 900,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(cardOpacity, {
					toValue: 1,
					duration: 600,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
			]),
			Animated.timing(msgOpacity, {
				toValue: 1,
				duration: 600,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		]).start(() => setGhostsVisible(false));
	}, [cardOpacity, cardScale, msgOpacity, othersOpacity, othersScale]);

	return (
		<ImageBackground
			source={BG}
			style={styles.bg}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => { playTap(); router.back(); }}
						style={styles.backBtn}
					>
						<Image
							source={CROWN_ICON}
							style={styles.backIcon}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</View>

				{ghostsVisible && (
					<Animated.View
						style={[
							styles.ghostTop,
							{ transform: [{ scale: othersScale }], opacity: othersOpacity },
						]}
					>
						<GhostStatusBar />
					</Animated.View>
				)}

				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.center}
					showsVerticalScrollIndicator={false}
				>
					<Animated.View
						style={{ transform: [{ scale: cardScale }], opacity: cardOpacity }}
					>
						<Image
							source={getCardImage(enemy.rank, enemy.suit)}
							style={styles.enemyCard}
							resizeMode="contain"
						/>
					</Animated.View>

					<Animated.Text style={[styles.defeatMsg, { opacity: msgOpacity }]}>
						{t("defeat.message")}
					</Animated.Text>

					{stats && (
						<Animated.View style={{ opacity: msgOpacity, width: "100%" }}>
							<StatsPanel
								stats={stats}
								defeatedEnemies={defeatedEnemies ?? []}
								playerHand={playerHand}
							/>
						</Animated.View>
					)}

					<Animated.View style={{ opacity: msgOpacity }}>
						<TouchableOpacity
							style={styles.newGameBtn}
							onPress={() => { playTap(); onReset(); }}
							activeOpacity={0.8}
						>
							<Text style={styles.newGameText}>{t("defeat.newGame")}</Text>
						</TouchableOpacity>
					</Animated.View>
				</ScrollView>

				{ghostsVisible && (
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
				)}
			</View>
		</ImageBackground>
	);
};
