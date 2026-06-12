import { useMultiplayerStore } from "@/store/multiplayerStore";
import { buildJoinUrl, shareRoom } from "@/utils/shareRoom";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ImageBackground,
	LayoutAnimation,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	UIManager,
	View,
} from "react-native";
import { styles } from "./LobbyScreen.styles";

const TavernSilver = require("@/assets/icons/tavern_silver.png");

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

type LobbyView = "entry" | "waiting";

export const LobbyScreen = () => {
	const { t } = useTranslation();
	const {
		myPlayerId,
		roomId,
		isHost,
		roomStatus,
		roomPlayers,
		myDisplayName,
		initPlayerId,
		createRoom,
		joinRoom: storeJoinRoom,
		startGame,
		leaveRoom,
	} = useMultiplayerStore();

	const params = useLocalSearchParams<{ code?: string }>();

	const [view, setView] = useState<LobbyView>("entry");
	const [displayName, setDisplayName] = useState("");
	const [joinCode, setJoinCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [joinFocused, setJoinFocused] = useState(false);
	const [copied, setCopied] = useState(false);

	// Pre-fill the join code when arriving from a shared link (?code=ABC123).
	useEffect(() => {
		if (typeof params.code === "string" && params.code) {
			setJoinCode(params.code.toUpperCase().slice(0, 6));
		}
	}, [params.code]);

	const handleJoinFocus = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setJoinFocused(true);
	};

	const handleJoinBlur = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setJoinFocused(false);
	};

	useEffect(() => {
		initPlayerId();
	}, [initPlayerId]);

	// Navegar para a partida quando ela começar
	useEffect(() => {
		if (roomStatus === "playing") {
			router.replace("/multiplayer-game");
		}
	}, [roomStatus]);

	const handleCreate = async () => {
		const name = displayName.trim();
		if (!name) {
			setError(t("lobby.errors.nameRequired"));
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await createRoom(name);
			setView("waiting");
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : t("lobby.errors.createFailed"));
		} finally {
			setLoading(false);
		}
	};

	const handleJoin = async () => {
		const name = displayName.trim();
		const code = joinCode.trim().toUpperCase();
		if (!name) {
			setError(t("lobby.errors.nameRequired"));
			return;
		}
		if (code.length !== 6) {
			setError(t("lobby.errors.invalidCode"));
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await storeJoinRoom(code, name);
			setView("waiting");
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : t("lobby.errors.joinFailed"));
		} finally {
			setLoading(false);
		}
	};

	const handleLeave = async () => {
		await leaveRoom();
		setView("entry");
		setError(null);
	};

	const handleShare = async () => {
		if (!roomId) return;
		const outcome = await shareRoom({
			title: t("lobby.shareTitle"),
			message: t("lobby.shareMessage", {
				code: roomId,
				url: buildJoinUrl(roomId),
			}),
		});
		if (outcome === "copied") {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleStart = async () => {
		if (roomPlayers.length < 2) {
			setError(t("lobby.errors.minPlayers"));
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await startGame();
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : t("lobby.errors.startFailed"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<ImageBackground
			source={require("@/assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<View style={styles.content}>
				{view === "entry" ? (
					<>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.back()}
						>
							<Image source={TavernSilver} style={styles.backIcon} contentFit="contain" />
						</TouchableOpacity>

						<Text style={styles.title}>{t("lobby.title")}</Text>

						{!joinFocused && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>
									{t("lobby.nameSection")}
								</Text>
								<TextInput
									style={styles.input}
									value={displayName}
									onChangeText={setDisplayName}
									placeholder={t("lobby.namePlaceholder")}
									placeholderTextColor="#63748b"
									maxLength={20}
									autoCapitalize="words"
								/>
							</View>
						)}

						{displayName && !joinFocused && (
							<>
								<View style={styles.section}>
									<Text style={styles.sectionTitle}>
										{t("lobby.createSection")}
									</Text>
									<TouchableOpacity
										style={[
											styles.button,
											styles.buttonPrimary,
											loading && styles.buttonDisabled,
										]}
										onPress={handleCreate}
										disabled={loading}
									>
										<Text style={styles.buttonText}>
											{loading ? t("lobby.creating") : t("lobby.createBtn")}
										</Text>
									</TouchableOpacity>
								</View>

								<View style={styles.divider}>
									<View style={styles.dividerLine} />
									<Text style={styles.dividerText}>{t("lobby.divider")}</Text>
									<View style={styles.dividerLine} />
								</View>
							</>
						)}

						{displayName && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>
									{t("lobby.joinSection")}
								</Text>
								<View style={styles.row}>
									<TextInput
										style={[styles.input, styles.inputFlex]}
										value={joinCode}
										onChangeText={(v) => setJoinCode(v.toUpperCase())}
										placeholder={t("lobby.joinPlaceholder")}
										placeholderTextColor="#475569"
										maxLength={6}
										autoCapitalize="characters"
										onFocus={handleJoinFocus}
										onBlur={handleJoinBlur}
									/>
									<TouchableOpacity
										style={[
											styles.button,
											styles.joinButton,
											loading && styles.buttonDisabled,
										]}
										onPress={handleJoin}
										disabled={loading}
									>
										<Text style={styles.buttonText}>
											{loading ? "…" : t("lobby.joinBtn")}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						)}

						{error && <Text style={styles.error}>{error}</Text>}
					</>
				) : (
					<>
						<TouchableOpacity style={styles.backButton} onPress={handleLeave}>
							<Image source={TavernSilver} style={styles.backIcon} contentFit="contain" />
						</TouchableOpacity>

						<Text style={styles.title}>{t("lobby.waitingTitle")}</Text>

						<View style={styles.section}>
							<TouchableOpacity
								onPress={handleShare}
								activeOpacity={0.7}
								accessibilityRole="button"
								accessibilityLabel={t("lobby.shareBtn")}
							>
								<Text style={styles.roomCode}>{roomId}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.shareButton}
								onPress={handleShare}
								activeOpacity={0.8}
							>
								<Ionicons
									name="share-social-outline"
									size={18}
									color="#E8D5A3"
								/>
								<Text style={styles.shareButtonText}>
									{t("lobby.shareBtn")}
								</Text>
							</TouchableOpacity>

							<Text style={styles.roomCodeLabel}>
								{copied ? t("lobby.codeCopied") : t("lobby.shareCode")}
							</Text>

							<Text style={styles.sectionTitle}>
								{t("lobby.players", { count: roomPlayers.length })}
							</Text>
							<View style={styles.playerList}>
								{roomPlayers.map((p) => {
									const isSelf = p.id === myPlayerId;
									const isRoomHost = isHost && isSelf;
									return (
										<View key={p.id} style={styles.playerRow}>
											<View
												style={[
													styles.playerDot,
													isRoomHost && styles.playerDotHost,
												]}
											/>
											<Text
												style={[
													styles.playerName,
													isSelf && styles.playerNameSelf,
												]}
											>
												{p.displayName}
											</Text>
											{isSelf && (
												<Text style={styles.playerTag}>{t("lobby.you")}</Text>
											)}
											{isRoomHost && (
												<Text style={styles.playerTag}>{t("lobby.host")}</Text>
											)}
										</View>
									);
								})}
							</View>

							{isHost ? (
								<TouchableOpacity
									style={[
										styles.button,
										styles.buttonPrimary,
										(roomPlayers.length < 2 || loading) &&
											styles.buttonDisabled,
									]}
									onPress={handleStart}
									disabled={roomPlayers.length < 2 || loading}
								>
									<Text style={styles.buttonText}>
										{loading ? t("lobby.starting") : t("lobby.startBtn")}
									</Text>
								</TouchableOpacity>
							) : (
								<Text style={styles.waitingText}>{t("lobby.waitingHost")}</Text>
							)}
						</View>

						{error && <Text style={styles.error}>{error}</Text>}
					</>
				)}
				</View>
			</View>
		</ImageBackground>
	);
};
