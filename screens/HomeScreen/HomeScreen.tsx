// /screens/HomeScreen/HomeScreen.tsx
import { router } from "expo-router";
import i18n from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Image,
	ImageBackground,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./HomeScreen.styles";

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
			source={require("../../assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<View style={styles.header}>
					<Image
						source={require("../../assets/images/regicide_logo.png")}
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
								source={require("../../assets/icons/sword.png")}
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
								source={require("../../assets/icons/history.png")}
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
								source={require("../../assets/images/crown.png")}
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
