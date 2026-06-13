import { ChatMessage } from "@/data/types";
import {
	clearRoomChat,
	registerPresence,
	sendChatMessage,
	subscribeToRoomChat,
} from "@/services/firebaseChat";
import { computeUnread, validateOutgoingText } from "@/utils/chat";
import { create } from "zustand";

interface ChatStore {
	roomId: string | null;
	myPlayerId: string;
	myDisplayName: string;
	messages: ChatMessage[];
	unreadCount: number;
	isOpen: boolean;
	error: "empty" | "tooLong" | null;
	lastSeenMessageId: string | null;

	_unsub: (() => void) | null;
	_presenceCleanup: (() => void) | null;

	connect: (roomId: string, playerId: string, playerName: string) => Promise<void>;
	disconnect: () => void;
	openChat: () => void;
	closeChat: () => void;
	markAsRead: () => void;
	sendText: (text: string) => Promise<void>;
	clearHistory: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
	roomId: null,
	myPlayerId: "",
	myDisplayName: "",
	messages: [],
	unreadCount: 0,
	isOpen: false,
	error: null,
	lastSeenMessageId: null,

	_unsub: null,
	_presenceCleanup: null,

	connect: async (roomId, playerId, playerName) => {
		// Já conectado nesta sala? não reassina.
		if (get().roomId === roomId && get()._unsub) return;
		get().disconnect();

		set({ roomId, myPlayerId: playerId, myDisplayName: playerName });

		const unsub = subscribeToRoomChat(roomId, (messages) => {
			const { isOpen, lastSeenMessageId, myPlayerId } = get();
			if (isOpen) {
				const lastId = messages.length ? messages[messages.length - 1].id : lastSeenMessageId;
				set({ messages, lastSeenMessageId: lastId, unreadCount: 0 });
			} else {
				set({ messages, unreadCount: computeUnread(messages, lastSeenMessageId, myPlayerId) });
			}
		});
		set({ _unsub: unsub });

		try {
			const cleanup = await registerPresence(roomId, { playerId, playerName });
			set({ _presenceCleanup: cleanup });
		} catch {
			// presença é best-effort; não bloqueia o chat
		}
	},

	disconnect: () => {
		const { _unsub, _presenceCleanup } = get();
		_presenceCleanup?.();
		_unsub?.();
		set({
			roomId: null,
			messages: [],
			unreadCount: 0,
			isOpen: false,
			error: null,
			lastSeenMessageId: null,
			_unsub: null,
			_presenceCleanup: null,
		});
	},

	openChat: () => {
		set({ isOpen: true });
		get().markAsRead();
	},

	closeChat: () => set({ isOpen: false }),

	markAsRead: () => {
		const { messages } = get();
		const lastId = messages.length ? messages[messages.length - 1].id : null;
		set({ lastSeenMessageId: lastId, unreadCount: 0 });
	},

	sendText: async (text) => {
		const { roomId, myPlayerId, myDisplayName } = get();
		if (!roomId) return;
		const result = validateOutgoingText(text);
		if (!result.ok) {
			set({ error: result.reason });
			return;
		}
		set({ error: null });
		try {
			await sendChatMessage(roomId, { playerId: myPlayerId, playerName: myDisplayName }, result.value);
		} catch {
			// falha de rede: silenciosa no MVP (a mensagem não aparece)
		}
	},

	clearHistory: () => {
		const { roomId } = get();
		if (roomId) clearRoomChat(roomId).catch(() => {});
	},
}));
