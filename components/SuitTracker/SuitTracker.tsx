import ClubsIcon from "@/assets/classes/clubs.png";
import DiamondsIcon from "@/assets/classes/diamonds.png";
import HeartsIcon from "@/assets/classes/hearts.png";
import SpadesIcon from "@/assets/classes/spades.png";
import { Enemy, Suit } from "@/data/types";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

const SUIT_ROWS: Suit[][] = [
	["hearts", "diamonds"],
	["clubs", "spades"],
];

const SUIT_ICON: Record<Suit, ImageSourcePropType | null> = {
	hearts: HeartsIcon,
	diamonds: DiamondsIcon,
	clubs: ClubsIcon,
	spades: SpadesIcon,
	jester: null,
};

interface SuitTrackerProps {
	/** Current-phase enemies (4 suits at the active rank). */
	enemies: Enemy[];
	defeatedIds: string[];
}

export const SuitTracker = ({ enemies, defeatedIds }: SuitTrackerProps) => {
	const isDefeated = (suit: Suit): boolean => {
		const enemy = enemies.find((e) => e.suit === suit);
		return !!enemy && defeatedIds.includes(enemy.id);
	};

	return (
		<View style={styles.container}>
			{SUIT_ROWS.map((row, rowIdx) => (
				<View key={rowIdx} style={styles.row}>
					{row.map((suit) => {
						const icon = SUIT_ICON[suit];
						const defeated = isDefeated(suit);
						if (!icon) return null;
						return (
							<View key={suit} style={styles.cell}>
								<Image source={icon} style={styles.icon} resizeMode="contain" />
								{defeated && (
									<View style={styles.overlay}>
										<Text style={styles.x}>✕</Text>
									</View>
								)}
							</View>
						);
					})}
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 56,
		left: 8,
		gap: 4,
		zIndex: 10,
	},
	row: {
		flexDirection: "row",
		gap: 4,
	},
	cell: {
		width: 32,
		height: 32,
	},
	icon: {
		width: 32,
		height: 32,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.55)",
		borderRadius: 4,
	},
	x: {
		color: "#EF4444",
		fontSize: 16,
		fontWeight: "800",
		lineHeight: 18,
	},
});
