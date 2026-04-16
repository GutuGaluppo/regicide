import { GamePhase } from "@/data/types";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { styles } from "./ActionBar.styles";
import CustomButton from "./components/CustomButton";

export const ActionBar = ({
	phase,
	onPlay,
	playDisabled,
}: {
	phase: GamePhase;
	onPlay: () => void;
	playDisabled: boolean;
}) => {
	const { t } = useTranslation();

	if (phase !== "player_turn") return null;

	return (
		<View style={styles.container}>
			<CustomButton
				label={t("action.play")}
				onPress={onPlay}
				disabled={playDisabled}
			/>
			{/* TODO: implement yield action on multiplayer mode */}
		</View>
	);
};
