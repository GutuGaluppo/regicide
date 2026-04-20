import GearFlat from "@/assets/icons/gear_flat.png";
import TavernSilver from "@/assets/icons/tavern_silver.png";
import { useAudio } from "@/contexts/AudioContext";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./ScreenHeader.styles";

interface ScreenHeaderProps {
	onSettingsPress?: () => void;
	/** Extra nodes rendered between the home button and the gear (left-to-right). */
	rightExtra?: React.ReactNode;
}

export const ScreenHeader = ({
	onSettingsPress,
	rightExtra,
}: ScreenHeaderProps) => {
	const { playTap } = useAudio();

	return (
		<View style={styles.header}>
			<TouchableOpacity
				onPress={() => {
					playTap();
					if (router.canGoBack()) {
						router.back();
					} else {
						router.replace("/");
					}
				}}
				style={styles.btn}
				activeOpacity={0.7}
			>
				<Image source={TavernSilver} style={styles.icon} contentFit="contain" />
			</TouchableOpacity>

			<View style={styles.rightGroup}>
				{rightExtra}
				{onSettingsPress && (
					<TouchableOpacity
						onPress={() => {
							playTap();
							onSettingsPress();
						}}
						style={styles.btn}
						activeOpacity={0.7}
					>
						<Image source={GearFlat} style={styles.icon} contentFit="contain" />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};
