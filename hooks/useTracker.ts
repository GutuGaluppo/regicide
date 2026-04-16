import { useState } from "react";
import { createCastleDeck } from "../data/enemies";
import { CardRank, Enemy, EnemyRank, Suit } from "../data/types";
import { shuffle } from "../utils/shuffle";
import { cardValue } from "../utils/gameLogic";

export interface AttackResult {
	damage: number;
	shieldAdded: number;
	powerText: string;
	immune: boolean;
}

interface BlockedCard {
	suit: Suit;
	value: number;
}

interface TrackerState {
	allEnemies: Enemy[];
	currentEnemyId: string | null;
	damageMap: Record<string, number>;
	shieldMap: Record<string, number>;
	defeatedIds: string[];
	jesterActiveIds: string[];
	blockedCardsMap: Record<string, BlockedCard[]>;
}

interface HistoryEntry {
	state: TrackerState;
	lastResult: AttackResult | null;
}

const MAX_HISTORY = 20;

const buildEnemies = (): Enemy[] => {
	const all = createCastleDeck();
	return [
		...shuffle(all.filter((e) => e.rank === "J")),
		...shuffle(all.filter((e) => e.rank === "Q")),
		...shuffle(all.filter((e) => e.rank === "K")),
	];
};

const createInitial = (): TrackerState => {
	const allEnemies = buildEnemies();
	return {
		allEnemies,
		currentEnemyId: null, // start in ENEMY_SELECTION so player chooses first enemy
		damageMap: {},
		shieldMap: {},
		defeatedIds: [],
		jesterActiveIds: [],
		blockedCardsMap: {},
	};
};

export const useTracker = () => {
	const [state, setState] = useState<TrackerState>(createInitial);
	const [lastResult, setLastResult] = useState<AttackResult | null>(null);
	const [history, setHistory] = useState<HistoryEntry[]>([]);

	const currentEnemy =
		state.allEnemies.find((e) => e.id === state.currentEnemyId) ?? null;

	const currentDamage = currentEnemy
		? (state.damageMap[currentEnemy.id] ?? 0)
		: 0;

	const currentShield = currentEnemy
		? (state.shieldMap[currentEnemy.id] ?? 0)
		: 0;

	const currentHP = currentEnemy
		? currentEnemy.health - currentDamage
		: 0;

	const effectiveAttack = currentEnemy
		? Math.max(0, currentEnemy.attack - currentShield)
		: 0;

	const isJesterActive = currentEnemy
		? state.jesterActiveIds.includes(currentEnemy.id)
		: false;

	const canUndo = history.length > 0;

	// Salva snapshot antes de qualquer mutação
	const snapshot = (currentState: TrackerState, currentLastResult: AttackResult | null) => {
		setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), { state: currentState, lastResult: currentLastResult }]);
	};

	// ─── Fase do footer ─────────────────────────────────────────────────────────
	const jEnemies = state.allEnemies.filter((e) => e.rank === "J");
	const qEnemies = state.allEnemies.filter((e) => e.rank === "Q");
	const jAllDefeated = jEnemies.every((e) => state.defeatedIds.includes(e.id));
	const qAllDefeated = qEnemies.every((e) => state.defeatedIds.includes(e.id));
	const footerPhase: EnemyRank = jAllDefeated
		? qAllDefeated
			? "K"
			: "Q"
		: "J";

	const footerEnemies = state.allEnemies.filter((e) => e.rank === footerPhase);
	const isVictory = state.allEnemies.every((e) => state.defeatedIds.includes(e.id));

	// ─── Ações ──────────────────────────────────────────────────────────────────

	const undo = () => {
		if (history.length === 0) return;
		const entry = history[history.length - 1];
		setState(entry.state);
		setLastResult(entry.lastResult);
		setHistory((h) => h.slice(0, -1));
	};

	const selectEnemy = (id: string) => {
		if (state.defeatedIds.includes(id)) return;
		snapshot(state, lastResult);
		setLastResult(null);
		setState((s) => ({ ...s, currentEnemyId: id }));
	};

	const applyAttack = (suit: Suit, rank: CardRank) => {
		if (!currentEnemy) return;

		snapshot(state, lastResult);

		// ── Jester: cancela imunidade e aplica retroativamente poderes bloqueados ──
		if (suit === "jester") {
			const blocked = state.blockedCardsMap[currentEnemy.id] ?? [];
			let retroShield = 0;
			let retroDamage = 0;
			const retroTexts: string[] = [];

			for (const bc of blocked) {
				switch (bc.suit) {
					case "spades":
						retroShield += bc.value;
						retroTexts.push(`♠ Escudo retroativo +${bc.value}`);
						break;
					case "clubs":
						retroDamage += bc.value;
						retroTexts.push(`♣ Dano extra retroativo +${bc.value}`);
						break;
					case "hearts":
						retroTexts.push(`♥ Curar ${bc.value} carta(s) do descarte`);
						break;
					case "diamonds":
						retroTexts.push(`♦ Comprar ${bc.value} carta(s)`);
						break;
				}
			}

			const powerText =
				blocked.length > 0
					? `🃏 Imunidade cancelada! ${retroTexts.join(" | ")}`
					: "🃏 Cancela o ataque inimigo nesta rodada";

			setLastResult({ damage: retroDamage, shieldAdded: retroShield, powerText, immune: false });

			setState((s) => ({
				...s,
				jesterActiveIds: [...s.jesterActiveIds, currentEnemy.id],
				blockedCardsMap: { ...s.blockedCardsMap, [currentEnemy.id]: [] },
				damageMap:
					retroDamage > 0
						? {
								...s.damageMap,
								[currentEnemy.id]: (s.damageMap[currentEnemy.id] ?? 0) + retroDamage,
						  }
						: s.damageMap,
				shieldMap:
					retroShield > 0
						? {
								...s.shieldMap,
								[currentEnemy.id]: (s.shieldMap[currentEnemy.id] ?? 0) + retroShield,
						  }
						: s.shieldMap,
			}));
			return;
		}

		// ── Carta normal ────────────────────────────────────────────────────────
		const jesterActive = state.jesterActiveIds.includes(currentEnemy.id);
		const immune = !jesterActive && suit === currentEnemy.suit;
		const value = cardValue(rank);

		if (immune) {
			const powerText = `Imunidade: poder de ${suit} não se aplica`;
			setLastResult({ damage: value, shieldAdded: 0, powerText, immune: true });

			setState((s) => ({
				...s,
				damageMap: {
					...s.damageMap,
					[currentEnemy.id]: (s.damageMap[currentEnemy.id] ?? 0) + value,
				},
				blockedCardsMap: {
					...s.blockedCardsMap,
					[currentEnemy.id]: [
						...(s.blockedCardsMap[currentEnemy.id] ?? []),
						{ suit, value },
					],
				},
			}));
			return;
		}

		const damage = value * (suit === "clubs" ? 2 : 1);
		const shieldAdded = suit === "spades" ? value : 0;

		let powerText = "";
		switch (suit) {
			case "hearts":
				powerText = `♥ Curar: mover ${value} carta(s) do descarte para a taverna`;
				break;
			case "diamonds":
				powerText = `♦ Comprar: ${value} carta(s)`;
				break;
			case "clubs":
				powerText = `♣ Dano dobrado: ${value} × 2 = ${damage}`;
				break;
			case "spades":
				powerText = `♠ Escudo: ataque reduzido em ${value} (total: ${currentShield + value})`;
				break;
		}

		setLastResult({ damage, shieldAdded, powerText, immune: false });

		setState((s) => ({
			...s,
			damageMap: {
				...s.damageMap,
				[currentEnemy.id]: (s.damageMap[currentEnemy.id] ?? 0) + damage,
			},
			shieldMap:
				shieldAdded > 0
					? {
							...s.shieldMap,
							[currentEnemy.id]: (s.shieldMap[currentEnemy.id] ?? 0) + shieldAdded,
					  }
					: s.shieldMap,
		}));
	};

	const defeatCurrentEnemy = () => {
		if (!currentEnemy) return;

		snapshot(state, lastResult);

		const newDefeated = [...state.defeatedIds, currentEnemy.id];

		setLastResult(null);
		setState((s) => ({
			...s,
			defeatedIds: newDefeated,
			currentEnemyId: null, // return to ENEMY_SELECTION to let player choose next enemy
		}));
	};

	const resetTracker = () => {
		setHistory([]);
		setLastResult(null);
		setState(createInitial());
	};

	return {
		currentEnemy,
		currentHP,
		currentShield,
		effectiveAttack,
		isJesterActive,
		canUndo,
		defeatedIds: state.defeatedIds,
		footerPhase,
		footerEnemies,
		isVictory,
		lastResult,
		undo,
		selectEnemy,
		applyAttack,
		defeatCurrentEnemy,
		resetTracker,
	};
};
