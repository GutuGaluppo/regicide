import {
	CHAT_MAX_LENGTH,
	ChatMessage,
	ChatSystemType,
} from "@/data/types";

/**
 * Pure chat helpers — no Firebase/RN dependencies, fully unit-testable.
 */

const SYSTEM_TYPES: ChatSystemType[] = ["join", "leave"];

/**
 * Validates and normalizes one raw message coming from Firebase (untrusted).
 * Returns a well-formed ChatMessage or `null` when the shape is invalid.
 */
export const parseIncomingMessage = (id: string, raw: unknown): ChatMessage | null => {
	if (!id || typeof raw !== "object" || raw === null) return null;
	const r = raw as Record<string, unknown>;

	const playerId = r.playerId;
	const playerName = r.playerName;
	const createdAt = r.createdAt;
	const kind = r.kind;

	if (typeof playerId !== "string" || playerId.length === 0) return null;
	if (typeof playerName !== "string" || playerName.length === 0) return null;
	if (typeof createdAt !== "number") return null;

	if (kind === "text") {
		const text = r.text;
		if (typeof text !== "string") return null;
		const trimmed = text.trim();
		if (trimmed.length === 0 || trimmed.length > CHAT_MAX_LENGTH) return null;
		return { id, playerId, playerName, createdAt, kind: "text", text: trimmed };
	}

	if (kind === "system") {
		const systemType = r.systemType;
		if (typeof systemType !== "string") return null;
		if (!SYSTEM_TYPES.includes(systemType as ChatSystemType)) return null;
		return {
			id,
			playerId,
			playerName,
			createdAt,
			kind: "system",
			systemType: systemType as ChatSystemType,
		};
	}

	return null;
};

export type OutgoingTextResult =
	| { ok: true; value: string }
	| { ok: false; reason: "empty" | "tooLong" };

/** Validates text the local player is about to send. */
export const validateOutgoingText = (text: string): OutgoingTextResult => {
	const trimmed = text.trim();
	if (trimmed.length === 0) return { ok: false, reason: "empty" };
	if (trimmed.length > CHAT_MAX_LENGTH) return { ok: false, reason: "tooLong" };
	return { ok: true, value: trimmed };
};

/**
 * Counts unread messages: those after `lastSeenId` that are not authored by the
 * local player. Messages are assumed sorted ascending (oldest → newest).
 * When `lastSeenId` is null, all non-own messages count as unread.
 */
export const computeUnread = (
	messages: ChatMessage[],
	lastSeenId: string | null,
	myPlayerId: string,
): number => {
	let seen = lastSeenId === null;
	let count = 0;
	for (const m of messages) {
		if (!seen) {
			if (m.id === lastSeenId) seen = true;
			continue;
		}
		if (m.id === lastSeenId) continue;
		if (m.playerId !== myPlayerId) count += 1;
	}
	return count;
};
