import { ScreenHeader } from "@/components/ScreenHeader";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageBackground, ScrollView, Text, View } from "react-native";
import { styles } from "./InstructionsScreen.styles";

import BG from "@/assets/backgrounds/blue_mountains.webp";

// ── Primitives ────────────────────────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>{title}</Text>
		{children}
	</View>
);

const Divider = () => <View style={styles.divider} />;

// ── Setup table (Jogadores / Joqueres / Mão) ──────────────────────────────────

const SetupTable = ({
	header,
	rows,
}: {
	header: { players: string; jesters: string; hand: string };
	rows: { players: string; jesters: string; hand: string }[];
}) => (
	<View style={styles.table}>
		<View style={[styles.tableRow, styles.tableRowHeader]}>
			<Text style={[styles.tableCell, styles.tableCellHeader]}>{header.players}</Text>
			<Text style={[styles.tableCell, styles.tableCellHeader, styles.tableCellCenter]}>{header.jesters}</Text>
			<Text style={[styles.tableCell, styles.tableCellHeader, styles.tableCellRight]}>{header.hand}</Text>
		</View>
		{rows.map((r, i) => (
			<View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
				<Text style={[styles.tableCell, styles.tableCellBold]}>{r.players}</Text>
				<Text style={[styles.tableCell, styles.tableCellCenter]}>{r.jesters}</Text>
				<Text style={[styles.tableCell, styles.tableCellRight]}>{r.hand}</Text>
			</View>
		))}
	</View>
);

// ── 4-passos summary list ─────────────────────────────────────────────────────

const StepSummaryList = ({ steps }: { steps: string[] }) => (
	<View style={styles.stepSummaryList}>
		{steps.map((s, i) => (
			<Text key={i} style={[styles.stepSummaryText, i === 0 && styles.stepSummaryFirst]}>
				{s}
			</Text>
		))}
	</View>
);

// ── Suit power block ──────────────────────────────────────────────────────────

const SUIT_META: Record<string, { symbol: string; color: string }> = {
	hearts:   { symbol: "♥", color: "#EF4444" },
	diamonds: { symbol: "♦", color: "#F59E0B" },
	clubs:    { symbol: "♣", color: "#4ADE80" },
	spades:   { symbol: "♠", color: "#60A5FA" },
};

const SuitBlock = ({
	suit,
	name,
	body,
}: {
	suit: keyof typeof SUIT_META;
	name: string;
	body: string;
}) => {
	const { symbol, color } = SUIT_META[suit];
	return (
		<View style={[styles.suitBlock, { borderLeftColor: color }]}>
			<View style={styles.suitBlockHeader}>
				<Text style={[styles.suitBlockSymbol, { color }]}>{symbol}</Text>
				<Text style={[styles.suitBlockName, { color }]}>{name}</Text>
			</View>
			<Text style={styles.suitBlockBody}>{body}</Text>
		</View>
	);
};

// ── Enemy stats table ─────────────────────────────────────────────────────────

const EnemyTable = ({
	header,
	rows,
}: {
	header: { enemy: string; atk: string; hp: string };
	rows: { enemy: string; atk: string; hp: string }[];
}) => (
	<View style={styles.table}>
		<View style={[styles.tableRow, styles.tableRowHeader]}>
			<Text style={[styles.tableCell, styles.tableCellHeader, { flex: 2 }]}>{header.enemy}</Text>
			<Text style={[styles.tableCell, styles.tableCellHeader, styles.tableCellCenter]}>{header.atk}</Text>
			<Text style={[styles.tableCell, styles.tableCellHeader, styles.tableCellRight]}>{header.hp}</Text>
		</View>
		{rows.map((r, i) => (
			<View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
				<Text style={[styles.tableCell, styles.tableCellBold, { flex: 2 }]}>{r.enemy}</Text>
				<Text style={[styles.tableCell, styles.tableCellCenter, styles.statAtk]}>{r.atk}</Text>
				<Text style={[styles.tableCell, styles.tableCellRight, styles.statHp]}>{r.hp}</Text>
			</View>
		))}
	</View>
);

// ── Defeat steps (I, II, III, IV) ─────────────────────────────────────────────

const ROMAN = ["I", "II", "III", "IV"];

const DefeatStepList = ({ steps }: { steps: string[] }) => (
	<View style={styles.defeatStepList}>
		{steps.map((s, i) => (
			<View key={i} style={styles.defeatStepRow}>
				<Text style={styles.defeatStepNum}>({ROMAN[i]})</Text>
				<Text style={styles.defeatStepText}>{s}</Text>
			</View>
		))}
	</View>
);

// ── Defeated enemy value table (J=10, Q=15, K=20) ────────────────────────────

const DefeatedValueTable = ({
	rows,
}: {
	rows: { rank: string; label: string; value: string }[];
}) => (
	<View style={styles.defeatedTable}>
		{rows.map((r, i) => (
			<View key={i} style={styles.defeatedRow}>
				<View style={styles.defeatedRankBadge}>
					<Text style={styles.defeatedRankText}>{r.rank}</Text>
				</View>
				<Text style={styles.defeatedLabel}>{r.label}</Text>
				<Text style={styles.defeatedValue}>{r.value}</Text>
			</View>
		))}
	</View>
);

// ── Communication examples ────────────────────────────────────────────────────

const CommExample = ({
	text,
	allowed,
}: {
	text: string;
	allowed: boolean;
}) => (
	<View style={[styles.commExample, allowed ? styles.commAllowed : styles.commForbidden]}>
		<Text style={[styles.commText, { color: allowed ? "#4ADE80" : "#F87171" }]}>{text}</Text>
	</View>
);

// ── Solo victory tiers ────────────────────────────────────────────────────────

const SoloTierList = ({
	tiers,
}: {
	tiers: { label: string; value: string }[];
}) => (
	<View style={styles.soloTierList}>
		{tiers.map((t, i) => (
			<View key={i} style={styles.soloTierRow}>
				<Text style={styles.soloTierLabel}>{t.label}</Text>
				<Text style={styles.soloTierValue}>{t.value}</Text>
			</View>
		))}
	</View>
);

// ── Screen ────────────────────────────────────────────────────────────────────

export const InstructionsScreen = () => {
	const { t } = useTranslation();
	const s = (key: string) => `instructions.sections.${key}`;

	const setupRows = t(`${s("setup")}.tableRows`, { returnObjects: true }) as {
		players: string; jesters: string; hand: string;
	}[];
	const setupHeader = t(`${s("setup")}.tableHeader`, { returnObjects: true }) as {
		players: string; jesters: string; hand: string;
	};
	const howToPlaySteps = t(`${s("howToPlay")}.steps`, { returnObjects: true }) as string[];

	const enemyRows = t(`${s("step3")}.enemyRows`, { returnObjects: true }) as {
		enemy: string; atk: string; hp: string;
	}[];
	const enemyHeader = t(`${s("step3")}.enemyHeader`, { returnObjects: true }) as {
		enemy: string; atk: string; hp: string;
	};
	const defeatSteps = t(`${s("step3")}.defeatSteps`, { returnObjects: true }) as string[];

	const defeatedRows = t(`${s("defeatedEnemy")}.tableRows`, { returnObjects: true }) as {
		rank: string; label: string; value: string;
	}[];

	const soloTiers = t(`${s("solo")}.tiers`, { returnObjects: true }) as {
		label: string; value: string;
	}[];

	const gameInfo = t("instructions.gameInfo", { returnObjects: true }) as {
		players: string; age: string; time: string;
	};

	return (
		<ImageBackground
			source={BG}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<ScreenHeader />

				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{/* ── Intro ── */}
					<View style={styles.introBlock}>
						<Image
							source={require("@/assets/images/crown.png")}
							style={styles.crownImage}
							resizeMode="contain"
						/>
						<Text style={styles.gameName}>{t("instructions.gameName")}</Text>
						<Text style={styles.gameSubtitle}>{t("instructions.gameSubtitle")}</Text>
						<View style={styles.gameInfoRow}>
							<View style={styles.gameInfoBadge}>
								<Text style={styles.gameInfoIcon}>👥</Text>
								<Text style={styles.gameInfoText}>{gameInfo.players}</Text>
							</View>
							<View style={styles.gameInfoBadge}>
								<Text style={styles.gameInfoIcon}>📅</Text>
								<Text style={styles.gameInfoText}>{gameInfo.age}</Text>
							</View>
							<View style={styles.gameInfoBadge}>
								<Text style={styles.gameInfoIcon}>⏱</Text>
								<Text style={styles.gameInfoText}>{gameInfo.time}</Text>
							</View>
						</View>
					</View>

					{/* ── Objetivo do Jogo ── */}
					<Section title={t(`${s("objective")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("objective")}.body`)}</Text>
					</Section>

					{/* ── Preparação ── */}
					<Section title={t(`${s("setup")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("setup")}.body`)}</Text>
						<SetupTable header={setupHeader} rows={setupRows} />
						<View style={styles.noteBlock}>
							<Text style={styles.noteText}>{t(`${s("setup")}.startNote`)}</Text>
						</View>
					</Section>

					{/* ── Como Jogar — 4 passos ── */}
					<Section title={t(`${s("howToPlay")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("howToPlay")}.intro`)}</Text>
						<Text style={styles.labelText}>{t(`${s("howToPlay")}.stepsLabel`)}</Text>
						<StepSummaryList steps={howToPlaySteps} />
					</Section>

					{/* ── Passo 1 ── */}
					<Section title={t(`${s("step1")}.title`)}>
						<Text style={styles.stepSubtitle}>{t(`${s("step1")}.subtitle`)}</Text>
						<Text style={styles.bodyText}>{t(`${s("step1")}.body`)}</Text>
					</Section>

					{/* ── Passo 2 — Poderes dos Naipes ── */}
					<Section title={t(`${s("step2")}.title`)}>
						<Text style={styles.stepSubtitle}>{t(`${s("step2")}.subtitle`)}</Text>
						<Text style={styles.bodyText}>{t(`${s("step2")}.intro`)}</Text>
						<Divider />
						{(["hearts", "diamonds", "clubs", "spades"] as const).map((suit) => (
							<SuitBlock
								key={suit}
								suit={suit}
								name={t(`${s("step2")}.suits.${suit}.name`)}
								body={t(`${s("step2")}.suits.${suit}.body`)}
							/>
						))}
						<View style={styles.noteBlock}>
							<Text style={styles.noteText}>{t(`${s("step2")}.note`)}</Text>
						</View>
					</Section>

					{/* ── Passo 3 — Dano e Derrota ── */}
					<Section title={t(`${s("step3")}.title`)}>
						<Text style={styles.stepSubtitle}>{t(`${s("step3")}.subtitle`)}</Text>
						<Text style={styles.bodyText}>{t(`${s("step3")}.body`)}</Text>
						<EnemyTable header={enemyHeader} rows={enemyRows} />
						<Text style={styles.labelText}>{t(`${s("step3")}.defeatTitle`)}</Text>
						<DefeatStepList steps={defeatSteps} />
					</Section>

					{/* ── Passo 4 ── */}
					<Section title={t(`${s("step4")}.title`)}>
						<Text style={styles.stepSubtitle}>{t(`${s("step4")}.subtitle`)}</Text>
						<Text style={styles.bodyText}>{t(`${s("step4")}.body`)}</Text>
					</Section>

					{/* ── Animais Companheiros ── */}
					<Section title={t(`${s("companions")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("companions")}.body`)}</Text>
					</Section>

					{/* ── Combinações ── */}
					<Section title={t(`${s("combos")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("combos")}.body`)}</Text>
					</Section>

					{/* ── Imunidade Inimiga ── */}
					<Section title={t(`${s("immunity")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("immunity")}.body`)}</Text>
					</Section>

					{/* ── Usando o Jóquer ── */}
					<Section title={t(`${s("jester")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("jester")}.body`)}</Text>
						<View style={styles.noteBlock}>
							<Text style={styles.noteText}>{t(`${s("jester")}.note`)}</Text>
						</View>
					</Section>

					{/* ── Aproveitando Inimigos Derrotados ── */}
					<Section title={t(`${s("defeatedEnemy")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("defeatedEnemy")}.body`)}</Text>
						<DefeatedValueTable rows={defeatedRows} />
					</Section>

					{/* ── Passar ── */}
					<Section title={t(`${s("pass")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("pass")}.body`)}</Text>
					</Section>

					{/* ── Comunicação ── */}
					<Section title={t(`${s("communication")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("communication")}.body`)}</Text>
						<CommExample text={t(`${s("communication")}.allowed`)} allowed />
						<CommExample text={t(`${s("communication")}.forbidden`)} allowed={false} />
					</Section>

					{/* ── Final do Jogo ── */}
					<Section title={t(`${s("endConditions")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("endConditions")}.body`)}</Text>
						<View style={styles.victoryBlock}>
							<Text style={styles.victoryTitle}>{t(`${s("endConditions")}.victoryTitle`)}</Text>
							<Text style={styles.endText}>{t(`${s("endConditions")}.victoryText`)}</Text>
						</View>
						<View style={styles.defeatBlock}>
							<Text style={styles.defeatTitle}>{t(`${s("endConditions")}.defeatTitle`)}</Text>
							<Text style={styles.endText}>{t(`${s("endConditions")}.defeatText`)}</Text>
						</View>
					</Section>

					{/* ── Jogo Solo ── */}
					<Section title={t(`${s("solo")}.title`)}>
						<Text style={styles.bodyText}>{t(`${s("solo")}.body`)}</Text>
						<Text style={styles.labelText}>{t(`${s("solo")}.tiersLabel`)}</Text>
						<SoloTierList tiers={soloTiers} />
					</Section>

					<View style={{ height: 32 }} />
				</ScrollView>
			</View>
		</ImageBackground>
	);
};
