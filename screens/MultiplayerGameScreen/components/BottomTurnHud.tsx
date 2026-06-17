import {
	MultiplayerRoomPlayer,
	useMultiplayerStore,
} from "@/store/multiplayerStore";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBlobIndicator } from "../hooks/useBlobIndicator";
import { BlobIndicator } from "./BlobIndicator";
import { styles } from "./BottomTurnHud.styles";
import { ChatButton } from "./ChatButton";
import { PlayerChip } from "./PlayerChip";

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

/**
 * Barra de turno flutuante (estilo "menubar"): pill escura com os jogadores em
 * linha e um blob dourado que desliza sob o jogador ativo, usando a cor do
 * jogador como acento.
 */
export const BottomTurnHud = () => {
	const { roomPlayers, _currentPlayerIndex, _playerOrder } =
		useMultiplayerStore();
	const insets = useSafeAreaInsets();

	const activePlayerId = _playerOrder[_currentPlayerIndex] ?? null;
	const orderedPlayers = getOrderedPlayers(roomPlayers, _playerOrder);
	const activeIndex = orderedPlayers.findIndex((p) => p.id === activePlayerId);
	const activeColor =
		PLAYER_COLORS[(activeIndex < 0 ? 0 : activeIndex) % PLAYER_COLORS.length];

	const { animatedStyle, measure } = useBlobIndicator({
		activeId: activePlayerId,
	});

	return (
		<View style={styles.wrap} pointerEvents="box-none">
			<View
				style={[
					styles.bar,
					{ paddingBottom: Math.max((insets.bottom || 0) - 2, 10) },
				]}
			>
				<View style={styles.track}>
					<View style={styles.playersRow}>
						<BlobIndicator color={activeColor} animatedStyle={animatedStyle} />
						{orderedPlayers.map((player, index) => (
							<PlayerChip
								key={player.id}
								player={player}
								color={PLAYER_COLORS[index % PLAYER_COLORS.length]}
								isActive={player.id === activePlayerId}
								onMeasure={(rect) => measure(player.id, rect)}
							/>
						))}
					</View>
					<ChatButton />
				</View>
			</View>
		</View>
	);
};
