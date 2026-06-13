import ClubsIcon from "@/assets/classes/clubs.png";
import ClubsShadowIcon from "@/assets/classes/clubs_shadow.png";
import DiamondsIcon from "@/assets/classes/diamonds.png";
import DiamondsShadowIcon from "@/assets/classes/diamonds_shadow.png";
import HeartsIcon from "@/assets/classes/hearts.png";
import HeartsShadowIcon from "@/assets/classes/hearts_shadow.png";
import SpadesIcon from "@/assets/classes/spades.png";
import SpadesShadowIcon from "@/assets/classes/spades_shadow.png";
import { Enemy, Suit } from "@/data/types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./SuitTracker.styles";

const SUIT_ROWS: Suit[][] = [
	["hearts", "diamonds"],
	["clubs", "spades"],
];

const SUIT_ICON: Record<Suit, { normal: number; shadow: number } | null> = {
	hearts: { normal: HeartsIcon, shadow: HeartsShadowIcon },
	diamonds: { normal: DiamondsIcon, shadow: DiamondsShadowIcon },
	clubs: { normal: ClubsIcon, shadow: ClubsShadowIcon },
	spades: { normal: SpadesIcon, shadow: SpadesShadowIcon },
	jester: null,
};

interface SuitTrackerProps {
	/** Current-phase enemies (4 suits at the active rank). */
	enemies: Enemy[];
	defeatedIds: string[];
	/** Suit of the enemy currently being fought — shown with shadow icon. */
	currentSuit?: Suit | null;
}

export const SuitTracker = React.memo(({ enemies, defeatedIds, currentSuit }: SuitTrackerProps) => {
	const { isDesktop } = useResponsiveLayout();
	const isDefeated = (suit: Suit): boolean => {
		const enemy = enemies.find((e) => e.suit === suit);
		return !!enemy && defeatedIds.includes(enemy.id);
	};

	return (
		<View style={styles.container}>
			{SUIT_ROWS.map((row, rowIdx) => (
				<View key={rowIdx} style={styles.row}>
					{row.map((suit) => {
						const icons = SUIT_ICON[suit];
						const defeated = isDefeated(suit);
						if (!icons) return null;
						const icon = suit === currentSuit ? icons.shadow : icons.normal;
						return (
							<View key={suit} style={[styles.cell, isDesktop && styles.cellDesktop]}>
								<Image source={icon} style={[styles.icon, isDesktop && styles.iconDesktop]} contentFit="contain" />
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

SuitTracker.displayName = "SuitTracker";
