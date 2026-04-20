import { Card, GamePhase, Suit } from "@/data/types";
import { getCompatibleCardIds } from "@/utils/gameLogic";
import { useCardSize } from "@/hooks/useCardSize";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { CardDetailModal } from "@/components/CardDetailModal";
import { CardView } from "@/components/CardView";
import { styles } from "./PlayerHand.styles";
import { ActionButtonRow } from "./components/ActionButtonRow";
import { DiscardButton } from "./components/DiscardButton/DiscardButton";

type PropsType = {
	hand: Card[];
	selectedIds: Set<string>;
	phase: GamePhase;
	immuneSuit?: Suit | null;
	discardingIds?: Set<string>;
	pendingDamage?: number;
	selectedTotal?: number;
	onCardPress: (card: Card) => void;
	onSort?: () => void;
	onSortByClass?: () => void;
	onDiscard?: () => void;
	onPlay?: () => void;
	playDisabled?: boolean;
};

export const PlayerHand = ({
	hand,
	selectedIds,
	phase,
	immuneSuit,
	discardingIds,
	pendingDamage,
	selectedTotal,
	onCardPress,
	onSort,
	onSortByClass,
	onDiscard,
	onPlay,
	playDisabled,
}: PropsType) => {
	const { t } = useTranslation();
	const [detailCard, setDetailCard] = useState<Card | null>(null);
	const interactive = phase === "player_turn" || phase === "suffer_damage";
	const { liftY } = useCardSize();

	const selectedCards = hand.filter((c) => selectedIds.has(c.id));
	const compatibleIds =
		phase === "player_turn" && selectedIds.size > 0
			? getCompatibleCardIds(selectedCards, hand)
			: null;

	const handleLongPress = (card: Card) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setDetailCard(card);
	};

	const pending = pendingDamage ?? 0;
	const current = selectedTotal ?? 0;
	const damageSubtraction = Math.max(0, pending - current);
	const enough = current >= pending;

	return (
		<View style={styles.container}>
			{phase === "suffer_damage" && pending > 0 && onDiscard ? (
				<DiscardButton
					enough={enough}
					damageSubtraction={damageSubtraction}
					onDiscard={onDiscard}
				/>
			) : (
				<ActionButtonRow
					phase={phase}
					onSort={onSort}
					onSortByClass={onSortByClass}
					onPlay={onPlay}
					playDisabled={playDisabled}
				/>
			)}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={[styles.scroll, { paddingTop: liftY + 4 }]}
			>
				{hand.map((card) => {
					const isDimmed =
						phase === "player_turn" &&
						selectedIds.size > 0 &&
						!selectedIds.has(card.id) &&
						!(compatibleIds?.has(card.id) ?? true);
					return (
						<CardView
							key={card.id}
							card={card}
							selected={selectedIds.has(card.id)}
							onPress={() => onCardPress(card)}
							onLongPress={() => handleLongPress(card)}
							disabled={!interactive || isDimmed}
							immuneSuit={immuneSuit}
							discarding={discardingIds?.has(card.id)}
							sufferMode={phase === "suffer_damage"}
							dimmed={isDimmed}
						/>
					);
				})}
				{hand.length === 0 && (
					<Text style={styles.empty}>{t("hand.empty")}</Text>
				)}
			</ScrollView>

			<CardDetailModal
				card={detailCard}
				visible={detailCard !== null}
				immuneSuit={immuneSuit}
				onClose={() => setDetailCard(null)}
			/>
		</View>
	);
};
