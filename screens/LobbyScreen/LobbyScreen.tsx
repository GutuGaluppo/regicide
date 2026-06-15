import { AvatarBadge } from "@/components/AvatarBadge";
import { AVATARS } from "@/data/avatars";
import { AvatarId } from "@/data/types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useSoundtrack } from "@/hooks/useSoundtrack";
import { useMultiplayerStore } from "@/store/multiplayerStore";
import { buildJoinUrl, shareRoom } from "@/utils/shareRoom";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	ImageBackground,
	LayoutAnimation,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	UIManager,
	View,
} from "react-native";
import { styles } from "./LobbyScreen.styles";

const TavernSilver = require("@/assets/icons/tavern_silver.png");
const PLAYER_COLORS = ["#4ADE80", "#60A5FA", "#FBBF24", "#F87171"] as const;

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

type LobbyView = "entry" | "waiting";
type EntryStep = "name" | "action";

/**
 * Avatar selecionável da fileira. No hover do mouse (web) aplica um efeito de
 * magnificação suave; no nativo o hover não dispara, então fica inerte.
 */
const AvatarOption = ({
	avatar,
	selected,
	taken,
	onPress,
}: {
	avatar: (typeof AVATARS)[number];
	selected: boolean;
	/** Já escolhido por outro jogador da sala — indisponível. */
	taken?: boolean;
	onPress: () => void;
}) => {
	const scale = useRef(new Animated.Value(1)).current;
	const animateTo = (toValue: number) =>
		Animated.spring(scale, {
			toValue,
			friction: 7,
			tension: 120,
			useNativeDriver: true,
		}).start();

	return (
		<Pressable
			onPress={taken ? undefined : onPress}
			disabled={taken}
			onHoverIn={taken ? undefined : () => animateTo(1.22)}
			onHoverOut={taken ? undefined : () => animateTo(1)}
			accessibilityRole="button"
			accessibilityState={{ selected, disabled: !!taken }}
			accessibilityLabel={avatar.label}
		>
			<Animated.View style={{ transform: [{ scale }] }}>
				<AvatarBadge
					avatarId={avatar.id}
					size={48}
					ringColor={selected ? "#E8D5A3" : "rgba(148,163,184,0.4)"}
				/>
				{taken && (
					<View style={styles.avatarTakenOverlay}>
						<Ionicons name="lock-closed" size={16} color="#E8D5A3" />
					</View>
				)}
			</Animated.View>
		</Pressable>
	);
};

export const LobbyScreen = () => {
	const { t } = useTranslation();
	const { isDesktop } = useResponsiveLayout();
	useSoundtrack(
		require("@/assets/soundtrack/intro.mp3") as import("expo-av").AVPlaybackSource,
		"intro",
	);
	const {
		myPlayerId,
		roomId,
		isHost,
		roomStatus,
		roomPlayers,
		myDisplayName,
		myAvatarId,
		setMyAvatar,
		updateMyLobbyProfile,
		initPlayerId,
		createRoom,
		joinRoom: storeJoinRoom,
		startGame,
		leaveRoom,
	} = useMultiplayerStore();

	const params = useLocalSearchParams<{ code?: string }>();

	const [view, setView] = useState<LobbyView>("entry");
	const [entryStep, setEntryStep] = useState<EntryStep>("name");
	const [displayName, setDisplayName] = useState("");
	const [joinCode, setJoinCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const handleSelectAvatar = (avatarId: AvatarId) => {
		if (roomId) {
			// Já na sala (lobby): propaga para os outros participantes.
			void updateMyLobbyProfile(myDisplayName, avatarId);
		} else {
			setMyAvatar(avatarId);
		}
	};

	// Avatares já em uso pelos OUTROS jogadores da sala — indisponíveis para mim.
	const takenAvatarIds = new Set(
		roomPlayers.filter((p) => p.id !== myPlayerId).map((p) => p.avatarId),
	);

	// Pre-fill the join code when arriving from a shared link (?code=ABC123).
	useEffect(() => {
		if (typeof params.code === "string" && params.code) {
			setJoinCode(params.code.toUpperCase().slice(0, 6));
		}
	}, [params.code]);

	const handleConfirmName = () => {
		if (!displayName.trim()) {
			setError(t("lobby.errors.nameRequired"));
			return;
		}
		setError(null);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setEntryStep("action");
	};

	const handleEditName = () => {
		setError(null);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setEntryStep("name");
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
		setEntryStep("action");
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
								onPress={
									entryStep === "action" ? handleEditName : () => router.back()
								}
							>
								<Image
									source={TavernSilver}
									style={styles.backIcon}
									contentFit="contain"
								/>
							</TouchableOpacity>

							<Text style={styles.title}>
								{entryStep === "action"
									? t("lobby.wantsTo", { name: displayName.trim() })
									: t("lobby.title")}
							</Text>

							{entryStep === "name" ? (
								<View style={styles.section}>
									<View style={styles.avatarSelector}>
										<AvatarBadge
											avatarId={myAvatarId}
											size={64}
											ringColor="#E8D5A3"
										/>
										<ScrollView
											horizontal
											showsHorizontalScrollIndicator={false}
											style={styles.avatarScroll}
											contentContainerStyle={styles.avatarStrip}
										>
											{AVATARS.map((a) => (
												<AvatarOption
													key={a.id}
													avatar={a}
													selected={a.id === myAvatarId}
													taken={takenAvatarIds.has(a.id)}
													onPress={() => handleSelectAvatar(a.id)}
												/>
											))}
										</ScrollView>
									</View>
									<Text style={styles.sectionTitle}>
										{t("lobby.nameSection")}
									</Text>
									<View
										style={
											isDesktop
												? styles.identityInputRow
												: styles.identityInputColumn
										}
									>
											<TextInput
												style={[
													styles.input,
													styles.identityInput,
													isDesktop
														? styles.identityInputDesktop
														: styles.identityInputMobile,
												]}
												value={displayName}
												onChangeText={setDisplayName}
												placeholder={t("lobby.namePlaceholder")}
												placeholderTextColor="#63748b"
												maxLength={20}
												autoCapitalize="words"
												returnKeyType="done"
												onSubmitEditing={handleConfirmName}
											/>

											<TouchableOpacity
												style={[
													styles.button,
													styles.buttonPrimary,
													!isDesktop && styles.identityConfirmMobile,
													!displayName.trim() && styles.buttonDisabled,
												]}
												onPress={handleConfirmName}
												disabled={!displayName.trim()}
											>
												<Text style={styles.buttonText}>
													{t("lobby.confirmName")}
												</Text>
											</TouchableOpacity>
										</View>
									</View>
							) : (
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
												returnKeyType="go"
												onSubmitEditing={handleJoin}
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
								</>
							)}

							{error && <Text style={styles.error}>{error}</Text>}
						</>
					) : (
						<>
							<TouchableOpacity style={styles.backButton} onPress={handleLeave}>
								<Image
									source={TavernSilver}
									style={styles.backIcon}
									contentFit="contain"
								/>
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
									{roomPlayers.map((p, index) => {
										const isSelf = p.id === myPlayerId;
										const isRoomHost = isHost && isSelf;
										const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
										const avatar = (
											<AvatarBadge
												avatarId={p.avatarId}
												size={36}
												ringColor={color}
											/>
										);
										return (
											<View key={p.id} style={styles.playerRow}>
												{avatar}
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
													<Text style={styles.playerTag}>
														{t("lobby.host")}
													</Text>
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
									<Text style={styles.waitingText}>
										{t("lobby.waitingHost")}
									</Text>
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
