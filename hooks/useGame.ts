import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { buildCastle } from "@/data/buildCastle";
import { createTavernDeck, HAND_SIZE } from "@/data/deck";
import { Card, GameState, GameStats, Suit } from "@/data/types";
import { loadGame, saveGame } from "@/services/storage";
import { enemyToCard, resolvePlay, validatePlay } from "@/utils/gameLogic";

const PLAYER_COUNT = 1 as const;
const MAX_HAND = HAND_SIZE[PLAYER_COUNT];

const emptyStats = (): GameStats => ({
	startTime: Date.now(),
	turnsPlayed: 0,
	cardsPerTurn: [],
	discardedCards: [],
	enemyKills: [],
});

const createInitialState = (): GameState => {
	const tavernDeck = createTavernDeck(PLAYER_COUNT);
	const playerHand = tavernDeck.splice(0, MAX_HAND);
	return {
		castle: buildCastle(),
		defeatedEnemies: [],
		tavernDeck,
		discardPile: [],
		playerHand,
		playedThisFight: [],
		discardedThisFight: [],
		currentDamage: 0,
		spadesShield: 0,
		jesterActive: false,
		pendingDamage: 0,
		phase: "player_turn",
		jestersAvailable: 2,
		jestersUsed: 0,
		stats: emptyStats(),
	};
};

// ─── Helpers de resolução de Coringa ─────────────────────────────────────────

type JesterResolution = Pick<
	GameState,
	"playerHand" | "tavernDeck" | "discardPile" | "jestersAvailable" | "jestersUsed" | "phase"
>;

type JesterTransition = {
	resolution: JesterResolution;
	usedJester: boolean;
	preDrawTavernDeck: Card[];
	preDrawDiscardPile: Card[];
};

/**
 * Consome 1 Coringa e reabastece a mão a partir da taverna (até MAX_HAND).
 * Retorna phase "defeat" se não houver Coringas disponíveis.
 */
const resolveEmptyHand = (
	state: GameState,
	tavernDeck: Card[],
	discardPile: Card[],
): JesterResolution => {
	if (state.jestersAvailable > 0) {
		const canDraw = Math.min(MAX_HAND, tavernDeck.length);
		return {
			playerHand: tavernDeck.slice(0, canDraw),
			tavernDeck: tavernDeck.slice(canDraw),
			discardPile,
			jestersAvailable: state.jestersAvailable - 1,
			jestersUsed: state.jestersUsed + 1,
			phase: "player_turn",
		};
	}
	return {
		playerHand: [],
		tavernDeck,
		discardPile,
		jestersAvailable: 0,
		jestersUsed: state.jestersUsed,
		phase: "defeat",
	};
};

/**
 * Usado quando o jogador não consegue pagar o dano recebido.
 * Se houver Coringas: descarta toda a mão atual, consome 1 Coringa e reabastece.
 * Se não houver Coringas: retorna phase "defeat" sem alterar a mão.
 */
const resolveCannotPay = (
	hand: Card[],
	tavernDeck: Card[],
	discardPile: Card[],
	jestersAvailable: number,
	jestersUsed: number,
): JesterResolution => {
	if (jestersAvailable > 0) {
		const newDiscard = [...discardPile, ...hand];
		const canDraw = Math.min(MAX_HAND, tavernDeck.length);
		return {
			playerHand: tavernDeck.slice(0, canDraw),
			tavernDeck: tavernDeck.slice(canDraw),
			discardPile: newDiscard,
			jestersAvailable: jestersAvailable - 1,
			jestersUsed: jestersUsed + 1,
			phase: "player_turn",
		};
	}
	return {
		playerHand: hand,
		tavernDeck,
		discardPile,
		jestersAvailable: 0,
		jestersUsed,
		phase: "defeat",
	};
};

const resolveEmptyHandTransition = (
	state: GameState,
	tavernDeck: Card[],
	discardPile: Card[],
): JesterTransition => {
	const resolution = resolveEmptyHand(state, tavernDeck, discardPile);
	return {
		resolution,
		usedJester: resolution.jestersUsed > state.jestersUsed,
		preDrawTavernDeck: tavernDeck,
		preDrawDiscardPile: discardPile,
	};
};

const resolveCannotPayTransition = (
	hand: Card[],
	tavernDeck: Card[],
	discardPile: Card[],
	jestersAvailable: number,
	jestersUsed: number,
): JesterTransition => {
	const resolution = resolveCannotPay(
		hand,
		tavernDeck,
		discardPile,
		jestersAvailable,
		jestersUsed,
	);

	return {
		resolution,
		usedJester: resolution.jestersUsed > jestersUsed,
		preDrawTavernDeck: tavernDeck,
		preDrawDiscardPile: [...discardPile, ...hand],
	};
};

export const useGame = () => {
	const { t } = useTranslation();
	const [gameState, setGameState] = useState<GameState>(createInitialState);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [playError, setPlayError] = useState<string | null>(null);
	const [cardsDrawnSignal, setCardsDrawnSignal] = useState(0);
	const [autoJesterSignal, setAutoJesterSignal] = useState(0);
	const [autoJesterPending, setAutoJesterPending] = useState(false);
	const bumpDraw = () => setCardsDrawnSignal((s) => s + 1);
	// Fires when cards should be dealt with full animation (new game or reset)
	const [dealSignal, setDealSignal] = useState(0);
	const bumpDeal = () => setDealSignal((s) => s + 1);
	const autoJesterSignalRef = useRef(0);
	const pendingAutoJesterRef = useRef<{
		usesRemaining: number;
		finalState: GameState;
		shouldBumpDraw: boolean;
	} | null>(null);

	useEffect(() => {
		let active = true;
		const init = async () => {
			try {
				const saved = await loadGame();
				if (!active) return;
				if (saved) {
					setGameState({
						...saved,
						defeatedEnemies: saved.defeatedEnemies ?? [],
						jestersAvailable: (saved as GameState).jestersAvailable ?? 2,
						jestersUsed: (saved as GameState).jestersUsed ?? 0,
						discardedThisFight: (saved as GameState).discardedThisFight ?? [],
						stats: (saved as GameState).stats ?? emptyStats(),
					} as GameState);
				} else {
					// Fresh start — signal to animate the initial deal
					bumpDeal();
				}
			} catch {
				// usa estado inicial — still animate
				bumpDeal();
			}
		};
		init();
		return () => { active = false; };
	}, []);

	const persist = async (state: GameState) => {
		try {
			await saveGame(state);
		} catch {
			// falha não-crítica
		}
	};

	const resetAutoJesterQueue = () => {
		pendingAutoJesterRef.current = null;
		autoJesterSignalRef.current = 0;
		setAutoJesterPending(false);
		setAutoJesterSignal(0);
	};

	const emitAutoJesterSignal = () => {
		setAutoJesterSignal((prev) => {
			const next = prev + 1;
			autoJesterSignalRef.current = next;
			return next;
		});
	};

	const commitState = (next: GameState, shouldBumpDraw = false) => {
		pendingAutoJesterRef.current = null;
		setAutoJesterPending(false);
		setGameState(next);
		if (shouldBumpDraw) {
			bumpDraw();
		}
		persist(next);
	};

	const queueAutoJesterSequence = (
		displayState: GameState,
		finalState: GameState,
		uses: number,
	) => {
		if (uses <= 0) {
			commitState(finalState);
			return;
		}

		pendingAutoJesterRef.current = {
			usesRemaining: uses,
			finalState,
			shouldBumpDraw:
				finalState.phase !== "defeat" && finalState.playerHand.length > 0,
		};
		setGameState(displayState);
		setAutoJesterPending(true);
		emitAutoJesterSignal();
	};

	const completeAutoJesterAnimation = (signal: number) => {
		if (signal !== autoJesterSignalRef.current) return;

		const pending = pendingAutoJesterRef.current;
		if (!pending) return;

		if (pending.usesRemaining > 1) {
			pendingAutoJesterRef.current = {
				...pending,
				usesRemaining: pending.usesRemaining - 1,
			};
			emitAutoJesterSignal();
			return;
		}

		commitState(pending.finalState, pending.shouldBumpDraw);
	};

	const buildAutoJesterDisplayState = (
		next: GameState,
		tavernDeck: Card[],
		discardPile: Card[],
	): GameState => ({
		...next,
		playerHand: [],
		tavernDeck,
		discardPile,
		phase: "player_turn",
		pendingDamage: 0,
		jestersAvailable: gameState.jestersAvailable,
		jestersUsed: gameState.jestersUsed,
	});

	const toggleCard = (card: Card) => {
		if (autoJesterPending) return;
		if (gameState.phase !== "player_turn" && gameState.phase !== "suffer_damage") return;
		setPlayError(null);
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(card.id)) {
				next.delete(card.id);
			} else {
				next.add(card.id);
			}
			return next;
		});
	};

	// ─── Usar Jester (cancela imunidade) ──────────────────────────────────────
	const useJester = () => {
		if (autoJesterPending) return;
		if (gameState.phase !== "player_turn") return;
		if (gameState.jestersAvailable <= 0) return;
		const next: GameState = {
			...gameState,
			jestersAvailable: gameState.jestersAvailable - 1,
			jestersUsed: gameState.jestersUsed + 1,
			jesterActive: true,
		};
		setGameState(next);
		persist(next);
	};

	// ─── Jogar cartas ─────────────────────────────────────────────────────────
	const playSelected = () => {
		if (autoJesterPending) return;
		if (gameState.phase !== "player_turn") return;

		const selected = gameState.playerHand.filter((c) => selectedIds.has(c.id));
		const validation = validatePlay(selected);
		if (!validation.valid) {
			setPlayError(validation.reason);
			return;
		}

		setPlayError(null);
		setSelectedIds(new Set());

		const enemy = gameState.castle[0];
		const result = resolvePlay(selected, gameState, MAX_HAND);

		const newStats: GameStats = {
			...gameState.stats,
			turnsPlayed: gameState.stats.turnsPlayed + 1,
			cardsPerTurn: [...gameState.stats.cardsPerTurn, selected],
		};

		// Jester jogado da mão (compatibilidade, caso ainda exista)
		if (result.isJester) {
			const next: GameState = {
				...gameState,
				playerHand: result.newHand,
				tavernDeck: result.newTavernDeck,
				discardPile: result.newDiscardPile,
				jesterActive: true,
				phase: "player_turn",
				stats: newStats,
			};
			setGameState(next);
			persist(next);
			return;
		}

		// Detectar compra de cartas via poder de Ouros
		const handSizeAfterPlay = gameState.playerHand.length - selected.length;
		const drewCardsFromPlay = result.newHand.length > handSizeAfterPlay;

		const newCurrentDamage = gameState.currentDamage + result.totalDamage;
		const allPlayedCards = [...gameState.playedThisFight, ...selected];

		// Inimigo derrotado
		if (newCurrentDamage >= enemy.health) {
			const exactKill = newCurrentDamage === enemy.health;
			const enemyCard = enemyToCard(enemy);

			const newTavern = exactKill
				? [enemyCard, ...result.newTavernDeck]
				: result.newTavernDeck;

			const newDiscard = exactKill
				? [...result.newDiscardPile, ...allPlayedCards]
				: [...result.newDiscardPile, ...allPlayedCards, enemyCard];

			const [, ...restCastle] = gameState.castle;
			const defeatedStats: GameStats = {
				...newStats,
				enemyKills: [...newStats.enemyKills, { enemy, allCards: allPlayedCards, discardedCards: gameState.discardedThisFight }],
			};

			if (restCastle.length === 0) {
				const next: GameState = {
					...gameState,
					castle: restCastle,
					defeatedEnemies: [...gameState.defeatedEnemies, enemy],
					playerHand: result.newHand,
					tavernDeck: newTavern,
					discardPile: newDiscard,
					playedThisFight: [],
					discardedThisFight: [],
					currentDamage: 0,
					spadesShield: 0,
					jesterActive: false,
					pendingDamage: 0,
					phase: "victory",
					stats: defeatedStats,
				};
				commitState(next);
				return;
			}

			// Verifica mão vazia após derrota do inimigo
			const emptyTransition = result.newHand.length === 0
				? resolveEmptyHandTransition(gameState, newTavern, newDiscard)
				: null;

			const next: GameState = {
				...gameState,
				castle: restCastle,
				defeatedEnemies: [...gameState.defeatedEnemies, enemy],
				playerHand: emptyTransition
					? emptyTransition.resolution.playerHand
					: result.newHand,
				tavernDeck: emptyTransition
					? emptyTransition.resolution.tavernDeck
					: newTavern,
				discardPile: emptyTransition
					? emptyTransition.resolution.discardPile
					: newDiscard,
				playedThisFight: [],
				discardedThisFight: [],
				currentDamage: 0,
				spadesShield: 0,
				jesterActive: false,
				pendingDamage: 0,
				phase: emptyTransition
					? emptyTransition.resolution.phase
					: "player_turn",
				jestersAvailable: emptyTransition
					? emptyTransition.resolution.jestersAvailable
					: gameState.jestersAvailable,
				jestersUsed: emptyTransition
					? emptyTransition.resolution.jestersUsed
					: gameState.jestersUsed,
				stats: defeatedStats,
			};

			if (emptyTransition?.usedJester) {
				queueAutoJesterSequence(
					buildAutoJesterDisplayState(
						next,
						emptyTransition.preDrawTavernDeck,
						emptyTransition.preDrawDiscardPile,
					),
					next,
					1,
				);
				return;
			}

			commitState(next, drewCardsFromPlay && next.phase !== "defeat");
			return;
		}

		// Inimigo não derrotado — verificar dano
		const effectiveAttack = Math.max(0, enemy.attack - result.newShield);

		if (effectiveAttack === 0) {
			// Totalmente bloqueado por espadas
			const emptyTransition = result.newHand.length === 0
				? resolveEmptyHandTransition(
					gameState,
					result.newTavernDeck,
					result.newDiscardPile,
				)
				: null;

			const next: GameState = {
				...gameState,
				playerHand: emptyTransition
					? emptyTransition.resolution.playerHand
					: result.newHand,
				tavernDeck: emptyTransition
					? emptyTransition.resolution.tavernDeck
					: result.newTavernDeck,
				discardPile: emptyTransition
					? emptyTransition.resolution.discardPile
					: result.newDiscardPile,
				playedThisFight: allPlayedCards,
				currentDamage: newCurrentDamage,
				spadesShield: result.newShield,
				phase: emptyTransition
					? emptyTransition.resolution.phase
					: "player_turn",
				jestersAvailable: emptyTransition
					? emptyTransition.resolution.jestersAvailable
					: gameState.jestersAvailable,
				jestersUsed: emptyTransition
					? emptyTransition.resolution.jestersUsed
					: gameState.jestersUsed,
				stats: newStats,
			};

			if (emptyTransition?.usedJester) {
				queueAutoJesterSequence(
					buildAutoJesterDisplayState(
						next,
						emptyTransition.preDrawTavernDeck,
						emptyTransition.preDrawDiscardPile,
					),
					next,
					1,
				);
				return;
			}

			commitState(next, drewCardsFromPlay && next.phase !== "defeat");
			return;
		}

		// Mão vazia após jogar: tenta repor via Coringa antes de avaliar dano
		const emptyTransition = result.newHand.length === 0
			? resolveEmptyHandTransition(
				gameState,
				result.newTavernDeck,
				result.newDiscardPile,
			)
			: null;

		const activeHand = emptyTransition
			? emptyTransition.resolution.playerHand
			: result.newHand;
		const activeTavern = emptyTransition
			? emptyTransition.resolution.tavernDeck
			: result.newTavernDeck;
		const activeDiscard = emptyTransition
			? emptyTransition.resolution.discardPile
			: result.newDiscardPile;
		const activeJestersAvailable =
			emptyTransition?.resolution.jestersAvailable ?? gameState.jestersAvailable;
		const activeJestersUsed =
			emptyTransition?.resolution.jestersUsed ?? gameState.jestersUsed;

		const handValue = activeHand.reduce((sum, c) => sum + c.value, 0);

		if (handValue < effectiveAttack) {
			// Não consegue pagar o dano: usa Coringa para descartar tudo e reabastecer,
			// ou vai para derrota se não houver Coringas
			const cannotPayTransition = resolveCannotPayTransition(
				activeHand,
				activeTavern,
				activeDiscard,
				activeJestersAvailable,
				activeJestersUsed,
			);
			const next: GameState = {
				...gameState,
				playerHand: cannotPayTransition.resolution.playerHand,
				tavernDeck: cannotPayTransition.resolution.tavernDeck,
				discardPile: cannotPayTransition.resolution.discardPile,
				playedThisFight: allPlayedCards,
				currentDamage: newCurrentDamage,
				spadesShield: result.newShield,
				pendingDamage:
					cannotPayTransition.resolution.phase === "defeat"
						? effectiveAttack
						: 0,
				phase: cannotPayTransition.resolution.phase,
				jestersAvailable: cannotPayTransition.resolution.jestersAvailable,
				jestersUsed: cannotPayTransition.resolution.jestersUsed,
				stats: newStats,
			};

			const autoJesterUses = next.jestersUsed - gameState.jestersUsed;

			if (cannotPayTransition.usedJester) {
				queueAutoJesterSequence(
					buildAutoJesterDisplayState(
						next,
						cannotPayTransition.preDrawTavernDeck,
						cannotPayTransition.preDrawDiscardPile,
					),
					next,
					autoJesterUses,
				);
				return;
			}

			if (emptyTransition?.usedJester) {
				queueAutoJesterSequence(
					buildAutoJesterDisplayState(
						next,
						emptyTransition.preDrawTavernDeck,
						emptyTransition.preDrawDiscardPile,
					),
					next,
					1,
				);
				return;
			}

			commitState(next, drewCardsFromPlay && next.phase !== "defeat");
			return;
		}

		const next: GameState = {
			...gameState,
			playerHand: activeHand,
			tavernDeck: activeTavern,
			discardPile: activeDiscard,
			playedThisFight: allPlayedCards,
			currentDamage: newCurrentDamage,
			spadesShield: result.newShield,
			pendingDamage: effectiveAttack,
			phase: "suffer_damage",
			jestersAvailable: activeJestersAvailable,
			jestersUsed: activeJestersUsed,
			stats: newStats,
		};

		if (emptyTransition?.usedJester) {
			queueAutoJesterSequence(
				buildAutoJesterDisplayState(
					next,
					emptyTransition.preDrawTavernDeck,
					emptyTransition.preDrawDiscardPile,
				),
				next,
				1,
			);
			return;
		}

		commitState(next, drewCardsFromPlay && next.phase !== "defeat");
	};

	// ─── Passar turno ─────────────────────────────────────────────────────────
	const yieldTurn = () => {
		if (autoJesterPending) return;
		if (gameState.phase !== "player_turn") return;
		const enemy = gameState.castle[0];
		if (!enemy) return;

		const effectiveAttack = Math.max(0, enemy.attack - gameState.spadesShield);
		if (effectiveAttack === 0) return;

		const handValue = gameState.playerHand.reduce((sum, c) => sum + c.value, 0);

		if (handValue < effectiveAttack) {
			const cannotPayTransition = resolveCannotPayTransition(
				gameState.playerHand,
				gameState.tavernDeck,
				gameState.discardPile,
				gameState.jestersAvailable,
				gameState.jestersUsed,
			);
			const next: GameState = {
				...gameState,
				playerHand: cannotPayTransition.resolution.playerHand,
				tavernDeck: cannotPayTransition.resolution.tavernDeck,
				discardPile: cannotPayTransition.resolution.discardPile,
				pendingDamage:
					cannotPayTransition.resolution.phase === "defeat"
						? effectiveAttack
						: 0,
				phase: cannotPayTransition.resolution.phase,
				jestersAvailable: cannotPayTransition.resolution.jestersAvailable,
				jestersUsed: cannotPayTransition.resolution.jestersUsed,
			};

			if (cannotPayTransition.usedJester) {
				queueAutoJesterSequence(
					buildAutoJesterDisplayState(
						next,
						cannotPayTransition.preDrawTavernDeck,
						cannotPayTransition.preDrawDiscardPile,
					),
					next,
					1,
				);
				return;
			}

			commitState(next);
			return;
		}

		const next: GameState = {
			...gameState,
			pendingDamage: effectiveAttack,
			phase: "suffer_damage",
		};
		commitState(next);
	};

	// ─── Confirmar descarte ───────────────────────────────────────────────────
	const confirmDiscard = () => {
		if (autoJesterPending) return;
		if (gameState.phase !== "suffer_damage") return;

		const selected = gameState.playerHand.filter((c) => selectedIds.has(c.id));
		const total = selected.reduce((sum, c) => sum + c.value, 0);

		if (total < gameState.pendingDamage) {
			setPlayError(
				t("game.errors.discardNotEnough", {
					needed: gameState.pendingDamage,
					current: total,
				}),
			);
			return;
		}

		setPlayError(null);
		setSelectedIds(new Set());

		const newHand = gameState.playerHand.filter((c) => !selectedIds.has(c.id));
		const newDiscard = [...gameState.discardPile, ...selected];
		const newDiscardedThisFight = [...gameState.discardedThisFight, ...selected];
		const newStats: GameStats = {
			...gameState.stats,
			discardedCards: [...gameState.stats.discardedCards, ...selected],
		};

		if (newHand.length === 0) {
			const emptyTransition = resolveEmptyHandTransition(
				gameState,
				gameState.tavernDeck,
				newDiscard,
			);
			const next: GameState = {
				...gameState,
				playerHand: emptyTransition.resolution.playerHand,
				tavernDeck: emptyTransition.resolution.tavernDeck,
				discardPile: emptyTransition.resolution.discardPile,
				discardedThisFight: newDiscardedThisFight,
				pendingDamage: 0,
				phase: emptyTransition.resolution.phase,
				jestersAvailable: emptyTransition.resolution.jestersAvailable,
				jestersUsed: emptyTransition.resolution.jestersUsed,
				stats: newStats,
			};

			if (emptyTransition.usedJester) {
				queueAutoJesterSequence(
					buildAutoJesterDisplayState(
						next,
						emptyTransition.preDrawTavernDeck,
						emptyTransition.preDrawDiscardPile,
					),
					next,
					1,
				);
				return;
			}

			commitState(next);
			return;
		}

		const next: GameState = {
			...gameState,
			playerHand: newHand,
			discardPile: newDiscard,
			discardedThisFight: newDiscardedThisFight,
			pendingDamage: 0,
			phase: "player_turn",
			stats: newStats,
		};
		commitState(next);
	};

	// ─── Ordenação ────────────────────────────────────────────────────────────
	const RANK_ORDER: Record<string, number> = {
		Jester: 0, A: 1,
		"2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
		"7": 7, "8": 8, "9": 9, "10": 10,
		J: 11, Q: 12, K: 13,
	};
	const SUIT_ORDER: Record<string, number> = {
		hearts: 0, diamonds: 1, clubs: 2, spades: 3,
	};

	const sortHand = () => {
		setGameState((prev) => ({
			...prev,
			playerHand: [...prev.playerHand].sort((a, b) => {
				const rankDiff = (RANK_ORDER[a.rank] ?? 0) - (RANK_ORDER[b.rank] ?? 0);
				if (rankDiff !== 0) return rankDiff;
				return (SUIT_ORDER[a.suit ?? ""] ?? 0) - (SUIT_ORDER[b.suit ?? ""] ?? 0);
			}),
		}));
	};

	const sortHandByClass = () => {
		setGameState((prev) => ({
			...prev,
			playerHand: [...prev.playerHand].sort((a, b) =>
				(SUIT_ORDER[a.suit ?? ""] ?? 0) - (SUIT_ORDER[b.suit ?? ""] ?? 0),
			),
		}));
	};

	const resetGame = () => {
		const next = createInitialState();
		resetAutoJesterQueue();
		setSelectedIds(new Set());
		setPlayError(null);
		setGameState(next);
		bumpDeal();
		persist(next);
	};

	// ─── Derivados ────────────────────────────────────────────────────────────
	const selectedCards = gameState.playerHand.filter((c) => selectedIds.has(c.id));
	const selectedTotal = selectedCards.reduce((sum, c) => sum + c.value, 0);
	const currentEnemy = gameState.castle[0] ?? null;
	const currentHP = currentEnemy ? currentEnemy.health - gameState.currentDamage : 0;
	const effectiveAttack = currentEnemy
		? Math.max(0, currentEnemy.attack - gameState.spadesShield)
		: 0;

	// ─── Preview de seleção (antes de jogar) ──────────────────────────────────
	let previewDamage = 0;
	let previewShieldGain = 0;
	if (currentEnemy && selectedCards.length > 0 && gameState.phase === "player_turn") {
		const isJesterSelected = selectedCards.some((c) => c.rank === "Jester");
		if (!isJesterSelected) {
			const attackValue = selectedTotal;
			const suitsPlayed = new Set(
				selectedCards.map((c) => c.suit).filter((s): s is Suit => s !== null),
			);
			const isImmune = (s: Suit) => !gameState.jesterActive && currentEnemy.suit === s;
			let clubsMultiplier = 1;
			for (const s of suitsPlayed) {
				if (isImmune(s)) continue;
				if (s === "clubs") clubsMultiplier = 2;
				if (s === "spades") previewShieldGain = attackValue;
			}
			previewDamage = attackValue * clubsMultiplier;
		}
	}

	return {
		gameState,
		selectedIds,
		playError,
		currentEnemy,
		currentHP,
		effectiveAttack,
		selectedCards,
		selectedTotal,
		previewDamage,
		previewShieldGain,
		defeatedEnemies: gameState.defeatedEnemies,
		cardsDrawnSignal,
		dealSignal,
		autoJesterSignal,
		autoJesterPending,
		toggleCard,
		playSelected,
		yieldTurn,
		confirmDiscard,
		completeAutoJesterAnimation,
		useJester,
		sortHand,
		sortHandByClass,
		resetGame,
	};
};
