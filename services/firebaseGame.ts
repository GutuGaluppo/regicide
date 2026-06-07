import { AbandonRequest, Room, RoomPlayer, SharedState } from "@/data/types";
import { get, onValue, ref, remove, set, update } from "firebase/database";
import { db } from "./firebase";

// ─── Geração de IDs ───────────────────────────────────────────────────────────

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateRoomCode = (): string =>
	Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");

export const generatePlayerId = (): string =>
	Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

// ─── Operações de sala ────────────────────────────────────────────────────────

export const createRoom = async (
	roomId: string,
	hostId: string,
	displayName: string,
): Promise<void> => {
	const player: RoomPlayer = { id: hostId, displayName, hand: "[]" };
	const room: Room = {
		hostId,
		status: "lobby",
		createdAt: Date.now(),
		players: { [hostId]: player },
	};
	await set(ref(db, `games/${roomId}`), room);
};

export const joinRoom = async (
	roomId: string,
	playerId: string,
	displayName: string,
): Promise<void> => {
	const player: RoomPlayer = { id: playerId, displayName, hand: "[]" };
	await set(ref(db, `games/${roomId}/players/${playerId}`), player);
};

export const leaveRoom = async (roomId: string, playerId: string): Promise<void> => {
	await remove(ref(db, `games/${roomId}/players/${playerId}`));
};

export const fetchRoom = async (roomId: string): Promise<Room | null> => {
	const snap = await get(ref(db, `games/${roomId}`));
	return snap.exists() ? (snap.val() as Room) : null;
};

export const subscribeToRoom = (roomId: string, callback: (room: Room) => void): (() => void) => {
	const r = ref(db, `games/${roomId}`);
	return onValue(r, (snap) => {
		if (snap.exists()) callback(snap.val() as Room);
	});
};

// ─── Estado da partida ────────────────────────────────────────────────────────

export const startGame = async (
	roomId: string,
	shared: SharedState,
	hands: Record<string, string>,
): Promise<void> => {
	const updates: Record<string, unknown> = { [`games/${roomId}/status`]: "playing", [`games/${roomId}/shared`]: shared };
	for (const [pid, hand] of Object.entries(hands)) {
		updates[`games/${roomId}/players/${pid}/hand`] = hand;
	}
	await update(ref(db), updates);
};

export const updateSharedAndHand = async (
	roomId: string,
	shared: SharedState,
	playerId: string,
	hand: string,
): Promise<void> => {
	await update(ref(db), {
		[`games/${roomId}/shared`]: shared,
		[`games/${roomId}/players/${playerId}/hand`]: hand,
	});
};

// Atualiza shared + múltiplas mãos de jogadores num único write atômico
// Usado após distribuição de Ouros (round-robin entre todos os jogadores)
export const updateSharedAndHands = async (
	roomId: string,
	shared: SharedState,
	hands: Record<string, string>, // playerId → JSON.stringify(Card[])
): Promise<void> => {
	const updates: Record<string, unknown> = { [`games/${roomId}/shared`]: shared };
	for (const [pid, hand] of Object.entries(hands)) {
		updates[`games/${roomId}/players/${pid}/hand`] = hand;
	}
	await update(ref(db), updates);
};

export const updateSharedState = async (roomId: string, shared: SharedState): Promise<void> => {
	await set(ref(db, `games/${roomId}/shared`), shared);
};

export const finishRoom = async (roomId: string): Promise<void> => {
	await set(ref(db, `games/${roomId}/status`), "finished");
};

// ─── Abandono de partida ──────────────────────────────────────────────────────

export const requestAbandon = async (
	roomId: string,
	playerId: string,
	playerName: string,
): Promise<void> => {
	const request: AbandonRequest = {
		requestedBy: playerId,
		requestedByName: playerName,
		votes: { [playerId]: true },
	};
	await set(ref(db, `games/${roomId}/abandonRequest`), request);
};

export const voteAbandon = async (
	roomId: string,
	playerId: string,
	agreed: boolean,
): Promise<void> => {
	await set(ref(db, `games/${roomId}/abandonRequest/votes/${playerId}`), agreed);
};

export const clearAbandonRequest = async (roomId: string): Promise<void> => {
	await remove(ref(db, `games/${roomId}/abandonRequest`));
};
