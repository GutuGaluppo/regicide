import { getHandCardImage } from "@/data/images";
import { Card, RevealState } from "@/data/types";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface Props {
	reveal: RevealState;
}

// Carta em tamanho fixo (pequeno) para o painel — face para cima, sem corte.
const RevealCard = ({ card }: { card: Card }) => {
	const img = getHandCardImage(card.rank, card.suit, card.id);
	if (!img) return null;
	return <Image source={img} style={styles.card} contentFit="contain" />;
};

// Sobreposição da janela de revelação entre turnos (Estratégia B). Enquanto
// ativa, o turno está congelado: mostra as cartas de ataque e descarte do
// jogador que acabou de jogar, com um contador regressivo. O turno avança
// automaticamente ao fim da contagem (ver docs/turn-reveal-delay-strategy.md).
export const TurnRevealOverlay = ({ reveal }: Props) => {
	const { t } = useTranslation();

	const remainingMs = () =>
		Math.max(0, reveal.startedAt + reveal.durationMs - Date.now());
	const [remaining, setRemaining] = useState(remainingMs);

	useEffect(() => {
		setRemaining(remainingMs());
		const id = setInterval(() => setRemaining(remainingMs()), 250);
		return () => clearInterval(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reveal.startedAt]);

	const seconds = Math.ceil(remaining / 1000);
	const hasAttack = reveal.attackCards.length > 0;
	const hasDiscard = reveal.discardCards.length > 0;
	const yieldedOnly = reveal.yielded && !hasAttack && !hasDiscard;

	return (
		<View style={styles.backdrop} pointerEvents="auto">
			<View style={styles.panel}>
				<Text style={styles.title} numberOfLines={1}>
					{reveal.byPlayerName}
				</Text>
				{reveal.defeatedEnemy && (
					<Text style={styles.defeated}>{t("multiplayer.reveal.defeated")}</Text>
				)}

				{yieldedOnly && (
					<Text style={styles.yielded}>{t("multiplayer.reveal.yielded")}</Text>
				)}

				{hasAttack && (
					<View style={[styles.section, styles.attackSection]}>
						<View style={styles.sectionHeader}>
							<View style={[styles.accent, styles.attackAccent]} />
							<Text style={[styles.sectionLabel, styles.attackLabel]}>
								{t("multiplayer.reveal.attackedWith")}
							</Text>
						</View>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.cardsRow}
						>
							{reveal.attackCards.map((card) => (
								<RevealCard key={card.id} card={card} />
							))}
						</ScrollView>
					</View>
				)}

				{hasDiscard && (
					<View style={[styles.section, styles.defenseSection]}>
						<View style={styles.sectionHeader}>
							<View style={[styles.accent, styles.defenseAccent]} />
							<Text style={[styles.sectionLabel, styles.defenseLabel]}>
								{t("multiplayer.reveal.defended")}
							</Text>
						</View>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.cardsRow}
						>
							{reveal.discardCards.map((card) => (
								<RevealCard key={card.id} card={card} />
							))}
						</ScrollView>
					</View>
				)}

				<Text style={styles.countdown}>
					{t("multiplayer.reveal.nextIn", { seconds })}
				</Text>
			</View>
		</View>
	);
};

const CARD_W = 46;
const CARD_H = 64;

const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(6,6,12,0.78)",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		zIndex: 50,
	},
	panel: {
		width: "100%",
		maxWidth: 460,
		backgroundColor: "rgba(18,18,28,0.96)",
		borderRadius: 18,
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.25)",
		paddingVertical: 20,
		paddingHorizontal: 18,
		gap: 14,
	},
	title: {
		fontFamily: "Cinzel",
		fontSize: 18,
		color: "#F8E7BC",
		textAlign: "center",
	},
	defeated: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#4ADE80",
		textAlign: "center",
		marginTop: -8,
	},
	yielded: {
		fontFamily: "IMFellEnglish",
		fontSize: 14,
		color: "#94A3B8",
		textAlign: "center",
		marginTop: -4,
	},
	section: {
		gap: 8,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderWidth: 1,
	},
	attackSection: {
		backgroundColor: "rgba(248,113,113,0.08)",
		borderColor: "rgba(248,113,113,0.28)",
	},
	defenseSection: {
		backgroundColor: "rgba(96,165,250,0.08)",
		borderColor: "rgba(96,165,250,0.28)",
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	accent: {
		width: 4,
		height: 16,
		borderRadius: 2,
	},
	attackAccent: {
		backgroundColor: "#F87171",
	},
	defenseAccent: {
		backgroundColor: "#60A5FA",
	},
	sectionLabel: {
		fontFamily: "Cinzel",
		fontSize: 15,
		letterSpacing: 0.5,
		fontWeight: "700",
	},
	attackLabel: {
		color: "#FCA5A5",
	},
	defenseLabel: {
		color: "#93C5FD",
	},
	cardsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingVertical: 2,
	},
	card: {
		width: CARD_W,
		height: CARD_H,
	},
	countdown: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#94A3B8",
		textAlign: "center",
		marginTop: 4,
	},
});
