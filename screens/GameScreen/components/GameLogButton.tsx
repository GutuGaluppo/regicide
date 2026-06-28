import History from "@/assets/icons/history.png";
import { ActionHint } from "@/components/ActionHint";
import { Image } from "expo-image";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity, View } from "react-native";
import { styles } from "../GameScreen.styles";

type Props = { onPress: () => void };

/**
 * Botão que abre o histórico de ações da partida. Usa o ícone de histórico e,
 * na web, expõe um tooltip nativo (atributo `title`) ao passar o mouse; no
 * mobile, um rótulo de guia (ActionHint) explica o ícone na primeira sessão.
 */
export const GameLogButton = ({ onPress }: Props) => {
	const { t } = useTranslation();
	// react-native-web encaminha `title` ao DOM (tooltip de hover); no nativo é ignorado.
	const webTooltip: Record<string, string> =
		Platform.OS === "web" ? { title: t("game.log.tooltip") } : {};

	return (
		<View>
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
			<ActionHint label={t("game.log.title")} />
		</View>
	);
};
