import { buildCastle } from "@/data/buildCastle";
import { createTavernDeck, HAND_SIZE, JESTER_COUNT } from "@/data/deck";
import {
	AbandonRequest,
	AvatarId,
	Card,
	Enemy,
	GamePhase,
	GameState,
	GameStats,
	Room,
	RoomPlayer,
	RoomStatus,
	SharedState,
	Suit,
} from "@/data/types";
import { DEFAULT_AVATAR_ID } from "@/data/avatars";
import {
	claimAvatar,
	clearAbandonRequest,
	createRoom,
	fetchRoom,
	finishRoom,
	generatePlayerId,
	generateRoomCode,
	joinRoom,
	leaveRoom,
	requestAbandon,
	startGame,
	subscribeToRoom,
	updatePlayerProfile,
	updateSharedAndHands,
	voteAbandon,
} from "@/services/firebaseGame";
import { scheduleLocalTurnNotification } from "@/services/notifications";
import { enemyToCard, resolvePlay, validatePlay } from "@/utils/gameLogic";
import { computeSuitPreview, resolveCannotPay, resolveEmptyHand } from "@/utils/gameEngine";
import * as Haptics from "expo-haptics";
import { t } from "i18next";
import { AppState } from "react-native";
import { create } from "zustand";

// ─── Constantes ───────────────────────────────────────────────────────────────

// ─── Persistência de sessão (web) ────────────────────────────────────────────

// Player ID persiste entre recarregamentos na mesma origem (localStorage)
const getOrCreatePlayerId = (): string => {
	try {
		if (typeof localStorage !== "undefined") {
			const stored = localStorage.getItem("regicide_player_id");
			if (stored) return stored;
			const id = generatePlayerId();
			localStorage.setItem("regicide_player_id", id);
			return id;
		}
	} catch {}
	return generatePlayerId();
};

const SESSION_PLAYER_ID = getOrCreatePlayerId();

type SessionData = {
	roomId: string;
	displayName: string;
	avatarId?: AvatarId;
	isHost: boolean;
};

const saveSession = (
	roomId: string,
	displayName: string,
	avatarId: AvatarId,
	isHost: boolean,
): void => {
	try {
		if (typeof sessionStorage !== "undefined")
			sessionStorage.setItem(
				"regicide_room",
				JSON.stringify({ roomId, displayName, avatarId, isHost }),
			);
	} catch {}
};

const loadSession = (): SessionData | null => {
	try {
		if (typeof sessionStorage !== "undefined") {
			const s = sessionStorage.getItem("regicide_room");
			return s ? (JSON.parse(s) as SessionData) : null;
		}
	} catch {}
	return null;
};

const clearSession = (): void => {
	try {
		if (typeof sessionStorage !== "undefined")
			sessionStorage.removeItem("regicide_room");
	} catch {}
};

const emptyStats = (): GameStats => ({
	startTime: Date.now(),
	turnsPlayed: 0,
	cardsPerTurn: [],
	discardedCards: [],
	enemyKills: [],
});

const RANK_ORDER: Record<string, number> = {
	Jester: 0, A: 1,
	"2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
	"7": 7, "8": 8, "9": 9, "10": 10,
	J: 11, Q: 12, K: 13,
};
const SUIT_ORDER: Record<string, number> = { hearts: 0, diamonds: 1, clubs: 2, spades: 3 };

// ─── Helpers de SharedState ───────────────────────────────────────────────────

const encodeShared = (
	gs: Omit<GameState, "playerHand">,
	currentPlayerIndex: number,
	playerOrder: string[],
	playerCount: number,
): SharedState => ({
	castle: JSON.stringify(gs.castle),
	defeatedEnemies: JSON.stringify(gs.defeatedEnemies),
	tavernDeck: JSON.stringify(gs.tavernDeck),
	discardPile: JSON.stringify(gs.discardPile),
	playedThisFight: JSON.stringify(gs.playedThisFight),
	discardedThisFight: JSON.stringify(gs.discardedThisFight),
	currentDamage: gs.currentDamage,
	spadesShield: gs.spadesShield,
	jesterActive: gs.jesterActive,
	pendingDamage: gs.pendingDamage,
	phase: gs.phase,
	jestersAvailable: gs.jestersAvailable,
	jestersUsed: gs.jestersUsed,
	stats: JSON.stringify(gs.stats),
	currentPlayerIndex,
	playerOrder: JSON.stringify(playerOrder),
	playerCount,
});

// Firebase pode retornar null para arrays vazios — garante array ao parsear
const safeParseArray = (raw: string | null | undefined): unknown[] => {
	if (!raw) return [];
	try { return JSON.parse(raw) as unknown[]; } catch { return []; }
};

const decodeShared = (s: SharedState): Omit<GameState, "playerHand"> & {
	currentPlayerIndex: number;
	playerOrder: string[];
	playerCount: number;
} => ({
	castle: safeParseArray(s.castle) as Enemy[],
	defeatedEnemies: safeParseArray(s.defeatedEnemies) as Enemy[],
	tavernDeck: safeParseArray(s.tavernDeck) as Card[],
	discardPile: safeParseArray(s.discardPile) as Card[],
	playedThisFight: safeParseArray(s.playedThisFight) as Card[],
	discardedThisFight: safeParseArray(s.discardedThisFight) as Card[],
	currentDamage: s.currentDamage ?? 0,
	spadesShield: s.spadesShield ?? 0,
	jesterActive: s.jesterActive ?? false,
	pendingDamage: s.pendingDamage ?? 0,
	phase: s.phase ?? "player_turn",
	jestersAvailable: s.jestersAvailable ?? 0,
	jestersUsed: s.jestersUsed ?? 0,
	stats: s.stats ? (JSON.parse(s.stats) as GameStats) : emptyStats(),
	currentPlayerIndex: s.currentPlayerIndex ?? 0,
	playerOrder: safeParseArray(s.playerOrder) as string[],
	playerCount: s.playerCount ?? 2,
});

// As resoluções síncronas de mão vazia / pagamento vivem em @/utils/gameEngine
// (resolveEmptyHand / resolveCannotPay), compartilhadas com o gameStore.

// ─── Tipagem do store ─────────────────────────────────────────────────────────

export interface MultiplayerRoomPlayer {
	id: string;
	displayName: string;
	avatarId: AvatarId;
	cardCount: number;
}

export interface MultiplayerStore {
	// Identidade local
	myPlayerId: string;
	myDisplayName: string;
	myAvatarId: AvatarId;

	// Estado da sala
	roomId: string | null;
	isHost: boolean;
	roomStatus: RoomStatus | "idle";
	roomPlayers: MultiplayerRoomPlayer[];
	isMyTurn: boolean;
	currentPlayerName: string;

	// Estado do jogo (interface compatível com GameScreen)
	gameState: GameState;
	selectedIds: Set<string>;
	selectedCards: Card[];
	playError: string | null;
	currentEnemy: ReturnType<typeof buildCastle>[number] | null;
	currentHP: number;
	effectiveAttack: number;
	selectedTotal: number;
	previewDamage: number;
	previewShieldGain: number;
	cardsDrawnSignal: number;
	dealSignal: number;
	autoJesterSignal: number;
	autoJesterPending: boolean;
	turnToastSignal: number;
	_initialized: boolean;

	// Cartas jogadas no turno atual (exibidas para jogadores em espera)
	lastPlayedCards: Card[];

	// Abandono de partida
	abandonRequest: AbandonRequest | null;
	requestAbandon: () => Promise<void>;
	voteAbandon: (agreed: boolean) => Promise<void>;

	// Ações de sala
	initPlayerId: () => Promise<void>;
	createRoom: (displayName: string, avatarId?: AvatarId) => Promise<string>;
	joinRoom: (roomId: string, displayName: string, avatarId?: AvatarId) => Promise<void>;
	startGame: () => Promise<void>;
	leaveRoom: () => Promise<void>;
	tryReconnect: () => Promise<boolean>;

	// Perfil (avatar) no lobby
	setMyAvatar: (avatarId: AvatarId) => void;
	updateMyLobbyProfile: (displayName: string, avatarId: AvatarId) => Promise<void>;

	// Ações de jogo (interface compatível com GameScreen)
	initialize: () => Promise<void>;
	toggleCard: (card: Card) => void;
	playSelected: () => void;
	yieldTurn: () => void;
	confirmDiscard: () => void;
	useJester: () => void;
	completeAutoJesterAnimation: (signal: number) => void;
	sortHand: () => void;
	sortHandByClass: () => void;
	resetGame: () => void;

	// Internos
	_allPlayerHands: Record<string, Card[]>; // cache das mãos de todos os jogadores (para distribuição de Ouros)
	_playerOrder: string[];
	_playerCount: number;
	_currentPlayerIndex: number;
	_prevRoomStatus: RoomStatus | "idle";
	_unsubscribeFn: (() => void) | null;
	_onRoomUpdate: (room: Room) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const placeholderGameState = (): GameState => ({
	castle: [],
	defeatedEnemies: [],
	tavernDeck: [],
	discardPile: [],
	playerHand: [],
	playedThisFight: [],
	discardedThisFight: [],
	currentDamage: 0,
	spadesShield: 0,
	jesterActive: false,
	pendingDamage: 0,
	phase: "player_turn",
	jestersAvailable: 0,
	jestersUsed: 0,
	stats: emptyStats(),
});

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => {
	// ── Helpers ──────────────────────────────────────────────────────────────

	const computeDerived = (gameState: GameState, selectedIds: Set<string>) => {
		const selectedCards = gameState.playerHand.filter((c) => selectedIds.has(c.id));
		const selectedTotal = selectedCards.reduce((sum, c) => sum + c.value, 0);
		const currentEnemy = gameState.castle[0] ?? null;
		const currentHP = currentEnemy ? currentEnemy.health - gameState.currentDamage : 0;
		const effectiveAttack = currentEnemy
			? Math.max(0, currentEnemy.attack - gameState.spadesShield)
			: 0;
		const { previewDamage, previewShieldGain } =
			currentEnemy && gameState.phase === "player_turn"
				? computeSuitPreview(selectedCards, selectedTotal, currentEnemy, gameState.jesterActive)
				: { previewDamage: 0, previewShieldGain: 0 };
		return { selectedCards, selectedTotal, currentEnemy, currentHP, effectiveAttack, previewDamage, previewShieldGain };
	};

	const advanceTurn = (currentIndex: number, playerCount: number) =>
		(currentIndex + 1) % playerCount;

	const pushToFirebase = async (shared: SharedState, hands: Record<string, Card[]>) => {
		const { roomId } = get();
		if (!roomId) return;
		const encoded: Record<string, string> = {};
		for (const [pid, hand] of Object.entries(hands)) {
			encoded[pid] = JSON.stringify(hand);
		}
		await updateSharedAndHands(roomId, shared, encoded);
	};

	// ── Distribuição de Ouros (round-robin per rulebook) ─────────────────────
	// "o jogador corrente recebe uma carta. Seguem-se os restantes jogadores,
	// no sentido dos ponteiros do relógio, tirando uma carta à vez, até ter sido
	// retirado um número de cartas igual ao valor do ataque."
	const distributeOuros = (
		diamondsValue: number,
		tavern: Card[],
		playerOrder: string[],
		startIndex: number,
		currentHands: Record<string, Card[]>,
		maxHand: number,
	): { newHands: Record<string, Card[]>; newTavern: Card[] } => {
		const count = playerOrder.length;
		const working: Record<string, Card[]> = {};
		for (const pid of playerOrder) {
			working[pid] = [...(currentHands[pid] ?? [])];
		}
		let remainingTavern = [...tavern];
		let toDraw = diamondsValue;
		let anyReceived = true;
		while (toDraw > 0 && remainingTavern.length > 0 && anyReceived) {
			anyReceived = false;
			for (let i = 0; i < count; i++) {
				if (toDraw <= 0 || remainingTavern.length === 0) break;
				const pid = playerOrder[(startIndex + i) % count];
				const hand = working[pid];
				if (hand.length < maxHand) {
					working[pid] = [remainingTavern[0], ...hand];
					remainingTavern = remainingTavern.slice(1);
					toDraw--;
					anyReceived = true;
				}
			}
		}
		return { newHands: working, newTavern: remainingTavern };
	};

	// ── Atualização do Firebase → estado local ────────────────────────────────
	// Único set() por chamada para evitar renders intermediários

	const onRoomUpdate = (room: Room) => {
		const s = get();
		const myPlayerId = s.myPlayerId;
		const shared = room.shared;

		const players: MultiplayerRoomPlayer[] = Object.values(room.players ?? {}).map((p) => ({
			id: p.id,
			displayName: p.displayName,
			avatarId: p.avatarId ?? DEFAULT_AVATAR_ID, // normaliza salas antigas
			cardCount: (safeParseArray(p.hand) as Card[]).length,
		}));

		// Cacheia todas as mãos para uso em distribuição de Ouros
		const allPlayerHands: Record<string, Card[]> = {};
		for (const [pid, p] of Object.entries(room.players ?? {})) {
			allPlayerHands[pid] = safeParseArray(p.hand) as Card[];
		}

		// Apenas sala no lobby (sem partida iniciada)
		if (!shared) {
			set({ roomStatus: room.status, roomPlayers: players, _allPlayerHands: allPlayerHands });
			return;
		}

		const decoded = decodeShared(shared);
		const myPlayer = room.players?.[myPlayerId];
		const myHand: Card[] = myPlayer ? (safeParseArray(myPlayer.hand) as Card[]) : [];

		const gameState: GameState = { ...decoded, playerHand: myHand };
		const selectedIds = new Set<string>();
		const derived = computeDerived(gameState, selectedIds);

		const currentPlayerId = decoded.playerOrder[decoded.currentPlayerIndex];
		const isMyTurn = currentPlayerId === myPlayerId;
		const currentPlayerEntry = players.find((p) => p.id === currentPlayerId);
		const currentPlayerName = currentPlayerEntry?.displayName ?? "";

		const handGrew = myHand.length > s.gameState.playerHand.length;
		// Dispara dealSignal quando a partida começa (transição lobby → playing)
		const gameJustStarted = s._prevRoomStatus !== "playing" && room.status === "playing";
		// Transição false → true: é a vez deste jogador
		const turnJustStarted = !s.isMyTurn && isMyTurn && !gameJustStarted;

		// ── Cartas jogadas no turno: delta de playedThisFight ────────────────
		const prevPlayed = s.gameState.playedThisFight;
		const newPlayed = decoded.playedThisFight as Card[];
		const playerIndexChanged = decoded.currentPlayerIndex !== s._currentPlayerIndex;
		let lastPlayedCards: Card[];
		if (newPlayed.length === 0) {
			// Novo duelo (inimigo derrotado) — limpa
			lastPlayedCards = [];
		} else if (newPlayed.length > prevPlayed.length) {
			// Cartas recém jogadas neste turno
			lastPlayedCards = newPlayed.slice(prevPlayed.length);
		} else if (playerIndexChanged) {
			// Turno passou sem novas cartas (yield) — limpa
			lastPlayedCards = [];
		} else {
			lastPlayedCards = s.lastPlayedCards;
		}

		if (turnJustStarted) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			if (AppState.currentState !== "active") {
				scheduleLocalTurnNotification();
			}
		}

		// ── Abandono: verifica votos ──────────────────────────────────────────
		// Resolve o resultado localmente a partir dos votos que todos os clientes
		// já observam — não depende do round-trip do write de status (que poderia
		// falhar/atrasar e travar a tela em "todos concordaram").
		const abandonRequest: AbandonRequest | null = room.abandonRequest ?? null;
		let resolvedStatus: RoomStatus = room.status;
		let resolvedAbandon: AbandonRequest | null = abandonRequest;
		if (abandonRequest && room.status === "playing") {
			const playerIds = Object.keys(room.players ?? {});
			const votes = abandonRequest.votes ?? {};
			const allAgreed = playerIds.length > 0 && playerIds.every((pid) => votes[pid] === true);
			const anyRefused = playerIds.some((pid) => votes[pid] === false);
			const { roomId } = get();
			if (allAgreed) {
				resolvedStatus = "finished";
				if (roomId) finishRoom(roomId);
			} else if (anyRefused) {
				resolvedAbandon = null;
				if (roomId) clearAbandonRequest(roomId);
			}
		}

		set((prev) => ({
			...derived,
			gameState,
			selectedIds,
			roomStatus: resolvedStatus,
			roomPlayers: players,
			isMyTurn,
			currentPlayerName,
			lastPlayedCards,
			abandonRequest: resolvedAbandon,
			_playerOrder: decoded.playerOrder,
			_playerCount: decoded.playerCount,
			_currentPlayerIndex: decoded.currentPlayerIndex,
			_prevRoomStatus: room.status as RoomStatus | "idle",
			_allPlayerHands: allPlayerHands,
			...(handGrew ? { cardsDrawnSignal: prev.cardsDrawnSignal + 1 } : {}),
			...(gameJustStarted ? { dealSignal: prev.dealSignal + 1 } : {}),
			...(turnJustStarted ? { turnToastSignal: prev.turnToastSignal + 1 } : {}),
		}));
	};

	// ── Estado inicial ────────────────────────────────────────────────────────

	const initialGameState = placeholderGameState();
	const initialSelectedIds = new Set<string>();
	const initialDerived = computeDerived(initialGameState, initialSelectedIds);

	return {
		myPlayerId: SESSION_PLAYER_ID,
		myDisplayName: "",
		myAvatarId: DEFAULT_AVATAR_ID,
		roomId: null,
		isHost: false,
		roomStatus: "idle",
		roomPlayers: [],
		isMyTurn: false,
		currentPlayerName: "",
		gameState: initialGameState,
		selectedIds: initialSelectedIds,
		playError: null,
		cardsDrawnSignal: 0,
		dealSignal: 0,
		autoJesterSignal: 0,
		autoJesterPending: false,
		turnToastSignal: 0,
		lastPlayedCards: [],
		abandonRequest: null,
		_initialized: false,
		_allPlayerHands: {},
		_playerOrder: [],
		_playerCount: 2,
		_currentPlayerIndex: 0,
		_prevRoomStatus: "idle",
		_unsubscribeFn: null,
		...initialDerived,

		// ── Abandono de partida ───────────────────────────────────────────────
		requestAbandon: async () => {
			const { roomId, myPlayerId, myDisplayName } = get();
			if (!roomId) return;
			await requestAbandon(roomId, myPlayerId, myDisplayName);
		},

		voteAbandon: async (agreed: boolean) => {
			const { roomId, myPlayerId } = get();
			if (!roomId) return;
			await voteAbandon(roomId, myPlayerId, agreed);
		},

		// ── Inicializar ID do jogador ─────────────────────────────────────────
		// ID já definido em SESSION_PLAYER_ID (gerado na carga do módulo)
		initPlayerId: async () => {},

		// ── Avatar / perfil no lobby ──────────────────────────────────────────
		setMyAvatar: (avatarId: AvatarId) => set({ myAvatarId: avatarId }),

		updateMyLobbyProfile: async (displayName: string, avatarId: AvatarId) => {
			const { roomId, myPlayerId } = get();
			set({ myDisplayName: displayName, myAvatarId: avatarId }); // otimista
			if (roomId) {
				await updatePlayerProfile(roomId, myPlayerId, { displayName }).catch(() => {});
				// Avatar via reivindicação atômica — pode reatribuir se houver corrida.
				const assignedAvatar = await claimAvatar(roomId, myPlayerId, avatarId).catch(
					() => avatarId,
				);
				set({ myAvatarId: assignedAvatar });
				saveSession(roomId, displayName, assignedAvatar, get().isHost);
			}
		},

		// ── Criar sala ────────────────────────────────────────────────────────
		createRoom: async (displayName: string, avatarId: AvatarId = get().myAvatarId) => {
			const { myPlayerId, _unsubscribeFn } = get();
			const roomId = generateRoomCode();
			await createRoom(roomId, myPlayerId, displayName, avatarId);
			_unsubscribeFn?.();
			const unsub = subscribeToRoom(roomId, onRoomUpdate);
			saveSession(roomId, displayName, avatarId, true);
			set({ roomId, myDisplayName: displayName, myAvatarId: avatarId, isHost: true, roomStatus: "lobby", _unsubscribeFn: unsub });
			return roomId;
		},

		// ── Entrar na sala ────────────────────────────────────────────────────
		joinRoom: async (roomId: string, displayName: string, avatarId: AvatarId = get().myAvatarId) => {
			const { myPlayerId, _unsubscribeFn } = get();
			const room = await fetchRoom(roomId);
			if (!room) throw new Error("Sala não encontrada");
			if (room.status !== "lobby") throw new Error("Partida já em andamento");
			const playerCount = Object.keys(room.players ?? {}).length;
			if (playerCount >= 4) throw new Error("Sala cheia (máx. 4 jogadores)");
			await joinRoom(roomId, myPlayerId, displayName, avatarId);
			// Reivindica o avatar atomicamente — se já estiver em uso por outro
			// jogador, recebe automaticamente o primeiro avatar livre.
			const assignedAvatar = await claimAvatar(roomId, myPlayerId, avatarId).catch(
				() => avatarId,
			);
			_unsubscribeFn?.();
			const unsub = subscribeToRoom(roomId, onRoomUpdate);
			saveSession(roomId, displayName, assignedAvatar, false);
			set({ roomId, myDisplayName: displayName, myAvatarId: assignedAvatar, isHost: false, roomStatus: "lobby", _unsubscribeFn: unsub });
		},

		// ── Iniciar partida (host) ────────────────────────────────────────────
		startGame: async () => {
			const { roomId, myPlayerId } = get();
			if (!roomId) return;
			const room = await fetchRoom(roomId);
			if (!room || room.hostId !== myPlayerId) return;

			const players = Object.values(room.players ?? {}) as RoomPlayer[];
			const playerCount = Math.max(1, Math.min(4, players.length)) as 1 | 2 | 3 | 4;
			const playerOrder = players.map((p) => p.id);
			const handSize = HAND_SIZE[playerCount];

			const tavernDeckFull = createTavernDeck(playerCount);
			const hands: Record<string, Card[]> = {};
			let remaining = [...tavernDeckFull];
			for (const p of players) {
				hands[p.id] = remaining.splice(0, handSize);
			}

			const castle = buildCastle();
			const jestersAvailable = JESTER_COUNT[playerCount];

			const sharedBase: Omit<GameState, "playerHand"> = {
				castle,
				defeatedEnemies: [],
				tavernDeck: remaining,
				discardPile: [],
				playedThisFight: [],
				discardedThisFight: [],
				currentDamage: 0,
				spadesShield: 0,
				jesterActive: false,
				pendingDamage: 0,
				phase: "player_turn",
				jestersAvailable,
				jestersUsed: 0,
				stats: emptyStats(),
			};

			const shared = encodeShared(sharedBase, 0, playerOrder, playerCount);
			const encodedHands: Record<string, string> = {};
			for (const [pid, hand] of Object.entries(hands)) {
				encodedHands[pid] = JSON.stringify(hand);
			}

			// Escrita no Firebase — o onRoomUpdate dispara dealSignal quando
			// a partida começa (transição lobby → playing)
			await startGame(roomId, shared, encodedHands);
		},

		// ── Sair da sala ──────────────────────────────────────────────────────
		leaveRoom: async () => {
			const { roomId, myPlayerId, _unsubscribeFn } = get();
			_unsubscribeFn?.();
			if (roomId) await leaveRoom(roomId, myPlayerId);
			clearSession();
			set({
				roomId: null,
				roomStatus: "idle",
				_prevRoomStatus: "idle",
				isHost: false,
				roomPlayers: [],
				_unsubscribeFn: null,
			});
		},

		// ── initialize (compatível com GameScreen) ────────────────────────────
		initialize: async () => {
			if (get()._initialized) return;
			set({ _initialized: true });
		},

		// ── Selecionar carta ──────────────────────────────────────────────────
		toggleCard: (card: Card) => {
			const { gameState, selectedIds } = get();
			if (gameState.phase !== "player_turn" && gameState.phase !== "suffer_damage") return;
			const next = new Set(selectedIds);
			if (next.has(card.id)) next.delete(card.id);
			else next.add(card.id);
			set({ playError: null, selectedIds: next, ...computeDerived(gameState, next) });
		},

		// ── Usar Jester ───────────────────────────────────────────────────────
		useJester: () => {
			const { isMyTurn, gameState, roomId, myPlayerId, _currentPlayerIndex, _playerOrder, _playerCount } = get();
			if (!isMyTurn || gameState.phase !== "player_turn") return;
			if (gameState.jestersAvailable <= 0) return;
			const next: GameState = {
				...gameState,
				jestersAvailable: gameState.jestersAvailable - 1,
				jestersUsed: gameState.jestersUsed + 1,
				jesterActive: true,
			};
			set({ gameState: next, selectedIds: get().selectedIds, ...computeDerived(next, get().selectedIds) });
			if (!roomId) return;
			const shared = encodeShared(next, _currentPlayerIndex, _playerOrder, _playerCount);
			pushToFirebase(shared, { [myPlayerId]: gameState.playerHand });
		},

		// ── Jogar cartas ──────────────────────────────────────────────────────
		playSelected: () => {
			const { isMyTurn, gameState, selectedIds, _currentPlayerIndex, _playerOrder, _playerCount, _allPlayerHands, myPlayerId } = get();
			if (!isMyTurn || gameState.phase !== "player_turn") return;

			const selected = gameState.playerHand.filter((c) => selectedIds.has(c.id));
			const validation = validatePlay(selected);
			if (!validation.valid) {
				set({ playError: t(validation.reason) });
				return;
			}

			set({ playError: null, selectedIds: new Set(), ...computeDerived(gameState, new Set()) });

			const playerCount = _playerCount as 1 | 2 | 3 | 4;
			const maxH = HAND_SIZE[playerCount];
			const enemy = gameState.castle[0];

			// ── Pré-calcular diamondsValue para distribuição round-robin (Ouros) ──
			// Para multiplayer com Ouros, passamos maxHandSize = handSizeAfterPlay
			// para que resolvePlay não distribua Ouros sozinho — faremos isso abaixo.
			const attackValue = selected.reduce((sum, c) => sum + c.value, 0);
			const suitsPlayed = new Set(selected.map((c) => c.suit).filter((s): s is Suit => s !== null));
			const isImmuneCheck = (s: Suit) => !gameState.jesterActive && enemy.suit === s;
			const diamondsValue = (!isImmuneCheck("diamonds") && suitsPlayed.has("diamonds")) ? attackValue : 0;

			// Em multiplayer com Ouros: impedimos resolvePlay de distribuir cartas (zero capacidade)
			// para fazermos o round-robin correto logo depois.
			const resolveMaxH = (playerCount > 1 && diamondsValue > 0)
				? gameState.playerHand.length - selected.length   // capacidade zero → resolvePlay não distribui
				: maxH;

			const result = resolvePlay(selected, gameState, resolveMaxH);

			// ── Distribuição de Ouros round-robin (Passo 2 — Ouros) ─────────────
			// "o jogador corrente recebe uma carta. Seguem-se os restantes jogadores,
			// no sentido dos ponteiros do relógio, tirando uma carta à vez."
			let activeHand = result.newHand;
			let activeTavern = result.newTavernDeck;
			let extraHands: Record<string, Card[]> = {};

			if (diamondsValue > 0 && playerCount > 1) {
				// Mãos atuais: active player usa result.newHand, outros usam o cache
				const handsSnapshot: Record<string, Card[]> = {
					..._allPlayerHands,
					[myPlayerId]: result.newHand,
				};
				const dist = distributeOuros(
					diamondsValue,
					result.newTavernDeck,
					_playerOrder,
					_currentPlayerIndex,
					handsSnapshot,
					maxH,
				);
				activeHand = dist.newHands[myPlayerId] ?? result.newHand;
				activeTavern = dist.newTavern;
				// Captura mãos dos outros jogadores para escrita conjunta no Firebase
				for (const pid of _playerOrder) {
					if (pid !== myPlayerId) extraHands[pid] = dist.newHands[pid];
				}
			}

			const newStats: GameStats = {
				...gameState.stats,
				turnsPlayed: gameState.stats.turnsPlayed + 1,
				cardsPerTurn: [...gameState.stats.cardsPerTurn, selected],
			};

			if (result.isJester) {
				const next: GameState = {
					...gameState,
					playerHand: activeHand,
					tavernDeck: activeTavern,
					discardPile: result.newDiscardPile,
					jesterActive: true,
					phase: "player_turn",
					stats: newStats,
				};
				set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
				const shared = encodeShared(next, _currentPlayerIndex, _playerOrder, playerCount);
				pushToFirebase(shared, { [myPlayerId]: activeHand, ...extraHands });
				return;
			}

			const newCurrentDamage = gameState.currentDamage + result.totalDamage;
			const allPlayedCards = [...gameState.playedThisFight, ...selected];

			// ── Inimigo derrotado ─────────────────────────────────────────────
			if (newCurrentDamage >= enemy.health) {
				const exactKill = newCurrentDamage === enemy.health;
				const enemyCard = enemyToCard(enemy);
				const newTavern = exactKill ? [enemyCard, ...activeTavern] : activeTavern;
				const newDiscard = exactKill
					? [...result.newDiscardPile, ...allPlayedCards]
					: [...result.newDiscardPile, ...allPlayedCards, enemyCard];
				const [, ...restCastle] = gameState.castle;
				const defeatedStats: GameStats = {
					...newStats,
					enemyKills: [
						...newStats.enemyKills,
						{ enemy, allCards: allPlayedCards, discardedCards: gameState.discardedThisFight },
					],
				};

				if (restCastle.length === 0) {
					const next: GameState = {
						...gameState,
						castle: restCastle,
						defeatedEnemies: [...gameState.defeatedEnemies, enemy],
						playerHand: activeHand,
						tavernDeck: newTavern,
						discardPile: newDiscard,
						playedThisFight: [],
						discardedThisFight: [],
						currentDamage: 0,
						spadesShield: 0,
						jesterActive: false,
						pendingDamage: 0,
						phase: "victory",
						stats: defeatedStats,
					};
					set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
					const shared = encodeShared(next, _currentPlayerIndex, _playerOrder, playerCount);
					pushToFirebase(shared, { [myPlayerId]: activeHand, ...extraHands });
					const { roomId } = get();
					if (roomId) finishRoom(roomId);
					return;
				}

				let finalHand = activeHand;
				let finalTavern = newTavern;
				let finalDiscard = newDiscard;
				let finalJestersAvailable = gameState.jestersAvailable;
				let finalJestersUsed = gameState.jestersUsed;
				let finalPhase: GamePhase = "player_turn";

				if (finalHand.length === 0) {
					const r = resolveEmptyHand(
						finalJestersAvailable, finalJestersUsed,
						finalTavern, finalDiscard, maxH,
					);
					finalHand = r.playerHand;
					finalTavern = r.tavernDeck;
					finalDiscard = r.discardPile;
					finalJestersAvailable = r.jestersAvailable;
					finalJestersUsed = r.jestersUsed;
					finalPhase = r.phase;
				}

				const nextIndex = finalPhase === "player_turn"
					? advanceTurn(_currentPlayerIndex, playerCount)
					: _currentPlayerIndex;

				const next: GameState = {
					...gameState,
					castle: restCastle,
					defeatedEnemies: [...gameState.defeatedEnemies, enemy],
					playerHand: finalHand,
					tavernDeck: finalTavern,
					discardPile: finalDiscard,
					playedThisFight: [],
					discardedThisFight: [],
					currentDamage: 0,
					spadesShield: 0,
					jesterActive: false,
					pendingDamage: 0,
					phase: finalPhase,
					jestersAvailable: finalJestersAvailable,
					jestersUsed: finalJestersUsed,
					stats: defeatedStats,
				};
				set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
				const shared = encodeShared(next, nextIndex, _playerOrder, playerCount);
				pushToFirebase(shared, { [myPlayerId]: finalHand, ...extraHands });
				return;
			}

			// ── Inimigo não derrotado ─────────────────────────────────────────
			const effectiveAttack = Math.max(0, enemy.attack - result.newShield);

			if (effectiveAttack === 0) {
				let finalHand = activeHand;
				let finalTavern = activeTavern;
				let finalDiscard = result.newDiscardPile;
				let finalJestersAvailable = gameState.jestersAvailable;
				let finalJestersUsed = gameState.jestersUsed;
				let finalPhase: GamePhase = "player_turn";

				if (finalHand.length === 0) {
					const r = resolveEmptyHand(
						finalJestersAvailable, finalJestersUsed,
						finalTavern, finalDiscard, maxH,
					);
					finalHand = r.playerHand;
					finalTavern = r.tavernDeck;
					finalDiscard = r.discardPile;
					finalJestersAvailable = r.jestersAvailable;
					finalJestersUsed = r.jestersUsed;
					finalPhase = r.phase;
				}

				const nextIndex = finalPhase === "player_turn"
					? advanceTurn(_currentPlayerIndex, playerCount)
					: _currentPlayerIndex;

				const next: GameState = {
					...gameState,
					playerHand: finalHand,
					tavernDeck: finalTavern,
					discardPile: finalDiscard,
					playedThisFight: allPlayedCards,
					currentDamage: newCurrentDamage,
					spadesShield: result.newShield,
					phase: finalPhase,
					jestersAvailable: finalJestersAvailable,
					jestersUsed: finalJestersUsed,
					stats: newStats,
				};
				set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
				const shared = encodeShared(next, nextIndex, _playerOrder, playerCount);
				pushToFirebase(shared, { [myPlayerId]: finalHand, ...extraHands });
				return;
			}

			// Verifica se pode pagar o dano
			let handForDamage = activeHand;
			let tavernForDamage = activeTavern;
			let discardForDamage = result.newDiscardPile;
			let jestersAvailableForDamage = gameState.jestersAvailable;
			let jestersUsedForDamage = gameState.jestersUsed;

			if (handForDamage.length === 0) {
				const r = resolveEmptyHand(
					jestersAvailableForDamage, jestersUsedForDamage,
					tavernForDamage, discardForDamage, maxH,
				);
				handForDamage = r.playerHand;
				tavernForDamage = r.tavernDeck;
				discardForDamage = r.discardPile;
				jestersAvailableForDamage = r.jestersAvailable;
				jestersUsedForDamage = r.jestersUsed;
			}

			const handValue = handForDamage.reduce((sum, c) => sum + c.value, 0);

			if (handValue < effectiveAttack) {
				const r = resolveCannotPay(
					handForDamage, tavernForDamage, discardForDamage,
					jestersAvailableForDamage, jestersUsedForDamage, maxH,
				);
				const nextIndex = r.phase === "player_turn"
					? advanceTurn(_currentPlayerIndex, playerCount)
					: _currentPlayerIndex;
				const next: GameState = {
					...gameState,
					playerHand: r.playerHand,
					tavernDeck: r.tavernDeck,
					discardPile: r.discardPile,
					playedThisFight: allPlayedCards,
					currentDamage: newCurrentDamage,
					spadesShield: result.newShield,
					pendingDamage: r.phase === "defeat" ? effectiveAttack : 0,
					phase: r.phase,
					jestersAvailable: r.jestersAvailable,
					jestersUsed: r.jestersUsed,
					stats: newStats,
				};
				set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
				const shared = encodeShared(next, nextIndex, _playerOrder, playerCount);
				pushToFirebase(shared, { [myPlayerId]: r.playerHand, ...extraHands });
				return;
			}

			// Fase de sofrer dano (Passo 4)
			const next: GameState = {
				...gameState,
				playerHand: handForDamage,
				tavernDeck: tavernForDamage,
				discardPile: discardForDamage,
				playedThisFight: allPlayedCards,
				currentDamage: newCurrentDamage,
				spadesShield: result.newShield,
				pendingDamage: effectiveAttack,
				phase: "suffer_damage",
				jestersAvailable: jestersAvailableForDamage,
				jestersUsed: jestersUsedForDamage,
				stats: newStats,
			};
			set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
			const shared = encodeShared(next, _currentPlayerIndex, _playerOrder, playerCount);
			// extraHands: já distribuídos acima — escrevemos junto com shared
			pushToFirebase(shared, { [myPlayerId]: handForDamage, ...extraHands });
		},

		// ── Passar turno ──────────────────────────────────────────────────────
		yieldTurn: () => {
			const { isMyTurn, gameState, myPlayerId, _currentPlayerIndex, _playerOrder, _playerCount } = get();
			if (!isMyTurn || gameState.phase !== "player_turn") return;
			const enemy = gameState.castle[0];
			if (!enemy) return;

			const playerCount = _playerCount as 1 | 2 | 3 | 4;
			const maxH = HAND_SIZE[playerCount];
			const effectiveAttack = Math.max(0, enemy.attack - gameState.spadesShield);

			if (effectiveAttack === 0) {
				const nextIndex = advanceTurn(_currentPlayerIndex, playerCount);
				const next: GameState = { ...gameState };
				set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
				const shared = encodeShared(next, nextIndex, _playerOrder, playerCount);
				pushToFirebase(shared, { [myPlayerId]: gameState.playerHand });
				return;
			}

			const handValue = gameState.playerHand.reduce((sum, c) => sum + c.value, 0);

			if (handValue < effectiveAttack) {
				const r = resolveCannotPay(
					gameState.playerHand, gameState.tavernDeck, gameState.discardPile,
					gameState.jestersAvailable, gameState.jestersUsed, maxH,
				);
				const nextIndex = r.phase === "player_turn"
					? advanceTurn(_currentPlayerIndex, playerCount)
					: _currentPlayerIndex;
				const next: GameState = {
					...gameState,
					playerHand: r.playerHand,
					tavernDeck: r.tavernDeck,
					discardPile: r.discardPile,
					pendingDamage: r.phase === "defeat" ? effectiveAttack : 0,
					phase: r.phase,
					jestersAvailable: r.jestersAvailable,
					jestersUsed: r.jestersUsed,
				};
				set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
				const shared = encodeShared(next, nextIndex, _playerOrder, playerCount);
				pushToFirebase(shared, { [myPlayerId]: r.playerHand });
				return;
			}

			const next: GameState = { ...gameState, pendingDamage: effectiveAttack, phase: "suffer_damage" };
			set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
			const shared = encodeShared(next, _currentPlayerIndex, _playerOrder, playerCount);
			pushToFirebase(shared, { [myPlayerId]: gameState.playerHand });
		},

		// ── Confirmar descarte ────────────────────────────────────────────────
		confirmDiscard: () => {
			const { isMyTurn, gameState, selectedIds, myPlayerId, _currentPlayerIndex, _playerOrder, _playerCount } = get();
			if (!isMyTurn || gameState.phase !== "suffer_damage") return;

			const playerCount = _playerCount as 1 | 2 | 3 | 4;
			const maxH = HAND_SIZE[playerCount];
			const selected = gameState.playerHand.filter((c) => selectedIds.has(c.id));
			const total = selected.reduce((sum, c) => sum + c.value, 0);

			if (total < gameState.pendingDamage) {
				set({
					playError: t("game.errors.discardNotEnough", {
						needed: gameState.pendingDamage,
						current: total,
					}),
				});
				return;
			}

			set({ playError: null, selectedIds: new Set(), ...computeDerived(gameState, new Set()) });

			const newHand = gameState.playerHand.filter((c) => !selectedIds.has(c.id));
			const newDiscard = [...gameState.discardPile, ...selected];
			const newDiscardedThisFight = [...gameState.discardedThisFight, ...selected];
			const newStats: GameStats = {
				...gameState.stats,
				discardedCards: [...gameState.stats.discardedCards, ...selected],
			};

			let finalHand = newHand;
			let finalTavern = gameState.tavernDeck;
			let finalDiscard = newDiscard;
			let finalJestersAvailable = gameState.jestersAvailable;
			let finalJestersUsed = gameState.jestersUsed;
			let finalPhase: GamePhase = "player_turn";

			if (finalHand.length === 0) {
				const r = resolveEmptyHand(
					finalJestersAvailable, finalJestersUsed,
					finalTavern, finalDiscard, maxH,
				);
				finalHand = r.playerHand;
				finalTavern = r.tavernDeck;
				finalDiscard = r.discardPile;
				finalJestersAvailable = r.jestersAvailable;
				finalJestersUsed = r.jestersUsed;
				finalPhase = r.phase;
			}

			const nextIndex = finalPhase === "player_turn"
				? advanceTurn(_currentPlayerIndex, playerCount)
				: _currentPlayerIndex;

			const next: GameState = {
				...gameState,
				playerHand: finalHand,
				tavernDeck: finalTavern,
				discardPile: finalDiscard,
				discardedThisFight: newDiscardedThisFight,
				pendingDamage: 0,
				phase: finalPhase,
				jestersAvailable: finalJestersAvailable,
				jestersUsed: finalJestersUsed,
				stats: newStats,
			};
			set({ gameState: next, selectedIds: new Set(), ...computeDerived(next, new Set()) });
			const shared = encodeShared(next, nextIndex, _playerOrder, playerCount);
			pushToFirebase(shared, { [myPlayerId]: finalHand });
		},

		// ── No-ops (animações apenas locais) ──────────────────────────────────
		completeAutoJesterAnimation: () => {},

		// ── Ordenação ─────────────────────────────────────────────────────────
		sortHand: () => {
			const { gameState, selectedIds } = get();
			const sorted: GameState = {
				...gameState,
				playerHand: [...gameState.playerHand].sort((a, b) => {
					const rankDiff = (RANK_ORDER[a.rank] ?? 0) - (RANK_ORDER[b.rank] ?? 0);
					if (rankDiff !== 0) return rankDiff;
					return (SUIT_ORDER[a.suit ?? ""] ?? 0) - (SUIT_ORDER[b.suit ?? ""] ?? 0);
				}),
			};
			set({ gameState: sorted, selectedIds, ...computeDerived(sorted, selectedIds) });
		},

		sortHandByClass: () => {
			const { gameState, selectedIds } = get();
			const sorted: GameState = {
				...gameState,
				playerHand: [...gameState.playerHand].sort(
					(a, b) => (SUIT_ORDER[a.suit ?? ""] ?? 0) - (SUIT_ORDER[b.suit ?? ""] ?? 0),
				),
			};
			set({ gameState: sorted, selectedIds, ...computeDerived(sorted, selectedIds) });
		},

		// ── Reset (host reinicia a partida) ───────────────────────────────────
		resetGame: () => {
			const { roomId, isHost } = get();
			if (!roomId || !isHost) return;
			get().startGame();
		},

		// ── Reconexão após refresh ────────────────────────────────────────────
		tryReconnect: async () => {
			const session = loadSession();
			if (!session) return false;
			const room = await fetchRoom(session.roomId);
			if (!room || room.status === "finished") { clearSession(); return false; }
			const { myPlayerId, _unsubscribeFn } = get();
			if (!room.players?.[myPlayerId]) { clearSession(); return false; }
			_unsubscribeFn?.();
			const unsub = subscribeToRoom(session.roomId, onRoomUpdate);
			set({
				roomId: session.roomId,
				myDisplayName: session.displayName,
				myAvatarId: session.avatarId ?? get().myAvatarId,
				isHost: session.isHost,
				roomStatus: room.status,
				_unsubscribeFn: unsub,
			});
			return true;
		},

		// ── Interno ───────────────────────────────────────────────────────────
		_onRoomUpdate: onRoomUpdate,
	};
});
