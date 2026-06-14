import { resolveAvatar } from "@/data/avatars";
import { AvatarId } from "@/data/types";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

interface AvatarBadgeProps {
	avatarId: AvatarId | undefined | null;
	size: number;
	/** Cor do anel ao redor (ex.: cor do jogador). */
	ringColor?: string;
	/** Destaque (turno ativo). */
	highlighted?: boolean;
}

/**
 * Avatar circular reutilizável (lobby, chat, chips). Resolve o asset sempre via
 * `resolveAvatar`, então um id inválido nunca quebra o render.
 */
export const AvatarBadge = ({
	avatarId,
	size,
	ringColor,
	highlighted,
}: AvatarBadgeProps) => {
	const avatar = resolveAvatar(avatarId);
	const borderWidth =
		ringColor || highlighted ? Math.max(2, Math.round(size * 0.03)) : 0;
	return (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: size / 2,
				overflow: "hidden",
				borderWidth,
				borderColor: ringColor ?? "#E8D5A3",
				backgroundColor: "rgba(2,6,23,0.6)",
			}}
		>
			<Image
				source={avatar.image}
				style={{ width: "100%", height: "100%" }}
				contentFit="cover"
				accessibilityLabel={avatar.label}
			/>
		</View>
	);
};
