import MagicShield from "@/assets/icons/shield.png";
import SkullIcon from "@/assets/icons/skull.png";
import { NumberSprite } from "@/components/NumberSprite";
import { ProgressRing } from "@/components/ProgressRing";
import { getCardImage } from "@/data/images";
import { Enemy } from "@/data/types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { styles } from "./EnemyStatsCard.styles";

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

	return (
		<Animated.View
			style={[
				styles.section,
				isDead && styles.sectionDead,
				isDefeatingTransition && { opacity: defeatFade },
			]}
		>
			<View style={styles.imageWrapper}>
				<Image
					source={getCardImage(enemy.rank, enemy.suit)}
					style={styles.image}
					resizeMode="contain"
				/>

				<TouchableOpacity
					style={styles.skullBtn}
					onPress={onDefeat}
					activeOpacity={0.7}
				>
					<Image source={SkullIcon} style={styles.skullIcon} resizeMode="contain" />
				</TouchableOpacity>

				{/* ATK — top right */}
				<View style={styles.atkBadge}>
					<Text style={styles.badgeLabel}>{t("enemy.attack")}</Text>
					<ProgressRing percent={attackPercent} size={80} strokeWidth={6} color="#FBBF24">
						<NumberSprite value={previewAttack} type="attack" height={32} />
					</ProgressRing>
					{currentShield > 0 && (
						<View style={styles.shieldWrapper}>
							<Image source={MagicShield} style={styles.shieldIconBg} />
							<NumberSprite value={currentShield} type="attack" height={22} />
						</View>
					)}
				</View>

				{/* HP — bottom left */}
				<View style={styles.hpBadge}>
					<ProgressRing percent={hpPercent} size={80} strokeWidth={6} color={hpColor}>
						<NumberSprite value={previewHP} type="health" height={32} />
					</ProgressRing>
					<Text style={styles.badgeLabel}>{t("enemy.health")}</Text>
				</View>
			</View>

			{isDead && (
				<Text style={styles.deadBadge}>{t("tracker.dead")}</Text>
			)}
		</Animated.View>
	);
};
