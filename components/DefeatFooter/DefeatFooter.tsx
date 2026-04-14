import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { getFooterCardImage } from "../../data/images";
import { Enemy, EnemyRank } from "../../data/types";
import { styles } from "./DefeatFooter.styles";

const LetterX = require("../assets/icons/letter-x.png");

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
							onPress={() => !defeated && onSelect(enemy.id)}
							activeOpacity={defeated ? 1 : 0.7}
							disabled={defeated}
						>
							<Image
								source={getFooterCardImage(enemy.rank, enemy.suit)}
								style={[styles.miniCard, defeated && styles.miniCardDefeated]}
								resizeMode="contain"
							/>
							{defeated && (
								<View style={styles.crossOverlay}>
									<Image
										source={LetterX}
										style={styles.crossIcon}
										resizeMode="contain"
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
