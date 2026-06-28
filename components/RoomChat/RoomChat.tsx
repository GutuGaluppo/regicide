import { AvatarBadge } from "@/components/AvatarBadge";
import { useAudio } from "@/contexts/AudioContext";
import { CHAT_MAX_LENGTH } from "@/data/types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useChatStore } from "@/store/chatStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./RoomChat.styles";

export const RoomChat = ({
	docked = false,
	showFab = true,
}: {
	docked?: boolean;
	/** Mostra o botão flutuante quando fechado. Desligue quando outro UI
	 * (ex.: o HUD inferior) já oferece o gatilho de chat. */
	showFab?: boolean;
}) => {
	const { t } = useTranslation();
	const { isTablet } = useResponsiveLayout();
	const insets = useSafeAreaInsets();

	const messages = useChatStore((s) => s.messages);
	const unreadCount = useChatStore((s) => s.unreadCount);
	const isOpen = useChatStore((s) => s.isOpen);
	const myPlayerId = useChatStore((s) => s.myPlayerId);
	const openChat = useChatStore((s) => s.openChat);
	const closeChat = useChatStore((s) => s.closeChat);
	const sendText = useChatStore((s) => s.sendText);
	const { playChatMessage } = useAudio();

	const [draft, setDraft] = useState("");
	const scrollRef = useRef<ScrollView>(null);
	const inputRef = useRef<TextInput>(null);

	// Toca um som ao chegar nova mensagem de texto de outro jogador.
	// Ignora o lote inicial do histórico e mensagens próprias/de sistema.
	const lastMsgIdRef = useRef<string | null>(null);
	const chatInitRef = useRef(false);
	useEffect(() => {
		if (messages.length === 0) {
			chatInitRef.current = false;
			lastMsgIdRef.current = null;
			return;
		}
		const last = messages[messages.length - 1];
		const prevId = lastMsgIdRef.current;
		lastMsgIdRef.current = last.id;
		if (!chatInitRef.current) {
			chatInitRef.current = true; // pula o histórico carregado ao conectar
			return;
		}
		if (
			last.id !== prevId &&
			last.kind === "text" &&
			last.playerId !== myPlayerId
		) {
			playChatMessage();
		}
	}, [messages, myPlayerId, playChatMessage]);

	const refocusInput = () => {
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const handleSend = () => {
		const value = draft;
		setDraft("");
		void sendText(value);
		// Mantém o foco após enviar (botão ou teclado), sem fechar o teclado.
		refocusInput();
	};

	const handleSubmitEditing = () => {
		handleSend();
	};

	// Modo overlay (mobile/tablet ou desktop fechado): mostra o FAB quando fechado.
	if (!docked && !isOpen) {
		if (!showFab) return null;
		return (
			<TouchableOpacity
				style={styles.fab}
				onPress={openChat}
				activeOpacity={0.8}
				accessibilityRole="button"
				accessibilityLabel={t("chat.title")}
			>
				<Ionicons
					name="chatbubble-ellipses-outline"
					size={24}
					color="#E8D5A3"
				/>
				{unreadCount > 0 && (
					<View style={styles.badge}>
						<Text style={styles.badgeText}>
							{unreadCount > 99 ? "99+" : unreadCount}
						</Text>
					</View>
				)}
			</TouchableOpacity>
		);
	}

	// No mobile (bottom sheet), reserva o espaço seguro inferior na barra de input.
	const inputRowStyle =
		!docked && !isTablet
			? [styles.inputRow, { paddingBottom: 12 + (insets.bottom || 0) }]
			: styles.inputRow;

	return (
		<>
			{/* Backdrop só no modo overlay (mobile/tablet): toque fora fecha o chat. */}
			{!docked && (
				<Pressable
					style={styles.backdrop}
					onPress={closeChat}
					accessibilityRole="button"
					accessibilityLabel={t("chat.close")}
				/>
			)}
			<KeyboardAvoidingView
				style={[
					styles.panel,
					docked
						? styles.panelDocked
						: isTablet
							? styles.panelTablet
							: styles.panelMobile,
				]}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				keyboardVerticalOffset={0}
			>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>{t("chat.title")}</Text>
				<TouchableOpacity
					onPress={closeChat}
					hitSlop={10}
					accessibilityLabel={t("chat.close")}
				>
					<Ionicons name="close" size={22} color="#94A3B8" />
				</TouchableOpacity>
			</View>

			{messages.length === 0 ? (
				<View style={styles.empty}>
					<Text style={styles.emptyText}>{t("chat.empty")}</Text>
				</View>
			) : (
				<ScrollView
					ref={scrollRef}
					style={styles.list}
					contentContainerStyle={styles.listContent}
					onContentSizeChange={() =>
						scrollRef.current?.scrollToEnd({ animated: true })
					}
				>
					{messages.map((m) => {
						// Mensagens de sistema (join/leave) foram removidas do chat.
						if (m.kind === "system") return null;
						const isOwn = m.playerId === myPlayerId;
						if (isOwn) {
							return (
								<View key={m.id} style={[styles.bubble, styles.bubbleOwn]}>
									<Text style={styles.bubbleText}>{m.text}</Text>
								</View>
							);
						}
						return (
							<View key={m.id} style={styles.msgRow}>
								<AvatarBadge avatarId={m.playerAvatarId} size={28} />
								<View
									style={[
										styles.bubble,
										styles.bubbleOther,
										styles.bubbleInRow,
									]}
								>
									<Text style={styles.author}>{m.playerName}</Text>
									<Text style={styles.bubbleText}>{m.text}</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>
			)}

			<View style={inputRowStyle}>
				<TextInput
					ref={inputRef}
					style={styles.input}
					value={draft}
					onChangeText={setDraft}
					placeholder={t("chat.placeholder")}
					placeholderTextColor="#63748b"
					maxLength={CHAT_MAX_LENGTH}
					multiline
					returnKeyType="send"
					onSubmitEditing={handleSubmitEditing}
					submitBehavior="submit"
				/>
				<TouchableOpacity
					style={[
						styles.sendBtn,
						draft.trim().length === 0 && styles.sendBtnDisabled,
					]}
					onPress={handleSend}
					disabled={draft.trim().length === 0}
					activeOpacity={0.8}
					accessibilityLabel={t("chat.send")}
				>
					<Ionicons name="send" size={18} color="#0f172a" />
				</TouchableOpacity>
			</View>
			</KeyboardAvoidingView>
		</>
	);
};
