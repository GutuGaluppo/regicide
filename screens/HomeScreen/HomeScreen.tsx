import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import i18n from "i18next";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Image,
	ImageBackground,
	Modal,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./HomeScreen.styles";

const LANGUAGES = [
	{ code: "pt-BR", label: "Português", abbr: "PT" },
	{ code: "en", label: "English", abbr: "EN" },
	{ code: "es", label: "Español", abbr: "ES" },
	{ code: "fr", label: "Français", abbr: "FR" },
] as const;

const NAV_ITEMS = [
	{
		route: "/game",
		tKey: "home.play.title" as const,
	},
	{
		route: "/tracker",
		tKey: "home.tracker.title" as const,
	},
	{
		route: "/instructions",
		tKey: "home.instructions.title" as const,
	},
] as const;

export const HomeScreen = () => {
	const { t } = useTranslation();
	const [langVisible, setLangVisible] = useState(false);
	const currentLang = i18n.language;

	return (
		<ImageBackground
			source={require("@/assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<TouchableOpacity
					style={styles.globeBtn}
					onPress={() => setLangVisible(true)}
					activeOpacity={0.7}
				>
					<Text style={styles.globeAbbr}>
						{LANGUAGES.find((l) => l.code === currentLang)?.abbr ?? "EN"}
					</Text>
					<Ionicons name="globe-outline" size={26} color="#94A3B8" />
				</TouchableOpacity>

				<Image
					source={require("@/assets/images/regicide_logo.png")}
					style={styles.logo}
				/>

				<View style={styles.navList}>
					{NAV_ITEMS.map(({ route, tKey }) => (
						<TouchableOpacity
							key={route}
							style={styles.navBtn}
							onPress={() => router.push(route)}
							activeOpacity={0.8}
						>
							<Text style={styles.navLabel}>{t(tKey)}</Text>
						</TouchableOpacity>
					))}
				</View>

				<Modal
					visible={langVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setLangVisible(false)}
				>
					<TouchableOpacity
						style={styles.modalOverlay}
						activeOpacity={1}
						onPress={() => setLangVisible(false)}
					>
						<View style={styles.langDropdown}>
							{LANGUAGES.map(({ code, label }) => {
								const active = currentLang === code;
								return (
									<TouchableOpacity
										key={code}
										style={[
											styles.langOption,
											active && styles.langOptionActive,
										]}
										onPress={() => {
											i18n.changeLanguage(code);
											setLangVisible(false);
										}}
									>
										<Text
											style={[
												styles.langOptionText,
												active && styles.langOptionTextActive,
											]}
										>
											{label}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
					</TouchableOpacity>
				</Modal>
			</View>
		</ImageBackground>
	);
};
