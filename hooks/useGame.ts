import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createTavernDeck, HAND_SIZE } from "../data/deck";
import { createCastleDeck } from "../data/enemies";
import { Card, Enemy, GamePhase, GameState, GameStats, Suit } from "../data/types";
import { loadGame, saveGame } from "../services/storage";
import { enemyToCard, resolvePlay, validatePlay } from "../utils/gameLogic";
import { shuffle } from "../utils/shuffle";

const PLAYER_COUNT = 1 as const;
const MAX_HAND = HAND_SIZE[PLAYER_COUNT];

const buildCastle = (): Enemy[] => {
	const all = createCastleDeck();
	const jacks = shuffle(all.filter((e) => e.rank === "J"));
	const queens = shuffle(all.filter((e) => e.rank === "Q"));
	const kings = shuffle(all.filter((e) => e.rank === "K"));
	return [...jacks, ...queens, ...kings];
};

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

// ─── Empty-hand resolution helper ──────────────────────────────────────────
const resolveEmptyHand = (
	state: GameState,
	tavernDeck: Card[],
	discardPile: Card[],
): Pick<GameState, "playerHand" | "tavernDeck" | "discardPile" | "jestersAvailable" | "jestersUsed" | "phase"> => {
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

export const useGame = () => {
	const { t } = useTranslation();
	const [gameState, setGameState] = useState<GameState>(createInitialState);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [playError, setPlayError] = useState<string | null>(null);
	const [cardsDrawnSignal, setCardsDrawnSignal] = useState(0);
	const bumpDraw = () => setCardsDrawnSignal((s) => s + 1);

	useEffect(() => {
		let active = true;
		const init = async () => {
			try {
				const saved = await loadGame();
				if (!active) return;
				if (saved)
					setGameState({
						...saved,
						defeatedEnemies: saved.defeatedEnemies ?? [],
						jestersAvailable: (saved as GameState).jestersAvailable ?? 2,
						jestersUsed: (saved as GameState).jestersUsed ?? 0,
						stats: (saved as GameState).stats ?? emptyStats(),
					} as GameState);
			} catch {
				// usa estado inicial
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

	const toggleCard = (card: Card) => {
		if (gameState.phase !== "player_turn" && gameState.phase !== "suffer_damage") return;
		setPlayError(null);
		setSelectedIds((prev) => {
			const next = new Set(prev);
			next.has(card.id) ? next.delete(card.id) : next.add(card.id);
			return next;
		});
	};

	// ─── Usar Jester (cancela imunidade) ──────────────────────────────────────
	const useJester = () => {
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
		if (result.newHand.length > handSizeAfterPlay) bumpDraw();

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
				enemyKills: [...newStats.enemyKills, { enemy, allCards: allPlayedCards }],
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
					currentDamage: 0,
					spadesShield: 0,
					jesterActive: false,
					pendingDamage: 0,
					phase: "victory",
					stats: defeatedStats,
				};
				setGameState(next);
				persist(next);
				return;
			}

			// Verifica mão vazia após derrota do inimigo
			const emptyResolution = result.newHand.length === 0
				? resolveEmptyHand(
					{ ...gameState, jestersAvailable: gameState.jestersAvailable, jestersUsed: gameState.jestersUsed },
					newTavern,
					newDiscard,
				)
				: null;

			if (emptyResolution && emptyResolution.playerHand.length > 0) bumpDraw();

			const next: GameState = {
				...gameState,
				castle: restCastle,
				defeatedEnemies: [...gameState.defeatedEnemies, enemy],
				playerHand: emptyResolution ? emptyResolution.playerHand : result.newHand,
				tavernDeck: emptyResolution ? emptyResolution.tavernDeck : newTavern,
				discardPile: emptyResolution ? emptyResolution.discardPile : newDiscard,
				playedThisFight: [],
				currentDamage: 0,
				spadesShield: 0,
				jesterActive: false,
				pendingDamage: 0,
				phase: emptyResolution ? emptyResolution.phase : "player_turn",
				jestersAvailable: emptyResolution ? emptyResolution.jestersAvailable : gameState.jestersAvailable,
				jestersUsed: emptyResolution ? emptyResolution.jestersUsed : gameState.jestersUsed,
				stats: defeatedStats,
			};
			setGameState(next);
			persist(next);
			return;
		}

		// Inimigo não derrotado — verificar dano
		const effectiveAttack = Math.max(0, enemy.attack - result.newShield);

		if (effectiveAttack === 0) {
			// Totalmente bloqueado por espadas
			const emptyResolution = result.newHand.length === 0
				? resolveEmptyHand(gameState, result.newTavernDeck, result.newDiscardPile)
				: null;

			if (emptyResolution && emptyResolution.playerHand.length > 0) bumpDraw();

			const next: GameState = {
				...gameState,
				playerHand: emptyResolution ? emptyResolution.playerHand : result.newHand,
				tavernDeck: emptyResolution ? emptyResolution.tavernDeck : result.newTavernDeck,
				discardPile: emptyResolution ? emptyResolution.discardPile : result.newDiscardPile,
				playedThisFight: allPlayedCards,
				currentDamage: newCurrentDamage,
				spadesShield: result.newShield,
				phase: emptyResolution ? emptyResolution.phase : "player_turn",
				jestersAvailable: emptyResolution ? emptyResolution.jestersAvailable : gameState.jestersAvailable,
				jestersUsed: emptyResolution ? emptyResolution.jestersUsed : gameState.jestersUsed,
				stats: newStats,
			};
			setGameState(next);
			persist(next);
			return;
		}

		const handValue = result.newHand.reduce((sum, c) => sum + c.value, 0);
		const canSatisfy = handValue >= effectiveAttack;
		const newPhase: GamePhase = canSatisfy ? "suffer_damage" : "defeat";

		const next: GameState = {
			...gameState,
			playerHand: result.newHand,
			tavernDeck: result.newTavernDeck,
			discardPile: result.newDiscardPile,
			playedThisFight: allPlayedCards,
			currentDamage: newCurrentDamage,
			spadesShield: result.newShield,
			pendingDamage: effectiveAttack,
			phase: newPhase,
			stats: newStats,
		};
		setGameState(next);
		persist(next);
	};

	// ─── Passar turno ─────────────────────────────────────────────────────────
	const yieldTurn = () => {
		if (gameState.phase !== "player_turn") return;
		const enemy = gameState.castle[0];
		if (!enemy) return;

		const effectiveAttack = Math.max(0, enemy.attack - gameState.spadesShield);
		if (effectiveAttack === 0) return;

		const handValue = gameState.playerHand.reduce((sum, c) => sum + c.value, 0);
		const newPhase: GamePhase = handValue >= effectiveAttack ? "suffer_damage" : "defeat";

		const next: GameState = {
			...gameState,
			pendingDamage: effectiveAttack,
			phase: newPhase,
		};
		setGameState(next);
		persist(next);
	};

	// ─── Confirmar descarte ───────────────────────────────────────────────────
	const confirmDiscard = () => {
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
		const newStats: GameStats = {
			...gameState.stats,
			discardedCards: [...gameState.stats.discardedCards, ...selected],
		};

		if (newHand.length === 0) {
			const emptyResolution = resolveEmptyHand(gameState, gameState.tavernDeck, newDiscard);
			if (emptyResolution.playerHand.length > 0) bumpDraw();
			const next: GameState = {
				...gameState,
				playerHand: emptyResolution.playerHand,
				tavernDeck: emptyResolution.tavernDeck,
				discardPile: emptyResolution.discardPile,
				pendingDamage: 0,
				phase: emptyResolution.phase,
				jestersAvailable: emptyResolution.jestersAvailable,
				jestersUsed: emptyResolution.jestersUsed,
				stats: newStats,
			};
			setGameState(next);
			persist(next);
			return;
		}

		const next: GameState = {
			...gameState,
			playerHand: newHand,
			discardPile: newDiscard,
			pendingDamage: 0,
			phase: "player_turn",
			stats: newStats,
		};
		setGameState(next);
		persist(next);
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
		setSelectedIds(new Set());
		setPlayError(null);
		setGameState(next);
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
		toggleCard,
		playSelected,
		yieldTurn,
		confirmDiscard,
		useJester,
		sortHand,
		sortHandByClass,
		resetGame,
	};
};
