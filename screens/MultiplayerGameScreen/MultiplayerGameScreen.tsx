import { AbandonVoteModal } from "@/components/AbandonVoteModal/AbandonVoteModal";
import { TurnToast } from "@/components/TurnToast/TurnToast";
import { MultiplayerStoreProvider } from "@/contexts/GameStoreContext";
import { GameScreen } from "@/screens/GameScreen";
import { requestTurnNotificationPermission } from "@/services/notifications";
import { useMultiplayerStore } from "@/store/multiplayerStore";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PLAYER_COLORS = ["#4ADE80", "#60A5FA", "#FBBF24", "#F87171"] as const;

const TurnHud = () => {
	const { isMyTurn, currentPlayerName, roomPlayers, myPlayerId } =
		useMultiplayerStore();
	const insets = useSafeAreaInsets();
	const pulseOpacity = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (isMyTurn) {
			pulseOpacity.setValue(1);
			return;
		}
		const anim = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseOpacity, { toValue: 0.3, duration: 850, useNativeDriver: true }),
				Animated.timing(pulseOpacity, { toValue: 1, duration: 850, useNativeDriver: true }),
			]),
		);
		anim.start();
		return () => anim.stop();
	}, [isMyTurn]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<View style={[styles.hud, { paddingBottom: Math.max((insets.bottom || 0) - 14, 8) }]}>
			{/* Fixo: indicador de turno */}
			<View style={[styles.turnPill, isMyTurn && styles.turnPillActive]}>
				{isMyTurn ? (
					<Text style={styles.turnTextActive}>Seu turno</Text>
				) : (
					<Animated.Text style={{ opacity: pulseOpacity }}>
						<Text style={styles.turnPlayerName}>{currentPlayerName}</Text>
						<Text style={styles.turnTextWaiting}>{" está jogando..."}</Text>
					</Animated.Text>
				)}
			</View>

			{/* Fixo: separador */}
			<View style={styles.separator} />

			{/* Rolável: chips dos jogadores */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.playersScroll}
			>
				{roomPlayers.map((p, idx) => {
					const isSelf = p.id === myPlayerId;
					const dotColor = PLAYER_COLORS[idx % PLAYER_COLORS.length];
					return (
						<View
							key={p.id}
							style={[styles.playerChip, isSelf && styles.playerChipSelf]}
						>
							<View style={[styles.dot, { backgroundColor: dotColor }]} />
							<Text
								style={[styles.chipName, isSelf && styles.chipNameSelf]}
								numberOfLines={1}
							>
								{p.displayName}
							</Text>
							<Text style={[styles.chipCards, isSelf && styles.chipCardsSelf]}>
								{p.cardCount}
							</Text>
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
		turnToastSignal, isMyTurn, myDisplayName,
		abandonRequest, myPlayerId, roomPlayers, roomStatus,
		requestAbandon, voteAbandon,
	} = store;

	useEffect(() => {
		requestTurnNotificationPermission();
	}, []);

	// Navega para home quando a partida é encerrada por abandono
	useEffect(() => {
		if (roomStatus === "finished") {
			router.replace("/");
		}
	}, [roomStatus]);

	const showAbandonModal = abandonRequest != null;

	return (
		<MultiplayerStoreProvider value={{ ...store, onAbandon: requestAbandon }}>
			<View style={styles.wrapper}>
				<View style={styles.gameArea}>
					<GameScreen />
				</View>
				<TurnHud />
				<TurnToast signal={turnToastSignal} isMyTurn={isMyTurn} playerName={myDisplayName} />
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
	gameArea: {
		flex: 1,
	},
	hud: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(10,10,18,0.9)",
		borderTopWidth: 1,
		borderTopColor: "rgba(232,213,163,0.15)",
		paddingLeft: 16,
		paddingRight: 8,
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
	dot: {
		width: 5,
		height: 5,
		borderRadius: 3,
		flexShrink: 0,
	},
	chipName: {
		fontFamily: "IMFellEnglish",
		fontSize: 11,
		color: "#64748B",
	},
	chipNameSelf: {
		color: "#CBD5E1",
	},
	chipCards: {
		fontFamily: "Cinzel",
		fontSize: 10,
		color: "#475569",
		minWidth: 10,
		textAlign: "right",
	},
	chipCardsSelf: {
		color: "#94A3B8",
	},
});
