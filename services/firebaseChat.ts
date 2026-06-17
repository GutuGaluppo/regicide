import { AvatarId, ChatMessage } from "@/data/types";
import { parseIncomingMessage } from "@/utils/chat";
import {
	limitToLast,
	onValue,
	orderByKey,
	push,
	query,
	ref,
	remove,
	serverTimestamp,
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
 * Presença no chat: as mensagens de sistema (join/leave) foram removidas do
 * chat. Mantido como no-op para preservar o ciclo de conexão do chatStore.
 */
export const registerPresence = async (
	_roomId: string,
	_author: Author,
): Promise<() => void> => {
	return () => {};
};

/** Removes the entire chat history for a room (called on room finish). */
export const clearRoomChat = async (roomId: string): Promise<void> => {
	await remove(chatRef(roomId));
};
