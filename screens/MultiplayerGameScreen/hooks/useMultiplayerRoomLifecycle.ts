import { useAudio } from "@/contexts/AudioContext";
import { AvatarId, RoomStatus } from "@/data/types";
import { requestTurnNotificationPermission } from "@/services/notifications";
import { useChatStore } from "@/store/chatStore";
import { router } from "expo-router";
import { useEffect } from "react";

type Options = {
	roomId: string | null;
	myPlayerId: string;
	myDisplayName: string;
	myAvatarId: AvatarId;
	roomStatus: RoomStatus | "idle";
	isMyTurn: boolean;
	turnToastSignal: number;
	tryReconnect: () => Promise<boolean>;
};

/**
 * Orquestra o ciclo de vida da sala multiplayer (efeitos colaterais): alerta
 * sonoro de turno, permissão de notificação, conexão/limpeza do chat,
 * reconexão após refresh e saída quando a sala encerra.
 */
export const useMultiplayerRoomLifecycle = ({
	roomId,
	myPlayerId,
	myDisplayName,
	myAvatarId,
	roomStatus,
	isMyTurn,
	turnToastSignal,
	tryReconnect,
}: Options) => {
	const { playTurnAlert } = useAudio();
	const chatConnect = useChatStore((s) => s.connect);
	const chatDisconnect = useChatStore((s) => s.disconnect);
	const chatClear = useChatStore((s) => s.clearHistory);

	// Alerta sonoro quando passa a ser a vez deste jogador.
	useEffect(() => {
		if (turnToastSignal > 0 && isMyTurn) playTurnAlert();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [turnToastSignal]);

	useEffect(() => {
		requestTurnNotificationPermission();
	}, []);

	// Conecta o chat ao ciclo da sala; desconecta no unmount / troca de sala.
	useEffect(() => {
		if (!roomId || !myPlayerId) return;
		void chatConnect(roomId, myPlayerId, myDisplayName, myAvatarId);
		return () => chatDisconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomId, myPlayerId]);

	// Limpa o histórico do chat quando a sala encerra.
	useEffect(() => {
		if (roomStatus === "finished") chatClear();
	}, [roomStatus, chatClear]);

	// Reconexão após refresh (web): sem sala em memória, tenta restaurar.
	useEffect(() => {
		if (roomId) return;
		tryReconnect().then((ok) => {
			if (!ok) router.replace("/");
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (roomStatus === "finished") {
			router.replace("/");
		}
	}, [roomStatus]);
};
