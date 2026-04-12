import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function RootLayout() {
	useEffect(() => {
		const loadFonts = async () => {
			try {
				await Font.loadAsync({
					"IMFellEnglish-Regular": require("../assets/fonts/IMFellEnglish-Regular.ttf"),
					"IMFellEnglish-Italic": require("../assets/fonts/IMFellEnglish-Italic.ttf"),
				});
			} catch (e) {
				console.warn(e);
			} finally {
				SplashScreen.hideAsync();
			}
		};

		loadFonts();
	}, []);
	return <Stack screenOptions={{ headerShown: false }} />;
}
