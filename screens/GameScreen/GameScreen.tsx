import cardBack from "@/assets/images/cardBack.png";
import { CardFlight, CardFlightOverlay } from "@/components/CardFlightOverlay/CardFlightOverlay";
import { CastleFooter } from "@/components/CastleFooter";
import { DefeatScreen } from "@/components/DefeatScreen";
import { EnemyCard } from "@/components/EnemyCard";
import { EnemyModal } from "@/components/EnemyModal";
import { NumberSprite } from "@/components/NumberSprite";
import { PlayerHand } from "@/components/PlayerHand";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { VictoryScreen } from "@/components/VictoryScreen";
import { useAudio } from "@/contexts/AudioContext";
import { Card } from "@/data/types";
import { useGame } from "@/hooks/useGame";
import { useSoundtrack } from "@/hooks/useSoundtrack";
import { validatePlay } from "@/utils/gameLogic";
import { Image } from "expo-image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, Text, View } from "react-native";
import { styles } from "./GameScreen.styles";

type ScreenRect = {
	x: number;
	y: number;
	w: number;
	h: number;
};

type ActiveDeal = {
	id: number;
	source: ScreenRect;
	orderById: Map<string, number>;
};

type ActiveDiscard = {
	id: number;
	flightById: Map<
		string,
		{
			order: number;
			dest: ScreenRect;
		}
	>;
};

type PendingAction = {
	id: number;
	kind: "play" | "discard";
	awaitShieldExit: boolean;
	incomingShieldCards: Card[];
};

type ActiveShieldExit = {
	id: number;
	flights: CardFlight[];
};

const SHIELD_PILE_CARD_SIZE = {
	w: 50,
	h: 66,
};

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

const StatusCard = ({ count, label }: { count: number; label: string }) => (
	<View style={styles.statusItem}>
		<View style={styles.statusCard}>
			<Image
				source={cardBack}
				style={styles.statusCardImg}
				contentFit="contain"
			/>
			<View style={styles.statusCardOverlay}>
				<NumberSprite value={count} type="deckstatus" height={25} />
			</View>
		</View>
		<Text style={styles.deckLabel}>{label}</Text>
	</View>
);

export const GameScreen = () => {
	const { t } = useTranslation();
	const { playShuffleCards } = useAudio();
	useSoundtrack(
		require("@/assets/soundtrack/502_Sentient_Eye.mp3") as import("expo-av").AVPlaybackSource,
	);

	const {
		gameState,
		selectedIds,
		selectedCards,
		playError,
		currentEnemy,
		currentHP,
		effectiveAttack,
		selectedTotal,
		previewDamage,
		previewShieldGain,
		defeatedEnemies,
		cardsDrawnSignal,
		dealSignal,
		toggleCard,
		playSelected,
		confirmDiscard,
		useJester,
		sortHand,
		sortHandByClass,
		resetGame,
	} = useGame();

	useEffect(() => {
		if (cardsDrawnSignal === 0) return;
		playShuffleCards();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardsDrawnSignal]);

	useEffect(() => {
		shieldPileRectRef.current = null;
	}, [currentEnemy?.id]);

	const {
		phase,
		spadesShield,
		tavernDeck,
		discardPile,
		pendingDamage,
		jesterActive,
	} = gameState;
	const shieldCards = gameState.playedThisFight.filter((c) => c.suit === "spades");

	const tavernRef = useRef<View>(null);
	const discardRef = useRef<View>(null);
	const activeDealRef = useRef<ActiveDeal | null>(null);
	const dealSequenceRef = useRef(0);
	const actionSequenceRef = useRef(0);
	const pendingActionRef = useRef<PendingAction | null>(null);
	const shieldPileRectRef = useRef<ScreenRect | null>(null);
	const dealingIdsRef = useRef<Set<string>>(new Set());
	const discardingIdsRef = useRef<Set<string>>(new Set());
	const shieldExitIdsRef = useRef<Set<string>>(new Set());
	const isInitialMountRef = useRef(true);
	const isSaveLoadPossibleRef = useRef(false);
	const prevHandIdsRef = useRef<Set<string>>(new Set());

	const [modalVisible, setModalVisible] = useState(false);
	const [settingsVisible, setSettingsVisible] = useState(false);
	const [dealingIds, setDealingIds] = useState<Set<string>>(new Set());
	const [discardingIds, setDiscardingIds] = useState<Set<string>>(new Set());
	const [shieldExitIds, setShieldExitIds] = useState<Set<string>>(new Set());
	const [activeDeal, setActiveDeal] = useState<ActiveDeal | null>(null);
	const [activeDiscard, setActiveDiscard] = useState<ActiveDiscard | null>(null);
	const [activeShieldExit, setActiveShieldExit] =
		useState<ActiveShieldExit | null>(null);
	const [hideShieldPile, setHideShieldPile] = useState(false);
	const [jesterAnimating, setJesterAnimating] = useState(false);

	const actionLocked =
		jesterAnimating ||
		activeDiscard !== null ||
		activeShieldExit !== null ||
		discardingIds.size > 0 ||
		shieldExitIds.size > 0;

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
		setActiveDiscard(null);
		setActiveShieldExit(null);
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

	const startShieldExitAnimation = (incomingShieldCards: Card[] = []) => {
		const shieldPileRect = shieldPileRectRef.current;
		const allShieldCards = [...shieldCards, ...incomingShieldCards];
		if (!shieldPileRect || allShieldCards.length === 0) {
			commitPendingAction("play");
			return;
		}

		measureRect(
			discardRef,
			(dest) => {
				const animationId = actionSequenceRef.current + 1;
				actionSequenceRef.current = animationId;
				const flights = allShieldCards.map((card, index) => {
					return {
						animationId,
						order: allShieldCards.length - 1 - index,
						card,
						source: getShieldPileSlotRect(
							shieldPileRect,
							index,
							allShieldCards.length,
						),
						dest,
					};
				});

				setHideShieldPile(true);
				syncShieldExitIds(new Set(flights.map((flight) => flight.card.id)));
				setActiveShieldExit({ id: animationId, flights });
			},
			() => {
				commitPendingAction("play");
			},
		);
	};

	const startHandDiscardAnimation = (
		cards: Card[],
		kind: PendingAction["kind"],
		incomingShieldCards: Card[] = [],
	) => {
		if (cards.length === 0) return;

		measureRect(
			discardRef,
			(discardDest) => {
				const actionId = actionSequenceRef.current + 1;
				actionSequenceRef.current = actionId;
				const shieldDest = shieldPileRectRef.current;
				const totalShieldCards = shieldCards.length + incomingShieldCards.length;
				const incomingShieldIds = new Set(
					incomingShieldCards.map((card) => card.id),
				);
				const incomingShieldOrder = new Map<string, number>();
				incomingShieldCards.forEach((card, index) =>
					incomingShieldOrder.set(card.id, index),
				);
				const flightById = new Map<
					string,
					{ order: number; dest: ScreenRect }
				>();

				cards.forEach((card, index) => {
					const shieldOrder = incomingShieldOrder.get(card.id);
					const dest =
						incomingShieldIds.has(card.id) &&
						shieldDest &&
						shieldOrder !== undefined
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
				};
				syncDiscardingIds(new Set(cards.map((card) => card.id)));
				setActiveDiscard({
					id: actionId,
					flightById,
				});
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

		measureRect(tavernRef, (source) => {
			const orderById = new Map<string, number>();
			cards.forEach((card, index) => orderById.set(card.id, index));

			const nextDeal: ActiveDeal = {
				id: nextDealId,
				source,
				orderById,
			};

			activeDealRef.current = nextDeal;
			setActiveDeal(nextDeal);
			syncDealingIds(new Set(cards.map((card) => card.id)));
		}, () => {
			activeDealRef.current = null;
			setActiveDeal(null);
			syncDealingIds(new Set());
		});
	};

	useLayoutEffect(() => {
		if (dealSignal === 0) return;
		isSaveLoadPossibleRef.current = false;
		prevHandIdsRef.current = new Set(gameState.playerHand.map((c) => c.id));
		triggerDeal(gameState.playerHand);
	}, [dealSignal]); // eslint-disable-line react-hooks/exhaustive-deps

	useLayoutEffect(() => {
		const currentIds = new Set(gameState.playerHand.map((c) => c.id));

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
		const newCards = gameState.playerHand.filter((c) => !prev.has(c.id));
		prevHandIdsRef.current = currentIds;
		if (newCards.length === 0) return;
		triggerDeal(newCards);
	}, [gameState.playerHand]); // eslint-disable-line react-hooks/exhaustive-deps

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

		commitPendingAction("play");
	};

	const handleShieldFlightComplete = (animationId: number, cardId: string) => {
		if (activeShieldExit?.id !== animationId) return;

		const next = new Set(shieldExitIdsRef.current);
		if (!next.delete(cardId)) return;
		syncShieldExitIds(next);

		if (next.size > 0) return;

		commitPendingAction("play");
	};

	const handlePlay = () => {
		if (phase !== "player_turn" || selectedCards.length === 0 || actionLocked) {
			return;
		}

		const validation = validatePlay(selectedCards);
		if (!validation.valid) {
			playSelected();
			return;
		}

		const incomingShieldCards =
			previewShieldGain > 0
				? selectedCards.filter((card) => card.suit === "spades")
				: [];
		startHandDiscardAnimation(selectedCards, "play", incomingShieldCards);
	};

	const handleConfirmDiscard = () => {
		if (
			phase !== "suffer_damage" ||
			selectedCards.length === 0 ||
			actionLocked
		) {
			return;
		}

		if (selectedTotal < (pendingDamage ?? 0)) {
			confirmDiscard();
			return;
		}

		startHandDiscardAnimation(selectedCards, "discard");
	};

	const handleShieldPileMeasure = (rect: ScreenRect) => {
		shieldPileRectRef.current = rect;
	};

	if (phase === "victory") return <VictoryScreen onReset={resetGame} />;

	if (phase === "defeat" && currentEnemy) {
		return (
			<DefeatScreen
				enemy={currentEnemy}
				stats={gameState.stats}
				defeatedEnemies={defeatedEnemies}
				playerHand={gameState.playerHand}
				onReset={resetGame}
			/>
		);
	}

	return (
		<ImageBackground
			source={require("@/assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<View style={styles.statusBar}>
					<StatusCard
						count={gameState.castle.length}
						label={t("game.status.castle")}
					/>
					<View ref={tavernRef} collapsable={false}>
						<StatusCard
							count={tavernDeck.length}
							label={t("game.status.tavern")}
						/>
					</View>
					<View ref={discardRef} collapsable={false}>
						<StatusCard
							count={discardPile.length}
							label={t("game.status.discard")}
						/>
					</View>
				</View>

				<View style={styles.center}>
					{(phase === "player_turn" || phase === "suffer_damage") &&
						currentEnemy && (
							<EnemyCard
								enemy={currentEnemy}
								currentHP={currentHP}
								effectiveAttack={effectiveAttack}
								jesterActive={jesterActive}
								spadesShield={spadesShield}
								shieldCards={shieldCards}
								jestersAvailable={gameState.jestersAvailable}
								jestersUsed={gameState.jestersUsed}
								hideShieldPile={hideShieldPile}
								onShieldPileMeasure={handleShieldPileMeasure}
								onUseJester={
									phase === "player_turn" &&
									activeDiscard === null &&
									activeShieldExit === null
										? useJester
										: undefined
								}
								onJesterAnimationStateChange={setJesterAnimating}
								onPress={!actionLocked ? () => setModalVisible(true) : undefined}
								previewDamage={phase === "player_turn" ? previewDamage : 0}
								previewShieldGain={
									phase === "player_turn" ? previewShieldGain : 0
								}
							/>
						)}
				</View>

				{playError && <Text style={styles.error}>{playError}</Text>}

				{(phase === "player_turn" || phase === "suffer_damage") && (
					<PlayerHand
						hand={gameState.playerHand}
						selectedIds={selectedIds}
						phase={phase}
						immuneSuit={jesterActive ? null : currentEnemy?.suit}
						dealingIds={dealingIds}
						activeDeal={activeDeal}
						activeDiscard={activeDiscard}
						locked={actionLocked}
						pendingDamage={pendingDamage}
						selectedTotal={selectedTotal}
						onCardPress={toggleCard}
						onDiscard={handleConfirmDiscard}
						onSort={sortHand}
						onSortByClass={sortHandByClass}
						onPlay={handlePlay}
						playDisabled={selectedIds.size === 0}
						onCardDealComplete={handleCardDealComplete}
						onCardDiscardComplete={handleCardDiscardComplete}
					/>
				)}

				<CastleFooter
					castle={gameState.castle}
					defeatedEnemies={defeatedEnemies}
					currentEnemyId={currentEnemy?.id}
				/>

				<ScreenHeader onSettingsPress={() => setSettingsVisible(true)} />
			</View>

			{activeShieldExit && (
				<CardFlightOverlay
					flights={activeShieldExit.flights}
					onFlightComplete={handleShieldFlightComplete}
				/>
			)}

			{currentEnemy && (
				<EnemyModal
					enemy={currentEnemy}
					currentHP={currentHP}
					effectiveAttack={effectiveAttack}
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
				/>
			)}

			<SettingsDrawer
				visible={settingsVisible}
				onClose={() => setSettingsVisible(false)}
				onReset={resetGame}
			/>
		</ImageBackground>
	);
};
