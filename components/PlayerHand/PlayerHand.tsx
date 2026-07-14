import { CardDetailModal } from "@/components/CardDetailModal";
import { CardView } from "@/components/CardView";
import { useAudio } from "@/contexts/AudioContext";
import { Card } from "@/data/types";
import { useCardSize } from "@/hooks/useCardSize";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { getCompatibleCardIds } from "@/utils/gameLogic";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutAnimation, ScrollView, Text, View } from "react-native";
import {
	HAND_ROW_LIFT,
	HAND_ROW_LIFT_COMPACT,
	styles,
} from "./PlayerHand.styles";
import { ActionButtonRow } from "./components/ActionButtonRow";
import { IconLabelButton } from "./components/ActionButtonRow/IconLabelButton";
import { SortButton } from "./components/ActionButtonRow/SortButton";
import { DiscardButton } from "./components/DiscardButton/DiscardButton";
import ScaledCard from "./components/ScaledCard";
import { PropsType } from "./types";

export const PlayerHand = ({
	hand,
	compactVerticalSpacing = false,
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
	onYield,
	playDisabled,
	onCardDealComplete,
	onCardDiscardComplete,
	waitingPlayedCards,
	highlightPlay,
	highlightSortValue,
	highlightSortSuit,
	detailOnly = false,
	onCardDetailChange,
}: PropsType) => {
	const { t } = useTranslation();
	const { playTap } = useAudio();
	const [detailCard, setDetailCard] = useState<Card | null>(null);

	const handleSort = () => {
		if (locked || isDealing) return;
		playTap();
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		onSort?.();
	};

	const handleSortByClass = () => {
		if (locked || isDealing) return;
		playTap();
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		onSortByClass?.();
	};
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
		onCardDetailChange?.(card);
	};

	const handleDetailClose = () => {
		setDetailCard(null);
		onCardDetailChange?.(null);
	};

	const pending = pendingDamage ?? 0;
	const current = selectedTotal ?? 0;
	const damageSubtraction = Math.max(0, pending - current);
	const enough = current >= pending;
	// Dano já coberto: a seleção de novas cartas é encerrada.
	const discardCovered = phase === "suffer_damage" && pending > 0 && enough;
	const { isDesktop } = useResponsiveLayout();

	const desktopSortButtons =
		isDesktop && (onSort || onSortByClass) ? (
			<View style={styles.desktopSortRow}>
				{onSort && (
					<IconLabelButton
						icon={require("@/assets/icons/sort_icon.png")}
						label={t("hand.sort")}
						onPress={handleSort}
						disabled={locked || isDealing}
					/>
				)}
				{onSortByClass && (
					<IconLabelButton
						icon={require("@/assets/icons/suits-sort.png")}
						label={t("hand.sortByClass")}
						onPress={handleSortByClass}
						disabled={locked || isDealing}
					/>
				)}
			</View>
		) : null;

	const compactSortButtons =
		!isDesktop && (onSort || onSortByClass) ? (
			<View style={styles.waitingSortRow}>
				{onSort && (
					<SortButton
						icon={require("@/assets/icons/sort_icon.png")}
						handleSort={handleSort}
						disabled={locked || isDealing}
					/>
				)}
				{onSortByClass && (
					<SortButton
						icon={require("@/assets/icons/suits-sort.png")}
						handleSort={handleSortByClass}
						disabled={locked || isDealing}
					/>
				)}
			</View>
		) : null;

	return (
		<View
			style={[
				styles.container,
				compactVerticalSpacing && styles.containerCompact,
			]}
		>
			{waitingPlayedCards !== undefined ? (
				// Modo espera: exibe cartas jogadas pelo jogador ativo + botões de sort
				<View style={[styles.waitingBar, isDesktop && styles.waitingBarDesktop]}>
					<View style={styles.waitingArea}>
						{waitingPlayedCards.length === 0 ? (
							<Text style={styles.waitingLabel}>
								{t("multiplayer.turnToast.waiting")}
							</Text>
						) : (
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={styles.waitingScroll}
							>
								{waitingPlayedCards.map((card) => (
									<ScaledCard key={card.id} card={card} />
								))}
							</ScrollView>
						)}
					</View>
					{desktopSortButtons ?? compactSortButtons}
				</View>
			) : phase === "suffer_damage" && pending > 0 && onDiscard ? (
				isDesktop ? (
					<View style={styles.desktopToolbar}>
						<DiscardButton
							enough={enough}
							damageSubtraction={damageSubtraction}
							onDiscard={onDiscard}
							locked={locked || isDealing}
						/>
						{desktopSortButtons}
					</View>
				) : (
					<DiscardButton
						enough={enough}
						damageSubtraction={damageSubtraction}
						onDiscard={onDiscard}
						locked={locked || isDealing}
					/>
				)
			) : (
				<ActionButtonRow
					phase={phase}
					onSort={onSort}
					onSortByClass={onSortByClass}
					onPlay={onPlay}
					onYield={onYield}
					playDisabled={playDisabled || isDealing}
					locked={locked || isDealing}
					highlightPlay={highlightPlay}
					highlightSortValue={highlightSortValue}
					highlightSortSuit={highlightSortSuit}
				/>
			)}
			<View
				style={[
					styles.handRow,
					{
						paddingTop:
							liftY +
							(compactVerticalSpacing ? HAND_ROW_LIFT_COMPACT : HAND_ROW_LIFT),
					},
				]}
			>
				{hand.map((card) => {
					const isSelected = selectedIds.has(card.id);
					// Ataque: cartas que não combinam com a seleção atual.
					const isIncompatible =
						phase === "player_turn" &&
						selectedIds.size > 0 &&
						!isSelected &&
						!(compatibleIds?.has(card.id) ?? true);
					// Descarte: coberto o dano, as demais cartas saem de cena — descartar
					// além do necessário só desperdiça a mão. As já escolhidas seguem
					// clicáveis para o jogador poder desfazer a seleção.
					const isSurplus = discardCovered && !isSelected;
					const isDimmed = isIncompatible || isSurplus;
					const dealOrder = activeDeal?.orderById.get(card.id);
					const discardFlight = activeDiscard?.flightById.get(card.id);
					return (
						<CardView
							key={card.id}
							card={card}
							selected={isSelected}
							onPress={detailOnly ? undefined : () => onCardPress(card)}
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
							// No passo do clique longo a carta segue tocável (só o toque
							// simples é que fica inerte), senão não haveria o que praticar.
							pressDisabled={!detailOnly && (!interactive || isDimmed)}
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
				onClose={handleDetailClose}
			/>
		</View>
	);
};
