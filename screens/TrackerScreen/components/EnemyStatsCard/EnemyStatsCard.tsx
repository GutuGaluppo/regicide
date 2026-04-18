import MagicShield from "@/assets/icons/shield.png";
import SkullIcon from "@/assets/icons/skull.png";
import { NumberSprite } from "@/components/NumberSprite";
import { ProgressRing } from "@/components/ProgressRing";
import { getCardImage } from "@/data/images";
import { Enemy } from "@/data/types";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Image,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { Text } from "react-native";
import { styles } from "./EnemyStatsCard.styles";

// ── Baseline dimensions (mobile reference) ───────────────────────────────────
const BASE = {
	wrapperW: 220,
	wrapperH: 309,
	cardW: 200,
	cardH: 300,
	badgeOff: 65,   // how far ATK/HP rings extend outside the wrapper
	badgeTop: 20,   // atkBadge top offset
	badgeBottom: 20, // hpBadge bottom offset
	skullOff: 45,
	skullSize: 30,
	skullTop: 120,  // skullBtn top (≈ card mid-height)
	ring: 80,
	stroke: 6,
	shield: 88,
	numH: 32,
	numShieldH: 22,
	badgeFont: 13,
} as const;

// ── Space consumed by fixed UI above and below the center scroll ──────────────
const TOP_H = 110;    // SuitTracker + ScreenHeader
const FOOTER_H = 320; // AttackFooter (suit row + card deck + combo/result + actions)
const SAFE_H = 50;    // bottom safe area + buffer
const MAX_SCALE = 1.8;

function computeScale(screenW: number, screenH: number): number {
	const availH = screenH - TOP_H - FOOTER_H - SAFE_H;
	const availW = screenW - 32 - BASE.badgeOff * 2; // 32 = paddingHorizontal * 2
	return Math.min(availH / BASE.wrapperH, availW / BASE.wrapperW, MAX_SCALE);
}

interface EnemyStatsCardProps {
	enemy: Enemy;
	isDead: boolean;
	defeatFade: Animated.Value;
	isDefeatingTransition: boolean;
	previewHP: number;
	hpPercent: number;
	hpColor: string;
	previewAttack: number;
	attackPercent: number;
	currentShield: number;
	onDefeat: () => void;
}

export const EnemyStatsCard = ({
	enemy,
	isDead,
	defeatFade,
	isDefeatingTransition,
	previewHP,
	hpPercent,
	hpColor,
	previewAttack,
	attackPercent,
	currentShield,
	onDefeat,
}: EnemyStatsCardProps) => {
	const { t } = useTranslation();
	const { width, height } = useWindowDimensions();

	const sc = computeScale(width, height);
	const r = {
		wrapperW: Math.round(BASE.wrapperW * sc),
		wrapperH: Math.round(BASE.wrapperH * sc),
		cardW: Math.round(BASE.cardW * sc),
		cardH: Math.round(BASE.cardH * sc),
		badgeOff: Math.round(BASE.badgeOff * sc),
		badgeTop: Math.round(BASE.badgeTop * sc),
		badgeBottom: Math.round(BASE.badgeBottom * sc),
		skullOff: Math.round(BASE.skullOff * sc),
		skullSize: Math.round(BASE.skullSize * sc),
		skullTop: Math.round(BASE.skullTop * sc),
		ring: Math.round(BASE.ring * sc),
		stroke: Math.max(2, Math.round(BASE.stroke * sc)),
		shield: Math.round(BASE.shield * sc),
		numH: Math.round(BASE.numH * sc),
		numShieldH: Math.round(BASE.numShieldH * sc),
		badgeFont: Math.round(BASE.badgeFont * sc),
	};

	return (
		<Animated.View
			style={[
				styles.section,
				isDead && styles.sectionDead,
				isDefeatingTransition && { opacity: defeatFade },
			]}
		>
			<View style={[styles.imageWrapper, { width: r.wrapperW, height: r.wrapperH }]}>
				<Image
					source={getCardImage(enemy.rank, enemy.suit)}
					style={[styles.image, { width: r.cardW, height: r.cardH }]}
					resizeMode="contain"
				/>

				<TouchableOpacity
					style={[styles.skullBtn, { left: -r.skullOff, top: r.skullTop }]}
					onPress={onDefeat}
					activeOpacity={0.7}
				>
					<Image
						source={SkullIcon}
						style={{ width: r.skullSize, height: r.skullSize }}
						resizeMode="contain"
					/>
				</TouchableOpacity>

				{/* ATK — top right */}
				<View style={[styles.atkBadge, { right: -r.badgeOff, top: r.badgeTop }]}>
					<Text style={[styles.badgeLabel, { fontSize: r.badgeFont }]}>
						{t("enemy.attack")}
					</Text>
					<ProgressRing
						percent={attackPercent}
						size={r.ring}
						strokeWidth={r.stroke}
						color="#FBBF24"
					>
						<NumberSprite value={previewAttack} type="attack" height={r.numH} />
					</ProgressRing>
					{currentShield > 0 && (
						<View style={{ width: r.shield, height: r.shield, justifyContent: "center", alignItems: "center" }}>
							<Image
								source={MagicShield}
								style={{ position: "absolute", top: 0, left: 0, width: r.shield, height: r.shield }}
								resizeMode="contain"
							/>
							<NumberSprite value={currentShield} type="attack" height={r.numShieldH} color="#FFFFFF" />
						</View>
					)}
				</View>

				{/* HP — bottom left */}
				<View style={[styles.hpBadge, { left: -r.badgeOff, bottom: r.badgeBottom }]}>
					<ProgressRing
						percent={hpPercent}
						size={r.ring}
						strokeWidth={r.stroke}
						color={hpColor}
					>
						<NumberSprite value={previewHP} type="health" height={r.numH} />
					</ProgressRing>
					<Text style={[styles.badgeLabel, { fontSize: r.badgeFont }]}>
						{t("enemy.health")}
					</Text>
				</View>
			</View>

			{isDead && (
				<Text style={styles.deadBadge}>{t("tracker.dead")}</Text>
			)}
		</Animated.View>
	);
};
