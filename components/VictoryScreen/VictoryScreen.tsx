import { GameLogModal } from "@/components/GameLog";
import { useAudio } from "@/contexts/AudioContext";
import { GameLogEntry } from "@/data/types";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Dimensions,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useBackgroundCaching } from "@/hooks/useBackgroundCaching";
import { ParallaxLayer } from "./components/ParallaxLayer";
import { styles } from "./VictoryScreen.styles";

import crown from "@/assets/images/crown.png";

const { width: SCREEN_W } = Dimensions.get("window");

const LAYERS: { source: number; amplitude: number; duration: number }[] = [
	{
		source: require("@/assets/backgrounds/parallaxi_bgs/4Background-Clouds-trans.png"),
		amplitude: SCREEN_W * 0.42,
		duration: 38000,
	},
	{
		source: require("@/assets/backgrounds/parallaxi_bgs/3Background.png"),
		amplitude: SCREEN_W * 0.58,
		duration: 37000,
	},
	{
		source: require("@/assets/backgrounds/parallaxi_bgs/2Foreground2.png"),
		amplitude: SCREEN_W * 1.0,
		duration: 32000,
	},
	{
		source: require("@/assets/backgrounds/parallaxi_bgs/1Foreground-Rocks.png"),
		amplitude: SCREEN_W * 1.0,
		duration: 31000,
	},
];

const LAYER_W = SCREEN_W + SCREEN_W * 2;

export const VictoryScreen = ({
	onReset,
	gameLog = [],
}: {
	onReset: () => void;
	gameLog?: GameLogEntry[];
}) => {
	const { t } = useTranslation();
	const { playTap } = useAudio();
	const [logVisible, setLogVisible] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(40)).current;
	const scaleAnim = useRef(new Animated.Value(0.85)).current;

	useBackgroundCaching("victory_bg_0", require("@/assets/backgrounds/parallaxi_bgs/4Background-Clouds-trans.png"));
	useBackgroundCaching("victory_bg_1", require("@/assets/backgrounds/parallaxi_bgs/3Background.png"));
	useBackgroundCaching("victory_bg_2", require("@/assets/backgrounds/parallaxi_bgs/2Foreground2.png"));
	useBackgroundCaching("victory_bg_3", require("@/assets/backgrounds/parallaxi_bgs/1Foreground-Rocks.png"));

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 700,
				useNativeDriver: true,
			}),
			Animated.spring(slideAnim, {
				toValue: 0,
				tension: 48,
				friction: 14,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				tension: 48,
				friction: 14,
				useNativeDriver: true,
			}),
		]).start();
	}, [fadeAnim, slideAnim, scaleAnim]);

	return (
		<View style={styles.bg}>
			{LAYERS.map((layer, i) => (
				<ParallaxLayer key={i} {...layer} layerWidth={LAYER_W} />
			))}

			<View style={styles.overlay}>
				<Animated.View
					style={[
						styles.content,
						{
							opacity: fadeAnim,
							transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
						},
					]}
				>
					<Image source={crown} style={styles.image} resizeMode="contain" />
					<Text style={styles.title}>{t("victory.title")}</Text>
					<Text style={styles.subtitle}>{t("victory.subtitle")}</Text>

					<View style={styles.actions}>
						<TouchableOpacity
							style={styles.btnReset}
							onPress={() => {
								playTap();
								onReset();
							}}
							activeOpacity={0.8}
						>
							<Text style={styles.btnResetText}>{t("victory.playAgain")}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.btnHome}
							onPress={() => {
								playTap();
								router.back();
							}}
							activeOpacity={0.8}
						>
							<Text style={styles.btnHomeText}>{t("victory.home")}</Text>
						</TouchableOpacity>
					</View>

					{gameLog.length > 0 && (
						<TouchableOpacity
							style={styles.btnLog}
							onPress={() => {
								playTap();
								setLogVisible(true);
							}}
							activeOpacity={0.7}
						>
							<Text style={styles.btnLogText}>{t("game.log.title")}</Text>
						</TouchableOpacity>
					)}
				</Animated.View>
			</View>

			<GameLogModal
				visible={logVisible}
				entries={gameLog}
				onClose={() => setLogVisible(false)}
			/>
		</View>
	);
};
