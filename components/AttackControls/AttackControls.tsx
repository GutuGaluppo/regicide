import SpellImmune from "@/assets/icons/spellImmune.png";
import { useAudio } from "@/contexts/AudioContext";
import { CardRank, Enemy, Suit } from "@/data/types";
import React, { useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import {
	CardSelectionInfo,
	getCardsForSuit,
	JESTER_CARDS,
	RegularSuit,
	SUITS,
} from "@/components/AttackInput/AttackInput.constants";
import { styles } from "./AttackControls.styles";

interface AttackControlsProps {
	enemy: Enemy | null;
	jesterActive?: boolean;
	onApply: (suit: Suit, rank: CardRank) => void;
	onSelectionChange?: (info: CardSelectionInfo | null) => void;
}

export const AttackControls = ({
	enemy,
	jesterActive = false,
	onApply,
	onSelectionChange,
}: AttackControlsProps) => {
	const { playTap } = useAudio();
	const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);

	const handleSuitPress = (s: Suit) => {
		playTap();
		setSelectedSuit((prev) => (prev === s ? null : s));
	};

	const canApply = false; // wired in subsequent commits
	const canApplyJester = false; // wired in subsequent commits

	return (
		<View style={styles.container}>
			{/* Action buttons */}
			<View style={styles.actionRow}>
				<TouchableOpacity
					style={[styles.actionBtn, !canApply && styles.actionBtnDisabled]}
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

			{/* Card deck */}
			{selectedSuit === "jester" ? (
				<View style={styles.jesterRow}>
					{JESTER_CARDS.map(({ image }, i) => (
						<View key={i} style={styles.cardBtn}>
							<Image
								source={image}
								style={[styles.cardThumb, styles.cardThumbDeck]}
								resizeMode="cover"
							/>
						</View>
					))}
				</View>
			) : selectedSuit !== null ? (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.rankRow}
				>
					{getCardsForSuit(selectedSuit as RegularSuit).map(({ rank: r, image }) => (
						<View key={r} style={styles.cardBtn}>
							<Image
								source={image}
								style={[styles.cardThumb, styles.cardThumbDeck]}
								resizeMode="cover"
							/>
						</View>
					))}
				</ScrollView>
			) : null}
		</View>
	);
};
