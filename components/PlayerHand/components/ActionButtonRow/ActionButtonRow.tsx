import { TutorialTarget } from "@/components/TutorialOverlay";
import { useAudio } from "@/contexts/AudioContext";
import { GamePhase } from "@/data/types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Image } from "expo-image";
import React from "react";
import { LayoutAnimation, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { styles } from "./ActionButtonRow.styles";
import { IconLabelButton } from "./IconLabelButton";
import { SortButton } from "./SortButton";

type PropsType = {
	phase: GamePhase;
	onSort?: () => void;
	onSortByClass?: () => void;
	onPlay?: () => void;
	onYield?: () => void;
	playDisabled?: boolean;
	locked?: boolean;
	/** Tutorial: envolve o respectivo botão com um alvo do spotlight. */
	highlightPlay?: boolean;
	highlightSortValue?: boolean;
	highlightSortSuit?: boolean;
};
export const ActionButtonRow = ({
	phase,
	onSort,
	onSortByClass,
	onPlay,
	onYield,
	playDisabled,
	locked,
	highlightPlay,
	highlightSortValue,
	highlightSortSuit,
}: PropsType) => {
	const { playTap } = useAudio();
	const { t } = useTranslation();
	const { isDesktop } = useResponsiveLayout();

	const handleSort = () => {
		if (locked) return;
		playTap();
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		onSort?.();
	};
	const handleSortByClass = () => {
		if (locked) return;
		playTap();
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		onSortByClass?.();
	};

	// Envolve cada botão com o alvo do tutorial apenas quando destacado, para não
	// alterar a árvore/layout fora do tutorial.
	const wrapPlay = (node: React.ReactNode) =>
		highlightPlay ? <TutorialTarget id="tutorial-attack">{node}</TutorialTarget> : node;
	const wrapSortValue = (node: React.ReactNode) =>
		highlightSortValue ? <TutorialTarget id="tutorial-sort-value">{node}</TutorialTarget> : node;
	const wrapSortSuit = (node: React.ReactNode) =>
		highlightSortSuit ? <TutorialTarget id="tutorial-sort-suit">{node}</TutorialTarget> : node;

	// ── Desktop: ações com ícone + texto e botões de ordenação persistentes ──
	if (isDesktop) {
		const inTurn = phase === "player_turn";
		return (
			<View style={styles.desktopRow}>
				{inTurn && (
					<View style={styles.desktopActionGroup}>
						{onPlay &&
							wrapPlay(
								<IconLabelButton
									icon={require("@/assets/icons/sword.png")}
									label={t("action.play")}
									onPress={() => {
										playTap();
										onPlay();
									}}
									disabled={playDisabled || locked}
									variant="primary"
								/>,
							)}
						{onYield && (
							<IconLabelButton
								icon={require("@/assets/icons/skip_icon.png")}
								label={t("action.yield")}
								onPress={() => {
									playTap();
									onYield();
								}}
								disabled={locked}
								variant="secondary"
							/>
						)}
					</View>
				)}

				{(onSort || onSortByClass) && (
					<View style={styles.desktopSortGroup}>
						{onSort &&
							wrapSortValue(
								<IconLabelButton
									icon={require("@/assets/icons/sort_icon.png")}
									label={t("hand.sort")}
									onPress={handleSort}
									disabled={locked}
								/>,
							)}
						{onSortByClass &&
							wrapSortSuit(
								<IconLabelButton
									icon={require("@/assets/icons/suits-sort.png")}
									label={t("hand.sortByClass")}
									onPress={handleSortByClass}
									disabled={locked}
								/>,
							)}
					</View>
				)}
			</View>
		);
	}

	// ── Mobile/tablet: botões com ícone (layout original) ────────────────────
	return (
		<View style={styles.container}>
			{phase === "player_turn" &&
				onPlay &&
				wrapPlay(
					<TouchableOpacity
						style={[styles.playBtn, playDisabled && styles.playBtnDisabled]}
						onPress={() => {
							playTap();
							onPlay();
						}}
						disabled={playDisabled || locked}
						activeOpacity={0.8}
					>
						<View style={styles.playBtnInner}>
							<Image
								source={require("@/assets/icons/sword.png")}
								style={{
									width: 35,
									height: 35,
									tintColor: "#F5F8F3",
									transform: [{ rotate: "45deg" }],
								}}
								contentFit="contain"
							/>
						</View>
					</TouchableOpacity>,
				)}
			{phase === "player_turn" && onYield && (
				<SortButton
					icon={require("@/assets/icons/skip_icon.png")}
					handleSort={() => {
						playTap();
						onYield();
					}}
					disabled={locked}
				/>
			)}
			<View style={{ flexDirection: "row", gap: 4 }}>
				{onSort &&
					phase === "player_turn" &&
					wrapSortValue(
						<SortButton
							icon={require("@/assets/icons/sort_icon.png")}
							handleSort={handleSort}
							disabled={locked}
						/>,
					)}
				{onSortByClass &&
					phase === "player_turn" &&
					wrapSortSuit(
						<SortButton
							icon={require("@/assets/icons/suits-sort.png")}
							handleSort={handleSortByClass}
							disabled={locked}
						/>
				)}
			</View>
		</View>
	);
};
