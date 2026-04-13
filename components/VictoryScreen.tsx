// /components/VictoryScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const THRONE_BREAK = require("../assets/images/throneBreak.png");
const BG = require("../assets/backgrounds/bg_cave.webp");

export const VictoryScreen = ({ onReset }: { onReset: () => void }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(40)).current;
	const scaleAnim = useRef(new Animated.Value(0.85)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 600,
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
	}, []);

	return (
		<ImageBackground source={BG} style={styles.bg} resizeMode="cover">
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
					<Text style={styles.title}>Vitória!</Text>
					<Text style={styles.subtitle}>O reino foi salvo</Text>

					<Image
						source={THRONE_BREAK}
						style={styles.image}
						resizeMode="contain"
					/>

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
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	bg: {
		flex: 1,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.65)",
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
		width: "90%",
		height: 320,
		marginVertical: 8,
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
