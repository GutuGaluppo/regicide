import { buildCastle } from "@/data/buildCastle";
import { CardRank, Enemy, EnemyRank, Suit } from "@/data/types";
import { cardValue } from "@/utils/gameLogic";
import { create } from "zustand";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AttackResult {
	damage: number;
	shieldAdded: number;
	powerText: string;
	immune: boolean;
}

export type AttackCard = { suit: Suit; rank: CardRank };

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

// ─── Estado inicial ───────────────────────────────────────────────────────────

const createInitial = (): TrackerState => {
	const allEnemies = buildCastle();
	return {
		allEnemies,
		currentEnemyId: null,
		damageMap: {},
		shieldMap: {},
		defeatedIds: [],
		jesterActiveIds: [],
		blockedCardsMap: {},
	};
};

// ─── Interface do store ───────────────────────────────────────────────────────

export interface TrackerStore {
	// Estado base
	trackerState: TrackerState;
	lastResult: AttackResult | null;
	history: HistoryEntry[];

	// Derivados
	currentEnemy: Enemy | null;
	currentHP: number;
	currentShield: number;
	effectiveAttack: number;
	isJesterActive: boolean;
	canUndo: boolean;
	footerPhase: EnemyRank;
	footerEnemies: Enemy[];
	isVictory: boolean;

	// Ações
	undo: () => void;
	selectEnemy: (id: string) => void;
	applyAttack: (cards: AttackCard[]) => void;
	defeatCurrentEnemy: () => void;
	resetTracker: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const computeDerived = (
	trackerState: TrackerState,
	lastResult: AttackResult | null,
	history: HistoryEntry[],
) => {
	const currentEnemy =
		trackerState.allEnemies.find((e) => e.id === trackerState.currentEnemyId) ?? null;

	const currentDamage = currentEnemy ? (trackerState.damageMap[currentEnemy.id] ?? 0) : 0;
	const currentShield = currentEnemy ? (trackerState.shieldMap[currentEnemy.id] ?? 0) : 0;
	const currentHP = currentEnemy ? currentEnemy.health - currentDamage : 0;
	const effectiveAttack = currentEnemy ? Math.max(0, currentEnemy.attack - currentShield) : 0;
	const isJesterActive = currentEnemy
		? trackerState.jesterActiveIds.includes(currentEnemy.id)
		: false;
	const canUndo = history.length > 0;

	const jEnemies = trackerState.allEnemies.filter((e) => e.rank === "J");
	const qEnemies = trackerState.allEnemies.filter((e) => e.rank === "Q");
	const jAllDefeated = jEnemies.every((e) => trackerState.defeatedIds.includes(e.id));
	const qAllDefeated = qEnemies.every((e) => trackerState.defeatedIds.includes(e.id));
	const footerPhase: EnemyRank = jAllDefeated ? (qAllDefeated ? "K" : "Q") : "J";
	const footerEnemies = trackerState.allEnemies.filter((e) => e.rank === footerPhase);
	const isVictory = trackerState.allEnemies.every((e) =>
		trackerState.defeatedIds.includes(e.id),
	);

	return {
		currentEnemy,
		currentHP,
		currentShield,
		effectiveAttack,
		isJesterActive,
		canUndo,
		footerPhase,
		footerEnemies,
		isVictory,
	};
};

export const useTrackerStore = create<TrackerStore>((set, get) => {
	const snapshot = (state: TrackerState, result: AttackResult | null) => {
		set((s) => ({
			history: [...s.history.slice(-(MAX_HISTORY - 1)), { state, lastResult: result }],
		}));
	};

	const initialState = createInitial();
	const initialDerived = computeDerived(initialState, null, []);

	return {
		// Estado base
		trackerState: initialState,
		lastResult: null,
		history: [],

		// Derivados
		...initialDerived,

		// ── Desfazer ─────────────────────────────────────────────────────────────
		undo: () => {
			const { history } = get();
			if (history.length === 0) return;
			const entry = history[history.length - 1];
			const newHistory = history.slice(0, -1);
			set({
				trackerState: entry.state,
				lastResult: entry.lastResult,
				history: newHistory,
				...computeDerived(entry.state, entry.lastResult, newHistory),
			});
		},

		// ── Selecionar inimigo ────────────────────────────────────────────────────
		selectEnemy: (id: string) => {
			const { trackerState, lastResult } = get();
			if (trackerState.defeatedIds.includes(id)) return;
			snapshot(trackerState, lastResult);
			const next: TrackerState = { ...trackerState, currentEnemyId: id };
			set({ trackerState: next, lastResult: null, ...computeDerived(next, null, get().history) });
		},

		// ── Aplicar ataque ────────────────────────────────────────────────────────
		applyAttack: (cards: AttackCard[]) => {
			const { trackerState, lastResult, history } = get();
			const { currentEnemy, currentShield } = computeDerived(trackerState, lastResult, history);
			if (!currentEnemy) return;

			snapshot(trackerState, lastResult);

			// Jester (sempre sozinho)
			if (cards.length === 1 && cards[0].suit === "jester") {
				const blocked = trackerState.blockedCardsMap[currentEnemy.id] ?? [];
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

				const newResult: AttackResult = {
					damage: retroDamage,
					shieldAdded: retroShield,
					powerText,
					immune: false,
				};

				const next: TrackerState = {
					...trackerState,
					jesterActiveIds: [...trackerState.jesterActiveIds, currentEnemy.id],
					blockedCardsMap: { ...trackerState.blockedCardsMap, [currentEnemy.id]: [] },
					damageMap:
						retroDamage > 0
							? {
									...trackerState.damageMap,
									[currentEnemy.id]: (trackerState.damageMap[currentEnemy.id] ?? 0) + retroDamage,
							  }
							: trackerState.damageMap,
					shieldMap:
						retroShield > 0
							? {
									...trackerState.shieldMap,
									[currentEnemy.id]: (trackerState.shieldMap[currentEnemy.id] ?? 0) + retroShield,
							  }
							: trackerState.shieldMap,
				};

				set({
					trackerState: next,
					lastResult: newResult,
					...computeDerived(next, newResult, get().history),
				});
				return;
			}

			// Cartas normais
			const jesterActive = trackerState.jesterActiveIds.includes(currentEnemy.id);
			const totalValue = cards.reduce((sum, c) => sum + cardValue(c.rank), 0);

			const newBlockedCards: BlockedCard[] = [];
			const activeSuits = new Set<Suit>();

			for (const card of cards) {
				const isImmune = !jesterActive && card.suit === currentEnemy.suit;
				if (isImmune) {
					newBlockedCards.push({ suit: card.suit, value: cardValue(card.rank) });
				} else {
					activeSuits.add(card.suit);
				}
			}

			const clubsDouble = activeSuits.has("clubs");
			const damage = totalValue * (clubsDouble ? 2 : 1);
			const shieldAdded = activeSuits.has("spades") ? totalValue : 0;

			const powerParts: string[] = [];
			if (newBlockedCards.length > 0) powerParts.push("Imunidade: poder não se aplica");
			if (activeSuits.has("hearts"))
				powerParts.push(`♥ Curar: mover ${totalValue} carta(s) do descarte para a taverna`);
			if (activeSuits.has("diamonds")) powerParts.push(`♦ Comprar: ${totalValue} carta(s)`);
			if (clubsDouble) powerParts.push(`♣ Dano dobrado: ${totalValue} × 2 = ${damage}`);
			if (activeSuits.has("spades"))
				powerParts.push(
					`♠ Escudo: ataque reduzido em ${totalValue} (total: ${currentShield + shieldAdded})`,
				);

			const newResult: AttackResult = {
				damage,
				shieldAdded,
				powerText: powerParts.join(" | ") || `Ataque: ${damage}`,
				immune: newBlockedCards.length > 0,
			};

			const next: TrackerState = {
				...trackerState,
				damageMap: {
					...trackerState.damageMap,
					[currentEnemy.id]: (trackerState.damageMap[currentEnemy.id] ?? 0) + damage,
				},
				shieldMap:
					shieldAdded > 0
						? {
								...trackerState.shieldMap,
								[currentEnemy.id]: (trackerState.shieldMap[currentEnemy.id] ?? 0) + shieldAdded,
						  }
						: trackerState.shieldMap,
				blockedCardsMap:
					newBlockedCards.length > 0
						? {
								...trackerState.blockedCardsMap,
								[currentEnemy.id]: [
									...(trackerState.blockedCardsMap[currentEnemy.id] ?? []),
									...newBlockedCards,
								],
						  }
						: trackerState.blockedCardsMap,
			};

			set({
				trackerState: next,
				lastResult: newResult,
				...computeDerived(next, newResult, get().history),
			});
		},

		// ── Derrotar inimigo atual ────────────────────────────────────────────────
		defeatCurrentEnemy: () => {
			const { trackerState, lastResult } = get();
			const { currentEnemy } = computeDerived(trackerState, lastResult, get().history);
			if (!currentEnemy) return;

			snapshot(trackerState, lastResult);

			const next: TrackerState = {
				...trackerState,
				defeatedIds: [...trackerState.defeatedIds, currentEnemy.id],
				currentEnemyId: null,
			};

			set({ trackerState: next, lastResult: null, ...computeDerived(next, null, get().history) });
		},

		// ── Reiniciar ─────────────────────────────────────────────────────────────
		resetTracker: () => {
			const next = createInitial();
			set({ trackerState: next, lastResult: null, history: [], ...computeDerived(next, null, []) });
		},
	};
});
