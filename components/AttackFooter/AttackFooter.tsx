import SpellImmune from "@/assets/icons/spellImmune.png";
import {
	CardSelectionInfo,
	ComboOption,
	RegularSuit,
	SuitRank,
	SUITS,
	getCardsForSuit,
	getComboOptions,
	JESTER_CARDS,
} from "@/components/AttackInput/AttackInput.constants";
import { ComboBar } from "@/components/ComboBar";
import { useAudio } from "@/contexts/AudioContext";
import { CardRank, Enemy, Suit } from "@/data/types";
import { cardValue } from "@/utils/gameLogic";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./AttackFooter.styles";

interface AttackFooterProps {
	enemy: Enemy | null;
	jesterActive?: boolean;
	onApply: (cards: { suit: Suit; rank: CardRank }[]) => void;
	onSelectionChange?: (info: CardSelectionInfo | null) => void;
	onImmuneWarning?: () => void;
}

// Default suit to display when nothing is selected (cards shown but disabled)
const DEFAULT_DISPLAY_SUIT: RegularSuit = "hearts";

export const AttackFooter = ({
	enemy,
	jesterActive = false,
	onApply,
	onSelectionChange,
	onImmuneWarning,
}: AttackFooterProps) => {
	const { playTap } = useAudio();
	const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
	const [selectedRank, setSelectedRank] = useState<SuitRank | "Jester" | null>(null);
	const [selectedJesterIndex, setSelectedJesterIndex] = useState<number | null>(null);
	const [comboCards, setComboCards] = useState<{ suit: RegularSuit; rank: SuitRank }[]>([]);

	const isJester = selectedSuit === "jester";

	// ── Main card (only set when suit + rank both chosen and not jester) ─────────
	const mainCard: { suit: RegularSuit; rank: SuitRank } | null =
		!isJester && selectedSuit !== null && selectedRank !== null
			? { suit: selectedSuit as RegularSuit, rank: selectedRank as SuitRank }
			: null;

	// ── All cards in the current play (main + combo) ─────────────────────────────
	const allCards = mainCard ? [mainCard, ...comboCards] : [];

	// ── Damage & suit-effect helpers ─────────────────────────────────────────────
	const suitIsImmune = (s: RegularSuit): boolean =>
		!jesterActive && enemy !== null && s === enemy.suit;

	const totalValue = allCards.reduce((sum, c) => sum + cardValue(c.rank), 0);
	const activeSuits = new Set(allCards.filter((c) => !suitIsImmune(c.suit)).map((c) => c.suit));
	const hasImmune = allCards.some((c) => suitIsImmune(c.suit));
	const clubsDouble = activeSuits.has("clubs");
	const damage = allCards.length > 0 ? totalValue * (clubsDouble ? 2 : 1) : 0;
	const shieldAdded = activeSuits.has("spades") ? totalValue : 0;

	// ── Power preview text ────────────────────────────────────────────────────────
	let powerPreview: string | null = null;
	if (isJester && selectedRank === "Jester") {
		powerPreview = "🃏 Cancela o ataque inimigo nesta rodada";
	} else if (mainCard) {
		const parts: string[] = [];
		if (hasImmune) parts.push("Imunidade: poder não se aplica");
		if (activeSuits.has("hearts")) parts.push(`♥ Curar ${totalValue} carta(s)`);
		if (activeSuits.has("diamonds")) parts.push(`♦ Comprar ${totalValue} carta(s)`);
		if (clubsDouble) parts.push(`♣ Dano dobrado → ${damage}`);
		if (activeSuits.has("spades")) parts.push(`♠ Escudo +${totalValue}`);
		powerPreview = parts.join(" | ") || `Ataque: ${damage}`;
	}

	// ── Combo options (valid additions based on current selection) ────────────────
	const comboOptions: ComboOption[] = mainCard
		? getComboOptions(mainCard.suit, mainCard.rank, comboCards)
		: [];

	// ── Apply gating ──────────────────────────────────────────────────────────────
	const canApply = mainCard !== null;
	const canApplyJester = isJester && selectedRank === "Jester";

	// The suit to display in the card row (default to hearts when nothing selected)
	const displaySuit: RegularSuit | "jester" = isJester
		? "jester"
		: ((selectedSuit as RegularSuit | null) ?? DEFAULT_DISPLAY_SUIT);

	// ── Notify parent of selection for HP/ATK preview ─────────────────────────────
	useEffect(() => {
		if (!mainCard || !powerPreview) {
			onSelectionChange?.(null);
			return;
		}
		onSelectionChange?.({
			suit: mainCard.suit,
			rank: mainCard.rank,
			damage,
			shieldAdded,
			powerPreview,
			immune: hasImmune,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSuit, selectedRank, comboCards, damage, shieldAdded, hasImmune, powerPreview]);

	// ── Handlers ──────────────────────────────────────────────────────────────────
	const handleApply = () => {
		if (isJester ? !canApplyJester : !canApply) return;
		playTap();
		if (isJester) {
			onApply([{ suit: selectedSuit!, rank: selectedRank! }]);
		} else {
			onApply([{ suit: mainCard!.suit, rank: mainCard!.rank }, ...comboCards]);
		}
		setSelectedSuit(null);
		setSelectedRank(null);
		setSelectedJesterIndex(null);
		setComboCards([]);
	};

	const handleSuitPress = (s: Suit) => {
		playTap();
		if (selectedSuit === s) {
			setSelectedSuit(null);
			setSelectedRank(null);
			setComboCards([]);
			return;
		}
		const isImmune = !jesterActive && enemy !== null && s === enemy.suit;
		if (isImmune) onImmuneWarning?.();
		setSelectedSuit(s);
		setSelectedRank(null);
		setSelectedJesterIndex(null);
		setComboCards([]);
	};

	const handleCardPress = (r: SuitRank) => {
		if (selectedSuit === null) return;
		playTap();
		if (selectedRank === r) {
			setSelectedRank(null);
			setComboCards([]);
		} else {
			setSelectedRank(r);
			setComboCards([]);
		}
	};

	const handleJesterCardPress = (index: number) => {
		playTap();
		setSelectedJesterIndex((prev) => (prev === index ? null : index));
		setSelectedRank(() => (selectedJesterIndex === index ? null : "Jester"));
	};

	const handleToggleCombo = (suit: RegularSuit, rank: SuitRank) => {
		playTap();
		setComboCards((prev) => {
			const exists = prev.some((c) => c.suit === suit && c.rank === rank);
			if (exists) return prev.filter((c) => !(c.suit === suit && c.rank === rank));
			return [...prev, { suit, rank }];
		});
	};

	const noSuit = selectedSuit === null;

	return (
		<View style={styles.container}>
			{/* ── Suit selection ── */}
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
									contentFit="contain"
								/>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>

			{/* ── Card deck (always visible, disabled until suit selected) ── */}
			{displaySuit === "jester" ? (
				<View style={styles.jesterRow}>
					{JESTER_CARDS.map(({ image }, i) => (
						<TouchableOpacity
							key={i}
							style={[
								styles.cardBtn,
								selectedJesterIndex === i && styles.cardBtnSelected,
								selectedJesterIndex !== null &&
									selectedJesterIndex !== i &&
									styles.cardBtnDimmed,
								selectedJesterIndex === i && styles.cardBtnLifted,
							]}
							onPress={() => handleJesterCardPress(i)}
							activeOpacity={0.7}
						>
							<Image source={image} style={styles.cardThumb} contentFit="cover" />
						</TouchableOpacity>
					))}
				</View>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.rankScrollView}
					contentContainerStyle={styles.rankRow}
				>
					{getCardsForSuit(displaySuit).map(({ rank: r, image }) => (
						<TouchableOpacity
							key={r}
							style={[
								styles.cardBtn,
								noSuit && styles.cardBtnDisabled,
								!noSuit && selectedRank === r && styles.cardBtnSelected,
								!noSuit &&
									selectedRank !== null &&
									selectedRank !== r &&
									styles.cardBtnDimmed,
								!noSuit && selectedRank === r && styles.cardBtnLifted,
							]}
							onPress={() => handleCardPress(r)}
							disabled={noSuit}
							activeOpacity={0.7}
						>
							<Image source={image} style={styles.cardThumb} contentFit="cover" />
						</TouchableOpacity>
					))}
				</ScrollView>
			)}

			{/* ── ComboBar: appears after main card selected (not for jester) ── */}
			{mainCard !== null && powerPreview !== null && (
				<ComboBar
					comboOptions={comboOptions}
					selectedComboCards={comboCards}
					onToggleCombo={handleToggleCombo}
					powerPreview={powerPreview}
					totalDamage={damage}
					immune={hasImmune}
				/>
			)}

			{/* ── Action buttons ── */}
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
		</View>
	);
};
