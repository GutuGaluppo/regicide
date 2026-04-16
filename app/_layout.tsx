import "../i18n";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { AudioProvider } from "@/contexts/AudioContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		const loadFonts = async () => {
			try {
				await Font.loadAsync({
					"IMFellEnglish-Regular": require("../assets/fonts/IMFellEnglish-Regular.ttf"),
					"IMFellEnglish-Italic": require("../assets/fonts/IMFellEnglish-Italic.ttf"),
					"Cinzel-VariableFont_wght": require("../assets/fonts/Cinzel-VariableFont_wght.ttf"),
				});
			} catch (e) {
				console.warn(e);
			} finally {
				setFontsLoaded(true);
				SplashScreen.hideAsync();
			}
		};

		loadFonts();
	}, []);

	if (!fontsLoaded) return null;

	return (
		<AudioProvider>
			<StatusBar hidden />
			<Stack screenOptions={{ headerShown: false }} />
		</AudioProvider>
	);
}
