import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { styles } from "../GameScreen.styles";

const PLAYER_COLORS = ["#4ADE80", "#60A5FA", "#FBBF24", "#F87171"] as const;

interface PlayerInfo {
	id: string;
	displayName: string;
	cardCount: number;
}

interface ParticipantsSidebarProps {
	players: PlayerInfo[];
	activePlayerId: string | null;
	myPlayerId?: string;
}

export const ParticipantsSidebar = ({
	players,
	activePlayerId,
	myPlayerId,
}: ParticipantsSidebarProps) => {
	const { t } = useTranslation();
	const activePlayerIndex = players.findIndex(
		(player) => player.id === activePlayerId,
	);
	const activePlayer =
		activePlayerIndex >= 0 ? players[activePlayerIndex] : null;
	const activePlayerColor = activePlayer
		? PLAYER_COLORS[activePlayerIndex % PLAYER_COLORS.length]
		: "#E8D5A3";
	const isMyTurn = activePlayer?.id === myPlayerId;

	return (
		<View style={styles.participantsSidebar}>
			{activePlayer && (
				<View
					style={[
						styles.participantsTurnCard,
						{ borderColor: `${activePlayerColor}66` },
					]}
				>
					<Text style={styles.participantsTurnLabel}>
						{t("multiplayer.status.turnLabel")}
					</Text>
					<View style={styles.participantsTurnRow}>
						<View
							style={[
								styles.participantsTurnDot,
								{ backgroundColor: activePlayerColor },
							]}
						/>
						{isMyTurn ? (
							<Text
								style={[
									styles.participantsTurnValue,
									{ color: activePlayerColor },
								]}
							>
								{t("multiplayer.status.yourTurn")}
							</Text>
						) : (
							<Text numberOfLines={2}>
								<Text
									style={[
										styles.participantsTurnValue,
										{ color: activePlayerColor },
									]}
								>
									{activePlayer.displayName}
								</Text>
								<Text style={styles.participantsTurnSuffix}>
									{` ${t("multiplayer.status.waitingInline")}`}
								</Text>
							</Text>
						)}
					</View>
				</View>
			)}

			<View style={styles.participantsList}>
				{players.map((player, index) => {
					const playerColor = PLAYER_COLORS[index % PLAYER_COLORS.length];
					const isActive = player.id === activePlayerId;

					return (
						<View
							key={player.id}
							style={[
								styles.participantCard,
								isActive
									? {
											borderColor: playerColor,
											opacity: 1,
										}
									: styles.participantCardWaiting,
							]}
						>
							<View style={styles.participantIdentity}>
								<View
									style={[
										styles.participantDot,
										{ backgroundColor: playerColor },
									]}
								/>
								<Text style={styles.participantName} numberOfLines={1}>
									{player.displayName}
								</Text>
							</View>
							<View
								style={[
									styles.participantCountPill,
									{
										backgroundColor: isActive
											? `${playerColor}20`
											: `${playerColor}12`,
									},
								]}
							>
								<Text style={styles.participantCount}>
									{player.cardCount} {t("multiplayer.status.cards")}
								</Text>
							</View>
						</View>
					);
				})}
			</View>
		</View>
	);
};
