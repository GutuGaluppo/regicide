import { AvatarId, Card, Enemy, GameState } from "@/data/types";
import { useGameStore } from "@/store/gameStore";
import React, { createContext, useContext } from "react";

// Interface mínima que GameScreen precisa do store
export interface GameScreenStore {
	gameState: GameState;
	selectedIds: Set<string>;
	selectedCards: Card[];
	playError: string | null;
	currentEnemy: Enemy | null;
	currentHP: number;
	effectiveAttack: number;
	selectedTotal: number;
	previewDamage: number;
	previewShieldGain: number;
	cardsDrawnSignal: number;
	dealSignal: number;
	autoJesterSignal: number;
	autoJesterPending: boolean;
	// true em single-player; valor real de turno em multiplayer
	isMyTurn: boolean;
	// Cartas jogadas pelo jogador ativo neste turno (vazio em single-player)
	lastPlayedCards: Card[];
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
	onAbandon?: () => void; // apenas multiplayer
	roomPlayers?: { id: string; displayName: string; avatarId: AvatarId; cardCount: number }[];
	myPlayerId?: string;
	playerOrder?: string[];
	currentPlayerIndex?: number;
}

const GameStoreContext = createContext<GameScreenStore | null>(null);

export const useGameScreenStore = (): GameScreenStore => {
	const ctx = useContext(GameStoreContext);
	if (ctx) return ctx;
	throw new Error("GameStoreContext not provided");
};

export const SinglePlayerStoreProvider = ({ children }: { children: React.ReactNode }) => {
	const store = useGameStore();
	// Single-player: é sempre a vez do jogador
	return <GameStoreContext.Provider value={{ ...store, isMyTurn: true, lastPlayedCards: [] }}>{children}</GameStoreContext.Provider>;
};

export const MultiplayerStoreProvider = ({
	value,
	children,
}: {
	value: GameScreenStore;
	children: React.ReactNode;
}) => <GameStoreContext.Provider value={value}>{children}</GameStoreContext.Provider>;
