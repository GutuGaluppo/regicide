import {
	Card,
	EnemyRank,
	GameLogDraft,
	GameLogEntry,
	GameLogKind,
} from "@/data/types";

/**
 * Pure action-log helpers — no Firebase/RN dependencies, fully unit-testable.
 * Espelha o padrão defensivo de utils/chat.ts (parseIncomingMessage).
 */

const KINDS: GameLogKind[] = ["attack", "discard", "jester", "yield", "enemy_defeated"];
const ENEMY_RANKS: EnemyRank[] = ["J", "Q", "K"];

/** Serializa as cartas como string JSON (simetria com SharedState). */
export const serializeLogCards = (cards?: Card[]): string | undefined =>
	cards && cards.length > 0 ? JSON.stringify(cards) : undefined;

const parseCards = (raw: unknown): Card[] | undefined => {
	if (typeof raw !== "string") return undefined;
	try {
		const arr = JSON.parse(raw);
		return Array.isArray(arr) ? (arr as Card[]) : undefined;
	} catch {
		return undefined;
	}
};

/**
 * Valida e normaliza uma entrada crua vinda do Firebase (não confiável).
 * Devolve uma GameLogEntry bem-formada ou `null` quando o shape é inválido.
 * Campos opcionais ausentes NUNCA descartam a entrada (mesma armadilha do chat).
 */
export const parseLogEntry = (id: string, raw: unknown): GameLogEntry | null => {
	if (!id || typeof raw !== "object" || raw === null) return null;
	const r = raw as Record<string, unknown>;

	const playerId = r.playerId;
	const kind = r.kind;
	const createdAt = r.createdAt;

	if (typeof playerId !== "string" || playerId.length === 0) return null;
	if (typeof kind !== "string" || !KINDS.includes(kind as GameLogKind)) return null;
	if (typeof createdAt !== "number") return null;

	const entry: GameLogEntry = {
		id,
		playerId,
		playerName: typeof r.playerName === "string" ? r.playerName : "",
		kind: kind as GameLogKind,
		createdAt,
	};

	if (typeof r.playerAvatarId === "string") entry.playerAvatarId = r.playerAvatarId;
	const cards = parseCards(r.cards);
	if (cards) entry.cards = cards;
	if (typeof r.enemyId === "string") entry.enemyId = r.enemyId;
	if (typeof r.enemyRank === "string" && ENEMY_RANKS.includes(r.enemyRank as EnemyRank))
		entry.enemyRank = r.enemyRank as EnemyRank;
	if (typeof r.damage === "number") entry.damage = r.damage;
	if (typeof r.shieldAdded === "number") entry.shieldAdded = r.shieldAdded;
	if (typeof r.turnIndex === "number") entry.turnIndex = r.turnIndex;
	if (typeof r.exactKill === "boolean") entry.exactKill = r.exactKill;

	return entry;
};

/**
 * Monta o objeto de fio para `push()` no RTDB: omite `undefined` (o RTDB rejeita)
 * e stringifica as cartas. O `createdAt` é adicionado pelo serviço (serverTimestamp).
 */
export const buildLogWire = (draft: GameLogDraft): Record<string, unknown> => {
	const wire: Record<string, unknown> = {
		playerId: draft.playerId,
		playerName: draft.playerName,
		kind: draft.kind,
	};
	const cards = serializeLogCards(draft.cards);
	if (cards !== undefined) wire.cards = cards;
	if (draft.playerAvatarId) wire.playerAvatarId = draft.playerAvatarId;
	if (draft.enemyId) wire.enemyId = draft.enemyId;
	if (draft.enemyRank) wire.enemyRank = draft.enemyRank;
	if (typeof draft.damage === "number") wire.damage = draft.damage;
	if (typeof draft.shieldAdded === "number") wire.shieldAdded = draft.shieldAdded;
	if (typeof draft.turnIndex === "number") wire.turnIndex = draft.turnIndex;
	if (typeof draft.exactKill === "boolean") wire.exactKill = draft.exactKill;
	return wire;
};

let localSeq = 0;

/** Constrói uma GameLogEntry completa para o log em memória (single-player). */
export const buildLocalLogEntry = (draft: GameLogDraft): GameLogEntry => {
	const entry: GameLogEntry = {
		id: `local-${Date.now()}-${localSeq++}`,
		createdAt: Date.now(),
		playerId: draft.playerId,
		playerName: draft.playerName,
		kind: draft.kind,
	};
	if (draft.playerAvatarId) entry.playerAvatarId = draft.playerAvatarId;
	if (draft.cards && draft.cards.length > 0) entry.cards = draft.cards;
	if (draft.enemyId) entry.enemyId = draft.enemyId;
	if (draft.enemyRank) entry.enemyRank = draft.enemyRank;
	if (typeof draft.damage === "number") entry.damage = draft.damage;
	if (typeof draft.shieldAdded === "number") entry.shieldAdded = draft.shieldAdded;
	if (typeof draft.turnIndex === "number") entry.turnIndex = draft.turnIndex;
	if (typeof draft.exactKill === "boolean") entry.exactKill = draft.exactKill;
	return entry;
};
