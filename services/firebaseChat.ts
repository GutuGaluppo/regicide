import { AvatarId, ChatMessage, ChatSystemType } from "@/data/types";
import { parseIncomingMessage } from "@/utils/chat";
import {
	limitToLast,
	onDisconnect,
	onValue,
	orderByKey,
	push,
	query,
	ref,
	remove,
	serverTimestamp,
	set,
} from "firebase/database";
import { db } from "./firebase";

const HISTORY_LIMIT = 50;

const chatRef = (roomId: string) => ref(db, `roomChats/${roomId}`);

interface Author {
	playerId: string;
	playerName: string;
	avatarId?: AvatarId;
}

// RTDB rejeita `undefined` — só inclui o avatar quando definido.
const authorFields = (author: Author) => ({
	playerId: author.playerId,
	playerName: author.playerName,
	...(author.avatarId ? { playerAvatarId: author.avatarId } : {}),
});

/** Sends a free-text message authored by the local player. */
export const sendChatMessage = async (
	roomId: string,
	author: Author,
	text: string,
): Promise<void> => {
	await push(chatRef(roomId), {
		...authorFields(author),
		text,
		kind: "text",
		createdAt: serverTimestamp(),
	});
};

/** Sends a structured system event (join/leave). Text is localized on render. */
export const sendSystemMessage = async (
	roomId: string,
	author: Author,
	systemType: ChatSystemType,
): Promise<void> => {
	await push(chatRef(roomId), {
		...authorFields(author),
		systemType,
		kind: "system",
		createdAt: serverTimestamp(),
	});
};

/**
 * Subscribes to the last 50 messages of a room, ordered by push key (which is
 * chronological). Defensively parses each entry; malformed ones are dropped.
 * Returns an unsubscribe function.
 */
export const subscribeToRoomChat = (
	roomId: string,
	callback: (messages: ChatMessage[]) => void,
): (() => void) => {
	const q = query(chatRef(roomId), orderByKey(), limitToLast(HISTORY_LIMIT));
	return onValue(q, (snap) => {
		const messages: ChatMessage[] = [];
		snap.forEach((child) => {
			const parsed = parseIncomingMessage(child.key ?? "", child.val());
			if (parsed) messages.push(parsed);
			return undefined; // keep iterating
		});
		// onValue + orderByKey already yields ascending key order.
		callback(messages);
	});
};

/**
 * Announces the player's presence: writes a "join" system message and arms an
 * onDisconnect that writes "leave" if the connection drops. Returns a cleanup
 * that cancels the onDisconnect and writes "leave" on a graceful exit.
 */
export const registerPresence = async (
	roomId: string,
	author: Author,
): Promise<() => void> => {
	const leavePayload = {
		...authorFields(author),
		systemType: "leave" as const,
		kind: "system" as const,
		createdAt: serverTimestamp(),
	};

	// New child slot reserved for the eventual "leave" message.
	const leaveRef = push(chatRef(roomId));
	const disconnect = onDisconnect(leaveRef);
	await disconnect.set(leavePayload);

	await sendSystemMessage(roomId, author, "join");

	return () => {
		disconnect.cancel().catch(() => {});
		set(leaveRef, leavePayload).catch(() => {});
	};
};

/** Removes the entire chat history for a room (called on room finish). */
export const clearRoomChat = async (roomId: string): Promise<void> => {
	await remove(chatRef(roomId));
};
