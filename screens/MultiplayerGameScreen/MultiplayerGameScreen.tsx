import { AbandonVoteModal } from "@/components/AbandonVoteModal/AbandonVoteModal";
import { RoomChat } from "@/components/RoomChat";
import { TurnToast } from "@/components/TurnToast/TurnToast";
import { MultiplayerStoreProvider } from "@/contexts/GameStoreContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { GameScreen } from "@/screens/GameScreen";
import { useChatStore } from "@/store/chatStore";
import { useMultiplayerStore } from "@/store/multiplayerStore";
import React from "react";
import { View } from "react-native";
import { BottomTurnHud } from "./components/BottomTurnHud";
import { useMultiplayerRoomLifecycle } from "./hooks/useMultiplayerRoomLifecycle";
import { styles } from "./MultiplayerGameScreen.styles";

export const MultiplayerGameScreen = () => {
	const store = useMultiplayerStore();
	const {
		turnToastSignal,
		isMyTurn,
		myDisplayName,
		myAvatarId,
		abandonRequest,
		myPlayerId,
		roomPlayers,
		roomStatus,
		requestAbandon,
		voteAbandon,
		roomId,
		tryReconnect,
	} = store;
	const { isTablet, isDesktop } = useResponsiveLayout();
	const chatOpen = useChatStore((s) => s.isOpen);

	useMultiplayerRoomLifecycle({
		roomId,
		myPlayerId,
		myDisplayName,
		myAvatarId,
		roomStatus,
		isMyTurn,
		turnToastSignal,
		tryReconnect,
	});

	const showAbandonModal = abandonRequest != null;
	// No desktop, o chat aberto é docado à direita e desloca o GameScreen;
	// no mobile/tablet permanece como overlay/drawer + botão flutuante.
	const dockedChat = isDesktop && chatOpen;

	// Jogador da vez (para o toast de turno): avatar + nome + se é o próprio.
	const activePlayerId = store._playerOrder[store._currentPlayerIndex] ?? null;
	const activePlayer = roomPlayers.find((p) => p.id === activePlayerId);

	return (
		<MultiplayerStoreProvider
			value={{
				...store,
				onAbandon: requestAbandon,
				playerOrder: store._playerOrder,
				currentPlayerIndex: store._currentPlayerIndex,
				reveal: store.gameState.reveal ?? null,
				closeReveal: store.closeReveal,
			}}
		>
			<View style={styles.wrapper}>
				<View style={styles.contentRow}>
					<View style={styles.gameArea}>
						<GameScreen />
					</View>
					{dockedChat && (
						<View style={styles.chatDock}>
							<RoomChat docked />
						</View>
					)}
				</View>
				{!isTablet && <BottomTurnHud />}
				{/* O HUD inferior já oferece o botão de chat; o FAB só aparece no
				    tablet (onde não há HUD inferior). */}
				{!dockedChat && <RoomChat showFab={isTablet} />}
				<TurnToast
					activePlayerId={activePlayerId}
					isMyTurn={isMyTurn}
					playerName={activePlayer?.displayName ?? ""}
					avatarId={activePlayer?.avatarId}
				/>
				{showAbandonModal && (
					<AbandonVoteModal
						abandonRequest={abandonRequest}
						myPlayerId={myPlayerId}
						playerCount={roomPlayers.length}
						onAgree={() => voteAbandon(true)}
						onRefuse={() => voteAbandon(false)}
					/>
				)}
			</View>
		</MultiplayerStoreProvider>
	);
};
