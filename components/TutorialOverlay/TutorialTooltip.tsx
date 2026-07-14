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

/** Espaço entre o recorte e o balão (acompanha o padding do SpotlightOverlay). */
const SPOT_PAD = 8;
const GAP = 14;
const EDGE = 16;
const MAX_WIDTH = 340;

// ── Tema "Arcano" — teal escuro, menta luminosa e acento violeta ──
const COLORS = {
	card: "rgba(14, 31, 28, 0.98)",
	border: "rgba(95, 208, 176, 0.5)",
	glow: "#5FD0B0",
	title: "#7CE0C0",
	body: "#C7D8D2",
	skip: "#6E8C84",
	progress: "rgba(124, 224, 192, 0.55)",
	btn: "rgba(109, 74, 160, 0.55)",
	btnBorder: "rgba(155, 123, 208, 0.9)",
	btnText: "#E6FBF2",
	// Secundário ("Voltar"): sem preenchimento, para não competir com o primário.
	backBtnBorder: "rgba(95, 208, 176, 0.45)",
	backBtnText: "#8FBFB2",
};

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
	/** Volta ao passo anterior; ausente quando não há passo para revisar. */
	backLabel?: string;
	onBack?: () => void;
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
	backLabel,
	onBack,
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

	// Ancorado, o card fica em um pai de largura automática — `maxWidth: "100%"`
	// não tem contra o que resolver e a largura fixa vazaria em telas estreitas.
	const cardWidth = Math.min(
		MAX_WIDTH,
		W - insets.left - insets.right - EDGE * 2,
	);

	const showPrimary = !!primaryLabel && !!onPrimary;
	const showBack = !!backLabel && !!onBack;

	const card = (
		<View
			style={[styles.card, { width: cardWidth }, !rect && styles.cardCentered]}
			onLayout={onLayout}
		>
			{icon && (
				<Image source={icon} style={styles.icon} resizeMode="contain" />
			)}
			<View style={styles.header}>
				<Text style={styles.title}>{title}</Text>
				{onSkip && (
					<TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
						<Text style={styles.skipText}>{skipLabel}</Text>
					</TouchableOpacity>
				)}
			</View>
			<Text style={styles.body}>{body}</Text>
			{(showBack || showPrimary) && (
				<View style={styles.actions}>
					{showBack && (
						<TouchableOpacity
							style={[styles.backBtn, !showPrimary && styles.actionAlone]}
							onPress={onBack}
							accessibilityRole="button"
						>
							<Text style={styles.backBtnText}>{backLabel}</Text>
						</TouchableOpacity>
					)}
					{showPrimary && (
						<TouchableOpacity
							style={[styles.primaryBtn, !showBack && styles.actionAlone]}
							onPress={onPrimary}
							accessibilityRole="button"
						>
							<Text style={styles.primaryBtnText}>{primaryLabel}</Text>
						</TouchableOpacity>
					)}
				</View>
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
		backgroundColor: COLORS.card,
		borderWidth: 1.5,
		borderColor: COLORS.border,
		borderRadius: 14,
		paddingHorizontal: 18,
		paddingTop: 14,
		paddingBottom: 12,
		gap: 7,
		// Brilho arcano suave (iOS); Android usa a elevation do root.
		shadowColor: COLORS.glow,
		shadowOpacity: 0.3,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 0 },
	},
	cardCentered: {
		maxWidth: 400,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 8,
	},
	title: {
		flex: 1,
		fontFamily: "Cinzel",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 1.8,
		textTransform: "uppercase",
		color: COLORS.title,
	},
	body: {
		fontFamily: "IMFellEnglish",
		fontSize: 15,
		lineHeight: 22,
		color: COLORS.body,
	},
	skipBtn: {
		paddingHorizontal: 4,
		paddingVertical: 2,
	},
	skipText: {
		fontFamily: "IMFellEnglish-Italic",
		fontSize: 13,
		color: COLORS.skip,
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 6,
	},
	// Sozinho na linha, o botão ocupa a largura toda (como era antes do "Voltar").
	actionAlone: {
		flex: 1,
	},
	primaryBtn: {
		flex: 2,
		backgroundColor: COLORS.btn,
		borderWidth: 1,
		borderColor: COLORS.btnBorder,
		borderRadius: 9,
		paddingVertical: 11,
		alignItems: "center",
	},
	backBtn: {
		flex: 1,
		borderWidth: 1,
		borderColor: COLORS.backBtnBorder,
		borderRadius: 9,
		paddingVertical: 11,
		paddingHorizontal: 8,
		alignItems: "center",
	},
	backBtnText: {
		fontFamily: "Cinzel",
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 1.2,
		textTransform: "uppercase",
		color: COLORS.backBtnText,
	},
	primaryBtnText: {
		fontFamily: "Cinzel",
		fontSize: 14,
		fontWeight: "700",
		letterSpacing: 1.5,
		textTransform: "uppercase",
		color: COLORS.btnText,
	},
	progress: {
		fontFamily: "Cinzel",
		fontSize: 11,
		letterSpacing: 1,
		color: COLORS.progress,
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
