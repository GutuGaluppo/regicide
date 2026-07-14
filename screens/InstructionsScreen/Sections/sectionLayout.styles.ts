import { StyleSheet } from "react-native";

/**
 * Layout compartilhado das seções em duas colunas (texto + tabela/quadro).
 *
 * Lado a lado (tablet/desktop) as colunas dividem a largura pela proporção de
 * `columnFlex`. Empilhadas (telas estreitas) elas precisam de `stretch`: com
 * `flex-start` no eixo cruzado a coluna se dimensiona pelo conteúdo e o texto
 * acaba desenhado para fora da caixa da seção.
 */
export const sectionLayout = StyleSheet.create({
	content: {
		width: "100%",
		gap: 16,
	},
	contentRow: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	contentColumn: {
		flexDirection: "column",
		alignItems: "stretch",
	},
	column: {
		minWidth: 0,
		alignSelf: "stretch",
	},
});

/** A proporção só existe no layout lado a lado; empilhado, a coluna é 100%. */
export const columnFlex = (ratio: number, isRow: boolean) =>
	isRow ? { flex: ratio } : null;
