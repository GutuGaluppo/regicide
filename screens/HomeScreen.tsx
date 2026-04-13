// /screens/HomeScreen.tsx
import { router } from "expo-router";
import i18n from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Image,
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const LANGUAGES = [
	{ code: "pt-BR", label: "PT" },
	{ code: "en", label: "EN" },
	{ code: "es", label: "ES" },
	{ code: "fr", label: "FR" },
] as const;

export const HomeScreen = () => {
	const { t } = useTranslation();
	const currentLang = i18n.language;

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

					{/* Language selector */}
					<View style={styles.langRow}>
						{LANGUAGES.map(({ code, label }) => {
							const active = currentLang === code;
							return (
								<TouchableOpacity
									key={code}
									style={[styles.langBtn, active && styles.langBtnActive]}
									onPress={() => i18n.changeLanguage(code)}
									activeOpacity={0.7}
								>
									<Text style={[styles.langText, active && styles.langTextActive]}>
										{label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
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
							<Text style={styles.cardTitle}>{t("home.play.title")}</Text>
						</View>
						<Text style={styles.cardDesc}>{t("home.play.desc")}</Text>
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
							<Text style={styles.cardTitle}>{t("home.tracker.title")}</Text>
						</View>
						<Text style={styles.cardDesc}>{t("home.tracker.desc")}</Text>
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
							<Text style={styles.cardTitle}>{t("home.instructions.title")}</Text>
						</View>
						<Text style={styles.cardDesc}>{t("home.instructions.desc")}</Text>
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
	header: { alignItems: "center", gap: 12 },
	langRow: {
		flexDirection: "row",
		gap: 6,
	},
	langBtn: {
		paddingHorizontal: 12,
		paddingVertical: 5,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.3)",
		backgroundColor: "rgba(15,23,42,0.5)",
	},
	langBtnActive: {
		borderColor: "#FBBF24",
		backgroundColor: "rgba(251,191,36,0.15)",
	},
	langText: {
		color: "#94A3B8",
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	langTextActive: {
		color: "#FBBF24",
	},
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
