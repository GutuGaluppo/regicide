import { getCardImage } from "@/data/images";
import { Enemy } from "@/data/types";
import React from "react";
import { Animated, Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const BG = require("@/assets/backgrounds/bg_cave.webp");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 2 columns with 24px padding each side and 16px gap
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 16) / 2;
const CARD_HEIGHT = CARD_WIDTH / 0.67;

interface EnemySelectionScreenProps {
	enemies: Enemy[];
	defeatedIds: string[];
	bgShift: Animated.Value;
	onSelectEnemy: (id: string) => void;
}

export const EnemySelectionScreen = ({
	enemies,
	defeatedIds,
	bgShift,
	onSelectEnemy,
}: EnemySelectionScreenProps) => {
	return (
		<View style={styles.root}>
			<Animated.Image
				source={BG}
				style={[styles.bg, { transform: [{ translateX: bgShift }] }]}
				resizeMode="cover"
			/>
			<View style={styles.overlay}>
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
		</View>
	);
};

const BG_MAX_SHIFT = 12 * 18;
const BG_WIDTH = SCREEN_WIDTH + BG_MAX_SHIFT;

const styles = StyleSheet.create({
	root: {
		flex: 1,
		overflow: "hidden",
	},
	bg: {
		position: "absolute",
		top: 0,
		left: 0,
		width: BG_WIDTH,
		height: SCREEN_HEIGHT,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.55)",
		justifyContent: "center",
		alignItems: "center",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: 16,
		paddingHorizontal: 24,
	},
	cell: {
		width: CARD_WIDTH,
		height: CARD_HEIGHT,
		position: "relative",
	},
	card: {
		width: "100%",
		height: "100%",
		borderRadius: 10,
	},
	cardDefeated: {
		opacity: 0.3,
	},
	defeatedOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 10,
	},
});
