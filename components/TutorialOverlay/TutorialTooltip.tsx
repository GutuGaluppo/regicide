import { TutorialRect } from "@/store/tutorialTargetStore";
import React, { useState } from "react";
import {
	Image,
	ImageSourcePropType,
	LayoutChangeEvent,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles as base } from "./TutorialOverlay.styles";

/** Espaço entre o recorte e o balão (acompanha o padding do SpotlightOverlay). */
const SPOT_PAD = 8;
const GAP = 14;
const EDGE = 16;
const MAX_WIDTH = 340;

type Props = {
	rect?: TutorialRect;
	title: string;
	body: string;
	/** Ícone ilustrativo exibido acima do título (ex.: botão referido no passo). */
	icon?: ImageSourcePropType;
	/** Indicador de progresso, ex.: "3 / 18". */
	progress?: string;
	primaryLabel?: string;
	onPrimary?: () => void;
	skipLabel?: string;
	onSkip?: () => void;
};

/**
 * Balão de texto do tutorial, ancorado ao alvo destacado. Posiciona-se abaixo
 * do recorte quando há espaço, senão acima; centraliza no alvo com clamp às
 * bordas. Sem `rect` (boas-vindas/conclusão), aparece centralizado na tela.
 */
export const TutorialTooltip = ({
	rect,
	title,
	body,
	icon,
	progress,
	primaryLabel,
	onPrimary,
	skipLabel,
	onSkip,
}: Props) => {
	const { width: W, height: H } = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const [size, setSize] = useState({ width: 0, height: 0 });

	const onLayout = (e: LayoutChangeEvent) => {
		const { width, height } = e.nativeEvent.layout;
		if (width !== size.width || height !== size.height) setSize({ width, height });
	};

	const card = (
		<View style={[styles.card, !rect && styles.cardCentered]} onLayout={onLayout}>
			{icon && (
				<Image source={icon} style={styles.icon} resizeMode="contain" />
			)}
			<View style={base.panelHeader}>
				<Text style={base.panelTitle}>{title}</Text>
				{onSkip && (
					<TouchableOpacity style={base.skipBtn} onPress={onSkip}>
						<Text style={base.skipText}>{skipLabel}</Text>
					</TouchableOpacity>
				)}
			</View>
			<Text style={base.panelBody}>{body}</Text>
			{primaryLabel && onPrimary && (
				<TouchableOpacity style={base.primaryBtn} onPress={onPrimary}>
					<Text style={base.primaryBtnText}>{primaryLabel}</Text>
				</TouchableOpacity>
			)}
			{progress && <Text style={styles.progress}>{progress}</Text>}
		</View>
	);

	// Sem alvo: balão centralizado.
	if (!rect) {
		return (
			<View style={[styles.centerWrap, styles.root]} pointerEvents="box-none">
				{card}
			</View>
		);
	}

	const holeTop = rect.y - SPOT_PAD;
	const holeBottom = rect.y + rect.height + SPOT_PAD;
	const centerX = rect.x + rect.width / 2;

	const placeBelow =
		holeBottom + GAP + size.height <= H - insets.bottom - EDGE || holeTop - GAP - size.height < insets.top + EDGE;

	const top = placeBelow ? holeBottom + GAP : holeTop - GAP - size.height;
	const left = Math.max(
		insets.left + EDGE,
		Math.min(centerX - size.width / 2, W - insets.right - EDGE - size.width),
	);

	// Card posicionado diretamente (sem camada de tela cheia), para não cobrir
	// o buraco do spotlight e bloquear o toque no alvo no nativo. Invisível até
	// medir, para evitar "salto" de posição.
	return (
		<View
			style={[styles.anchor, styles.root, { top, left, opacity: size.height ? 1 : 0 }]}
			pointerEvents="box-none"
		>
			{card}
		</View>
	);
};

const styles = StyleSheet.create({
	// Acima do dim do spotlight (1000) e de views nativas com zIndex/elevation.
	root: {
		zIndex: 1001,
		elevation: 1001,
	},
	anchor: {
		position: "absolute",
		maxWidth: MAX_WIDTH,
	},
	centerWrap: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	card: {
		width: MAX_WIDTH,
		maxWidth: "100%",
		backgroundColor: "rgba(10, 7, 3, 0.98)",
		borderWidth: 1,
		borderColor: "rgba(232, 213, 163, 0.55)",
		borderRadius: 12,
		paddingHorizontal: 18,
		paddingTop: 14,
		paddingBottom: 12,
		gap: 6,
	},
	cardCentered: {
		maxWidth: 400,
	},
	progress: {
		fontFamily: "IMFellEnglish",
		fontSize: 12,
		color: "rgba(148, 163, 184, 0.7)",
		textAlign: "center",
		marginTop: 2,
	},
	icon: {
		width: 30,
		height: 30,
		alignSelf: "center",
		marginBottom: 2,
	},
});
