import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { getCardImage } from "@/data/images";
import { Enemy } from "@/data/types";
import { useGame } from "@/hooks/useGame";
import { useTracker } from "@/hooks/useTracker";
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
	const { defeatedIds } = useTracker();
	const { resetGame } = useGame();

	const [settingsVisible, setSettingsVisible] = useState(false);

	const bgAnimStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: bgShift.value }],
	}));

	return (
		<View style={styles.root}>
			<AnimatedImage
				source={BG}
				style={[styles.bg, bgAnimStyle]}
				contentFit="cover"
			/>
			<View style={styles.overlay}>
				{/* ── Top (fixed) ── */}
				<ScreenHeader onSettingsPress={() => setSettingsVisible(true)} />

				<View style={styles.grid}>
					{enemies.map((enemy) => {
						const defeated = defeatedIds.includes(enemy.id);
						return (
							<TouchableOpacity
								key={enemy.id}
								style={styles.cell}
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
				onReset={resetGame}
			/>
		</View>
	);
};
