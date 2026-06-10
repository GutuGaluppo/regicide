import { Card, Enemy, GamePhase } from "@/data/types";
import { enemyToCard, validatePlay } from "@/utils/gameLogic";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
	ActiveDeal,
	ActiveDiscard,
	ActiveEnemyCapture,
	ActiveShieldExit,
	PendingAction,
	PendingEnemyCapture,
	ScreenRect,
} from "../types";

const SHIELD_PILE_CARD_SIZE = { w: 50, h: 66 };

const getShieldPileSlotRect = (
	anchor: ScreenRect,
	stackIndex: number,
	totalCards: number,
): ScreenRect => {
	const visibleStart = Math.max(0, totalCards - 3);
	const visibleIndex = Math.min(2, Math.max(0, stackIndex - visibleStart));
	return {
		x: anchor.x + visibleIndex * 6,
		y: anchor.y + visibleIndex * 6,
		w: SHIELD_PILE_CARD_SIZE.w,
		h: SHIELD_PILE_CARD_SIZE.h,
	};
};

type Options = {
	tavernRef: React.RefObject<View | null>;
	discardRef: React.RefObject<View | null>;
	shieldCards: Card[];
	currentEnemy: Enemy | null | undefined;
	currentHP: number;
	previewDamage: number;
	previewShieldGain: number;
	pendingDamage: number | null | undefined;
	selectedCards: Card[];
	selectedTotal: number;
	phase: GamePhase;
	isMyTurn: boolean;
	autoJesterPending: boolean;
	dealSignal: number;
	playerHand: Card[];
	playSelected: () => void;
	confirmDiscard: () => void;
	yieldTurn: () => void;
};

export const useGameAnimations = ({
	tavernRef,
	discardRef,
	shieldCards,
	currentEnemy,
	currentHP,
	previewDamage,
	previewShieldGain,
	pendingDamage,
	selectedCards,
	selectedTotal,
	phase,
	isMyTurn,
	autoJesterPending,
	dealSignal,
	playerHand,
	playSelected,
	confirmDiscard,
	yieldTurn,
}: Options) => {
	const activeDealRef = useRef<ActiveDeal | null>(null);
	const dealSequenceRef = useRef(0);
	const actionSequenceRef = useRef(0);
	const pendingActionRef = useRef<PendingAction | null>(null);
	const shieldPileRectRef = useRef<ScreenRect | null>(null);
	const enemyCardRectRef = useRef<ScreenRect | null>(null);
	const dealingIdsRef = useRef<Set<string>>(new Set());
	const discardingIdsRef = useRef<Set<string>>(new Set());
	const shieldExitIdsRef = useRef<Set<string>>(new Set());
	const activeEnemyCaptureRef = useRef<ActiveEnemyCapture | null>(null);
	const isInitialMountRef = useRef(true);
	const isSaveLoadPossibleRef = useRef(false);
	const prevHandIdsRef = useRef<Set<string>>(new Set());

	const [dealingIds, setDealingIds] = useState<Set<string>>(new Set());
	const [discardingIds, setDiscardingIds] = useState<Set<string>>(new Set());
	const [shieldExitIds, setShieldExitIds] = useState<Set<string>>(new Set());
	const [activeDeal, setActiveDeal] = useState<ActiveDeal | null>(null);
	const [activeDiscard, setActiveDiscard] = useState<ActiveDiscard | null>(null);
	const [activeShieldExit, setActiveShieldExit] = useState<ActiveShieldExit | null>(null);
	const [activeEnemyCapture, setActiveEnemyCapture] = useState<ActiveEnemyCapture | null>(null);
	const [hideShieldPile, setHideShieldPile] = useState(false);
	const [jesterAnimating, setJesterAnimating] = useState(false);

	const actionLocked =
		autoJesterPending ||
		jesterAnimating ||
		activeDiscard !== null ||
		activeShieldExit !== null ||
		activeEnemyCapture !== null ||
		discardingIds.size > 0 ||
		shieldExitIds.size > 0;

	useEffect(() => {
		shieldPileRectRef.current = null;
		enemyCardRectRef.current = null;
	}, [currentEnemy?.id]); // eslint-disable-line react-hooks/exhaustive-deps

	const measureRect = (
		ref: React.RefObject<View | null>,
		onMeasured: (rect: ScreenRect) => void,
		onUnavailable?: () => void,
	) => {
		const node = ref.current;
		if (!node) {
			onUnavailable?.();
			return;
		}
		requestAnimationFrame(() => {
			node.measureInWindow((x, y, w, h) => {
				if (w === 0 || h === 0) {
					onUnavailable?.();
					return;
				}
				onMeasured({ x, y, w, h });
			});
		});
	};

	const syncDealingIds = (next: Set<string>) => {
		dealingIdsRef.current = next;
		setDealingIds(next);
	};
	const syncDiscardingIds = (next: Set<string>) => {
		discardingIdsRef.current = next;
		setDiscardingIds(next);
	};
	const syncShieldExitIds = (next: Set<string>) => {
		shieldExitIdsRef.current = next;
		setShieldExitIds(next);
	};

	const resetTransientActionState = () => {
		pendingActionRef.current = null;
		activeEnemyCaptureRef.current = null;
		setActiveDiscard(null);
		setActiveShieldExit(null);
		setActiveEnemyCapture(null);
		setHideShieldPile(false);
		syncDiscardingIds(new Set());
		syncShieldExitIds(new Set());
	};

	const commitPendingAction = (kind: PendingAction["kind"]) => {
		resetTransientActionState();
		if (kind === "play") {
			playSelected();
			return;
		}
		confirmDiscard();
	};

	const continuePendingPlayFlow = () => {
		const pending = pendingActionRef.current;
		if (pending?.enemyCapture) {
			startEnemyCaptureAnimation(pending.enemyCapture);
			return;
		}
		commitPendingAction("play");
	};

	const startEnemyCaptureAnimation = (enemyCapture: PendingEnemyCapture) => {
		const source = enemyCardRectRef.current;
		if (!source) {
			commitPendingAction("play");
			return;
		}
		const destinationRef = enemyCapture.destination === "tavern" ? tavernRef : discardRef;
		measureRect(
			destinationRef,
			(dest) => {
				const animationId = actionSequenceRef.current + 1;
				actionSequenceRef.current = animationId;
				const nextCapture: ActiveEnemyCapture = {
					animationId,
					enemy: enemyCapture.enemy,
					card: enemyCapture.card,
					source,
					dest,
				};
				activeEnemyCaptureRef.current = nextCapture;
				setActiveEnemyCapture(nextCapture);
			},
			() => {
				commitPendingAction("play");
			},
		);
	};

	const startShieldExitAnimation = (incomingShieldCards: Card[] = []) => {
		const shieldPileRect = shieldPileRectRef.current;
		const allShieldCards = [...shieldCards, ...incomingShieldCards];
		if (!shieldPileRect || allShieldCards.length === 0) {
			continuePendingPlayFlow();
			return;
		}
		measureRect(
			discardRef,
			(dest) => {
				const animationId = actionSequenceRef.current + 1;
				actionSequenceRef.current = animationId;
				const flights = allShieldCards.map((card, index) => ({
					animationId,
					order: allShieldCards.length - 1 - index,
					card,
					source: getShieldPileSlotRect(shieldPileRect, index, allShieldCards.length),
					dest,
				}));
				setHideShieldPile(true);
				syncShieldExitIds(new Set(flights.map((f) => f.card.id)));
				setActiveShieldExit({ id: animationId, flights });
			},
			() => {
				continuePendingPlayFlow();
			},
		);
	};

	const startHandDiscardAnimation = (
		cards: Card[],
		kind: PendingAction["kind"],
		incomingShieldCards: Card[] = [],
		enemyCapture: PendingEnemyCapture | null = null,
	) => {
		if (cards.length === 0) return;
		measureRect(
			discardRef,
			(discardDest) => {
				const actionId = actionSequenceRef.current + 1;
				actionSequenceRef.current = actionId;
				const shieldDest = shieldPileRectRef.current;
				const totalShieldCards = shieldCards.length + incomingShieldCards.length;
				const incomingShieldIds = new Set(incomingShieldCards.map((c) => c.id));
				const incomingShieldOrder = new Map<string, number>();
				incomingShieldCards.forEach((c, i) => incomingShieldOrder.set(c.id, i));
				const flightById = new Map<string, { order: number; dest: ScreenRect }>();
				cards.forEach((card, index) => {
					const shieldOrder = incomingShieldOrder.get(card.id);
					const dest =
						incomingShieldIds.has(card.id) && shieldDest && shieldOrder !== undefined
							? getShieldPileSlotRect(
									shieldDest,
									shieldCards.length + shieldOrder,
									totalShieldCards,
								)
							: discardDest;
					flightById.set(card.id, { order: index, dest });
				});
				pendingActionRef.current = {
					id: actionId,
					kind,
					awaitShieldExit:
						kind === "play" &&
						previewDamage >= currentHP &&
						(shieldCards.length > 0 || incomingShieldCards.length > 0),
					incomingShieldCards,
					enemyCapture,
				};
				syncDiscardingIds(new Set(cards.map((c) => c.id)));
				setActiveDiscard({ id: actionId, flightById });
			},
			() => {
				commitPendingAction(kind);
			},
		);
	};

	const triggerDeal = (cards: Card[]) => {
		if (cards.length === 0) return;
		const nextDealId = dealSequenceRef.current + 1;
		dealSequenceRef.current = nextDealId;
		measureRect(
			tavernRef,
			(source) => {
				const orderById = new Map<string, number>();
				cards.forEach((card, index) => orderById.set(card.id, index));
				const nextDeal: ActiveDeal = { id: nextDealId, source, orderById };
				activeDealRef.current = nextDeal;
				setActiveDeal(nextDeal);
				syncDealingIds(new Set(cards.map((c) => c.id)));
			},
			() => {
				activeDealRef.current = null;
				setActiveDeal(null);
				syncDealingIds(new Set());
			},
		);
	};

	useLayoutEffect(() => {
		if (dealSignal === 0) return;
		isSaveLoadPossibleRef.current = false;
		prevHandIdsRef.current = new Set(playerHand.map((c) => c.id));
		triggerDeal(playerHand);
	}, [dealSignal]); // eslint-disable-line react-hooks/exhaustive-deps

	useLayoutEffect(() => {
		const currentIds = new Set(playerHand.map((c) => c.id));
		if (isInitialMountRef.current) {
			isInitialMountRef.current = false;
			isSaveLoadPossibleRef.current = true;
			prevHandIdsRef.current = currentIds;
			return;
		}
		if (isSaveLoadPossibleRef.current) {
			isSaveLoadPossibleRef.current = false;
			prevHandIdsRef.current = currentIds;
			return;
		}
		const prev = prevHandIdsRef.current;
		const newCards = playerHand.filter((c) => !prev.has(c.id));
		prevHandIdsRef.current = currentIds;
		if (newCards.length === 0) return;
		triggerDeal(newCards);
	}, [playerHand]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleCardDealComplete = (dealId: number, cardId: string) => {
		if (activeDealRef.current?.id !== dealId) return;
		const next = new Set(dealingIdsRef.current);
		if (!next.delete(cardId)) return;
		syncDealingIds(next);
		if (next.size === 0 && activeDealRef.current?.id === dealId) {
			activeDealRef.current = null;
			setActiveDeal(null);
		}
	};

	const handleCardDiscardComplete = (discardId: number, cardId: string) => {
		const pending = pendingActionRef.current;
		if (!pending || pending.id !== discardId) return;
		const next = new Set(discardingIdsRef.current);
		if (!next.delete(cardId)) return;
		syncDiscardingIds(next);
		if (next.size > 0) return;
		setActiveDiscard(null);
		if (pending.kind === "discard") {
			commitPendingAction("discard");
			return;
		}
		if (pending.awaitShieldExit) {
			startShieldExitAnimation(pending.incomingShieldCards);
			return;
		}
		continuePendingPlayFlow();
	};

	const handleShieldFlightComplete = (animationId: number, cardId: string) => {
		if (activeShieldExit?.id !== animationId) return;
		const next = new Set(shieldExitIdsRef.current);
		if (!next.delete(cardId)) return;
		syncShieldExitIds(next);
		if (next.size > 0) return;
		setActiveShieldExit(null);
		continuePendingPlayFlow();
	};

	const handleEnemyCaptureComplete = (animationId: number) => {
		if (activeEnemyCaptureRef.current?.animationId !== animationId) return;
		commitPendingAction("play");
	};

	const handlePlay = () => {
		if (phase !== "player_turn" || selectedCards.length === 0 || actionLocked || !isMyTurn) return;
		const validation = validatePlay(selectedCards);
		if (!validation.valid) {
			playSelected();
			return;
		}
		const incomingShieldCards =
			previewShieldGain > 0 ? selectedCards.filter((c) => c.suit === "spades") : [];
		const enemyCapture =
			currentEnemy && previewDamage >= currentHP
				? {
						enemy: currentEnemy,
						card: enemyToCard(currentEnemy),
						destination: (previewDamage === currentHP ? "tavern" : "discard") as
							| "tavern"
							| "discard",
					}
				: null;
		startHandDiscardAnimation(selectedCards, "play", incomingShieldCards, enemyCapture);
	};

	const handleYield = () => {
		if (phase !== "player_turn" || actionLocked || !isMyTurn) return;
		yieldTurn();
	};

	const handleConfirmDiscard = () => {
		if (phase !== "suffer_damage" || selectedCards.length === 0 || actionLocked || !isMyTurn) return;
		if (selectedTotal < (pendingDamage ?? 0)) {
			confirmDiscard();
			return;
		}
		startHandDiscardAnimation(selectedCards, "discard");
	};

	const handleShieldPileMeasure = (rect: ScreenRect) => {
		shieldPileRectRef.current = rect;
	};
	const handleEnemyCardMeasure = (rect: ScreenRect) => {
		enemyCardRectRef.current = rect;
	};

	return {
		dealingIds,
		activeDeal,
		activeDiscard,
		activeShieldExit,
		activeEnemyCapture,
		hideShieldPile,
		actionLocked,
		jesterAnimating,
		setJesterAnimating,
		handlePlay,
		handleYield,
		handleConfirmDiscard,
		handleCardDealComplete,
		handleCardDiscardComplete,
		handleShieldFlightComplete,
		handleEnemyCaptureComplete,
		handleShieldPileMeasure,
		handleEnemyCardMeasure,
	};
};
