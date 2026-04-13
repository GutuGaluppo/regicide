// /components/VictoryScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Easing,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import crown from "../assets/images/crown.png";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Amplitude base em pixels relativos à largura da tela (robusto em web e nativo)
// Camada traseira: pouco movimento. Camada frontal: percorre a tela inteira.
const LAYERS: { source: number; amplitude: number; duration: number }[] = [
	{
		source: require("../assets/backgrounds/parallaxi_bgs/4Background-Clouds-trans.png"),
		amplitude: SCREEN_W * 0.42, // ~47px — quase estático
		duration: 38000,
	},
	{
		source: require("../assets/backgrounds/parallaxi_bgs/3Background.png"),
		amplitude: SCREEN_W * 0.58, // ~109px
		duration: 37000,
	},
	{
		source: require("../assets/backgrounds/parallaxi_bgs/2Foreground2.png"),
		amplitude: SCREEN_W * 1.0, // ~215px
		duration: 32000,
	},
	{
		source: require("../assets/backgrounds/parallaxi_bgs/1Foreground-Rocks.png"),
		amplitude: SCREEN_W * 1.0, // largura completa da tela — máximo percurso
		duration: 31000,
	},
];

// Largura de cada camada = tela + 2 × amplitude máxima para nunca mostrar borda
const LAYER_W = SCREEN_W + SCREEN_W * 2; // 3× screen width

const ParallaxLayer = ({
	source,
	amplitude,
	duration,
}: {
	source: number;
	amplitude: number;
	duration: number;
}) => {
	const shift = useRef(new Animated.Value(-amplitude)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(shift, {
					toValue: amplitude,
					duration,
					easing: Easing.inOut(Easing.sin),
					useNativeDriver: true,
				}),
				Animated.timing(shift, {
					toValue: -amplitude,
					duration,
					easing: Easing.inOut(Easing.sin),
					useNativeDriver: true,
				}),
			]),
		);
		loop.start();
		return () => loop.stop();
	}, [shift, amplitude, duration]);

	return (
		<Animated.Image
			source={source}
			style={[
				styles.layer,
				{
					width: LAYER_W,
					left: -amplitude,
					transform: [{ translateX: shift }],
				},
			]}
			resizeMode="cover"
		/>
	);
};

export const VictoryScreen = ({ onReset }: { onReset: () => void }) => {
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
				<ParallaxLayer key={i} {...layer} />
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
					<Text style={styles.title}>Vitória!</Text>
					<Text style={styles.subtitle}>O reino foi salvo</Text>

					<View style={styles.actions}>
						<TouchableOpacity
							style={styles.btnReset}
							onPress={onReset}
							activeOpacity={0.8}
						>
							<Text style={styles.btnResetText}>Jogar novamente</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.btnHome}
							onPress={() => router.back()}
							activeOpacity={0.8}
						>
							<Text style={styles.btnHomeText}>← Início</Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	bg: {
		flex: 1,
		overflow: "hidden",
	},
	layer: {
		position: "absolute",
		top: 0,
		height: SCREEN_H,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	content: {
		alignItems: "center",
		gap: 12,
		width: "100%",
	},
	title: {
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 48,
		fontWeight: "900",
		color: "#FBBF24",
		textShadowColor: "#F59E0B",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 20,
		letterSpacing: 2,
		padding: 15,
	},
	subtitle: {
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 16,
		color: "#CBD5E1",
		fontWeight: "500",
		letterSpacing: 1,
		textTransform: "uppercase",
		marginBottom: 8,
	},
	image: {
		position: "absolute",
		top: -160,
		width: "50%",
		height: 180,
	},
	actions: {
		width: "100%",
		gap: 12,
		marginTop: 8,
	},
	btnReset: {
		backgroundColor: "#FBBF24",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	btnResetText: {
		color: "#0F172A",
		fontWeight: "800",
		fontSize: 16,
		letterSpacing: 0.5,
	},
	btnHome: {
		backgroundColor: "rgba(15,23,42,0.75)",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.3)",
	},
	btnHomeText: {
		color: "#94A3B8",
		fontWeight: "600",
		fontSize: 15,
	},
});
