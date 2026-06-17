import { AbandonRequest, AvatarId, Room, RoomPlayer, SharedState } from "@/data/types";
import { DEFAULT_AVATAR_ID } from "@/data/avatars";
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

/**
 * Resultado de uma reivindicação de avatar. Em conflito não há escrita; o caller
 * recebe os avatares ocupados para repedir a escolha (sem reatribuição automática).
 */
export type ClaimResult =
	| { ok: true; avatarId: AvatarId }
	| { ok: false; takenAvatarIds: AvatarId[] };

const collectTaken = (
	players: Record<string, RoomPlayer> | null,
	exceptPlayerId: string,
): AvatarId[] =>
	Object.values(players ?? {})
		.filter((p) => p.id !== exceptPlayerId)
		.map((p) => p.avatarId)
		.filter((id): id is AvatarId => Boolean(id));

/**
 * Entra na sala reivindicando o avatar de forma atômica: numa única transação
 * sobre `players`, adiciona o jogador apenas se o avatar desejado estiver livre.
 * Se outro jogador já o tiver, aborta sem escrever e devolve os ocupados.
 */
export const joinRoom = async (
	roomId: string,
	playerId: string,
	displayName: string,
	avatarId: AvatarId = DEFAULT_AVATAR_ID,
): Promise<ClaimResult> => {
	const playersRef = ref(db, `games/${roomId}/players`);
	const result = await runTransaction(
		playersRef,
		(players: Record<string, RoomPlayer> | null) => {
			const map = players ?? {};
			if (new Set(collectTaken(map, playerId)).has(avatarId)) return undefined; // aborta
			map[playerId] = { id: playerId, displayName, avatarId, hand: "[]" };
			return map;
		},
	);
	if (!result.committed) {
		return { ok: false, takenAvatarIds: collectTaken(result.snapshot.val(), playerId) };
	}
	return { ok: true, avatarId };
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
 * Reivindica um avatar para um jogador já presente na sala, de forma atômica.
 * Numa transação sobre `players`, só confirma se nenhum outro jogador usa o
 * avatar; em conflito aborta sem escrever e devolve os ocupados (sem
 * reatribuição automática — o caller decide o que fazer).
 */
export const claimAvatar = async (
	roomId: string,
	playerId: string,
	desiredAvatarId: AvatarId,
): Promise<ClaimResult> => {
	const playersRef = ref(db, `games/${roomId}/players`);
	const result = await runTransaction(
		playersRef,
		(players: Record<string, RoomPlayer> | null) => {
			// Ainda não estou na sala (estado em cache/corrida) — não mexe.
			if (!players || !players[playerId]) return players;
			if (new Set(collectTaken(players, playerId)).has(desiredAvatarId))
				return undefined; // aborta
			players[playerId] = { ...players[playerId], avatarId: desiredAvatarId };
			return players;
		},
	);
	if (!result.committed) {
		return { ok: false, takenAvatarIds: collectTaken(result.snapshot.val(), playerId) };
	}
	return { ok: true, avatarId: desiredAvatarId };
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

/**
 * Fecha a janela de revelação entre turnos de forma atômica e idempotente:
 * numa transação sobre `shared`, efetiva o avanço do turno (`currentPlayerIndex`
 * = `reveal.toIndex`) e remove `reveal` — mas só se a revelação ainda existir e
 * seu `startedAt` bater com o esperado. Assim um fechamento atrasado (ator + o
 * fallback do próximo jogador) nunca avança o turno duas vezes nem encerra uma
 * revelação mais nova. Ver docs/turn-reveal-delay-strategy.md (B.3/B.4).
 */
export const closeRevealTx = async (
	roomId: string,
	expectedStartedAt: number,
): Promise<void> => {
	const sharedRef = ref(db, `games/${roomId}/shared`);
	await runTransaction(sharedRef, (shared: SharedState | null) => {
		if (!shared || !shared.reveal) return shared; // já fechada / inexistente
		let reveal: { startedAt: number; toIndex: number };
		try {
			reveal = JSON.parse(shared.reveal) as { startedAt: number; toIndex: number };
		} catch {
			return shared;
		}
		if (reveal.startedAt !== expectedStartedAt) return shared; // revelação obsoleta
		return { ...shared, currentPlayerIndex: reveal.toIndex, reveal: null };
	});
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
