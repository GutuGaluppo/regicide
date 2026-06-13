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
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./RoomChat.styles";

export const RoomChat = () => {
	const { t } = useTranslation();
	const { isTablet } = useResponsiveLayout();

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
		if (last.id !== prevId && last.kind === "text" && last.playerId !== myPlayerId) {
			playChatMessage();
		}
	}, [messages, myPlayerId, playChatMessage]);

	const handleSend = () => {
		const value = draft;
		setDraft("");
		void sendText(value);
	};

	if (!isOpen) {
		return (
			<TouchableOpacity
				style={styles.fab}
				onPress={openChat}
				activeOpacity={0.8}
				accessibilityRole="button"
				accessibilityLabel={t("chat.title")}
			>
				<Ionicons name="chatbubble-ellipses-outline" size={24} color="#E8D5A3" />
				{unreadCount > 0 && (
					<View style={styles.badge}>
						<Text style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
					</View>
				)}
			</TouchableOpacity>
		);
	}

	return (
		<KeyboardAvoidingView
			style={[styles.panel, isTablet ? styles.panelTablet : styles.panelMobile]}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>{t("chat.title")}</Text>
				<TouchableOpacity onPress={closeChat} hitSlop={10} accessibilityLabel="Fechar">
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
					onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
				>
					{messages.map((m) => {
						if (m.kind === "system") {
							return (
								<View key={m.id} style={styles.systemRow}>
									<Text style={styles.systemText}>
										{t(`chat.system.${m.systemType}`, { name: m.playerName })}
									</Text>
								</View>
							);
						}
						const isOwn = m.playerId === myPlayerId;
						return (
							<View
								key={m.id}
								style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}
							>
								{!isOwn && <Text style={styles.author}>{m.playerName}</Text>}
								<Text style={styles.bubbleText}>{m.text}</Text>
							</View>
						);
					})}
				</ScrollView>
			)}

			<View style={styles.inputRow}>
				<TextInput
					style={styles.input}
					value={draft}
					onChangeText={setDraft}
					placeholder={t("chat.placeholder")}
					placeholderTextColor="#63748b"
					maxLength={CHAT_MAX_LENGTH}
					multiline
					returnKeyType="send"
					onSubmitEditing={handleSend}
					blurOnSubmit
				/>
				<TouchableOpacity
					style={[styles.sendBtn, draft.trim().length === 0 && styles.sendBtnDisabled]}
					onPress={handleSend}
					disabled={draft.trim().length === 0}
					activeOpacity={0.8}
					accessibilityLabel={t("chat.send")}
				>
					<Ionicons name="send" size={18} color="#0f172a" />
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};
