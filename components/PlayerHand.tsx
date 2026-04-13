// /components/PlayerHand.tsx
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	LayoutAnimation,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Card, GamePhase, Suit } from "../data/types";
import { useCardSize } from "../utils/responsive";
import { CardDetailModal } from "./CardDetailModal";
import { CardView } from "./CardView";

export const PlayerHand = ({
	hand,
	selectedIds,
	phase,
	immuneSuit,
	discardingIds,
	onCardPress,
	onSort,
	onSortByClass,
}: {
	hand: Card[];
	selectedIds: Set<string>;
	phase: GamePhase;
	immuneSuit?: Suit | null;
	discardingIds?: Set<string>;
	onCardPress: (card: Card) => void;
	onSort?: () => void;
	onSortByClass?: () => void;
}) => {
	const { t } = useTranslation();
	const [detailCard, setDetailCard] = useState<Card | null>(null);
	const interactive = phase === "player_turn" || phase === "suffer_damage";
	const { liftY } = useCardSize();

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

	return (
		<View style={styles.container}>
			<View style={styles.labelRow}>
				<Text style={styles.label}>
					{phase === "suffer_damage"
						? t("hand.sufferDiscard")
						: t("hand.title", { count: hand.length })}
				</Text>
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
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={[
					styles.scroll,
					// Extra padding top so selected cards (lifted by liftY) are not clipped
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
					/>
				))}
				{hand.length === 0 && <Text style={styles.empty}>{t("hand.empty")}</Text>}
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

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
	},
	labelRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		marginBottom: 6,
		paddingHorizontal: 12,
	},
	label: {
		color: "#94A3B8",
		fontSize: 14,
		textAlign: "center",
	},
	sortBtn: {
		paddingVertical: 3,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: "rgba(100,116,139,0.2)",
		borderWidth: 1,
		borderColor: "rgba(100,116,139,0.4)",
	},
	sortText: {
		color: "#94A3B8",
		fontSize: 12,
		fontWeight: "600",
	},
	scroll: {
		// flexGrow + justifyContent centram as cartas quando cabem na tela;
		// quando transbordam, o ScrollView assume e permite rolar normalmente.
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "flex-end",
		paddingHorizontal: 12,
	},
	empty: {
		color: "#64748B",
		fontStyle: "italic",
		paddingHorizontal: 16,
		alignSelf: "center",
	},
});
