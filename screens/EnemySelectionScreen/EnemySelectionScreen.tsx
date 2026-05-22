import { getCardImage } from "@/data/images";
import { Enemy } from "@/data/types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useTrackerStore } from "@/store/trackerStore";
import { Image as ExpoImage } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./EnemySelectionScreen.styles";

interface EnemySelectionScreenProps {
	enemies: Enemy[];
	onSelectEnemy: (id: string) => void;
}

export const EnemySelectionScreen = ({
	enemies,
	onSelectEnemy,
}: EnemySelectionScreenProps) => {
	const { width, isTablet, isDesktop, contentMaxWidth, screenPadding } =
		useResponsiveLayout();
	const defeatedIds = useTrackerStore((s) => s.trackerState.defeatedIds);

	const gridGap = isDesktop ? 24 : isTablet ? 18 : 16;
	const columns = isDesktop ? 4 : isTablet ? 3 : 2;
	const gridWidth = Math.min(width - screenPadding * 2, contentMaxWidth);
	const cardWidth = Math.min(
		220,
		(gridWidth - gridGap * (columns - 1)) / columns,
	);
	const cardHeight = cardWidth / 0.67;

	return (
		<View style={styles.content}>
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
	);
};
