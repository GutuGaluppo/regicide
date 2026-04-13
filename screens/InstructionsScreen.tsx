// /screens/InstructionsScreen.tsx
import { router } from "expo-router";
import React from "react";
import {
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const BG = require("../assets/backgrounds/bg_cave.webp");

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
	suit,
	symbol,
	color,
	name,
	power,
}: {
	suit: string;
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
			<Text style={styles.enemyImmunity}>Imune a: {immunity}</Text>
		</View>
	</View>
);

export const InstructionsScreen = () => {
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
						<Text style={styles.backText}>← Voltar</Text>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Como Jogar</Text>
					<View style={{ width: 60 }} />
				</View>

				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{/* Logo / intro */}
					<View style={styles.introBlock}>
						<Image
							source={require("../assets/images/crown.png")}
							style={styles.crownImage}
							resizeMode="contain"
						/>
						<Text style={styles.gameName}>REGICIDE</Text>
						<Text style={styles.gameSubtitle}>
							Um jogo cooperativo para 1–4 jogadores
						</Text>
					</View>

					{/* Objetivo */}
					<Section title="Objetivo">
						<Text style={styles.bodyText}>
							Os jogadores devem trabalhar juntos para derrotar todos os 12 nobres
							do castelo — 4 Valetes, 4 Rainhas e 4 Reis — antes que o baralho
							acabe ou a mão dos jogadores esvazie sem poder agir.
						</Text>
					</Section>

					{/* Preparação */}
					<Section title="Preparação">
						<Text style={styles.bodyText}>
							Separe os 12 nobres (J, Q, K de cada naipe) formando o Castelo:
							embaralhe os Valetes e coloque-os no topo, depois as Rainhas, depois
							os Reis. As demais 40 cartas formam a Taverna (baralho dos
							jogadores). Compre 8 cartas para a mão inicial (7 se forem 2
							jogadores, 6 se forem 3, 5 se forem 4).
						</Text>
					</Section>

					{/* Turno */}
					<Section title="Estrutura de um Turno">
						<View style={styles.stepList}>
							{[
								{
									num: "1",
									title: "Jogar cartas",
									desc: 'Jogue 1 ou mais cartas com o mesmo valor ou um combo ("animal companheiro"). O valor total é o dano causado ao inimigo.',
								},
								{
									num: "2",
									title: "Ativar poderes",
									desc: "Cada naipe das cartas jogadas ativa um poder especial (ver tabela abaixo).",
								},
								{
									num: "3",
									title: "Sofrer dano",
									desc: "Se o inimigo não foi derrotado, os jogadores devem descartar cartas da mão equivalentes ao ataque do inimigo (reduzido pelo escudo de Espadas).",
								},
								{
									num: "4",
									title: "Comprar cartas",
									desc: "Ao final do turno, complete sua mão até o limite máximo.",
								},
							].map((step) => (
								<View key={step.num} style={styles.step}>
									<View style={styles.stepNum}>
										<Text style={styles.stepNumText}>{step.num}</Text>
									</View>
									<View style={styles.stepBody}>
										<Text style={styles.stepTitle}>{step.title}</Text>
										<Text style={styles.stepDesc}>{step.desc}</Text>
									</View>
								</View>
							))}
						</View>
					</Section>

					{/* Poderes dos naipes */}
					<Section title="Poderes dos Naipes">
						<View style={styles.suitList}>
							<SuitPower
								suit="hearts"
								symbol="♥"
								color="#EF4444"
								name="Copas — Cura"
								power="Retire cartas do descarte e recoloque-as na Taverna (embaralhe). Quantidade igual ao valor das cartas jogadas."
							/>
							<SuitPower
								suit="diamonds"
								symbol="♦"
								color="#F59E0B"
								name="Ouros — Compra"
								power="Compre cartas imediatamente. Quantidade igual ao valor das cartas jogadas."
							/>
							<SuitPower
								suit="clubs"
								symbol="♣"
								color="#4ADE80"
								name="Paus — Força dupla"
								power="O dano causado ao inimigo é dobrado para os outros poderes de Paus. Cartas de Paus contam em dobro no cálculo do dano total."
							/>
							<SuitPower
								suit="spades"
								symbol="♠"
								color="#60A5FA"
								name="Espadas — Escudo"
								power="Reduza o ataque do inimigo atual pelo valor das cartas de Espadas jogadas. O escudo acumula ao longo dos turnos."
							/>
						</View>
					</Section>

					{/* Imunidades */}
					<Section title="Imunidades dos Nobres">
						<Text style={styles.bodyText}>
							Cada nobre é imune ao naipe correspondente ao seu próprio naipe —
							cartas do mesmo naipe não causam dano nem ativam poderes contra ele.
							O Curinga (Jester) cancela a imunidade do inimigo atual por um
							turno.
						</Text>
						<View style={styles.immuneExamples}>
							{[
								{ symbol: "♥", color: "#EF4444", label: "Nobre de Copas ignora cartas de ♥" },
								{ symbol: "♦", color: "#F59E0B", label: "Nobre de Ouros ignora cartas de ♦" },
								{ symbol: "♣", color: "#4ADE80", label: "Nobre de Paus ignora cartas de ♣" },
								{ symbol: "♠", color: "#60A5FA", label: "Nobre de Espadas ignora cartas de ♠" },
							].map((item) => (
								<View key={item.symbol} style={styles.immuneRow}>
									<Text style={[styles.immuneSymbol, { color: item.color }]}>
										{item.symbol}
									</Text>
									<Text style={styles.immuneLabel}>{item.label}</Text>
								</View>
							))}
						</View>
					</Section>

					{/* Tabela de inimigos */}
					<Section title="Nobres do Castelo">
						<EnemyRow
							rank="J"
							label="Valete"
							hp={20}
							atk={10}
							immunity="naipe próprio"
						/>
						<EnemyRow
							rank="Q"
							label="Rainha"
							hp={30}
							atk={15}
							immunity="naipe próprio"
						/>
						<EnemyRow
							rank="K"
							label="Rei"
							hp={40}
							atk={20}
							immunity="naipe próprio"
						/>
					</Section>

					{/* Animal companions */}
					<Section title="Animais Companheiros (Combos)">
						<Text style={styles.bodyText}>
							Você pode jogar múltiplas cartas de uma vez se elas formarem um
							"animal companheiro" — combinações cujo valor somado não ultrapasse
							10, ou cartas de mesmo valor. O dano total é a soma de todas as
							cartas jogadas, e todos os poderes de naipe são ativados.
						</Text>
						<View style={styles.comboExamples}>
							<Row label="Ex: 4 + 6" value="= 10 de dano (ambos os naipes)" />
							<Row label="Ex: 3 + 3 + 3" value="= 9 de dano (mesmo valor)" />
							<Row label="Ex: A + A" value="= 2 de dano (mesmo valor)" />
						</View>
					</Section>

					{/* Derrota inimigo */}
					<Section title="Derrotando um Nobre">
						<Text style={styles.bodyText}>
							Quando o HP do nobre chega a zero (ou abaixo), ele é derrotado.
							Coloque as cartas jogadas contra ele embaixo da Taverna (não no
							descarte). Em seguida, vire o próximo nobre do Castelo e comece um
							novo combate.
						</Text>
					</Section>

					{/* Vitória e derrota */}
					<Section title="Vitória e Derrota">
						<View style={styles.endConditions}>
							<View style={styles.victoryBlock}>
								<Text style={styles.victoryTitle}>Vitória 👑</Text>
								<Text style={styles.endText}>
									Derrote todos os 12 nobres do Castelo.
								</Text>
							</View>
							<View style={styles.defeatBlock}>
								<Text style={styles.defeatTitle}>Derrota 💀</Text>
								<Text style={styles.endText}>
									Um jogador não consegue descartar cartas suficientes para cobrir
									o dano sofrido, ou precisa jogar uma carta e não tem nenhuma na
									mão.
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

const styles = StyleSheet.create({
	container: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.65)",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 52,
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	backBtn: { padding: 4, width: 60 },
	backText: { color: "#94A3B8", fontSize: 14 },
	headerTitle: {
		color: "#F1F5F9",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 20,
		fontWeight: "700",
	},
	scroll: { flex: 1 },
	scrollContent: {
		paddingHorizontal: 16,
		paddingBottom: 16,
		gap: 20,
	},

	// Intro
	introBlock: {
		alignItems: "center",
		paddingVertical: 20,
		gap: 6,
	},
	crownImage: {
		width: 64,
		height: 64,
		marginBottom: 4,
	},
	gameName: {
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 36,
		fontWeight: "900",
		color: "#FBBF24",
		letterSpacing: 6,
	},
	gameSubtitle: {
		color: "#94A3B8",
		fontSize: 13,
		letterSpacing: 0.5,
	},

	// Sections
	section: {
		backgroundColor: "rgba(15,23,42,0.75)",
		borderRadius: 14,
		padding: 16,
		gap: 12,
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.12)",
	},
	sectionTitle: {
		fontFamily: "IMFellEnglish-Regular",
		color: "#FBBF24",
		fontSize: 17,
		fontWeight: "700",
		letterSpacing: 0.5,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(251,191,36,0.2)",
		paddingBottom: 8,
	},
	bodyText: {
		color: "#CBD5E1",
		fontSize: 14,
		lineHeight: 22,
	},

	// Steps
	stepList: { gap: 12 },
	step: {
		flexDirection: "row",
		gap: 12,
		alignItems: "flex-start",
	},
	stepNum: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "rgba(251,191,36,0.2)",
		borderWidth: 1,
		borderColor: "#FBBF24",
		justifyContent: "center",
		alignItems: "center",
		flexShrink: 0,
	},
	stepNumText: {
		color: "#FBBF24",
		fontWeight: "700",
		fontSize: 13,
	},
	stepBody: { flex: 1, gap: 2 },
	stepTitle: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 14,
	},
	stepDesc: {
		color: "#94A3B8",
		fontSize: 13,
		lineHeight: 20,
	},

	// Suit powers
	suitList: { gap: 12 },
	suitRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
	},
	suitBadge: {
		width: 40,
		height: 40,
		borderRadius: 10,
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		flexShrink: 0,
	},
	suitSymbol: { fontSize: 20, fontWeight: "700" },
	suitInfo: { flex: 1, gap: 2 },
	suitName: { fontSize: 14, fontWeight: "700" },
	suitPower: { color: "#94A3B8", fontSize: 13, lineHeight: 19 },

	// Immunity examples
	immuneExamples: { gap: 6 },
	immuneRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	immuneSymbol: { fontSize: 18, fontWeight: "700", width: 24 },
	immuneLabel: { color: "#94A3B8", fontSize: 13 },

	// Enemy rows
	enemyRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 14,
		paddingVertical: 4,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(148,163,184,0.1)",
	},
	enemyRankBadge: {
		width: 36,
		height: 36,
		borderRadius: 8,
		backgroundColor: "rgba(251,191,36,0.15)",
		borderWidth: 1,
		borderColor: "rgba(251,191,36,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	enemyRankText: {
		color: "#FBBF24",
		fontFamily: "IMFellEnglish-Regular",
		fontSize: 18,
		fontWeight: "700",
	},
	enemyInfo: { flex: 1, gap: 2 },
	enemyLabel: { color: "#F1F5F9", fontWeight: "700", fontSize: 14 },
	enemyStats: { fontSize: 13 },
	statHp: { color: "#4ADE80" },
	statAtk: { color: "#FBBF24" },
	enemyImmunity: { color: "#64748B", fontSize: 12 },

	// Combo examples
	comboExamples: {
		gap: 6,
		backgroundColor: "rgba(0,0,0,0.25)",
		borderRadius: 8,
		padding: 10,
	},
	tableRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 3,
	},
	tableLabel: { color: "#CBD5E1", fontSize: 13 },
	tableValue: { color: "#94A3B8", fontSize: 13, flex: 1, textAlign: "right" },

	// End conditions
	endConditions: { gap: 10 },
	victoryBlock: {
		backgroundColor: "rgba(34,197,94,0.1)",
		borderRadius: 10,
		padding: 12,
		gap: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#22C55E",
	},
	victoryTitle: { color: "#22C55E", fontWeight: "700", fontSize: 15 },
	defeatBlock: {
		backgroundColor: "rgba(239,68,68,0.1)",
		borderRadius: 10,
		padding: 12,
		gap: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#EF4444",
	},
	defeatTitle: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
	endText: { color: "#CBD5E1", fontSize: 13, lineHeight: 20 },
});
