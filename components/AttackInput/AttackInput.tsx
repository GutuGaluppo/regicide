import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import SpellImmune from "@/assets/icons/spellImmune.png";
import { CardRank, Enemy, Suit } from "@/data/types";
import { cardValue } from "@/utils/gameLogic";
import { RANKS, SUITS } from "./AttackInput.constants";
import { styles } from "./AttackInput.styles";

export const AttackInput = ({
	enemy,
	onApply,
}: {
	enemy: Enemy;
	onApply: (suit: Suit, rank: CardRank) => void;
}) => {
	const [suit, setSuit] = useState<Suit | null>(null);
	const [rank, setRank] = useState<CardRank | null>(null);

	const value = rank ? cardValue(rank) : 0;
	const immune = suit === enemy.suit;
	const damage = value * (!immune && suit === "clubs" ? 2 : 1);

	const powerPreview =
		suit && rank
			? immune
				? `Imunidade: poder de ${suit} não se aplica`
				: suit === "hearts"
					? `♥ Curar ${value} carta(s) do descarte`
					: suit === "diamonds"
						? `♦ Comprar ${value} carta(s)`
						: suit === "clubs"
							? `♣ Dano dobrado → ${damage}`
							: `♠ Escudo +${value}`
			: null;

	const canApply = suit !== null && rank !== null;

	const handleApply = () => {
		if (!suit || !rank) return;
		onApply(suit, rank);
		setSuit(null);
		setRank(null);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Carta jogada</Text>

			{/* Seleção de naipe */}
			<View style={styles.suitRow}>
				{SUITS.map(({ suit: s, icon, immuneIcon }) => {
					const isImmune = s === enemy.suit;
					return (
						<View key={s} style={styles.suitWrapper}>
							{isImmune && (
								<Image source={SpellImmune} style={styles.immuneIcon} />
							)}
							<TouchableOpacity
								style={[styles.suitBtn, suit === s && styles.suitBtnSelected]}
								onPress={() => setSuit((prev) => (prev === s ? null : s))}
								activeOpacity={0.7}
							>
								<Image
									style={styles.suitIcon}
									source={isImmune ? immuneIcon : icon}
									resizeMode="contain"
								/>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>

			{/* Seleção de rank */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.rankRow}
			>
				{RANKS.map((r) => (
					<TouchableOpacity
						key={r}
						style={[styles.rankBtn, rank === r && styles.rankSelected]}
						onPress={() => setRank((prev) => (prev === r ? null : r))}
						activeOpacity={0.7}
					>
						<Text
							style={[styles.rankText, rank === r && styles.rankTextSelected]}
						>
							{r}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>

			{/* Preview */}
			{powerPreview && (
				<View style={[styles.preview, immune && styles.previewImmune]}>
					<Text style={styles.previewDamage}>Dano: {damage}</Text>
					<Text style={styles.previewPower}>{powerPreview}</Text>
				</View>
			)}

			{/* Botão aplicar */}
			<TouchableOpacity
				style={[styles.applyBtn, !canApply && styles.applyDisabled]}
				onPress={handleApply}
				disabled={!canApply}
				activeOpacity={0.8}
			>
				<Text style={styles.applyText}>Aplicar ataque</Text>
			</TouchableOpacity>
		</View>
	);
};
