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

// Janela de revelação entre turnos (multiplayer): durante a revelação o turno
// está "congelado" — ninguém age — enquanto todos veem as cartas usadas no
// ataque e descartadas pelo jogador que acabou de jogar. Ver
// docs/turn-reveal-delay-strategy.md.
export interface RevealState {
	byPlayerId: string; // quem acabou de jogar
	byPlayerName: string; // snapshot para render
	fromIndex: number; // currentPlayerIndex que estava agindo
	toIndex: number; // próximo jogador (ainda NÃO efetivado)
	startedAt: number; // Date.now() do ator no início da revelação
	durationMs: number; // duração da janela
	attackCards: Card[]; // cartas jogadas contra o inimigo neste turno
	discardCards: Card[]; // cartas descartadas para pagar dano neste turno
	defeatedEnemy: boolean; // o golpe derrotou o inimigo atual
	yielded: boolean; // o jogador passou a vez sem jogar cartas
}

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
	reveal?: RevealState | null; // janela de revelação ativa (multiplayer)
}

// ─── Action Log (tracker de ações) ────────────────────────────────────────────
// Registro append-only e atribuído das ações dos jogadores. Ver
// docs/action-tracker-implementation-plan.md.

export type GameLogKind =
	| "attack" // cartas jogadas contra o inimigo
	| "discard" // cartas descartadas para pagar dano
	| "jester" // jester usado (cancela imunidade)
	| "yield" // turno passado sem jogar
	| "enemy_defeated"; // inimigo derrotado (evento marco)

// Entrada já parseada, consumida pela UI.
export interface GameLogEntry {
	id: string; // = chave do push() (RTDB) ou id local
	playerId: string; // autor da ação
	playerName: string; // snapshot para render histórico
	playerAvatarId?: AvatarId; // snapshot (opcional no fio; fallback ao ler)
	kind: GameLogKind;
	cards?: Card[]; // presente em attack/discard/jester
	enemyId?: string; // inimigo-alvo no momento da ação
	enemyRank?: EnemyRank; // snapshot p/ render sem cruzar com o castle
	damage?: number; // dano aplicado (attack)
	shieldAdded?: number; // escudo somado (attack com espadas)
	turnIndex?: number; // stats.turnsPlayed no momento — agrupa por turno
	createdAt: number; // ServerValue.TIMESTAMP (MP) ou Date.now() (SP)
}

// Rascunho emitido pela store (sem id/createdAt; cards ainda como Card[]).
export interface GameLogDraft {
	playerId: string;
	playerName: string;
	playerAvatarId?: AvatarId;
	kind: GameLogKind;
	cards?: Card[];
	enemyId?: string;
	enemyRank?: EnemyRank;
	damage?: number;
	shieldAdded?: number;
	turnIndex?: number;
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
	reveal?: string | null; // JSON.stringify(RevealState) | null
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
