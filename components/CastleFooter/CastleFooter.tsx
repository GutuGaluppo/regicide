// /components/CastleFooter.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import { getCardImage } from "@/data/images";
import { Enemy, EnemyRank } from "@/data/types";
import LetterX from "@/assets/icons/letter-x.png";
import { styles } from "./CastleFooter.styles";

export const CastleFooter = ({
	castle,
	defeatedEnemies,
	currentEnemyId,
}: {
	castle: Enemy[];
	defeatedEnemies: Enemy[];
	currentEnemyId: string;
}) => {
	const { t } = useTranslation();
	const PHASE_LABEL: Record<EnemyRank, string> = {
		J: t("footer.jacks"),
		Q: t("footer.queens"),
		K: t("footer.kings"),
	};
	const allEnemies = [...defeatedEnemies, ...castle];
	const defeatedIds = defeatedEnemies.map((e) => e.id);

	const jEnemies = allEnemies.filter((e) => e.rank === "J");
	const qEnemies = allEnemies.filter((e) => e.rank === "Q");
	const jAllDefeated =
		jEnemies.length > 0 && jEnemies.every((e) => defeatedIds.includes(e.id));
	const qAllDefeated =
		qEnemies.length > 0 && qEnemies.every((e) => defeatedIds.includes(e.id));
	const footerPhase: EnemyRank = jAllDefeated
		? qAllDefeated
			? "K"
			: "Q"
		: "J";

	const phaseEnemies = allEnemies.filter((e) => e.rank === footerPhase);
	const defeatedCount = phaseEnemies.filter((e) =>
		defeatedIds.includes(e.id),
	).length;

	return (
		<View style={styles.container}>
			<Text style={styles.label}>
				{PHASE_LABEL[footerPhase]} {defeatedCount}/{phaseEnemies.length}
			</Text>
			<View style={styles.row}>
				{phaseEnemies.map((enemy) => {
					const defeated = defeatedIds.includes(enemy.id);
					const isCurrent = enemy.id === currentEnemyId;
					return (
						<View
							key={enemy.id}
							style={[styles.slot, isCurrent && styles.slotCurrent]}
						>
							<Image
								source={getCardImage(enemy.rank, enemy.suit)}
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
						</View>
					);
				})}
			</View>
		</View>
	);
};
