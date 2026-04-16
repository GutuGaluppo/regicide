import SpellImmune from "@/assets/icons/spellImmune.png";
import { useAudio } from "@/contexts/AudioContext";
import { CardRank, Enemy, Suit } from "@/data/types";
import { cardValue } from "@/utils/gameLogic";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import {
	CardSelectionInfo,
	getCardsForSuit,
	JESTER_CARDS,
	RegularSuit,
	SuitRank,
	SUITS,
} from "@/components/AttackInput/AttackInput.constants";
import { ComboBar } from "@/components/ComboBar";
import { styles } from "./AttackControls.styles";

interface AttackControlsProps {
	enemy: Enemy | null;
	jesterActive?: boolean;
	onApply: (suit: Suit, rank: CardRank) => void;
	onSelectionChange?: (info: CardSelectionInfo | null) => void;
	onImmuneWarning?: () => void;
}

export const AttackControls = ({
	enemy,
	jesterActive = false,
	onApply,
	onSelectionChange,
	onImmuneWarning,
}: AttackControlsProps) => {
	const { playTap } = useAudio();
	const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
	const [selectedRank, setSelectedRank] = useState<SuitRank | "Jester" | null>(null);
	const [selectedJesterIndex, setSelectedJesterIndex] = useState<number | null>(null);

	const isJester = selectedSuit === "jester";
	const value = selectedRank && !isJester ? cardValue(selectedRank as SuitRank) : 0;
	const immune = !jesterActive && selectedSuit !== null && selectedSuit === enemy?.suit;
	const damage = value * (!immune && selectedSuit === "clubs" ? 2 : 1);
	const shieldAdded = !immune && selectedSuit === "spades" ? value : 0;

	const powerPreview =
		selectedSuit && selectedRank
			? isJester
				? "🃏 Cancela o ataque inimigo nesta rodada"
				: immune
					? `Imunidade: poder de ${selectedSuit} não se aplica`
					: selectedSuit === "hearts"
						? `♥ Curar ${value} carta(s) do descarte`
						: selectedSuit === "diamonds"
							? `♦ Comprar ${value} carta(s)`
							: selectedSuit === "clubs"
								? `♣ Dano dobrado → ${damage}`
								: `♠ Escudo +${value}`
			: null;

	const canApply = selectedSuit !== null && selectedRank !== null;
	const canApplyJester = isJester && selectedRank === "Jester";

	useEffect(() => {
		if (!selectedSuit || !selectedRank || !powerPreview) {
			onSelectionChange?.(null);
			return;
		}
		onSelectionChange?.({
			suit: selectedSuit,
			rank: selectedRank,
			damage,
			shieldAdded,
			powerPreview,
			immune,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSuit, selectedRank, damage, immune, powerPreview]);

	const handleApply = () => {
		if (!selectedSuit || !selectedRank) return;
		playTap();
		onApply(selectedSuit, selectedRank);
		setSelectedSuit(null);
		setSelectedRank(null);
		setSelectedJesterIndex(null);
	};

	const handleSuitPress = (s: Suit) => {
		playTap();
		const isImmune = !jesterActive && enemy !== null && s === enemy.suit;
		if (isImmune) {
			onImmuneWarning?.();
		}
		setSelectedSuit((prev) => {
			if (prev === s) return null;
			setSelectedRank(null);
			setSelectedJesterIndex(null);
			return s;
		});
	};

	const handleCardPress = (r: SuitRank) => {
		playTap();
		setSelectedRank((prev) => (prev === r ? null : r));
	};

	const handleJesterCardPress = (index: number) => {
		playTap();
		setSelectedJesterIndex((prev) => (prev === index ? null : index));
		setSelectedRank((prev) => (selectedJesterIndex === index ? null : "Jester"));
	};

	return (
		<View style={styles.container}>
			{/* Action buttons */}
			<View style={styles.actionRow}>
				<TouchableOpacity
					style={[styles.actionBtn, !canApply && styles.actionBtnDisabled]}
					onPress={handleApply}
					disabled={!canApply}
					activeOpacity={0.8}
				>
					<View style={styles.actionBtnInner}>
						<Image
							style={styles.actionIcon}
							source={require("@/assets/icons/sword.png")}
						/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionBtn, !canApplyJester && styles.actionBtnDisabled]}
					onPress={handleApply}
					disabled={!canApplyJester}
					activeOpacity={0.8}
				>
					<View style={styles.actionBtnInner}>
						<Image
							style={styles.jesterIcon}
							source={require("@/assets/icons/jester_icon.png")}
						/>
					</View>
				</TouchableOpacity>
			</View>

			{/* Suit selection */}
			<View style={styles.suitRow}>
				{SUITS.map(({ suit: s, icon, immuneIcon }) => {
					const isImmune = !jesterActive && enemy !== null && s === enemy.suit;
					return (
						<View key={s} style={styles.suitWrapper}>
							{isImmune && (
								<Image
									source={SpellImmune}
									style={[
										styles.immuneIcon,
										selectedSuit === s && styles.immuneIconSelected,
									]}
								/>
							)}
							<TouchableOpacity
								style={[
									styles.suitBtn,
									selectedSuit === s && styles.suitBtnSelected,
								]}
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

			{/* Combo bar */}
			<ComboBar
				info={
					selectedSuit && selectedRank && powerPreview
						? { suit: selectedSuit, rank: selectedRank, damage, shieldAdded, powerPreview, immune }
						: null
				}
			/>

			{/* Card deck */}
			{isJester ? (
				<View style={styles.jesterRow}>
					{JESTER_CARDS.map(({ image }, i) => (
						<TouchableOpacity
							key={i}
							style={[
								styles.cardBtn,
								selectedJesterIndex === i && styles.cardBtnSelected,
								selectedJesterIndex !== null && selectedJesterIndex !== i && styles.cardBtnDimmed,
								selectedJesterIndex === i && styles.cardBtnLifted,
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
			) : selectedSuit !== null ? (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.rankRow}
				>
					{getCardsForSuit(selectedSuit as RegularSuit).map(({ rank: r, image }) => (
						<TouchableOpacity
							key={r}
							style={[
								styles.cardBtn,
								selectedRank === r && styles.cardBtnSelected,
								selectedRank !== null && selectedRank !== r && styles.cardBtnDimmed,
								selectedRank === r && styles.cardBtnLifted,
							]}
							onPress={() => handleCardPress(r)}
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
			) : null}
		</View>
	);
};
