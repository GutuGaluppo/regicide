import * as Notifications from "expo-notifications";
import i18next from "i18next";
import { Platform } from "react-native";

// Quando o app está em foreground, não exibe a notificação do sistema —
// o TurnToast cuida da experiência visual dentro do app.
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: false,
		shouldShowList: false,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export const requestTurnNotificationPermission = async (): Promise<boolean> => {
	if (Platform.OS === "web") return false;
	const { status } = await Notifications.requestPermissionsAsync();
	return status === "granted";
};

export const scheduleLocalTurnNotification = async (): Promise<void> => {
	try {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "Regicide",
				body: i18next.t("notifications.turnBody"),
				sound: true,
			},
			trigger: null, // imediata
		});
	} catch {
		// Permissão negada ou plataforma sem suporte — silencia
	}
};
