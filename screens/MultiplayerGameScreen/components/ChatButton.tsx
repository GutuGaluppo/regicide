import { useChatStore } from "@/store/chatStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./BottomTurnHud.styles";

/**
 * Botão de chat encaixado na barra do HUD (no lugar do FAB flutuante), com o
 * mesmo tamanho dos avatares e badge de mensagens não lidas.
 */
export const ChatButton = () => {
	const { t } = useTranslation();
	const openChat = useChatStore((s) => s.openChat);
	const unreadCount = useChatStore((s) => s.unreadCount);

	return (
		<TouchableOpacity
			style={styles.chatBtn}
			onPress={openChat}
			activeOpacity={0.8}
			accessibilityRole="button"
			accessibilityLabel={t("chat.title")}
		>
			<Ionicons name="chatbubble-ellipses-outline" size={18} color="#E8D5A3" />
			{unreadCount > 0 && (
				<View style={styles.chatBadge}>
					<Text style={styles.chatBadgeText}>
						{unreadCount > 99 ? "99+" : unreadCount}
					</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};
