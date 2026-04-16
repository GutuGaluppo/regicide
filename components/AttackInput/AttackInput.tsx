import SpellImmune from "@/assets/icons/spellImmune.png";
import { useAudio } from "@/contexts/AudioContext";
import { CardRank, Enemy, Suit } from "@/data/types";
import { cardValue } from "@/utils/gameLogic";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
	CardSelectionInfo,
	getCardsForSuit,
	JESTER_CARDS,
	RegularSuit,
	SuitRank,
	SUITS,
} from "./AttackInput.constants";
import { styles } from "./AttackInput.styles";

export const AttackInput = ({
	enemy,
	onApply,
	onSelectionChange,
	jesterActive = false,
}: {
	enemy: Enemy;
	onApply: (suit: Suit, rank: CardRank) => void;
	onSelectionChange?: (info: CardSelectionInfo | null) => void;
	jesterActive?: boolean;
}) => {
	const { playTap } = useAudio();
	const [suit, setSuit] = useState<Suit | null>(null);
	const [rank, setRank] = useState<SuitRank | "Jester" | null>(null);
	const [jesterIndex, setJesterIndex] = useState<number | null>(null);

	const isJester = suit === "jester";
	const value = rank && !isJester ? cardValue(rank as SuitRank) : 0;
	const immune = !jesterActive && suit !== null && suit === enemy.suit;
	const damage = value * (!immune && suit === "clubs" ? 2 : 1);
	const shieldAdded = !immune && suit === "spades" ? value : 0;

	const powerPreview =
		suit && rank
			? isJester
				? "🃏 Cancela o ataque inimigo nesta rodada"
				: immune
					? `Imunidade: poder de ${suit} não se aplica`
					: suit === "hearts"
						? `♥ Curar ${value} carta(s) do descarte`
						: suit === "diamonds"
							? `♦ Comprar ${value} carta(s)`
							: suit === "clubs"
								? `♣ Dano dobrado → ${damage}`
								: `♠ Escudo +${value}`
			: null;

	useEffect(() => {
		if (!suit || !rank || !powerPreview) {
			onSelectionChange?.(null);
			return;
		}
		onSelectionChange?.({
			suit,
			rank,
			damage,
			shieldAdded,
			powerPreview,
			immune,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [suit, rank, damage, immune, powerPreview]);

	const canApply = suit !== null && rank !== null;
	const canApplyJester = isJester && rank === "Jester";

	const handleApply = () => {
		if (!suit || !rank) return;
		playTap();
		onApply(suit, rank);
		setSuit(null);
		setRank(null);
		setJesterIndex(null);
	};

	const handleSuitPress = (s: Suit) => {
		playTap();
		setSuit((current) => {
			if (current === s) return null;
			setRank(null);
			setJesterIndex(null);
			return s;
		});
	};

	const handleJesterCardPress = (index: number) => {
		playTap();
		setJesterIndex((prev) => (prev === index ? null : index));
		setRank((prev) => (jesterIndex === index ? null : "Jester"));
	};

	return (
		<View style={styles.container}>
			{/* Botões aplicar */}
			<View style={styles.applyRow}>
				<TouchableOpacity
					style={[styles.applyBtn, !canApply && styles.applyDisabled]}
					onPress={handleApply}
					disabled={!canApply}
					activeOpacity={0.8}
				>
					<View style={styles.actionBtnWrapper}>
						<Image
							style={{ width: 25, height: 35, transform: "rotate(45deg)" }}
							source={require("@/assets/icons/sword_outlined.png")}
						/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.applyBtn, !canApplyJester && styles.applyDisabled]}
					onPress={handleApply}
					disabled={!canApplyJester}
					activeOpacity={0.8}
				>
					<View style={styles.actionBtnWrapper}>
						<Image
							style={{ width: 25, height: 35 }}
							source={require("@/assets/icons/jester_icon.png")}
						/>
					</View>
				</TouchableOpacity>
			</View>

			{/* Seleção de naipe */}
			<View style={styles.suitRow}>
				{SUITS.map(({ suit: s, icon, immuneIcon }) => {
					const isImmune = !jesterActive && s === enemy.suit;
					return (
						<View key={s} style={styles.suitWrapper}>
							{isImmune && (
								<Image
									source={SpellImmune}
									style={[
										styles.immuneIcon,
										suit === s && styles.immuniIconSelected,
									]}
								/>
							)}
							<TouchableOpacity
								style={[styles.suitBtn, suit === s && styles.suitBtnSelected]}
								onPress={() => handleSuitPress(s)}
								activeOpacity={0.7}
							>
								<Image
									style={styles.suitIcon}
									source={isImmune && immuneIcon ? immuneIcon : icon}
									resizeMode="contain"
								/>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>

			{/* Seleção de rank / jester */}
			{suit === null ? (
				<Text style={styles.rankHint}>
					Selecione um naipe para ver as cartas
				</Text>
			) : isJester ? (
				<View style={styles.jesterRow}>
					{JESTER_CARDS.map(({ image }, i) => (
						<TouchableOpacity
							key={i}
							style={[
								styles.cardBtn,
								jesterIndex === i && styles.cardBtnSelected,
								jesterIndex !== null &&
									jesterIndex !== i &&
									styles.cardBtnDimmed,
								jesterIndex === i && styles.cardBtnLifted,
							]}
							onPress={() => handleJesterCardPress(i)}
							activeOpacity={0.7}
						>
							<Image
								source={image}
								style={styles.cardThumb}
								resizeMode="cover"
							/>
						</TouchableOpacity>
					))}
				</View>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.rankRow}
				>
					{getCardsForSuit(suit as RegularSuit).map(({ rank: r, image }) => (
						<TouchableOpacity
							key={r}
							style={[
								styles.cardBtn,
								rank === r && styles.cardBtnSelected,
								rank !== null && rank !== r && styles.cardBtnDimmed,
								rank === r && styles.cardBtnLifted,
							]}
							onPress={() => {
								playTap();
								setRank((prev) => (prev === r ? null : r));
							}}
							activeOpacity={0.7}
						>
							<Image
								source={image}
								style={styles.cardThumb}
								resizeMode="cover"
							/>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}
		</View>
	);
};
