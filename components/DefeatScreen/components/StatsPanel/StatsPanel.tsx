import { Enemy, GameStats } from "@/data/types";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { StatItem } from "./StatItem";
import { styles } from "./StatsPanel.styles";

const formatTime = (ms: number): string => {
	const totalSec = Math.floor(ms / 1000);
	const m = Math.floor(totalSec / 60);
	const s = totalSec % 60;
	return `${m}m ${s}s`;
};

export const StatsPanel = ({
	stats,
	defeatedEnemies,
}: {
	stats: GameStats;
	defeatedEnemies: Enemy[];
}) => {
	const { t } = useTranslation();
	const elapsed = Date.now() - stats.startTime;

	const SUIT_SYMBOL: Record<string, string> = {
		hearts: "♥",
		diamonds: "♦",
		clubs: "♣",
		spades: "♠",
	};

	return (
		<View style={styles.panel}>
			<View style={styles.row}>
				<StatItem
					icon="⏱"
					label={t("defeat.stats.time")}
					value={formatTime(elapsed)}
				/>
				<StatItem
					icon="⚔"
					label={t("defeat.stats.turns")}
					value={String(stats.turnsPlayed)}
				/>
				<StatItem
					icon="💀"
					label={t("defeat.stats.enemies")}
					value={String(defeatedEnemies.length)}
				/>
				<StatItem
					icon="🗑"
					label={t("defeat.stats.discarded")}
					value={String(stats.discardedCards.length)}
				/>
			</View>
			{defeatedEnemies.length > 0 && (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.killList}
				>
					{defeatedEnemies.map((e) => (
						<View key={e.id} style={styles.killChip}>
							<Text style={styles.killText}>
								{SUIT_SYMBOL[e.suit]} {e.rank}
							</Text>
						</View>
					))}
				</ScrollView>
			)}
		</View>
	);
};
