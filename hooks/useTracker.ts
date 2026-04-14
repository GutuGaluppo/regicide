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

interface TrackerState {
	allEnemies: Enemy[];
	currentEnemyId: string | null;
	damageMap: Record<string, number>;
	shieldMap: Record<string, number>;
	defeatedIds: string[];
}

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
		currentEnemyId: allEnemies[0]?.id ?? null,
		damageMap: {},
		shieldMap: {},
		defeatedIds: [],
	};
};

export const useTracker = () => {
	const [state, setState] = useState<TrackerState>(createInitial);
	const [lastResult, setLastResult] = useState<AttackResult | null>(null);

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

	const selectEnemy = (id: string) => {
		if (state.defeatedIds.includes(id)) return;
		setLastResult(null);
		setState((s) => ({ ...s, currentEnemyId: id }));
	};

	const applyAttack = (suit: Suit, rank: CardRank) => {
		if (!currentEnemy) return;

		const value = cardValue(rank);
		const immune = suit === currentEnemy.suit;

		// Dano: sempre o valor base; paus dobra (exceto imunidade)
		const damage = value * (!immune && suit === "clubs" ? 2 : 1);

		// Escudo: espadas (exceto imunidade)
		const shieldAdded = !immune && suit === "spades" ? value : 0;

		// Texto do poder
		let powerText = "";
		if (immune) {
			powerText = `Imunidade: poder de ${suit} não se aplica`;
		} else {
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
		}

		const result: AttackResult = { damage, shieldAdded, powerText, immune };
		setLastResult(result);

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
							[currentEnemy.id]:
								(s.shieldMap[currentEnemy.id] ?? 0) + shieldAdded,
					  }
					: s.shieldMap,
		}));
	};

	const defeatCurrentEnemy = () => {
		if (!currentEnemy) return;

		const newDefeated = [...state.defeatedIds, currentEnemy.id];
		const nextEnemy = state.allEnemies.find(
			(e) => !newDefeated.includes(e.id)
		);

		setLastResult(null);
		setState((s) => ({
			...s,
			defeatedIds: newDefeated,
			currentEnemyId: nextEnemy?.id ?? null,
		}));
	};

	const resetTracker = () => {
		setLastResult(null);
		setState(createInitial());
	};

	return {
		currentEnemy,
		currentHP,
		currentShield,
		effectiveAttack,
		defeatedIds: state.defeatedIds,
		footerPhase,
		footerEnemies,
		isVictory,
		lastResult,
		selectEnemy,
		applyAttack,
		defeatCurrentEnemy,
		resetTracker,
	};
};
