import { Card, GamePhase, Suit } from "@/data/types";

export type ScreenRect = {
	x: number;
	y: number;
	w: number;
	h: number;
};

export type PropsType = {
	hand: Card[];
	compactVerticalSpacing?: boolean;
	selectedIds: Set<string>;
	phase: GamePhase;
	immuneSuit?: Suit | null;
	dealingIds?: Set<string>;
	activeDeal?: {
		id: number;
		source: ScreenRect;
		orderById: Map<string, number>;
	} | null;
	activeDiscard?: {
		id: number;
		flightById: Map<
			string,
			{
				order: number;
				dest: ScreenRect;
			}
		>;
	} | null;
	locked?: boolean;
	pendingDamage?: number;
	selectedTotal?: number;
	onCardPress: (card: Card) => void;
	onSort?: () => void;
	onSortByClass?: () => void;
	onDiscard?: () => void;
	onPlay?: () => void;
	onYield?: () => void;
	playDisabled?: boolean;
	onCardDealComplete?: (dealId: number, cardId: string) => void;
	onCardDiscardComplete?: (discardId: number, cardId: string) => void;
	// Multiplayer: cartas jogadas pelo jogador ativo (exibidas quando !isMyTurn)
	waitingPlayedCards?: Card[];
	// Tutorial: destaca o respectivo botão como alvo do spotlight.
	highlightPlay?: boolean;
	highlightSortValue?: boolean;
	highlightSortSuit?: boolean;
};
