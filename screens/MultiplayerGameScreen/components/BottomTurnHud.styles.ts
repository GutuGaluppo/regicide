import { StyleSheet } from "react-native";

// Tamanho dos avatares no HUD — o jogador ativo é levemente maior.
export const AVATAR_SIZE = 28;
export const AVATAR_SIZE_ACTIVE = 46;

// HUD de turno no estilo "menubar": barra inferior cheia (largura total), com os
// avatares distribuídos e um blob/halo deslizante sob o jogador ativo. Paleta do
// jogo: escuro + dourado/pergaminho, com a cor do jogador ativo como acento.
export const styles = StyleSheet.create({
	// Ocupa toda a largura, encostada na base.
	wrap: {
		width: "100%",
	},
	// Barra cheia (sem margens laterais) — só um leve arredondado no topo.
	// overflow visível para o avatar ativo (maior) "saltar" acima da barra.
	bar: {
		width: "100%",
		backgroundColor: "rgba(10,10,18,0.92)",
		borderTopWidth: 1,
		borderTopColor: "rgba(232,213,163,0.18)",
		// borderTopLeftRadius: 18,
		// borderTopRightRadius: 18,
		paddingTop: 8,
		overflow: "visible",
	},
	// Trilha: jogadores à esquerda (espalhados) e chat fixo à direita; os itens
	// alinham pela base para o avatar ativo (mais alto) transbordar para cima.
	track: {
		flexDirection: "row",
		alignItems: "flex-end",
		paddingHorizontal: 10,
		gap: 8,
		overflow: "visible",
	},
	// Faixa dos jogadores (ocupa o espaço livre; o chat fica depois, à direita).
	playersRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-evenly",
		height: AVATAR_SIZE,
		position: "relative",
		overflow: "visible",
	},

	// ── Blob/halo deslizante (destaque do jogador ativo) ──────────────────────
	// Ancorado pela base e com a altura do avatar ativo, sobe junto com ele.
	blobWrap: {
		position: "absolute",
		bottom: 0,
		left: 0,
		height: AVATAR_SIZE_ACTIVE,
	},
	// Halo translúcido (o "ripple" da referência), na cor do jogador.
	blobHalo: {
		position: "absolute",
		top: -5,
		bottom: -5,
		left: -7,
		right: -7,
		borderRadius: 999,
		opacity: 0.2,
	},

	// ── Avatar de cada jogador ────────────────────────────────────────────────
	chip: {
		alignItems: "center",
		justifyContent: "center",
	},
	// Véu escuro sobre o avatar em espera (sem anel, fundo mais escuro).
	waitingScrim: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(2,6,23,0.5)",
	},

	// ── Badge de contagem de cartas (canto superior direito) ──────────────────
	cardsPill: {
		position: "absolute",
		top: -5,
		right: -7,
		minWidth: 16,
		paddingHorizontal: 4,
		paddingVertical: 1,
		borderRadius: 999,
		backgroundColor: "rgba(10,10,18,0.95)",
		borderWidth: 1,
		borderColor: "rgba(148,163,184,0.35)",
		alignItems: "center",
		justifyContent: "center",
	},
	cardsPillActive: {
		borderColor: "rgba(232,213,163,0.6)",
		backgroundColor: "rgba(10,10,18,0.98)",
	},
	cardsText: {
		fontFamily: "Cinzel",
		fontSize: 9,
		lineHeight: 12,
		color: "#93a7c3",
		textAlign: "center",
	},
	cardsTextActive: {
		color: "#F8E7BC",
	},

	// ── Botão de chat (encaixado na barra como um avatar) ─────────────────────
	chatBtn: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(232,213,163,0.08)",
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.22)",
	},
	chatBadge: {
		position: "absolute",
		top: -5,
		right: -6,
		minWidth: 16,
		height: 16,
		paddingHorizontal: 3,
		borderRadius: 999,
		backgroundColor: "#EF4444",
		alignItems: "center",
		justifyContent: "center",
	},
	chatBadgeText: {
		fontFamily: "Cinzel",
		fontSize: 9,
		lineHeight: 12,
		color: "#fff",
		fontWeight: "700",
	},
});
