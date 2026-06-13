import { useAudio } from "@/contexts/AudioContext";
import { GamePhase } from "@/data/types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Image } from "expo-image";
import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { styles } from "./ActionButtonRow.styles";
import { SortButton } from "./SortButton";

type PropsType = {
	phase: GamePhase;
	onSort?: () => void;
	onSortByClass?: () => void;
	onPlay?: () => void;
	onYield?: () => void;
	playDisabled?: boolean;
	locked?: boolean;
};
export const ActionButtonRow = ({
	phase,
	onSort,
	onSortByClass,
	onPlay,
	onYield,
	playDisabled,
	locked,
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

	// ── Desktop: botões com legenda (sem ícone) ──────────────────────────────
	if (isDesktop) {
		const inTurn = phase === "player_turn";
		return (
			<View style={styles.desktopRow}>
				{inTurn && onPlay && (
					<TouchableOpacity
						style={[
							styles.textBtn,
							styles.textBtnPrimary,
							(playDisabled || locked) && styles.textBtnDisabled,
						]}
						onPress={() => {
							playTap();
							onPlay();
						}}
						disabled={playDisabled || locked}
						activeOpacity={0.85}
					>
						<Text style={[styles.textBtnLabel, styles.textBtnLabelPrimary]}>
							{t("action.play")}
						</Text>
					</TouchableOpacity>
				)}
				{inTurn && onYield && (
					<TouchableOpacity
						style={[
							styles.textBtn,
							styles.textBtnSecondary,
							locked && styles.textBtnDisabled,
						]}
						onPress={() => {
							playTap();
							onYield();
						}}
						disabled={locked}
						activeOpacity={0.85}
					>
						<Text style={styles.textBtnLabel}>{t("action.yield")}</Text>
					</TouchableOpacity>
				)}

				{inTurn && (onSort || onSortByClass) && (
					<View style={styles.desktopSortGroup}>
						{onSort && (
							<TouchableOpacity
								style={[styles.textBtn, styles.textBtnGhost, locked && styles.textBtnDisabled]}
								onPress={handleSort}
								disabled={locked}
								activeOpacity={0.85}
							>
								<Text style={styles.textBtnLabelGhost}>{t("hand.sort")}</Text>
							</TouchableOpacity>
						)}
						{onSortByClass && (
							<TouchableOpacity
								style={[styles.textBtn, styles.textBtnGhost, locked && styles.textBtnDisabled]}
								onPress={handleSortByClass}
								disabled={locked}
								activeOpacity={0.85}
							>
								<Text style={styles.textBtnLabelGhost}>{t("hand.sortByClass")}</Text>
							</TouchableOpacity>
						)}
					</View>
				)}
			</View>
		);
	}

	// ── Mobile/tablet: botões com ícone (layout original) ────────────────────
	return (
		<View style={styles.container}>
			{phase === "player_turn" && onPlay && (
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
								transform: [{ rotate: "45deg" }],
							}}
							contentFit="contain"
						/>
					</View>
				</TouchableOpacity>
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
			<View style={{ flexDirection: "row", marginLeft: "auto", gap: 4 }}>
				{onSort && phase === "player_turn" && (
					<SortButton
						icon={require("@/assets/icons/sort_icon.png")}
						handleSort={handleSort}
						disabled={locked}
					/>
				)}
				{onSortByClass && phase === "player_turn" && (
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
