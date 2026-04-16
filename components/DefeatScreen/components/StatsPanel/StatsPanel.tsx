import { getEnemyName } from "@/data/images";
import { Card, Enemy, GameStats } from "@/data/types";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { EnemyAccordionItem } from "./EnemyAccordionItem";
import { StatItem } from "./StatItem";
import { styles } from "./StatsPanel.styles";

const HOURGLASS = require("@/assets/icons/hourglass.png");
const SWORD = require("@/assets/icons/sword_outlined.png");
const SKULL = require("@/assets/icons/skull.png");
const SHIELD = require("@/assets/icons/shield.png");

const formatTime = (ms: number): string => {
	const totalSec = Math.floor(ms / 1000);
	const m = Math.floor(totalSec / 60);
	const s = totalSec % 60;
	return `${m}m ${s}s`;
};

export const StatsPanel = ({
	stats,
	defeatedEnemies,
	playerHand,
}: {
	stats: GameStats;
	defeatedEnemies: Enemy[];
	playerHand?: Card[];
}) => {
	const { t } = useTranslation();
	const elapsed = Date.now() - stats.startTime;

	return (
		<View style={styles.panel}>
			<View style={styles.statList}>
				<StatItem icon={HOURGLASS} label={t("defeat.stats.time")} value={formatTime(elapsed)} />
				<StatItem icon={SWORD} label={t("defeat.stats.turns")} value={String(stats.turnsPlayed)} />
				<StatItem icon={SKULL} label={t("defeat.stats.enemies")} value={String(defeatedEnemies.length)} />
				<StatItem icon={SHIELD} label={t("defeat.stats.discarded")} value={String(stats.discardedCards.length)} />
			</View>

			{stats.enemyKills.length > 0 && (
				<View style={{ marginTop: 4 }}>
					{stats.enemyKills.map(({ enemy, allCards, discardedCards }) => (
						<EnemyAccordionItem
							key={enemy.id}
							enemy={enemy}
							attackCards={allCards}
							discardedCards={discardedCards ?? []}
							label={getEnemyName(enemy.rank, enemy.suit)}
							emptyLabel={t("defeat.stats.noCards")}
						/>
					))}
					<EnemyAccordionItem
						sectionIcon={SHIELD}
						cards={stats.discardedCards}
						label={t("defeat.stats.discardPile")}
						emptyLabel={t("defeat.stats.noCards")}
					/>
					{playerHand !== undefined && (
						<EnemyAccordionItem
							sectionIcon={SKULL}
							cards={playerHand}
							label={t("defeat.stats.hand")}
							emptyLabel={t("defeat.stats.noCards")}
						/>
					)}
				</View>
			)}
		</View>
	);
};
