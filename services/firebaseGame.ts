import { AbandonRequest, AvatarId, Room, RoomPlayer, SharedState } from "@/data/types";
import { AVATARS, DEFAULT_AVATAR_ID } from "@/data/avatars";
import { get, onValue, ref, remove, runTransaction, set, update } from "firebase/database";
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
	avatarId: AvatarId = DEFAULT_AVATAR_ID,
): Promise<void> => {
	const player: RoomPlayer = { id: hostId, displayName, avatarId, hand: "[]" };
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
	avatarId: AvatarId = DEFAULT_AVATAR_ID,
): Promise<void> => {
	const player: RoomPlayer = { id: playerId, displayName, avatarId, hand: "[]" };
	await set(ref(db, `games/${roomId}/players/${playerId}`), player);
};

export const leaveRoom = async (roomId: string, playerId: string): Promise<void> => {
	await remove(ref(db, `games/${roomId}/players/${playerId}`));
};

/** Atualiza apenas nome/avatar do jogador no lobby (sem reescrever a sala). */
export const updatePlayerProfile = async (
	roomId: string,
	playerId: string,
	profile: { displayName?: string; avatarId?: AvatarId },
): Promise<void> => {
	const updates: Record<string, unknown> = {};
	if (profile.displayName !== undefined)
		updates[`games/${roomId}/players/${playerId}/displayName`] = profile.displayName;
	if (profile.avatarId !== undefined)
		updates[`games/${roomId}/players/${playerId}/avatarId`] = profile.avatarId;
	if (Object.keys(updates).length > 0) await update(ref(db), updates);
};

/**
 * Reivindica um avatar de forma atômica dentro da sala. Numa transação lê todos
 * os jogadores e só confirma o avatar desejado se nenhum outro jogador já o usa;
 * se estiver ocupado, atribui o primeiro avatar livre do catálogo. Fecha a janela
 * de corrida em que dois clientes escolheriam o mesmo avatar simultaneamente.
 * Retorna o avatar efetivamente atribuído (pode diferir do desejado).
 */
export const claimAvatar = async (
	roomId: string,
	playerId: string,
	desiredAvatarId: AvatarId,
): Promise<AvatarId> => {
	const playersRef = ref(db, `games/${roomId}/players`);
	const result = await runTransaction(
		playersRef,
		(players: Record<string, RoomPlayer> | null) => {
			// Ainda não estou na sala (estado em cache/corrida) — não mexe.
			if (!players || !players[playerId]) return players;
			const takenByOthers = new Set(
				Object.values(players)
					.filter((p) => p.id !== playerId && p.avatarId)
					.map((p) => p.avatarId),
			);
			let target = desiredAvatarId;
			if (takenByOthers.has(target)) {
				target =
					AVATARS.map((a) => a.id).find((id) => !takenByOthers.has(id)) ??
					desiredAvatarId;
			}
			players[playerId] = { ...players[playerId], avatarId: target };
			return players;
		},
	);
	const assigned = result.snapshot.child(`${playerId}/avatarId`).val();
	return (assigned as AvatarId | null) ?? desiredAvatarId;
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
