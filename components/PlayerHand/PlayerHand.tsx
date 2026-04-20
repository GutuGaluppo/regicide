import { CardDetailModal } from "@/components/CardDetailModal";
import { CardView } from "@/components/CardView";
import { Card, GamePhase, Suit } from "@/data/types";
import { useCardSize } from "@/hooks/useCardSize";
import { getCompatibleCardIds } from "@/utils/gameLogic";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { styles } from "./PlayerHand.styles";
import { ActionButtonRow } from "./components/ActionButtonRow";
import { DiscardButton } from "./components/DiscardButton/DiscardButton";

type ScreenRect = {
	x: number;
	y: number;
	w: number;
	h: number;
};

type PropsType = {
	hand: Card[];
	selectedIds: Set<string>;
	phase: GamePhase;
	immuneSuit?: Suit | null;
	dealingIds?: Set<string>;
	activeDeal?: {
		id: number;
		source: ScreenRect;
		orderById: Map<string, number>;
	} | null;
	activeDiscard?: {
		id: number;
		flightById: Map<
			string,
			{
				order: number;
				dest: ScreenRect;
			}
		>;
	} | null;
	locked?: boolean;
	pendingDamage?: number;
	selectedTotal?: number;
	onCardPress: (card: Card) => void;
	onSort?: () => void;
	onSortByClass?: () => void;
	onDiscard?: () => void;
	onPlay?: () => void;
	playDisabled?: boolean;
	onCardDealComplete?: (dealId: number, cardId: string) => void;
	onCardDiscardComplete?: (discardId: number, cardId: string) => void;
};

export const PlayerHand = ({
	hand,
	selectedIds,
	phase,
	immuneSuit,
	dealingIds,
	activeDeal,
	activeDiscard,
	locked,
	pendingDamage,
	selectedTotal,
	onCardPress,
	onSort,
	onSortByClass,
	onDiscard,
	onPlay,
	playDisabled,
	onCardDealComplete,
	onCardDiscardComplete,
}: PropsType) => {
	const { t } = useTranslation();
	const [detailCard, setDetailCard] = useState<Card | null>(null);
	const isDealing = (dealingIds?.size ?? 0) > 0;
	const interactive =
		(phase === "player_turn" || phase === "suffer_damage") &&
		!isDealing &&
		!locked;
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
					locked={locked || isDealing}
				/>
			) : (
				<ActionButtonRow
					phase={phase}
					onSort={onSort}
					onSortByClass={onSortByClass}
					onPlay={onPlay}
					playDisabled={playDisabled || isDealing}
					locked={locked || isDealing}
				/>
			)}
			<View style={[styles.handRow, { paddingTop: liftY + 4 }]}>
				{hand.map((card) => {
					const isDimmed =
						phase === "player_turn" &&
						selectedIds.size > 0 &&
						!selectedIds.has(card.id) &&
						!(compatibleIds?.has(card.id) ?? true);
					const dealOrder = activeDeal?.orderById.get(card.id);
					const discardFlight = activeDiscard?.flightById.get(card.id);
					return (
						<CardView
							key={card.id}
							card={card}
							selected={selectedIds.has(card.id)}
							onPress={() => onCardPress(card)}
							onLongPress={() => handleLongPress(card)}
							onDealComplete={onCardDealComplete}
							onDiscardComplete={onCardDiscardComplete}
							dealAnimation={
								activeDeal && dealOrder !== undefined
									? {
											id: activeDeal.id,
											order: dealOrder,
											source: activeDeal.source,
										}
									: undefined
							}
							discardAnimation={
								activeDiscard && discardFlight
									? {
											id: activeDiscard.id,
											order: discardFlight.order,
											dest: discardFlight.dest,
										}
									: undefined
							}
							pressDisabled={!interactive || isDimmed}
							immuneSuit={immuneSuit}
							sufferMode={phase === "suffer_damage"}
							dimmed={isDimmed}
						/>
					);
				})}
				{hand.length === 0 && (
					<Text style={styles.empty}>{t("hand.empty")}</Text>
				)}
			</View>

			<CardDetailModal
				card={detailCard}
				visible={detailCard !== null}
				immuneSuit={immuneSuit}
				onClose={() => setDetailCard(null)}
			/>
		</View>
	);
};
