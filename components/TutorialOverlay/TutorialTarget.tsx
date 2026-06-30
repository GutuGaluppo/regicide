import { useTutorialTargets } from "@/store/tutorialTargetStore";
import React, { useCallback, useEffect, useRef } from "react";
import {
	LayoutChangeEvent,
	StyleProp,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native";

type Props = {
	/** Identificador do alvo, lido pelo overlay (ex.: "tutorial-attack"). */
	id: string;
	/** Só mede/registra quando ativo (ex.: durante o tutorial), evitando custo. */
	active?: boolean;
	style?: StyleProp<ViewStyle>;
	/** Repassado ao View — útil ao usar como overlay de medição (ex.: "none"). */
	pointerEvents?: "auto" | "none" | "box-none" | "box-only";
	/** Ao mudar, força nova medição (ex.: trocar de passo após a animação assentar). */
	measureSignal?: unknown;
	/** Loga o retângulo medido em __DEV__ para validar measureInWindow. */
	debug?: boolean;
	children?: React.ReactNode;
};

/**
 * Envolve um elemento da UI e publica sua posição absoluta na janela em
 * `tutorialTargetStore` (via `measureInWindow`, suportado em nativo e web).
 * Re-mede em `onLayout` e quando as dimensões da janela mudam (rotação/resize).
 */
export const TutorialTarget = ({ id, active = true, style, pointerEvents, measureSignal, debug, children }: Props) => {
	const ref = useRef<View>(null);
	const setTarget = useTutorialTargets((s) => s.setTarget);
	const clearTarget = useTutorialTargets((s) => s.clearTarget);
	const { width, height } = useWindowDimensions();

	const measure = useCallback(() => {
		if (!active) return;
		const node = ref.current;
		if (!node) return;
		node.measureInWindow((x, y, w, h) => {
			if (w <= 0 || h <= 0) return;
			const rect = { x, y, width: w, height: h };
			if (debug && __DEV__) {
				console.log(`[TutorialTarget] ${id}`, rect);
			}
			setTarget(id, rect);
		});
	}, [active, debug, id, setTarget]);

	const handleLayout = useCallback(
		(_e: LayoutChangeEvent) => {
			measure();
		},
		[measure],
	);

	// Re-mede quando a janela muda de tamanho (web resize / rotação nativa) ou
	// quando o sinal externo muda (troca de passo, após assentar a animação).
	useEffect(() => {
		measure();
	}, [measure, width, height, measureSignal]);

	// Remove o registro ao desmontar ou ao desativar.
	useEffect(() => {
		if (!active) clearTarget(id);
		return () => clearTarget(id);
	}, [active, id, clearTarget]);

	return (
		<View
			ref={ref}
			style={style}
			pointerEvents={pointerEvents}
			collapsable={false}
			onLayout={handleLayout}
		>
			{children}
		</View>
	);
};
