import { AvatarBadge } from "@/components/AvatarBadge";
import { CardCountBadge } from "@/components/CardCountBadge";
import { MultiplayerRoomPlayer } from "@/store/multiplayerStore";
import React, { useRef } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { ChipRect } from "../types";
import {
	AVATAR_SIZE,
	AVATAR_SIZE_ACTIVE,
	styles,
} from "./BottomTurnHud.styles";

type Props = {
	player: MultiplayerRoomPlayer;
	// Cor identitária do jogador (anel do avatar, só quando ativo).
	color: string;
	isActive: boolean;
	// Reporta x/largura do avatar para posicionar o blob.
	onMeasure: (rect: ChipRect) => void;
};

/**
 * Avatar de um jogador no HUD. O ativo é levemente maior e ganha o anel na cor
 * do jogador; os em espera ficam sem anel e com um véu mais escuro. A contagem
 * de cartas aparece como badge no canto superior direito.
 */
export const PlayerChip = ({ player, color, isActive, onMeasure }: Props) => {
	// Só reporta a medição quando x/largura realmente mudam (arredondados), para
	// não disparar reposicionamentos do blob por oscilação de sub-pixel.
	const lastRect = useRef<ChipRect | null>(null);
	const handleLayout = (e: LayoutChangeEvent) => {
		const x = Math.round(e.nativeEvent.layout.x);
		const width = Math.round(e.nativeEvent.layout.width);
		const prev = lastRect.current;
		if (prev && prev.x === x && prev.width === width) return;
		lastRect.current = { x, width };
		onMeasure({ x, width });
	};

	const size = isActive ? AVATAR_SIZE_ACTIVE : AVATAR_SIZE;

	return (
		<View
			onLayout={handleLayout}
			style={[styles.chip, { width: size, height: size }]}
		>
			<AvatarBadge
				avatarId={player.avatarId}
				size={size}
				ringColor={isActive ? color : undefined}
				highlighted={isActive}
			/>
			{!isActive && (
				<View style={[styles.waitingScrim, { borderRadius: size / 2 }]} />
			)}
			<CardCountBadge
				count={player.cardCount}
				pillStyle={[styles.cardsPill, isActive && styles.cardsPillActive]}
				textStyle={[styles.cardsText, isActive && styles.cardsTextActive]}
			/>
		</View>
	);
};
