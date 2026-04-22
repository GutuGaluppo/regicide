import { buildCastle } from "@/data/buildCastle";
import { createTavernDeck, HAND_SIZE } from "@/data/deck";
import { Card, GameState, GameStats, Suit } from "@/data/types";
import { loadGame, saveGame } from "@/services/storage";
import { enemyToCard, resolvePlay, validatePlay } from "@/utils/gameLogic";
import { t } from "i18next";
import { create } from "zustand";

const PLAYER_COUNT = 1 as const;
const MAX_HAND = HAND_SIZE[PLAYER_COUNT];

// ─── Estado inicial ───────────────────────────────────────────────────────────

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
	const resolution = resolveCannotPay(hand, tavernDeck, discardPile, jestersAvailable, jestersUsed);
	return {
		resolution,
		usedJester: resolution.jestersUsed > jestersUsed,
		preDrawTavernDeck: tavernDeck,
		preDrawDiscardPile: [...discardPile, ...hand],
	};
};

// ─── Ordenação ────────────────────────────────────────────────────────────────

const RANK_ORDER: Record<string, number> = {
	Jester: 0, A: 1,
	"2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
	"7": 7, "8": 8, "9": 9, "10": 10,
	J: 11, Q: 12, K: 13,
};
const SUIT_ORDER: Record<string, number> = {
	hearts: 0, diamonds: 1, clubs: 2, spades: 3,
};

// ─── Tipagem do store ─────────────────────────────────────────────────────────

type PendingAutoJester = {
	usesRemaining: number;
	finalState: GameState;
	shouldBumpDraw: boolean;
};

export interface GameStore {
	// Estado do jogo
	gameState: GameState;
	selectedIds: Set<string>;
	playError: string | null;

	// Sinais de animação
	cardsDrawnSignal: number;
	dealSignal: number;
	autoJesterSignal: number;
	autoJesterPending: boolean;

	// Fila interna de animação de Coringa automático
	_pendingAutoJester: PendingAutoJester | null;

	// Controle de inicialização
	_initialized: boolean;

	// Derivados
	selectedCards: Card[];
	selectedTotal: number;
	currentEnemy: ReturnType<typeof buildCastle>[number] | null;
	currentHP: number;
	effectiveAttack: number;
	previewDamage: number;
	previewShieldGain: number;

	// Ações públicas
	initialize: () => Promise<void>;
	toggleCard: (card: Card) => void;
	playSelected: () => void;
	yieldTurn: () => void;
	confirmDiscard: () => void;
	useJester: () => void;
	completeAutoJesterAnimation: (signal: number) => void;
	sortHand: () => void;
	sortHandByClass: () => void;
	resetGame: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>((set, get) => {
	// ── Helpers internos ──────────────────────────────────────────────────────

	const persist = async (state: GameState) => {
		try {
			await saveGame(state);
		} catch {
			// falha não-crítica
		}
	};

	const computeDerived = (gameState: GameState, selectedIds: Set<string>) => {
		const selectedCards = gameState.playerHand.filter((c) => selectedIds.has(c.id));
		const selectedTotal = selectedCards.reduce((sum, c) => sum + c.value, 0);
		const currentEnemy = gameState.castle[0] ?? null;
		const currentHP = currentEnemy ? currentEnemy.health - gameState.currentDamage : 0;
		const effectiveAttack = currentEnemy
			? Math.max(0, currentEnemy.attack - gameState.spadesShield)
			: 0;

		let previewDamage = 0;
		let previewShieldGain = 0;
		if (currentEnemy && selectedCards.length > 0 && gameState.phase === "player_turn") {
			const isJesterSelected = selectedCards.some((c) => c.rank === "Jester");
			if (!isJesterSelected) {
				const suitsPlayed = new Set(
					selectedCards.map((c) => c.suit).filter((s): s is Suit => s !== null),
				);
				const isImmune = (s: Suit) => !gameState.jesterActive && currentEnemy.suit === s;
				let clubsMultiplier = 1;
				for (const s of suitsPlayed) {
					if (isImmune(s)) continue;
					if (s === "clubs") clubsMultiplier = 2;
					if (s === "spades") previewShieldGain = selectedTotal;
				}
				previewDamage = selectedTotal * clubsMultiplier;
			}
		}

		return { selectedCards, selectedTotal, currentEnemy, currentHP, effectiveAttack, previewDamage, previewShieldGain };
	};

	const setWithDerived = (
		gameState: GameState,
		selectedIds: Set<string>,
		extra?: Partial<GameStore>,
	) => {
		set({ gameState, selectedIds, ...computeDerived(gameState, selectedIds), ...extra });
	};

	const commitState = (next: GameState, shouldBumpDraw = false) => {
		const { selectedIds } = get();
		set((s) => ({
			_pendingAutoJester: null,
			autoJesterPending: false,
			...(shouldBumpDraw ? { cardsDrawnSignal: s.cardsDrawnSignal + 1 } : {}),
		}));
		setWithDerived(next, selectedIds);
		persist(next);
	};

	const emitAutoJesterSignal = () => {
		set((s) => ({ autoJesterSignal: s.autoJesterSignal + 1 }));
	};

	const resetAutoJesterQueue = () => {
		set({ _pendingAutoJester: null, autoJesterPending: false, autoJesterSignal: 0 });
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
		const { selectedIds } = get();
		set({
			_pendingAutoJester: {
				usesRemaining: uses,
				finalState,
				shouldBumpDraw: finalState.phase !== "defeat" && finalState.playerHand.length > 0,
			},
			autoJesterPending: true,
		});
		setWithDerived(displayState, selectedIds);
		emitAutoJesterSignal();
	};

	const buildAutoJesterDisplayState = (
		preActionGameState: GameState,
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
		jestersAvailable: preActionGameState.jestersAvailable,
		jestersUsed: preActionGameState.jestersUsed,
	});

	// ── Estado inicial ────────────────────────────────────────────────────────

	const initialGameState = createInitialState();
	const initialSelectedIds = new Set<string>();
	const initialDerived = computeDerived(initialGameState, initialSelectedIds);

	return {
		// Estado
		gameState: initialGameState,
		selectedIds: initialSelectedIds,
		playError: null,
		cardsDrawnSignal: 0,
		dealSignal: 0,
		autoJesterSignal: 0,
		autoJesterPending: false,
		_pendingAutoJester: null,
		_initialized: false,

		// Derivados
		...initialDerived,

		// ── Inicialização ─────────────────────────────────────────────────────
		initialize: async () => {
			if (get()._initialized) return;
			set({ _initialized: true });
			try {
				const saved = await loadGame();
				if (saved) {
					const restoredState: GameState = {
						...saved,
						defeatedEnemies: saved.defeatedEnemies ?? [],
						jestersAvailable: (saved as GameState).jestersAvailable ?? 2,
						jestersUsed: (saved as GameState).jestersUsed ?? 0,
						discardedThisFight: (saved as GameState).discardedThisFight ?? [],
						stats: (saved as GameState).stats ?? emptyStats(),
					};
					setWithDerived(restoredState, new Set<string>());
				} else {
					set((s) => ({ dealSignal: s.dealSignal + 1 }));
				}
			} catch {
				set((s) => ({ dealSignal: s.dealSignal + 1 }));
			}
		},

		// ── Selecionar carta ──────────────────────────────────────────────────
		toggleCard: (card: Card) => {
			const { autoJesterPending, gameState, selectedIds } = get();
			if (autoJesterPending) return;
			if (gameState.phase !== "player_turn" && gameState.phase !== "suffer_damage") return;

			const next = new Set(selectedIds);
			if (next.has(card.id)) {
				next.delete(card.id);
			} else {
				next.add(card.id);
			}

			set({ playError: null, selectedIds: next, ...computeDerived(gameState, next) });
		},

		// ── Usar Jester (cancela imunidade) ───────────────────────────────────
		useJester: () => {
			const { autoJesterPending, gameState } = get();
			if (autoJesterPending) return;
			if (gameState.phase !== "player_turn") return;
			if (gameState.jestersAvailable <= 0) return;
			const next: GameState = {
				...gameState,
				jestersAvailable: gameState.jestersAvailable - 1,
				jestersUsed: gameState.jestersUsed + 1,
				jesterActive: true,
			};
			setWithDerived(next, get().selectedIds);
			persist(next);
		},

		// ── Jogar cartas ──────────────────────────────────────────────────────
		playSelected: () => {
			const { autoJesterPending, gameState, selectedIds } = get();
			if (autoJesterPending) return;
			if (gameState.phase !== "player_turn") return;

			const selected = gameState.playerHand.filter((c) => selectedIds.has(c.id));
			const validation = validatePlay(selected);
			if (!validation.valid) {
				set({ playError: validation.reason });
				return;
			}

			set({ playError: null, selectedIds: new Set(), ...computeDerived(gameState, new Set()) });

			const enemy = gameState.castle[0];
			const result = resolvePlay(selected, gameState, MAX_HAND);

			const newStats: GameStats = {
				...gameState.stats,
				turnsPlayed: gameState.stats.turnsPlayed + 1,
				cardsPerTurn: [...gameState.stats.cardsPerTurn, selected],
			};

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
				setWithDerived(next, new Set());
				persist(next);
				return;
			}

			const handSizeAfterPlay = gameState.playerHand.length - selected.length;
			const drewCardsFromPlay = result.newHand.length > handSizeAfterPlay;

			const newCurrentDamage = gameState.currentDamage + result.totalDamage;
			const allPlayedCards = [...gameState.playedThisFight, ...selected];

			// Inimigo derrotado
			if (newCurrentDamage >= enemy.health) {
				const exactKill = newCurrentDamage === enemy.health;
				const enemyCard = enemyToCard(enemy);
				const newTavern = exactKill ? [enemyCard, ...result.newTavernDeck] : result.newTavernDeck;
				const newDiscard = exactKill
					? [...result.newDiscardPile, ...allPlayedCards]
					: [...result.newDiscardPile, ...allPlayedCards, enemyCard];

				const [, ...restCastle] = gameState.castle;
				const defeatedStats: GameStats = {
					...newStats,
					enemyKills: [
						...newStats.enemyKills,
						{ enemy, allCards: allPlayedCards, discardedCards: gameState.discardedThisFight },
					],
				};

				if (restCastle.length === 0) {
					commitState({
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
					});
					return;
				}

				const emptyTransition = result.newHand.length === 0
					? resolveEmptyHandTransition(gameState, newTavern, newDiscard)
					: null;

				const next: GameState = {
					...gameState,
					castle: restCastle,
					defeatedEnemies: [...gameState.defeatedEnemies, enemy],
					playerHand: emptyTransition?.resolution.playerHand ?? result.newHand,
					tavernDeck: emptyTransition?.resolution.tavernDeck ?? newTavern,
					discardPile: emptyTransition?.resolution.discardPile ?? newDiscard,
					playedThisFight: [],
					discardedThisFight: [],
					currentDamage: 0,
					spadesShield: 0,
					jesterActive: false,
					pendingDamage: 0,
					phase: emptyTransition?.resolution.phase ?? "player_turn",
					jestersAvailable: emptyTransition?.resolution.jestersAvailable ?? gameState.jestersAvailable,
					jestersUsed: emptyTransition?.resolution.jestersUsed ?? gameState.jestersUsed,
					stats: defeatedStats,
				};

				if (emptyTransition?.usedJester) {
					queueAutoJesterSequence(
						buildAutoJesterDisplayState(gameState, next, emptyTransition.preDrawTavernDeck, emptyTransition.preDrawDiscardPile),
						next,
						1,
					);
					return;
				}

				commitState(next, drewCardsFromPlay && next.phase !== "defeat");
				return;
			}

			// Inimigo não derrotado
			const effectiveAttack = Math.max(0, enemy.attack - result.newShield);

			if (effectiveAttack === 0) {
				const emptyTransition = result.newHand.length === 0
					? resolveEmptyHandTransition(gameState, result.newTavernDeck, result.newDiscardPile)
					: null;

				const next: GameState = {
					...gameState,
					playerHand: emptyTransition?.resolution.playerHand ?? result.newHand,
					tavernDeck: emptyTransition?.resolution.tavernDeck ?? result.newTavernDeck,
					discardPile: emptyTransition?.resolution.discardPile ?? result.newDiscardPile,
					playedThisFight: allPlayedCards,
					currentDamage: newCurrentDamage,
					spadesShield: result.newShield,
					phase: emptyTransition?.resolution.phase ?? "player_turn",
					jestersAvailable: emptyTransition?.resolution.jestersAvailable ?? gameState.jestersAvailable,
					jestersUsed: emptyTransition?.resolution.jestersUsed ?? gameState.jestersUsed,
					stats: newStats,
				};

				if (emptyTransition?.usedJester) {
					queueAutoJesterSequence(
						buildAutoJesterDisplayState(gameState, next, emptyTransition.preDrawTavernDeck, emptyTransition.preDrawDiscardPile),
						next,
						1,
					);
					return;
				}

				commitState(next, drewCardsFromPlay && next.phase !== "defeat");
				return;
			}

			const emptyTransition = result.newHand.length === 0
				? resolveEmptyHandTransition(gameState, result.newTavernDeck, result.newDiscardPile)
				: null;

			const activeHand = emptyTransition?.resolution.playerHand ?? result.newHand;
			const activeTavern = emptyTransition?.resolution.tavernDeck ?? result.newTavernDeck;
			const activeDiscard = emptyTransition?.resolution.discardPile ?? result.newDiscardPile;
			const activeJestersAvailable = emptyTransition?.resolution.jestersAvailable ?? gameState.jestersAvailable;
			const activeJestersUsed = emptyTransition?.resolution.jestersUsed ?? gameState.jestersUsed;

			const handValue = activeHand.reduce((sum, c) => sum + c.value, 0);

			if (handValue < effectiveAttack) {
				const cannotPayTransition = resolveCannotPayTransition(
					activeHand, activeTavern, activeDiscard, activeJestersAvailable, activeJestersUsed,
				);
				const next: GameState = {
					...gameState,
					playerHand: cannotPayTransition.resolution.playerHand,
					tavernDeck: cannotPayTransition.resolution.tavernDeck,
					discardPile: cannotPayTransition.resolution.discardPile,
					playedThisFight: allPlayedCards,
					currentDamage: newCurrentDamage,
					spadesShield: result.newShield,
					pendingDamage: cannotPayTransition.resolution.phase === "defeat" ? effectiveAttack : 0,
					phase: cannotPayTransition.resolution.phase,
					jestersAvailable: cannotPayTransition.resolution.jestersAvailable,
					jestersUsed: cannotPayTransition.resolution.jestersUsed,
					stats: newStats,
				};

				const autoJesterUses = next.jestersUsed - gameState.jestersUsed;

				if (cannotPayTransition.usedJester) {
					queueAutoJesterSequence(
						buildAutoJesterDisplayState(gameState, next, cannotPayTransition.preDrawTavernDeck, cannotPayTransition.preDrawDiscardPile),
						next,
						autoJesterUses,
					);
					return;
				}

				if (emptyTransition?.usedJester) {
					queueAutoJesterSequence(
						buildAutoJesterDisplayState(gameState, next, emptyTransition.preDrawTavernDeck, emptyTransition.preDrawDiscardPile),
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
					buildAutoJesterDisplayState(gameState, next, emptyTransition.preDrawTavernDeck, emptyTransition.preDrawDiscardPile),
					next,
					1,
				);
				return;
			}

			commitState(next, drewCardsFromPlay && next.phase !== "defeat");
		},

		// ── Passar turno ──────────────────────────────────────────────────────
		yieldTurn: () => {
			const { autoJesterPending, gameState } = get();
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
					pendingDamage: cannotPayTransition.resolution.phase === "defeat" ? effectiveAttack : 0,
					phase: cannotPayTransition.resolution.phase,
					jestersAvailable: cannotPayTransition.resolution.jestersAvailable,
					jestersUsed: cannotPayTransition.resolution.jestersUsed,
				};

				if (cannotPayTransition.usedJester) {
					queueAutoJesterSequence(
						buildAutoJesterDisplayState(gameState, next, cannotPayTransition.preDrawTavernDeck, cannotPayTransition.preDrawDiscardPile),
						next,
						1,
					);
					return;
				}

				commitState(next);
				return;
			}

			commitState({ ...gameState, pendingDamage: effectiveAttack, phase: "suffer_damage" });
		},

		// ── Confirmar descarte ────────────────────────────────────────────────
		confirmDiscard: () => {
			const { autoJesterPending, gameState, selectedIds } = get();
			if (autoJesterPending) return;
			if (gameState.phase !== "suffer_damage") return;

			const selected = gameState.playerHand.filter((c) => selectedIds.has(c.id));
			const total = selected.reduce((sum, c) => sum + c.value, 0);

			if (total < gameState.pendingDamage) {
					set({
						playError: t("game.errors.discardNotEnough", {
							needed: gameState.pendingDamage,
							current: total,
						}),
				});
				return;
			}

			set({ playError: null, selectedIds: new Set(), ...computeDerived(gameState, new Set()) });

			const newHand = gameState.playerHand.filter((c) => !selectedIds.has(c.id));
			const newDiscard = [...gameState.discardPile, ...selected];
			const newDiscardedThisFight = [...gameState.discardedThisFight, ...selected];
			const newStats: GameStats = {
				...gameState.stats,
				discardedCards: [...gameState.stats.discardedCards, ...selected],
			};

			if (newHand.length === 0) {
				const emptyTransition = resolveEmptyHandTransition(gameState, gameState.tavernDeck, newDiscard);
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
						buildAutoJesterDisplayState(gameState, next, emptyTransition.preDrawTavernDeck, emptyTransition.preDrawDiscardPile),
						next,
						1,
					);
					return;
				}

				commitState(next);
				return;
			}

			commitState({
				...gameState,
				playerHand: newHand,
				discardPile: newDiscard,
				discardedThisFight: newDiscardedThisFight,
				pendingDamage: 0,
				phase: "player_turn",
				stats: newStats,
			});
		},

		// ── Animação de Coringa automático ────────────────────────────────────
		completeAutoJesterAnimation: (signal: number) => {
			const { autoJesterSignal, _pendingAutoJester } = get();
			if (signal !== autoJesterSignal) return;
			if (!_pendingAutoJester) return;

			if (_pendingAutoJester.usesRemaining > 1) {
				set((s) => ({
					_pendingAutoJester: s._pendingAutoJester
						? { ...s._pendingAutoJester, usesRemaining: s._pendingAutoJester.usesRemaining - 1 }
						: null,
				}));
				emitAutoJesterSignal();
				return;
			}

			commitState(_pendingAutoJester.finalState, _pendingAutoJester.shouldBumpDraw);
		},

		// ── Ordenação ─────────────────────────────────────────────────────────
		sortHand: () => {
			const { gameState, selectedIds } = get();
			const sorted: GameState = {
				...gameState,
				playerHand: [...gameState.playerHand].sort((a, b) => {
					const rankDiff = (RANK_ORDER[a.rank] ?? 0) - (RANK_ORDER[b.rank] ?? 0);
					if (rankDiff !== 0) return rankDiff;
					return (SUIT_ORDER[a.suit ?? ""] ?? 0) - (SUIT_ORDER[b.suit ?? ""] ?? 0);
				}),
			};
			setWithDerived(sorted, selectedIds);
		},

		sortHandByClass: () => {
			const { gameState, selectedIds } = get();
			const sorted: GameState = {
				...gameState,
				playerHand: [...gameState.playerHand].sort(
					(a, b) => (SUIT_ORDER[a.suit ?? ""] ?? 0) - (SUIT_ORDER[b.suit ?? ""] ?? 0),
				),
			};
			setWithDerived(sorted, selectedIds);
		},

		// ── Reset ─────────────────────────────────────────────────────────────
		resetGame: () => {
			const next = createInitialState();
			resetAutoJesterQueue();
			set((s) => ({
				selectedIds: new Set(),
				playError: null,
				dealSignal: s.dealSignal + 1,
				...computeDerived(next, new Set()),
			}));
			setWithDerived(next, new Set());
			persist(next);
		},
	};
});
