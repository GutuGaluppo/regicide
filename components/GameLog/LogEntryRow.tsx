import { AvatarBadge } from "@/components/AvatarBadge";
import { Card, EnemyRank, GameLogEntry } from "@/data/types";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { styles } from "./GameLog.styles";

const SUIT_SYMBOL: Record<string, string> = {
	hearts: "♥",
	diamonds: "♦",
	clubs: "♣",
	spades: "♠",
};
const SUIT_COLOR: Record<string, string> = {
	hearts: "#DC2626",
	diamonds: "#DC2626",
	clubs: "#1E293B",
	spades: "#1E293B",
};

const rankLabel = (rank: EnemyRank | undefined, t: (k: string) => string): string => {
	if (!rank) return "";
	return t(`game.log.rank${rank}`);
};

const CardChip = ({ card }: { card: Card }) => {
	if (card.suit === null || card.rank === "Jester") {
		return (
			<View style={styles.chip}>
				<Text style={styles.chipJester}>🃏</Text>
			</View>
		);
	}
	const color = SUIT_COLOR[card.suit] ?? "#1E293B";
	return (
		<View style={styles.chip}>
			<Text style={[styles.chipRank, { color }]}>{card.rank}</Text>
			<Text style={[styles.chipSuit, { color }]}>{SUIT_SYMBOL[card.suit] ?? ""}</Text>
		</View>
	);
};

export const LogEntryRow = ({ entry }: { entry: GameLogEntry }) => {
	const { t } = useTranslation();

	if (entry.kind === "enemy_defeated") {
		return (
			<View style={styles.defeatRow}>
				<Text style={styles.defeatText}>
					{t("game.log.defeatedFull", {
						name: entry.playerName,
						enemy: rankLabel(entry.enemyRank, t),
					})}
				</Text>
			</View>
		);
	}

	const hasCards = !!entry.cards && entry.cards.length > 0;
	const hasMeta = !!entry.damage || !!entry.shieldAdded;

	return (
		<View style={styles.row}>
			<AvatarBadge avatarId={entry.playerAvatarId} size={28} />
			<View style={styles.body}>
				<View style={styles.line}>
					<Text style={styles.name}>{entry.playerName}</Text>
					<Text style={styles.verb}>{` ${t(`game.log.${entry.kind}`)}`}</Text>
				</View>

				{hasCards && (
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.cards}
					>
						{entry.cards!.map((c) => (
							<CardChip key={c.id} card={c} />
						))}
					</ScrollView>
				)}

				{hasMeta && (
					<View style={styles.meta}>
						{!!entry.damage && (
							<Text style={styles.damage}>{t("game.log.damage", { value: entry.damage })}</Text>
						)}
						{!!entry.shieldAdded && (
							<Text style={styles.shield}>{t("game.log.shield", { value: entry.shieldAdded })}</Text>
						)}
					</View>
				)}
			</View>
		</View>
	);
};
