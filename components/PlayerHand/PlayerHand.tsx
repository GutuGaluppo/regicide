import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	LayoutAnimation,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Card, GamePhase, Suit } from "@/data/types";
import { getCompatibleCardIds } from "@/utils/gameLogic";
import { useCardSize } from "@/utils/responsive";
import { CardDetailModal } from "../CardDetailModal";
import { CardView } from "../CardView";
import { SvgNumberSprite } from "../SvgNumberSprite";
import { styles } from "./PlayerHand.styles";

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
}: {
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
}) => {
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

	const handleSort = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		onSort?.();
	};
	const handleSortByClass = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		onSortByClass?.();
	};

	const pending = pendingDamage ?? 0;
	const current = selectedTotal ?? 0;
	const damageSubtraction = Math.max(0, pending - current);
	const enough = current >= pending;
	const totalColor = "#fff";

	return (
		<View style={styles.container}>
			{phase === "suffer_damage" && pending > 0 && onDiscard ? (
				<TouchableOpacity
					style={styles.discardBtn}
					onPress={onDiscard}
					disabled={!enough}
					activeOpacity={0.8}
				>
					<Text style={styles.discardLabel}>{t("action.discard_label")}</Text>
					<SvgNumberSprite
						value={damageSubtraction}
						height={26}
						color={totalColor}
					/>
				</TouchableOpacity>
			) : (
				<View style={styles.labelRow}>
					{onSort && phase === "player_turn" && (
						<TouchableOpacity
							onPress={handleSort}
							style={styles.sortBtn}
							activeOpacity={0.7}
						>
							<Text style={styles.sortText}>{t("hand.sort")}</Text>
						</TouchableOpacity>
					)}
					{onSortByClass && phase === "player_turn" && (
						<TouchableOpacity
							onPress={handleSortByClass}
							style={styles.sortBtn}
							activeOpacity={0.7}
						>
							<Text style={styles.sortText}>{t("hand.sortByClass")}</Text>
						</TouchableOpacity>
					)}
				</View>
			)}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={[
					styles.scroll,
					{ paddingTop: liftY + 4 },
				]}
			>
				{hand.map((card) => (
					<CardView
						key={card.id}
						card={card}
						selected={selectedIds.has(card.id)}
						onPress={() => onCardPress(card)}
						onLongPress={() => handleLongPress(card)}
						disabled={!interactive}
						immuneSuit={immuneSuit}
						discarding={discardingIds?.has(card.id)}
						sufferMode={phase === "suffer_damage"}
						dimmed={
							phase === "player_turn" &&
							selectedIds.size > 0 &&
							!selectedIds.has(card.id) &&
							!(compatibleIds?.has(card.id) ?? true)
						}
					/>
				))}
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
