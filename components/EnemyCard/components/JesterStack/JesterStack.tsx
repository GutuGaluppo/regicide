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
	{ x: 0, y: 0 },
	{ x: 7, y: 7 },
] as const;

type ActiveSwap = {
	id: number;
	frontCardId: number;
	backCardId: number;
};

const buildStackSnapshot = (jestersUsed: number) => {
	if (jestersUsed <= 0) {
		return {
			order: [0, 1] as [number, number],
			backMap: { 0: false, 1: false } as Record<number, boolean>,
		};
	}

	if (jestersUsed === 1) {
		return {
			order: [1, 0] as [number, number],
			backMap: { 0: false, 1: true } as Record<number, boolean>,
		};
	}

	return {
		order: [0, 1] as [number, number],
		backMap: { 0: true, 1: true } as Record<number, boolean>,
	};
};

export const JesterStack = ({
	jestersAvailable,
	jestersUsed,
	jesterActive,
	onUseJester,
	onAnimationStateChange,
}: {
	jestersAvailable: number;
	jestersUsed: number;
	jesterActive: boolean;
	onUseJester?: () => void;
	onAnimationStateChange?: (isAnimating: boolean) => void;
}) => {
	const { playTap } = useAudio();
	const initialSnapshot = useMemo(
		() => buildStackSnapshot(jestersUsed),
		[jestersUsed],
	);
	const [order, setOrder] = useState<[number, number]>(initialSnapshot.order);
	const [backMap, setBackMap] = useState<Record<number, boolean>>(
		initialSnapshot.backMap,
	);
	const [activeSwap, setActiveSwap] = useState<ActiveSwap | null>(null);
	const actionIdRef = useRef(0);
	const isAnimatingRef = useRef(false);
	const activeSwapRef = useRef<ActiveSwap | null>(null);

	useEffect(() => {
		if (isAnimatingRef.current) return;
		const nextSnapshot = buildStackSnapshot(jestersUsed);
		setOrder(nextSnapshot.order);
		setBackMap(nextSnapshot.backMap);
	}, [jestersUsed]);

	const totalCards = jestersAvailable + jestersUsed;
	if (totalCards === 0) return null;

	const handlePress = () => {
		if (jestersAvailable <= 0 || !onUseJester || isAnimatingRef.current) return;

		const nextSwap: ActiveSwap = {
			id: actionIdRef.current + 1,
			backCardId: order[0],
			frontCardId: order[1],
		};

		playTap();
		actionIdRef.current = nextSwap.id;
		activeSwapRef.current = nextSwap;
		isAnimatingRef.current = true;
		onAnimationStateChange?.(true);
		setActiveSwap(nextSwap);
	};

	const handleSwapComplete = (animationId: number) => {
		const currentSwap = activeSwapRef.current;
		if (!currentSwap || currentSwap.id !== animationId) return;

		setBackMap((prev) => ({ ...prev, [currentSwap.frontCardId]: true }));
		setOrder([currentSwap.frontCardId, currentSwap.backCardId]);
		setActiveSwap(null);
		activeSwapRef.current = null;
		isAnimatingRef.current = false;
		onUseJester?.();
		onAnimationStateChange?.(false);
	};

	return (
		<TouchableOpacity
			style={[styles.stack, jesterActive && styles.stackActive]}
			onPress={handlePress}
			activeOpacity={jestersAvailable > 0 ? 0.78 : 1}
			disabled={!onUseJester || jestersAvailable === 0 || isAnimatingRef.current}
		>
			{order.map((cardId, stackIndex) => {
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
						isBack={backMap[cardId]}
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
