import { TutorialRect } from "@/store/tutorialTargetStore";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const DIM = "rgba(8,8,14,0.78)";
const RING = "rgba(232,213,163,0.95)";
const DEFAULT_PADDING = 8;
const DEFAULT_RADIUS = 14;

type Props = {
	/** Retângulo do alvo (janela). Ausente → escurece tudo sem recorte. */
	rect?: TutorialRect;
	/** Toque fora do alvo (nos retângulos de escurecimento). */
	onPressOutside?: () => void;
	/**
	 * Se o alvo destacado pode ser tocado. Em passos informativos (`false`), um
	 * bloqueador transparente cobre o buraco para não disparar a ação do elemento
	 * (ex.: ordenar a mão). Nos passos de prática (`true`), o buraco fica livre.
	 */
	interactive?: boolean;
	padding?: number;
	radius?: number;
};

const noop = () => {};

/**
 * Escurece a tela ao redor do alvo e deixa o recorte (buraco) totalmente
 * vazio, guiado por um anel pulsante. O escurecimento é feito por quatro
 * retângulos ao redor do buraco (não uma camada de tela cheia), para que o
 * toque no buraco alcance o elemento por baixo — inclusive no Android, onde
 * uma view de tela cheia com `elevation` interceptaria o toque mesmo com
 * `box-none`. A `elevation` fica só nas peças visíveis, nunca sobre o buraco.
 */
export const SpotlightOverlay = ({
	rect,
	onPressOutside = noop,
	interactive = true,
	padding = DEFAULT_PADDING,
	radius = DEFAULT_RADIUS,
}: Props) => {
	const { width: W, height: H } = useWindowDimensions();
	const pulse = useSharedValue(0);

	useEffect(() => {
		pulse.value = withRepeat(
			withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
			-1,
			true,
		);
	}, [pulse]);

	const ringStyle = useAnimatedStyle(() => ({
		opacity: 0.35 + pulse.value * 0.5,
		transform: [{ scale: 1 + pulse.value * 0.06 }],
	}));

	// Sem alvo medido: escurece tudo e bloqueia a tela inteira.
	if (!rect) {
		return (
			<View style={StyleSheet.absoluteFill} pointerEvents="box-none">
				<Pressable
					style={[StyleSheet.absoluteFill, styles.dim, styles.elevated]}
					onPress={onPressOutside}
					accessibilityElementsHidden
				/>
			</View>
		);
	}

	const left = rect.x - padding;
	const top = rect.y - padding;
	const holeW = rect.width + padding * 2;
	const holeH = rect.height + padding * 2;
	const right = left + holeW;
	const bottom = top + holeH;

	return (
		<View style={StyleSheet.absoluteFill} pointerEvents="box-none">
			{/* Quatro faixas de escurecimento ao redor do buraco. O buraco fica
			    vazio (sem view), então o toque passa para o alvo por baixo. */}
			<Pressable
				style={[styles.dim, styles.elevated, { left: 0, top: 0, width: W, height: Math.max(0, top) }]}
				onPress={onPressOutside}
			/>
			<Pressable
				style={[styles.dim, styles.elevated, { left: 0, top: bottom, width: W, height: Math.max(0, H - bottom) }]}
				onPress={onPressOutside}
			/>
			<Pressable
				style={[styles.dim, styles.elevated, { left: 0, top, width: Math.max(0, left), height: holeH }]}
				onPress={onPressOutside}
			/>
			<Pressable
				style={[styles.dim, styles.elevated, { left: right, top, width: Math.max(0, W - right), height: holeH }]}
				onPress={onPressOutside}
			/>

			{/* Passo informativo: bloqueia o toque no alvo (sem disparar sua ação). */}
			{!interactive && (
				<Pressable
					style={[styles.elevated, { position: "absolute", left, top, width: holeW, height: holeH }]}
					onPress={onPressOutside}
				/>
			)}

			{/* Anel pulsante ao redor do alvo (não captura toque). */}
			<Animated.View
				pointerEvents="none"
				style={[
					styles.ring,
					styles.elevated,
					ringStyle,
					{ left, top, width: holeW, height: holeH, borderRadius: radius },
				]}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	// Acima de tudo, inclusive views nativas com zIndex/elevation (ex.: baralho).
	// Aplicado só nas peças visíveis — nunca numa camada sobre o buraco.
	elevated: {
		zIndex: 1000,
		elevation: 1000,
	},
	dim: {
		position: "absolute",
		backgroundColor: DIM,
	},
	ring: {
		position: "absolute",
		borderWidth: 2,
		borderColor: RING,
	},
});
