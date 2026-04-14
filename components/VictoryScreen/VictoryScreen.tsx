import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Dimensions,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
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

export const VictoryScreen = ({ onReset }: { onReset: () => void }) => {
	const { t } = useTranslation();
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(40)).current;
	const scaleAnim = useRef(new Animated.Value(0.85)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 700,
				useNativeDriver: true,
			}),
			Animated.spring(slideAnim, {
				toValue: 0,
				tension: 60,
				friction: 10,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				tension: 60,
				friction: 10,
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
							onPress={onReset}
							activeOpacity={0.8}
						>
							<Text style={styles.btnResetText}>{t("victory.playAgain")}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.btnHome}
							onPress={() => router.back()}
							activeOpacity={0.8}
						>
							<Text style={styles.btnHomeText}>{t("victory.home")}</Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</View>
		</View>
	);
};
