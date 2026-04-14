// /screens/InstructionsScreen/InstructionsScreen.tsx
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Image,
	ImageBackground,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./InstructionsScreen.styles";

const BG = require("@/assets/backgrounds/bg_cave.webp");

const Section = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>{title}</Text>
		{children}
	</View>
);

const Row = ({ label, value }: { label: string; value: string }) => (
	<View style={styles.tableRow}>
		<Text style={styles.tableLabel}>{label}</Text>
		<Text style={styles.tableValue}>{value}</Text>
	</View>
);

const SuitPower = ({
	symbol,
	color,
	name,
	power,
}: {
	symbol: string;
	color: string;
	name: string;
	power: string;
}) => (
	<View style={styles.suitRow}>
		<View style={[styles.suitBadge, { backgroundColor: color + "22", borderColor: color }]}>
			<Text style={[styles.suitSymbol, { color }]}>{symbol}</Text>
		</View>
		<View style={styles.suitInfo}>
			<Text style={[styles.suitName, { color }]}>{name}</Text>
			<Text style={styles.suitPower}>{power}</Text>
		</View>
	</View>
);

const EnemyRow = ({
	rank,
	label,
	hp,
	atk,
	immunity,
}: {
	rank: string;
	label: string;
	hp: number;
	atk: number;
	immunity: string;
}) => (
	<View style={styles.enemyRow}>
		<View style={styles.enemyRankBadge}>
			<Text style={styles.enemyRankText}>{rank}</Text>
		</View>
		<View style={styles.enemyInfo}>
			<Text style={styles.enemyLabel}>{label}</Text>
			<Text style={styles.enemyStats}>
				<Text style={styles.statHp}>❤ {hp} HP</Text>
				{"  "}
				<Text style={styles.statAtk}>⚔ {atk} ATK</Text>
			</Text>
			<Text style={styles.enemyImmunity}>{immunity}</Text>
		</View>
	</View>
);

export const InstructionsScreen = () => {
	const { t } = useTranslation();

	const steps = t("instructions.sections.turn.steps", { returnObjects: true }) as Array<{
		title: string;
		desc: string;
	}>;

	return (
		<ImageBackground
			source={BG}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backBtn}
					>
						<Text style={styles.backText}>{t("common.back")}</Text>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{t("instructions.header")}</Text>
					<View style={{ width: 60 }} />
				</View>

				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.introBlock}>
						<Image
							source={require("@/assets/images/crown.png")}
							style={styles.crownImage}
							resizeMode="contain"
						/>
						<Text style={styles.gameName}>{t("instructions.gameName")}</Text>
						<Text style={styles.gameSubtitle}>{t("instructions.gameSubtitle")}</Text>
					</View>

					<Section title={t("instructions.sections.objective.title")}>
						<Text style={styles.bodyText}>{t("instructions.sections.objective.body")}</Text>
					</Section>

					<Section title={t("instructions.sections.setup.title")}>
						<Text style={styles.bodyText}>{t("instructions.sections.setup.body")}</Text>
					</Section>

					<Section title={t("instructions.sections.turn.title")}>
						<View style={styles.stepList}>
							{steps.map((step, index) => (
								<View key={index} style={styles.step}>
									<View style={styles.stepNum}>
										<Text style={styles.stepNumText}>{index + 1}</Text>
									</View>
									<View style={styles.stepBody}>
										<Text style={styles.stepTitle}>{step.title}</Text>
										<Text style={styles.stepDesc}>{step.desc}</Text>
									</View>
								</View>
							))}
						</View>
					</Section>

					<Section title={t("instructions.sections.suitPowersSection.title")}>
						<View style={styles.suitList}>
							<SuitPower
								symbol="♥"
								color="#EF4444"
								name={t("instructions.sections.suitPowersSection.hearts.name")}
								power={t("instructions.sections.suitPowersSection.hearts.power")}
							/>
							<SuitPower
								symbol="♦"
								color="#F59E0B"
								name={t("instructions.sections.suitPowersSection.diamonds.name")}
								power={t("instructions.sections.suitPowersSection.diamonds.power")}
							/>
							<SuitPower
								symbol="♣"
								color="#4ADE80"
								name={t("instructions.sections.suitPowersSection.clubs.name")}
								power={t("instructions.sections.suitPowersSection.clubs.power")}
							/>
							<SuitPower
								symbol="♠"
								color="#60A5FA"
								name={t("instructions.sections.suitPowersSection.spades.name")}
								power={t("instructions.sections.suitPowersSection.spades.power")}
							/>
						</View>
					</Section>

					<Section title={t("instructions.sections.immunities.title")}>
						<Text style={styles.bodyText}>
							{t("instructions.sections.immunities.body")}
						</Text>
						<View style={styles.immuneExamples}>
							{(["hearts", "diamonds", "clubs", "spades"] as const).map((suit, i) => {
								const colors = ["#EF4444", "#F59E0B", "#4ADE80", "#60A5FA"];
								const symbols = ["♥", "♦", "♣", "♠"];
								return (
									<View key={suit} style={styles.immuneRow}>
										<Text style={[styles.immuneSymbol, { color: colors[i] }]}>
											{symbols[i]}
										</Text>
										<Text style={styles.immuneLabel}>
											{t(`instructions.sections.immunities.examples.${suit}`)}
										</Text>
									</View>
								);
							})}
						</View>
					</Section>

					<Section title={t("instructions.sections.enemies.title")}>
						<EnemyRow
							rank="J"
							label={t("instructions.sections.enemies.jack")}
							hp={20}
							atk={10}
							immunity={t("instructions.sections.enemies.immuneTo", {
								suit: t("instructions.sections.enemies.ownSuit"),
							})}
						/>
						<EnemyRow
							rank="Q"
							label={t("instructions.sections.enemies.queen")}
							hp={30}
							atk={15}
							immunity={t("instructions.sections.enemies.immuneTo", {
								suit: t("instructions.sections.enemies.ownSuit"),
							})}
						/>
						<EnemyRow
							rank="K"
							label={t("instructions.sections.enemies.king")}
							hp={40}
							atk={20}
							immunity={t("instructions.sections.enemies.immuneTo", {
								suit: t("instructions.sections.enemies.ownSuit"),
							})}
						/>
					</Section>

					<Section title={t("instructions.sections.companions.title")}>
						<Text style={styles.bodyText}>
							{t("instructions.sections.companions.body")}
						</Text>
						<View style={styles.comboExamples}>
							<Row
								label="Ex: 4 + 6"
								value={t("instructions.sections.companions.examples.fourSix")}
							/>
							<Row
								label="Ex: 3 + 3 + 3"
								value={t("instructions.sections.companions.examples.threeThrees")}
							/>
							<Row
								label="Ex: A + A"
								value={t("instructions.sections.companions.examples.twoAces")}
							/>
						</View>
					</Section>

					<Section title={t("instructions.sections.defeating.title")}>
						<Text style={styles.bodyText}>
							{t("instructions.sections.defeating.body")}
						</Text>
					</Section>

					<Section title={t("instructions.sections.endConditions.title")}>
						<View style={styles.endConditions}>
							<View style={styles.victoryBlock}>
								<Text style={styles.victoryTitle}>
									{t("instructions.sections.endConditions.victoryTitle")}
								</Text>
								<Text style={styles.endText}>
									{t("instructions.sections.endConditions.victoryText")}
								</Text>
							</View>
							<View style={styles.defeatBlock}>
								<Text style={styles.defeatTitle}>
									{t("instructions.sections.endConditions.defeatTitle")}
								</Text>
								<Text style={styles.endText}>
									{t("instructions.sections.endConditions.defeatText")}
								</Text>
							</View>
						</View>
					</Section>

					<View style={{ height: 32 }} />
				</ScrollView>
			</View>
		</ImageBackground>
	);
};
