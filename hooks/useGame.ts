// /hooks/useGame.ts
import { useEffect, useState } from "react";
import { createTavernDeck, HAND_SIZE } from "../data/deck";
import { createCastleDeck } from "../data/enemies";
import { Card, Enemy, GamePhase, GameState } from "../data/types";
import { loadGame, saveGame } from "../services/storage";
import { shuffle } from "../utils/shuffle";
import { enemyToCard, resolvePlay, validatePlay } from "../utils/gameLogic";

const PLAYER_COUNT = 2 as const;
const MAX_HAND = HAND_SIZE[PLAYER_COUNT];

const buildCastle = (): Enemy[] => {
	const all = createCastleDeck();
	const jacks = shuffle(all.filter((e) => e.rank === "J"));
	const queens = shuffle(all.filter((e) => e.rank === "Q"));
	const kings = shuffle(all.filter((e) => e.rank === "K"));
	// Valetes em cima, Reis em baixo (Valetes são encontrados primeiro)
	return [...jacks, ...queens, ...kings];
};

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
	};
};

export const useGame = () => {
	const [gameState, setGameState] = useState<GameState>(createInitialState);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [playError, setPlayError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		const init = async () => {
			try {
				const saved = await loadGame();
				if (!active) return;
				if (saved) setGameState({ ...saved, defeatedEnemies: saved.defeatedEnemies ?? [] } as GameState);
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
		if (gameState.phase !== "player_turn" && gameState.phase !== "suffer_damage")
			return;
		setPlayError(null);
		setSelectedIds((prev) => {
			const next = new Set(prev);
			next.has(card.id) ? next.delete(card.id) : next.add(card.id);
			return next;
		});
	};

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

		// Jester: cancela imunidade, pula passos 3 e 4
		if (result.isJester) {
			const next: GameState = {
				...gameState,
				playerHand: result.newHand,
				tavernDeck: result.newTavernDeck,
				discardPile: result.newDiscardPile,
				jesterActive: true,
				phase: "player_turn",
			};
			setGameState(next);
			persist(next);
			return;
		}

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
			const newPhase: GamePhase = restCastle.length === 0 ? "victory" : "player_turn";

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
				phase: newPhase,
			};
			setGameState(next);
			persist(next);
			return;
		}

		// Inimigo não derrotado — passo 4: sofrer dano
		const effectiveAttack = Math.max(0, enemy.attack - result.newShield);

		if (effectiveAttack === 0) {
			// Totalmente bloqueado por espadas
			const next: GameState = {
				...gameState,
				playerHand: result.newHand,
				tavernDeck: result.newTavernDeck,
				discardPile: result.newDiscardPile,
				playedThisFight: allPlayedCards,
				currentDamage: newCurrentDamage,
				spadesShield: result.newShield,
				phase: "player_turn",
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
		};
		setGameState(next);
		persist(next);
	};

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

	const confirmDiscard = () => {
		if (gameState.phase !== "suffer_damage") return;

		const selected = gameState.playerHand.filter((c) => selectedIds.has(c.id));
		const total = selected.reduce((sum, c) => sum + c.value, 0);

		if (total < gameState.pendingDamage) {
			setPlayError(
				`Selecione cartas com valor total ≥ ${gameState.pendingDamage} (atual: ${total})`
			);
			return;
		}

		setPlayError(null);
		setSelectedIds(new Set());

		const next: GameState = {
			...gameState,
			playerHand: gameState.playerHand.filter((c) => !selectedIds.has(c.id)),
			discardPile: [...gameState.discardPile, ...selected],
			pendingDamage: 0,
			phase: "player_turn",
		};
		setGameState(next);
		persist(next);
	};

	const resetGame = () => {
		const next = createInitialState();
		setSelectedIds(new Set());
		setPlayError(null);
		setGameState(next);
		persist(next);
	};

	// ─── Derivados ──────────────────────────────────────────────────────────────
	const selectedCards = gameState.playerHand.filter((c) => selectedIds.has(c.id));
	const selectedTotal = selectedCards.reduce((sum, c) => sum + c.value, 0);
	const currentEnemy = gameState.castle[0] ?? null;
	const currentHP = currentEnemy
		? currentEnemy.health - gameState.currentDamage
		: 0;
	const effectiveAttack = currentEnemy
		? Math.max(0, currentEnemy.attack - gameState.spadesShield)
		: 0;

	return {
		gameState,
		selectedIds,
		playError,
		currentEnemy,
		currentHP,
		effectiveAttack,
		selectedCards,
		selectedTotal,
		defeatedEnemies: gameState.defeatedEnemies,
		toggleCard,
		playSelected,
		yieldTurn,
		confirmDiscard,
		resetGame,
	};
};
