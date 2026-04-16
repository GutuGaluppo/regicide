import GearFlat from "@/assets/icons/gear_flat.png";
import TavernSilver from "@/assets/icons/tavern_silver.png";
import { useAudio } from "@/contexts/AudioContext";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
	onSettingsPress?: () => void;
	/** Extra nodes rendered between the home button and the gear (left-to-right). */
	rightExtra?: React.ReactNode;
}

export const ScreenHeader = ({ onSettingsPress, rightExtra }: ScreenHeaderProps) => {
	const { playTap } = useAudio();

	return (
		<View style={styles.header}>
			<TouchableOpacity
				onPress={() => { playTap(); router.back(); }}
				style={styles.btn}
				activeOpacity={0.7}
			>
				<Image source={TavernSilver} style={styles.icon} resizeMode="contain" />
			</TouchableOpacity>

			<View style={styles.rightGroup}>
				{rightExtra}
				{onSettingsPress && (
					<TouchableOpacity
						onPress={() => { playTap(); onSettingsPress(); }}
						style={styles.btn}
						activeOpacity={0.7}
					>
						<Image source={GearFlat} style={styles.icon} resizeMode="contain" />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 12,
		paddingHorizontal: 12,
		paddingBottom: 4,
	},
	btn: {
		padding: 6,
	},
	icon: {
		width: 30,
		height: 30,
	},
	rightGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
});
