import { useAudio } from "@/contexts/AudioContext";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import LetterX from "@/assets/icons/letter-x.png";
import { getFooterCardImage } from "@/data/images";
import { Enemy, EnemyRank } from "@/data/types";
import { styles } from "./DefeatFooter.styles";

const PHASE_LABEL: Record<EnemyRank, string> = {
	J: "Valetes derrotados",
	Q: "Rainhas derrotadas",
	K: "Reis derrotados",
};

type DefeatFooterPropsType = {
	phase: EnemyRank;
	enemies: Enemy[];
	defeatedIds: string[];
	currentEnemyId: string | null;
	onSelect: (id: string) => void;
};

export const DefeatFooter = ({
	phase,
	enemies,
	defeatedIds,
	currentEnemyId,
	onSelect,
}: DefeatFooterPropsType) => {
	const { playTap } = useAudio();
	const defeatedCount = enemies.filter((e) =>
		defeatedIds.includes(e.id),
	).length;

	return (
		<View style={styles.container}>
			<Text style={styles.label}>
				{PHASE_LABEL[phase]} {defeatedCount}/{enemies.length}
			</Text>
			<View style={styles.row}>
				{enemies.map((enemy) => {
					const defeated = defeatedIds.includes(enemy.id);
					const isCurrent = enemy.id === currentEnemyId;
					return (
						<TouchableOpacity
							key={enemy.id}
							style={[styles.slot, isCurrent && styles.slotCurrent]}
							onPress={() => { if (!defeated) { playTap(); onSelect(enemy.id); } }}
							activeOpacity={defeated ? 1 : 0.7}
							disabled={defeated}
						>
							<Image
								source={getFooterCardImage(enemy.rank, enemy.suit)}
								style={[styles.miniCard, defeated && styles.miniCardDefeated]}
								contentFit="contain"
							/>
							{defeated && (
								<View style={styles.crossOverlay}>
									<Image
										source={LetterX}
										style={styles.crossIcon}
										contentFit="contain"
									/>
								</View>
							)}
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
};
