import { AvatarBadge } from "@/components/AvatarBadge";
import { AVATARS, DEFAULT_AVATAR_ID } from "@/data/avatars";
import { AvatarId } from "@/data/types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./AvatarPickerModal.styles";

interface Props {
	visible: boolean;
	initialAvatarId: AvatarId;
	onConfirm: (avatarId: AvatarId) => void;
	onCancel: () => void;
}

export const AvatarPickerModal = ({ visible, initialAvatarId, onConfirm, onCancel }: Props) => {
	const { t } = useTranslation();
	const { isDesktop } = useResponsiveLayout();
	const [selected, setSelected] = useState<AvatarId>(initialAvatarId ?? DEFAULT_AVATAR_ID);

	// Sincroniza a seleção ao reabrir.
	useEffect(() => {
		if (visible) setSelected(initialAvatarId ?? DEFAULT_AVATAR_ID);
	}, [visible, initialAvatarId]);

	const itemSize = isDesktop ? 76 : 64;

	return (
		<Modal transparent visible={visible} onRequestClose={onCancel} statusBarTranslucent animationType="fade">
			<Pressable
				style={[styles.backdrop, isDesktop ? styles.backdropCenter : styles.backdropBottom]}
				onPress={onCancel}
			>
				<Pressable
					style={[styles.card, isDesktop ? styles.cardDesktop : styles.cardMobile]}
					onPress={() => {}}
				>
					<Text style={styles.title}>{t("lobby.avatarTitle")}</Text>
					<Text style={styles.description}>{t("lobby.avatarDescription")}</Text>

					<ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
						{AVATARS.map((a) => {
							const isSel = a.id === selected;
							return (
								<TouchableOpacity
									key={a.id}
									onPress={() => setSelected(a.id)}
									activeOpacity={0.8}
									accessibilityRole="button"
									accessibilityState={{ selected: isSel }}
									accessibilityLabel={a.label}
									style={[styles.gridItem, isSel && styles.gridItemSelected]}
								>
									<AvatarBadge
										avatarId={a.id}
										size={itemSize}
										ringColor={isSel ? "#E8D5A3" : "rgba(148,163,184,0.4)"}
									/>
									<Text style={[styles.gridLabel, isSel && styles.gridLabelSelected]} numberOfLines={1}>
										{a.label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</ScrollView>

					<View style={styles.footer}>
						<TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onCancel} activeOpacity={0.8}>
							<Text style={styles.btnCancelText}>{t("lobby.cancelAvatar")}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.btn, styles.btnConfirm]}
							onPress={() => onConfirm(selected)}
							activeOpacity={0.8}
						>
							<Text style={styles.btnConfirmText}>{t("lobby.confirmAvatar")}</Text>
						</TouchableOpacity>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};
