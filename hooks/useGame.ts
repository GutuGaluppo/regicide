// /hooks/useGame.ts
import { useEffect, useState } from "react";
import { createCastleDeck } from "../data/enemies";
import { Enemy } from "../data/types";
import { loadGame, saveGame } from "../services/storage";
import { shuffle } from "../utils/shuffle";

export const useGame = () => {
	const [castle, setCastle] = useState<Enemy[]>([]);
	const [history, setHistory] = useState<Enemy[]>([]);

	useEffect(() => {
		let active = true;

		const init = async () => {
			try {
				const saved = await loadGame();
				if (!active) return;

				if (saved) {
					setCastle(saved.castle);
					setHistory(saved.history);
				} else {
					setCastle(shuffle(createCastleDeck()));
				}
			} catch {
				if (active) setCastle(shuffle(createCastleDeck()));
			}
		};

		init();
		return () => { active = false; };
	}, []);

	const persist = async (newCastle: Enemy[], newHistory: Enemy[]) => {
		try {
			await saveGame({ castle: newCastle, history: newHistory });
		} catch {
			// storage failure is non-critical; game state remains in memory
		}
	};

	const defeatEnemy = () => {
		if (!castle.length) return;

		const [current, ...rest] = castle;
		const newHistory = [...history, current];

		setCastle(rest);
		setHistory(newHistory);
		persist(rest, newHistory);
	};

	const resetGame = () => {
		const newDeck = shuffle(createCastleDeck());
		setCastle(newDeck);
		setHistory([]);
		persist(newDeck, []);
	};

	return {
		castle,
		currentEnemy: castle[0],
		history,
		defeatEnemy,
		resetGame,
	};
};
