// /data/types.ts
export type Suit = "hearts" | "diamonds" | "clubs" | "spades" | "jester";
export type EnemyRank = "J" | "Q" | "K";
export type CardRank =
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8"
	| "9"
	| "10"
	| "A"
	| "Jester"
	| EnemyRank;

export interface Enemy {
	id: string;
	suit: Suit;
	rank: EnemyRank;
	health: number;
	attack: number;
}

export interface Card {
	id: string;
	rank: CardRank;
	suit: Suit | null; // null apenas para Jester
	value: number; // valor de ataque/descarte
}
[];
export type GamePhase = "player_turn" | "suffer_damage" | "victory" | "defeat";

export interface GameStats {
	startTime: number;
	turnsPlayed: number;
	cardsPerTurn: Card[][];
	discardedCards: Card[];
	enemyKills: { enemy: Enemy; allCards: Card[]; discardedCards: Card[] }[];
}

export interface GameState {
	castle: Enemy[];
	defeatedEnemies: Enemy[];
	tavernDeck: Card[];
	discardPile: Card[];
	playerHand: Card[];
	playedThisFight: Card[]; // cartas jogadas contra o inimigo atual
	discardedThisFight: Card[]; // cartas descartadas sofrendo dano do inimigo atual
	currentDamage: number; // dano acumulado no inimigo atual
	spadesShield: number; // redução de ataque acumulada por espadas
	jesterActive: boolean; // imunidade do inimigo cancelada
	pendingDamage: number; // dano a sofrer na fase suffer_damage
	phase: GamePhase;
	jestersAvailable: number;
	jestersUsed: number;
	stats: GameStats;
}

// ─── Tipos Multiplayer ────────────────────────────────────────────────────────

// Identificador estável do avatar escolhido. O mapeamento id → asset/label é
// local (ver data/avatars.ts); só o id trafega/persiste.
export type AvatarId = string;

export interface RoomPlayer {
	id: string;
	displayName: string;
	avatarId?: AvatarId; // opcional no fio; normalizado ao ler (salas antigas)
	hand: string; // JSON.stringify(Card[])
}

export interface SharedState {
	castle: string; // JSON.stringify(Enemy[])
	defeatedEnemies: string;
	tavernDeck: string;
	discardPile: string;
	playedThisFight: string;
	discardedThisFight: string;
	currentDamage: number;
	spadesShield: number;
	jesterActive: boolean;
	pendingDamage: number;
	phase: GamePhase;
	jestersAvailable: number;
	jestersUsed: number;
	stats: string; // JSON.stringify(GameStats)
	currentPlayerIndex: number;
	playerOrder: string; // JSON.stringify(string[])
	playerCount: number;
}

export type RoomStatus = "lobby" | "playing" | "finished";

export interface AbandonRequest {
	requestedBy: string;
	requestedByName: string;
	votes: Record<string, boolean>; // playerId → true (agree) | false (refuse)
}

export interface Room {
	hostId: string;
	status: RoomStatus;
	createdAt: number;
	players: Record<string, RoomPlayer>;
	shared?: SharedState;
	abandonRequest?: AbandonRequest;
}

// ─── Chat ───────────────────────────────────────────────────────────────────

export type ChatMessageKind = "text" | "system";
export type ChatSystemType = "join" | "leave";

export const CHAT_MAX_LENGTH = 180;

export interface ChatMessage {
	id: string; // = chave do push()
	playerId: string; // autor (playerId local)
	playerName: string; // snapshot para render histórico
	playerAvatarId?: AvatarId; // snapshot do avatar; opcional no fio (msgs antigas)
	text?: string; // presente quando kind === "text"
	systemType?: ChatSystemType; // presente quando kind === "system"
	createdAt: number; // ServerValue.TIMESTAMP
	kind: ChatMessageKind;
}
