// /components/DefeatScreen.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Easing,
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { getCardImage } from "../data/images";
import { Enemy, GameStats } from "../data/types";

const BG = require("../assets/backgrounds/bg_cave.webp");
const CARD_BACK = require("../assets/images/cards_back.png");
const CROWN_ICON = require("../assets/icons/crown_white.png");

// ─── Ghost elements ──────────────────────────────────────────────────────────

const GhostStatusBar = () => (
	<View style={ghost.statusRow}>
		{[0, 1, 2].map((i) => (
			<Image key={i} source={CARD_BACK} style={ghost.statusCard} resizeMode="contain" />
		))}
	</View>
);

const GhostHand = () => (
	<View style={ghost.handRow}>
		{[0, 1, 2, 3, 4, 5, 6].map((i) => (
			<Image key={i} source={CARD_BACK} style={ghost.handCard} resizeMode="contain" />
		))}
	</View>
);

const GhostActions = () => (
	<View style={ghost.actionsRow}>
		<View style={ghost.btnPrimary} />
		<View style={ghost.btnSecondary} />
	</View>
);

const GhostFooter = () => (
	<View style={ghost.footerRow}>
		{[0, 1, 2, 3].map((i) => (
			<Image key={i} source={CARD_BACK} style={ghost.footerCard} resizeMode="contain" />
		))}
	</View>
);

// ─── Stats panel ─────────────────────────────────────────────────────────────

const formatTime = (ms: number): string => {
	const totalSec = Math.floor(ms / 1000);
	const m = Math.floor(totalSec / 60);
	const s = totalSec % 60;
	return `${m}m ${s}s`;
};

const StatsPanel = ({ stats, defeatedEnemies }: { stats: GameStats; defeatedEnemies: Enemy[] }) => {
	const { t } = useTranslation();
	const elapsed = Date.now() - stats.startTime;

	const SUIT_SYMBOL: Record<string, string> = {
		hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠",
	};

	return (
		<View style={statsStyles.panel}>
			<View style={statsStyles.row}>
				<StatItem icon="⏱" label={t("defeat.stats.time")} value={formatTime(elapsed)} />
				<StatItem icon="⚔" label={t("defeat.stats.turns")} value={String(stats.turnsPlayed)} />
				<StatItem icon="💀" label={t("defeat.stats.enemies")} value={String(defeatedEnemies.length)} />
				<StatItem icon="🗑" label={t("defeat.stats.discarded")} value={String(stats.discardedCards.length)} />
			</View>
			{defeatedEnemies.length > 0 && (
				<ScrollView horizontal showsHorizontalScrollIndicator={false} style={statsStyles.killList}>
					{defeatedEnemies.map((e) => (
						<View key={e.id} style={statsStyles.killChip}>
							<Text style={statsStyles.killText}>
								{SUIT_SYMBOL[e.suit]} {e.rank}
							</Text>
						</View>
					))}
				</ScrollView>
			)}
		</View>
	);
};

const StatItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
	<View style={statsStyles.item}>
		<Text style={statsStyles.itemIcon}>{icon}</Text>
		<Text style={statsStyles.itemValue}>{value}</Text>
		<Text style={statsStyles.itemLabel}>{label}</Text>
	</View>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const DefeatScreen = ({
	enemy,
	stats,
	defeatedEnemies,
	onReset,
}: {
	enemy: Enemy;
	stats?: GameStats;
	defeatedEnemies?: Enemy[];
	onReset: () => void;
}) => {
	const { t } = useTranslation();

	const othersScale = useRef(new Animated.Value(1)).current;
	const othersOpacity = useRef(new Animated.Value(1)).current;
	const cardScale = useRef(new Animated.Value(0.6)).current;
	const cardOpacity = useRef(new Animated.Value(0.6)).current;
	const msgOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.sequence([
			Animated.parallel([
				Animated.timing(othersScale, {
					toValue: 0,
					duration: 700,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(othersOpacity, {
					toValue: 0,
					duration: 500,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(cardScale, {
					toValue: 1,
					duration: 900,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(cardOpacity, {
					toValue: 1,
					duration: 600,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
			]),
			Animated.timing(msgOpacity, {
				toValue: 1,
				duration: 600,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		]).start();
	}, [cardOpacity, cardScale, msgOpacity, othersOpacity, othersScale]);

	return (
		<ImageBackground
			source={BG}
			style={styles.bg}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<View style={styles.header}>
					<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
						<Image source={CROWN_ICON} style={styles.backIcon} resizeMode="contain" />
					</TouchableOpacity>
				</View>

				<Animated.View
					style={[styles.ghostTop, { transform: [{ scale: othersScale }], opacity: othersOpacity }]}
				>
					<GhostStatusBar />
				</Animated.View>

				<View style={styles.center}>
					<Animated.View style={{ transform: [{ scale: cardScale }], opacity: cardOpacity }}>
						<Image
							source={getCardImage(enemy.rank, enemy.suit)}
							style={styles.enemyCard}
							resizeMode="contain"
						/>
					</Animated.View>

					<Animated.Text style={[styles.defeatMsg, { opacity: msgOpacity }]}>
						{t("defeat.message")}
					</Animated.Text>

					{stats && (
						<Animated.View style={{ opacity: msgOpacity, width: "100%" }}>
							<StatsPanel stats={stats} defeatedEnemies={defeatedEnemies ?? []} />
						</Animated.View>
					)}

					<Animated.View style={{ opacity: msgOpacity }}>
						<TouchableOpacity style={styles.newGameBtn} onPress={onReset} activeOpacity={0.8}>
							<Text style={styles.newGameText}>{t("defeat.newGame")}</Text>
						</TouchableOpacity>
					</Animated.View>
				</View>

				<Animated.View
					style={[styles.ghostBottom, { transform: [{ scale: othersScale }], opacity: othersOpacity }]}
				>
					<GhostHand />
					<GhostActions />
					<GhostFooter />
				</Animated.View>
			</View>
		</ImageBackground>
	);
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	bg: { flex: 1 },
	overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
	header: { paddingTop: 52, paddingHorizontal: 16, paddingBottom: 4 },
	backBtn: { alignSelf: "flex-start", paddingVertical: 6, paddingHorizontal: 12 },
	backIcon: { width: 30, height: 30 },
	ghostTop: { alignItems: "center", paddingHorizontal: 16 },
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
		paddingHorizontal: 20,
	},
	enemyCard: { width: 220, height: 308, borderRadius: 14 },
	defeatMsg: {
		fontFamily: "IMFellEnglish-Regular",
		color: "#EF4444",
		fontSize: 28,
		fontWeight: "900",
		letterSpacing: 2,
		textShadowColor: "#7F1D1D",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 12,
	},
	newGameBtn: {
		paddingVertical: 12,
		paddingHorizontal: 40,
		borderRadius: 10,
		backgroundColor: "rgba(104,50,55,0.7)",
		borderWidth: 1,
		borderColor: "#EF4444",
	},
	newGameText: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 18,
		fontWeight: "700",
		letterSpacing: 1,
		textAlign: "center",
	},
	ghostBottom: { paddingHorizontal: 12, paddingBottom: 8, gap: 8 },
});

const statsStyles = StyleSheet.create({
	panel: {
		backgroundColor: "rgba(15,23,42,0.75)",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.15)",
		paddingVertical: 12,
		paddingHorizontal: 16,
		gap: 10,
		width: "100%",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	item: {
		alignItems: "center",
		gap: 2,
	},
	itemIcon: { fontSize: 18 },
	itemValue: {
		color: "#F1F5F9",
		fontSize: 18,
		fontWeight: "700",
	},
	itemLabel: {
		color: "#64748B",
		fontSize: 9,
		fontWeight: "600",
		letterSpacing: 0.5,
		textTransform: "uppercase",
		textAlign: "center",
	},
	killList: { marginTop: 2 },
	killChip: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
		backgroundColor: "rgba(239,68,68,0.12)",
		borderWidth: 1,
		borderColor: "rgba(239,68,68,0.3)",
		marginRight: 6,
	},
	killText: {
		color: "#FCA5A5",
		fontSize: 12,
		fontWeight: "700",
	},
});

const ghost = StyleSheet.create({
	statusRow: { flexDirection: "row", justifyContent: "center", gap: 12, paddingVertical: 4 },
	statusCard: { width: 36, height: 50 },
	handRow: { flexDirection: "row", gap: 6, justifyContent: "center" },
	handCard: { width: 52, height: 75 },
	actionsRow: { flexDirection: "row", gap: 10, justifyContent: "center" },
	btnPrimary: { width: 160, height: 44, borderRadius: 10, backgroundColor: "rgba(103,130,110,0.6)" },
	btnSecondary: { width: 100, height: 44, borderRadius: 10, backgroundColor: "rgba(51,65,85,0.5)" },
	footerRow: { flexDirection: "row", gap: 10, justifyContent: "center" },
	footerCard: { width: 44, height: 62 },
});
