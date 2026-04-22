import { useAudio } from "@/contexts/AudioContext";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { JesterCard, JesterSwapAnimation } from "./JesterCard";
import { styles } from "./JesterStack.styles";

const JESTER_IMGS = [
	require("@/assets/game/cards/jester_1.png"),
	require("@/assets/game/cards/jester_2.png"),
] as const;

const CARD_OFFSETS = [
	// `order` is [back, front]. The front card sits slightly forward/down-right.
	{ x: 0, y: 0 },
	{ x: 7, y: 7 },
] as const;

type ActiveSwap = {
	id: number;
	frontCardId: number;
	backCardId: number;
	trigger: "manual" | "auto";
	signal?: number;
};

const buildStackSnapshot = (jestersUsed: number) => {
	if (jestersUsed <= 0) {
		return {
			// `order` is always [back, front]. Jester 1 starts on top.
			order: [1, 0] as [number, number],
			backMap: { 0: false, 1: false } as Record<number, boolean>,
		};
	}

	if (jestersUsed === 1) {
		return {
			// After using Jester 1, it flips to the back and Jester 2 stays on top.
			order: [0, 1] as [number, number],
			backMap: { 0: true, 1: false } as Record<number, boolean>,
		};
	}

	return {
		// After the second use, both are face-down again; keep the last-used card back.
		order: [1, 0] as [number, number],
		backMap: { 0: true, 1: true } as Record<number, boolean>,
	};
};

export const JesterStack = ({
	jestersAvailable,
	jestersUsed,
	jesterActive,
	autoUseSignal,
	onUseJester,
	onAutoUseComplete,
	onAnimationStateChange,
}: {
	jestersAvailable: number;
	jestersUsed: number;
	jesterActive: boolean;
	autoUseSignal?: number;
	onUseJester?: () => void;
	onAutoUseComplete?: (signal: number) => void;
	onAnimationStateChange?: (isAnimating: boolean) => void;
}) => {
	const { playTap } = useAudio();
	const snapshot = useMemo(() => buildStackSnapshot(jestersUsed), [jestersUsed]);
	const [order, setOrder] = useState<[number, number]>(snapshot.order);
	const [backMap, setBackMap] = useState<Record<number, boolean>>(snapshot.backMap);
	const [activeSwap, setActiveSwap] = useState<ActiveSwap | null>(null);
	const actionIdRef = useRef(0);
	const isAnimatingRef = useRef(false);
	const activeSwapRef = useRef<ActiveSwap | null>(null);
	const lastAutoUseSignalRef = useRef(0);

	useEffect(() => {
		if (isAnimatingRef.current) return;
		setOrder(snapshot.order);
		setBackMap(snapshot.backMap);
	}, [snapshot]);

	const visibleOrder = activeSwap ? order : snapshot.order;
	const visibleBackMap = activeSwap ? backMap : snapshot.backMap;

	const startSwap = (trigger: ActiveSwap["trigger"], signal?: number) => {
		if (isAnimatingRef.current) return;
		const nextSwap: ActiveSwap = {
			id: actionIdRef.current + 1,
			backCardId: visibleOrder[0],
			frontCardId: visibleOrder[1],
			trigger,
			signal,
		};

		actionIdRef.current = nextSwap.id;
		activeSwapRef.current = nextSwap;
		isAnimatingRef.current = true;
		setOrder(visibleOrder);
		setBackMap(visibleBackMap);
		onAnimationStateChange?.(true);
		setActiveSwap(nextSwap);
	};

	const handlePress = () => {
		if (jestersAvailable <= 0 || !onUseJester || isAnimatingRef.current) return;

		playTap();
		startSwap("manual");
	};

	useEffect(() => {
		if (!autoUseSignal || lastAutoUseSignalRef.current === autoUseSignal) return;
		lastAutoUseSignalRef.current = autoUseSignal;
		if (isAnimatingRef.current) return;

		const nextSwap: ActiveSwap = {
			id: actionIdRef.current + 1,
			backCardId: visibleOrder[0],
			frontCardId: visibleOrder[1],
			trigger: "auto",
			signal: autoUseSignal,
		};

		actionIdRef.current = nextSwap.id;
		activeSwapRef.current = nextSwap;
		isAnimatingRef.current = true;
		setOrder(visibleOrder);
		setBackMap(visibleBackMap);
		onAnimationStateChange?.(true);
		setActiveSwap(nextSwap);
	}, [autoUseSignal, onAnimationStateChange, visibleBackMap, visibleOrder]);

	const handleSwapComplete = (animationId: number) => {
		const currentSwap = activeSwapRef.current;
		if (!currentSwap || currentSwap.id !== animationId) return;

		setBackMap((prev) => ({
			...prev,
			[currentSwap.frontCardId]: true,
			[currentSwap.backCardId]: false,
		}));
		setOrder([currentSwap.frontCardId, currentSwap.backCardId]);
		setActiveSwap(null);
		activeSwapRef.current = null;
		isAnimatingRef.current = false;

		if (currentSwap.trigger === "manual") {
			onUseJester?.();
		} else if (currentSwap.signal !== undefined) {
			onAutoUseComplete?.(currentSwap.signal);
		}

		onAnimationStateChange?.(false);
	};

	const totalCards = jestersAvailable + jestersUsed;
	if (totalCards === 0) return null;

	return (
		<TouchableOpacity
			style={[styles.stack, jesterActive && styles.stackActive]}
			onPress={handlePress}
			activeOpacity={jestersAvailable > 0 && !!onUseJester ? 0.78 : 1}
			disabled={!onUseJester || jestersAvailable === 0 || isAnimatingRef.current}
		>
			{visibleOrder.map((cardId, stackIndex) => {
				const offset = CARD_OFFSETS[stackIndex];
				let animation: JesterSwapAnimation | undefined;

				if (activeSwap?.backCardId === cardId) {
					animation = {
						id: activeSwap.id,
						role: "promote",
						deltaX: CARD_OFFSETS[1].x - CARD_OFFSETS[0].x,
						deltaY: CARD_OFFSETS[1].y - CARD_OFFSETS[0].y,
						notifyOnComplete: true,
					};
				}

				if (activeSwap?.frontCardId === cardId) {
					animation = {
						id: activeSwap.id,
						role: "demote",
						deltaX: CARD_OFFSETS[0].x - CARD_OFFSETS[1].x,
						deltaY: CARD_OFFSETS[0].y - CARD_OFFSETS[1].y,
					};
				}

				return (
					<JesterCard
						key={cardId}
						imageSource={JESTER_IMGS[cardId]}
						isBack={visibleBackMap[cardId]}
						offsetX={offset.x}
						offsetY={offset.y}
						zIndex={stackIndex}
						animation={animation}
						onAnimationComplete={handleSwapComplete}
					/>
				);
			})}
			{jesterActive && <View style={styles.activeDot} />}
		</TouchableOpacity>
	);
};
