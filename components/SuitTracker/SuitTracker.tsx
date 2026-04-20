import ClubsIcon from "@/assets/classes/clubs.png";
import DiamondsIcon from "@/assets/classes/diamonds.png";
import HeartsIcon from "@/assets/classes/hearts.png";
import SpadesIcon from "@/assets/classes/spades.png";
import { Enemy, Suit } from "@/data/types";
import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./SuitTracker.styles";

const SUIT_ROWS: Suit[][] = [
	["hearts", "diamonds"],
	["clubs", "spades"],
];

const SUIT_ICON: Record<Suit, number | null> = {
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

export const SuitTracker = React.memo(({ enemies, defeatedIds }: SuitTrackerProps) => {
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
								<Image source={icon} style={styles.icon} contentFit="contain" />
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
});
