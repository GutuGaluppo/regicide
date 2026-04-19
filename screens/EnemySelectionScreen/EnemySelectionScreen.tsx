import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { getCardImage } from "@/data/images";
import { Enemy } from "@/data/types";
import { useGame } from "@/hooks/useGame";
import { useTracker } from "@/hooks/useTracker";
import React, { useState } from "react";
import { Animated, Image, TouchableOpacity, View } from "react-native";
import { styles } from "./EnemySelectionScreen.styles";

const BG = require("@/assets/backgrounds/bg_cave.webp");

interface EnemySelectionScreenProps {
	enemies: Enemy[];
	bgShift: Animated.Value;
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

	return (
		<View style={styles.root}>
			<Animated.Image
				source={BG}
				style={[styles.bg, { transform: [{ translateX: bgShift }] }]}
				resizeMode="cover"
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
								<Image
									source={getCardImage(enemy.rank, enemy.suit)}
									style={[styles.card, defeated && styles.cardDefeated]}
									resizeMode="contain"
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
