// /screens/HomeScreen.tsx
import { router } from "expo-router";
import React from "react";
import {
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export const HomeScreen = () => {
	return (
		<ImageBackground
			source={require("../assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<View style={styles.header}>
					<Image
						source={require("../assets/images/regicide_logo.png")}
						style={{ width: 250, height: 250, resizeMode: "contain" }}
					/>
				</View>

				<View style={styles.cards}>
					<TouchableOpacity
						style={[styles.card, styles.cardGame]}
						onPress={() => router.push("/game")}
						activeOpacity={0.85}
					>
						<View style={styles.cardHeader}>
							<Image
								source={require("../assets/icons/sword.png")}
								style={{ width: 32, height: 32 }}
							/>
							<Text style={styles.cardTitle}>PLAY</Text>
						</View>
						<Text style={styles.cardDesc}>
							Versão digital completa — deck, mão e poderes dos naipes
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.card, styles.cardTracker]}
						onPress={() => router.push("/tracker")}
						activeOpacity={0.85}
					>
						<View style={styles.cardHeader}>
							<Image
								source={require("../assets/icons/history.png")}
								style={{ width: 32, height: 32 }}
							/>
							<Text style={styles.cardTitle}>TRACKER</Text>
						</View>
						<Text style={styles.cardDesc}>
							Placar para o baralho físico — rastreie HP e ataque dos inimigos
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.card, styles.cardInstructions]}
						onPress={() => router.push("/instructions")}
						activeOpacity={0.85}
					>
						<View style={styles.cardHeader}>
							<Image
								source={require("../assets/images/crown.png")}
								style={{ width: 32, height: 32 }}
							/>
							<Text style={styles.cardTitle}>COMO JOGAR</Text>
						</View>
						<Text style={styles.cardDesc}>
							Regras, poderes dos naipes e tabela dos nobres do castelo
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
		gap: 48,
	},
	header: { alignItems: "center", gap: 8 },
	title: {
		color: "#F1F5F9",
		fontSize: 42,
		fontWeight: "900",
		letterSpacing: 8,
	},
	subtitle: {
		color: "#94A3B8",
		fontSize: 14,
		letterSpacing: 1,
	},
	cards: { width: "100%", gap: 16 },
	card: {
		borderRadius: 16,
		padding: 24,
		gap: 8,
		borderWidth: 1,
	},
	cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
	cardGame: {
		backgroundColor: "rgba(71,85,105,0.7)",
		borderColor: "#67826E",
	},
	cardTracker: {
		backgroundColor: "rgba(71,85,105,0.7)",
		borderColor: "#D5B377",
	},
	cardInstructions: {
		backgroundColor: "rgba(71,85,105,0.7)",
		borderColor: "#94A3B8",
	},
	cardIcon: { fontSize: 32 },
	cardTitle: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 24,
		fontWeight: "700",
		width: "100%",
	},
	cardDesc: {
		color: "#e4ebfe",
		fontSize: 16,
		lineHeight: 18,
	},
});
