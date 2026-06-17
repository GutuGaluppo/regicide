import { useEffect, useRef } from "react";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { ChipRect } from "../types";

const SPRING = { damping: 16, stiffness: 180, mass: 0.6 } as const;

type Options = {
	// Id do jogador atualmente ativo (recebe o destaque do blob).
	activeId: string | null;
};

/**
 * Anima o "blob" deslizante do HUD: desliza (translateX) e redimensiona (width)
 * até o chip do jogador ativo, com mola elástica — espelhando a menubar de
 * referência. O primeiro posicionamento é instantâneo (sem deslize) para não
 * "voar" da origem na montagem; as trocas de turno seguintes são animadas.
 */
export const useBlobIndicator = ({ activeId }: Options) => {
	const rects = useRef<Record<string, ChipRect>>({});
	const settled = useRef(false);

	const x = useSharedValue(0);
	const w = useSharedValue(0);
	const opacity = useSharedValue(0);

	const apply = (animate: boolean) => {
		const rect = activeId ? rects.current[activeId] : undefined;
		if (!rect) {
			opacity.value = withTiming(0, { duration: 120 });
			return;
		}
		if (animate && settled.current) {
			x.value = withSpring(rect.x, SPRING);
			w.value = withSpring(rect.width, SPRING);
		} else {
			x.value = rect.x;
			w.value = rect.width;
			settled.current = true;
		}
		opacity.value = withTiming(1, { duration: 180 });
	};

	// Reposiciona quando o item ativo muda (deslize animado).
	useEffect(() => {
		apply(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeId]);

	// Chamado pelos chips no onLayout; reposiciona o blob se quem mudou foi o ativo.
	const measure = (id: string, rect: ChipRect) => {
		const prev = rects.current[id];
		rects.current[id] = rect;
		if (id === activeId && (!prev || prev.x !== rect.x || prev.width !== rect.width)) {
			apply(settled.current);
		}
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: x.value }],
		width: w.value,
		opacity: opacity.value,
	}));

	return { animatedStyle, measure };
};
