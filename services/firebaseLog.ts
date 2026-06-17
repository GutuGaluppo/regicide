import { GameLogDraft, GameLogEntry } from "@/data/types";
import { buildLogWire, parseLogEntry } from "@/utils/log";
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

// Uma partida tem muito mais eventos que o chat; ainda assim limitado.
const HISTORY_LIMIT = 200;

const logRef = (roomId: string) => ref(db, `roomLogs/${roomId}`);

/** Acrescenta uma entrada de ação do jogador local (append-only). */
export const appendLogEntry = async (
	roomId: string,
	draft: GameLogDraft,
): Promise<void> => {
	await push(logRef(roomId), {
		...buildLogWire(draft),
		createdAt: serverTimestamp(),
	});
};

/**
 * Assina as últimas N entradas da sala, em ordem cronológica (chave de push).
 * Cada entrada é parseada defensivamente; as malformadas são descartadas.
 * Devolve uma função de unsubscribe.
 */
export const subscribeToRoomLog = (
	roomId: string,
	callback: (entries: GameLogEntry[]) => void,
): (() => void) => {
	const q = query(logRef(roomId), orderByKey(), limitToLast(HISTORY_LIMIT));
	return onValue(q, (snap) => {
		const entries: GameLogEntry[] = [];
		snap.forEach((child) => {
			const parsed = parseLogEntry(child.key ?? "", child.val());
			if (parsed) entries.push(parsed);
			return undefined; // keep iterating
		});
		// onValue + orderByKey já entrega em ordem ascendente de chave.
		callback(entries);
	});
};

/** Remove todo o histórico de ações de uma sala. */
export const clearRoomLog = async (roomId: string): Promise<void> => {
	await remove(logRef(roomId));
};
