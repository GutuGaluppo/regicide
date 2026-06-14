import { AbandonVoteModal } from "@/components/AbandonVoteModal/AbandonVoteModal";
import { AvatarBadge } from "@/components/AvatarBadge";
import { CardCountBadge } from "@/components/CardCountBadge";
import { RoomChat } from "@/components/RoomChat";
import { TurnToast } from "@/components/TurnToast/TurnToast";
import { useAudio } from "@/contexts/AudioContext";
import { MultiplayerStoreProvider } from "@/contexts/GameStoreContext";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { GameScreen } from "@/screens/GameScreen";
import { requestTurnNotificationPermission } from "@/services/notifications";
import { useChatStore } from "@/store/chatStore";
import { MultiplayerRoomPlayer, useMultiplayerStore } from "@/store/multiplayerStore";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PLAYER_COLORS = ["#4ADE80", "#60A5FA", "#FBBF24", "#F87171"] as const;

const getOrderedPlayers = (
	roomPlayers: MultiplayerRoomPlayer[],
	playerOrder: string[],
) => {
	const orderIndex = new Map(
		playerOrder.map((playerId, index) => [playerId, index]),
	);

	return [...roomPlayers].sort((left, right) => {
		const leftIndex = orderIndex.get(left.id) ?? Number.MAX_SAFE_INTEGER;
		const rightIndex = orderIndex.get(right.id) ?? Number.MAX_SAFE_INTEGER;
		return leftIndex - rightIndex;
	});
};

const useTurnPulse = (isMyTurn: boolean) => {
	const pulseOpacity = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (isMyTurn) {
			pulseOpacity.setValue(1);
			return;
		}

		const anim = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseOpacity, {
					toValue: 0.35,
					duration: 850,
					useNativeDriver: true,
				}),
				Animated.timing(pulseOpacity, {
					toValue: 1,
					duration: 850,
					useNativeDriver: true,
				}),
			]),
		);

		anim.start();
		return () => anim.stop();
	}, [isMyTurn, pulseOpacity]);

	return pulseOpacity;
};

const BottomTurnHud = () => {
	const { t } = useTranslation();
	const {
		isMyTurn,
		currentPlayerName,
		roomPlayers,
		myPlayerId,
		_currentPlayerIndex,
		_playerOrder,
	} = useMultiplayerStore();
	const insets = useSafeAreaInsets();
	const pulseOpacity = useTurnPulse(isMyTurn);
	const activePlayerId = _playerOrder[_currentPlayerIndex] ?? null;
	const orderedPlayers = getOrderedPlayers(roomPlayers, _playerOrder);

	return (
		<View
			style={[
				styles.hud,
				{
					paddingBottom: Math.max((insets.bottom || 0) - 14, 8),
					paddingHorizontal: 16,
				},
			]}
		>
			<View style={[styles.turnPill, isMyTurn && styles.turnPillActive]}>
				{isMyTurn ? (
					<Text style={styles.turnTextActive}>
						{t("multiplayer.status.yourTurn")}
					</Text>
				) : (
					<Animated.Text style={{ opacity: pulseOpacity }}>
						<Text style={styles.turnPlayerName}>{currentPlayerName}</Text>
						<Text style={styles.turnTextWaiting}>
							{` ${t("multiplayer.status.waitingInline")}`}
						</Text>
					</Animated.Text>
				)}
			</View>

			<View style={styles.separator} />

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.playersScroll}
			>
				{orderedPlayers.map((player, index) => {
					const isSelf = player.id === myPlayerId;
					const isActive = player.id === activePlayerId;
					const dotColor = PLAYER_COLORS[index % PLAYER_COLORS.length];

					return (
						<View
							key={player.id}
							style={[
								styles.playerChip,
								isSelf && styles.playerChipSelf,
								isActive && styles.playerChipActive,
							]}
						>
							<AvatarBadge avatarId={player.avatarId} size={22} ringColor={dotColor} />
							<Text
								style={[
									styles.chipName,
									isSelf && styles.chipNameSelf,
									isActive && styles.chipNameActive,
								]}
								numberOfLines={1}
							>
								{player.displayName}
							</Text>
							<CardCountBadge
								count={player.cardCount}
								pillStyle={[
									styles.chipCardsPill,
									isActive && styles.chipCardsPillActive,
								]}
								textStyle={[
									styles.chipCards,
									isSelf && styles.chipCardsSelf,
									isActive && styles.chipCardsActive,
								]}
							/>
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
};

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
	const { playTurnAlert } = useAudio();
	const chatOpen = useChatStore((s) => s.isOpen);

	// Alerta sonoro quando passa a ser a vez deste jogador.
	useEffect(() => {
		if (turnToastSignal > 0 && isMyTurn) playTurnAlert();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [turnToastSignal]);

	const chatConnect = useChatStore((s) => s.connect);
	const chatDisconnect = useChatStore((s) => s.disconnect);
	const chatClear = useChatStore((s) => s.clearHistory);

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

	useEffect(() => {
		if (roomId) return;
		tryReconnect().then((ok) => {
			if (!ok) router.replace("/");
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (roomStatus === "finished") {
			router.replace("/");
		}
	}, [roomStatus]);

	const showAbandonModal = abandonRequest != null;
	// No desktop, o chat aberto é docado à direita e desloca o GameScreen;
	// no mobile/tablet permanece como overlay/drawer + botão flutuante.
	const dockedChat = isDesktop && chatOpen;

	return (
		<MultiplayerStoreProvider
			value={{
				...store,
				onAbandon: requestAbandon,
				playerOrder: store._playerOrder,
				currentPlayerIndex: store._currentPlayerIndex,
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
				{!dockedChat && <RoomChat />}
				<TurnToast
					signal={turnToastSignal}
					isMyTurn={isMyTurn}
					playerName={myDisplayName}
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

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		flexDirection: "column",
	},
	contentRow: {
		flex: 1,
		flexDirection: "row",
	},
	gameArea: {
		flex: 1,
	},
	chatDock: {
		width: 360,
	},
	hud: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(10,10,18,0.9)",
		borderTopWidth: 1,
		borderTopColor: "rgba(232,213,163,0.15)",
		paddingTop: 8,
		gap: 6,
	},
	turnPill: {
		borderRadius: 14,
		paddingHorizontal: 10,
		paddingVertical: 4,
		backgroundColor: "rgba(255,255,255,0.05)",
		flexShrink: 0,
	},
	turnPillActive: {
		backgroundColor: "rgba(74,222,128,0.15)",
		borderWidth: 1,
		borderColor: "rgba(74,222,128,0.4)",
	},
	turnTextActive: {
		fontFamily: "Cinzel",
		fontSize: 11,
		color: "#4ADE80",
		letterSpacing: 0.5,
	},
	turnTextWaiting: {
		fontFamily: "IMFellEnglish",
		fontSize: 12,
		color: "#64748B",
	},
	turnPlayerName: {
		fontFamily: "IMFellEnglish",
		fontSize: 12,
		color: "#E8D5A3",
	},
	separator: {
		width: 1,
		height: 18,
		backgroundColor: "rgba(232,213,163,0.15)",
		marginHorizontal: 2,
		flexShrink: 0,
	},
	playersScroll: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingRight: 8,
	},
	playerChip: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 12,
		paddingHorizontal: 7,
		paddingVertical: 3,
		gap: 4,
	},
	playerChipSelf: {
		backgroundColor: "rgba(255,255,255,0.07)",
	},
	playerChipActive: {
		backgroundColor: "rgba(232,213,163,0.1)",
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.18)",
	},
	dot: {
		width: 5,
		height: 5,
		borderRadius: 3,
		flexShrink: 0,
	},
	chipName: {
		fontFamily: "IMFellEnglish",
		fontSize: 11,
		color: "#91a8c7",
	},
	chipNameSelf: {
		color: "#CBD5E1",
	},
	chipNameActive: {
		color: "#F8E7BC",
	},
	chipCardsPill: {
		minWidth: 18,
		paddingHorizontal: 5,
		paddingVertical: 1,
		borderRadius: 999,
		backgroundColor: "rgba(148,163,184,0.08)",
		alignItems: "center",
	},
	chipCardsPillActive: {
		backgroundColor: "rgba(232,213,163,0.12)",
	},
	chipCards: {
		fontFamily: "Cinzel",
		fontSize: 10,
		color: "#93a7c3",
		minWidth: 10,
		textAlign: "right",
	},
	chipCardsSelf: {
		color: "#94A3B8",
	},
	chipCardsActive: {
		color: "#F8E7BC",
	},
});
