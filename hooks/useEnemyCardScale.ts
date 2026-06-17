import { useMemo } from "react";

const MIN_SCALE = 0.72;
const MAX_SCALE = 1;
const DEFAULT_BOTTOM_GAP = 12;
const DEFAULT_WIDTH_GAP = 12;

const BASE = {
	cardWidth: 210,
	cardHeight: 320,
	borderRadius: 12,
	badgeOffset: 65,
	jesterOffset: 68,
	badgeTop: 20,
	badgeBottom: 20,
	badgeLabelGap: 4,
	badgeLabelFontSize: 13,
	ringSize: 80,
	ringStroke: 6,
	numberHeight: 32,
	shieldValueSize: 60,
	shieldNumberHeight: 20,
	shieldPileAnchorWidth: 50,
	shieldPileAnchorHeight: 66,
	shieldPileCardWidth: 50,
	shieldPileCardHeight: 66,
	shieldPileStep: 6,
	shieldPlaceholderIcon: 35,
	jesterStackWidth: 68,
	jesterStackHeight: 88,
} as const;

const ENVELOPE = {
	width: BASE.cardWidth + BASE.jesterOffset + BASE.badgeOffset,
	height: BASE.cardHeight,
} as const;

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const scaleInt = (value: number, scale: number, min: number) =>
	Math.max(min, Math.round(value * scale));

export type EnemyCardLayout = {
	scale: number;
	cardWidth: number;
	cardHeight: number;
	borderRadius: number;
	badgeOffset: number;
	jesterOffset: number;
	badgeTop: number;
	badgeBottom: number;
	badgeLabelGap: number;
	badgeLabelFontSize: number;
	ringSize: number;
	ringStroke: number;
	numberHeight: number;
	shieldValueSize: number;
	shieldNumberHeight: number;
	shieldPileAnchorWidth: number;
	shieldPileAnchorHeight: number;
	shieldPileCardWidth: number;
	shieldPileCardHeight: number;
	shieldPileStep: number;
	shieldPlaceholderIcon: number;
	jesterStackWidth: number;
	jesterStackHeight: number;
};

export const getEnemyCardLayout = (scale: number): EnemyCardLayout => {
	const safeScale = clamp(scale, MIN_SCALE, MAX_SCALE);

	return {
		scale: safeScale,
		cardWidth: scaleInt(BASE.cardWidth, safeScale, 150),
		cardHeight: scaleInt(BASE.cardHeight, safeScale, 228),
		borderRadius: scaleInt(BASE.borderRadius, safeScale, 9),
		badgeOffset: scaleInt(BASE.badgeOffset, safeScale, 46),
		jesterOffset: scaleInt(BASE.jesterOffset, safeScale, 48),
		badgeTop: scaleInt(BASE.badgeTop, safeScale, 14),
		badgeBottom: scaleInt(BASE.badgeBottom, safeScale, 14),
		badgeLabelGap: scaleInt(BASE.badgeLabelGap, safeScale, 2),
		badgeLabelFontSize: scaleInt(BASE.badgeLabelFontSize, safeScale, 11),
		ringSize: scaleInt(BASE.ringSize, safeScale, 58),
		ringStroke: scaleInt(BASE.ringStroke, safeScale, 4),
		numberHeight: scaleInt(BASE.numberHeight, safeScale, 24),
		shieldValueSize: scaleInt(BASE.shieldValueSize, safeScale, 42),
		shieldNumberHeight: scaleInt(BASE.shieldNumberHeight, safeScale, 15),
		shieldPileAnchorWidth: scaleInt(BASE.shieldPileAnchorWidth, safeScale, 36),
		shieldPileAnchorHeight: scaleInt(BASE.shieldPileAnchorHeight, safeScale, 48),
		shieldPileCardWidth: scaleInt(BASE.shieldPileCardWidth, safeScale, 36),
		shieldPileCardHeight: scaleInt(BASE.shieldPileCardHeight, safeScale, 48),
		shieldPileStep: scaleInt(BASE.shieldPileStep, safeScale, 4),
		shieldPlaceholderIcon: scaleInt(BASE.shieldPlaceholderIcon, safeScale, 24),
		jesterStackWidth: scaleInt(BASE.jesterStackWidth, safeScale, 48),
		jesterStackHeight: scaleInt(BASE.jesterStackHeight, safeScale, 62),
	};
};

type UseEnemyCardScaleOptions = {
	containerWidth: number;
	containerHeight: number;
	topReserved: number;
	horizontalPadding?: number;
	widthReserve?: number;
	bottomGap?: number;
	widthGap?: number;
};

export const useEnemyCardScale = ({
	containerWidth,
	containerHeight,
	topReserved,
	horizontalPadding = 0,
	widthReserve = 0,
	bottomGap = DEFAULT_BOTTOM_GAP,
	widthGap = DEFAULT_WIDTH_GAP,
}: UseEnemyCardScaleOptions) =>
	useMemo(() => {
		if (containerWidth <= 0 || containerHeight <= 0) {
			return {
				scale: MAX_SCALE,
				layout: getEnemyCardLayout(MAX_SCALE),
				minScaleReached: false,
				compactHand: false,
			};
		}

		const availableWidth = Math.max(
			0,
			containerWidth - horizontalPadding * 2 - widthReserve - widthGap,
		);
		const availableHeight = Math.max(0, containerHeight - topReserved - bottomGap);

		const rawScale = Math.min(
			availableWidth > 0 ? availableWidth / ENVELOPE.width : MAX_SCALE,
			availableHeight > 0 ? availableHeight / ENVELOPE.height : MAX_SCALE,
			MAX_SCALE,
		);
		const scale = clamp(rawScale, MIN_SCALE, MAX_SCALE);

		return {
			scale,
			layout: getEnemyCardLayout(scale),
			minScaleReached: scale <= MIN_SCALE + 0.001,
			compactHand: rawScale < 0.9 || availableHeight < ENVELOPE.height * 0.88,
		};
	}, [
		bottomGap,
		containerHeight,
		containerWidth,
		horizontalPadding,
		topReserved,
		widthGap,
		widthReserve,
	]);
