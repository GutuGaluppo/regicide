import History from "@/assets/icons/history.png";
import { Image } from "expo-image";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity } from "react-native";
import { styles } from "../GameScreen.styles";

type Props = { onPress: () => void };

/**
 * Botão que abre o histórico de ações da partida. Usa o ícone de histórico e,
 * na web, expõe um tooltip nativo (atributo `title`) ao passar o mouse.
 */
export const GameLogButton = ({ onPress }: Props) => {
	const { t } = useTranslation();
	// react-native-web encaminha `title` ao DOM (tooltip de hover); no nativo é ignorado.
	const webTooltip: Record<string, string> =
		Platform.OS === "web" ? { title: t("game.log.tooltip") } : {};

	return (
		<TouchableOpacity
			onPress={onPress}
			style={styles.logButton}
			activeOpacity={0.7}
			accessibilityRole="button"
			accessibilityLabel={t("game.log.title")}
			{...webTooltip}
		>
			<Image source={History} style={styles.logIcon} contentFit="contain" />
		</TouchableOpacity>
	);
};
