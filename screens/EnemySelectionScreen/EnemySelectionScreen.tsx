import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { getCardImage } from "@/data/images";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Enemy } from "@/data/types";
import { useTrackerStore } from "@/store/trackerStore";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import Animated, {
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { styles } from "./EnemySelectionScreen.styles";

const AnimatedImage = Animated.createAnimatedComponent(ExpoImage);
const BG = require("@/assets/backgrounds/bg_cave.webp");

interface EnemySelectionScreenProps {
	enemies: Enemy[];
	bgShift: SharedValue<number>;
	onSelectEnemy: (id: string) => void;
	onSettingsPress: () => void;
}

export const EnemySelectionScreen = ({
	enemies,
	bgShift,
	onSelectEnemy,
}: EnemySelectionScreenProps) => {
	const { width, height, isTablet, isDesktop, contentMaxWidth, screenPadding } =
		useResponsiveLayout();
	const defeatedIds = useTrackerStore((s) => s.trackerState.defeatedIds);
	const resetTracker = useTrackerStore((s) => s.resetTracker);

	const [settingsVisible, setSettingsVisible] = useState(false);

	const gridGap = isDesktop ? 24 : isTablet ? 18 : 16;
	const columns = isDesktop ? 4 : isTablet ? 3 : 2;
	const gridWidth = Math.min(width - screenPadding * 2, contentMaxWidth);
	const cardWidth = Math.min(220, (gridWidth - gridGap * (columns - 1)) / columns);
	const cardHeight = cardWidth / 0.67;
	const bgWidth = width + 12 * 18;

	const bgAnimStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: bgShift.value }],
	}));

	return (
		<View style={styles.root}>
			<AnimatedImage
				source={BG}
				style={[styles.bg, bgAnimStyle, { width: bgWidth, height }]}
				contentFit="cover"
			/>
			<View style={styles.overlay}>
				{/* ── Top (fixed) ── */}
				<ScreenHeader onSettingsPress={() => setSettingsVisible(true)} />

				<View
					style={[
						styles.grid,
						{
							width: gridWidth,
							maxWidth: gridWidth,
							gap: gridGap,
						},
					]}
				>
					{enemies.map((enemy) => {
						const defeated = defeatedIds.includes(enemy.id);
						return (
							<TouchableOpacity
								key={enemy.id}
								style={[styles.cell, { width: cardWidth, height: cardHeight }]}
								onPress={() => onSelectEnemy(enemy.id)}
								disabled={defeated}
								activeOpacity={0.75}
							>
								<ExpoImage
									source={getCardImage(enemy.rank, enemy.suit)}
									style={[styles.card, defeated && styles.cardDefeated]}
									contentFit="contain"
								/>
								{defeated && <View style={styles.defeatedOverlay} />}
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
			{/* Settings drawer */}
			<SettingsDrawer
				visible={settingsVisible}
				onClose={() => setSettingsVisible(false)}
				onReset={resetTracker}
			/>
		</View>
	);
};
