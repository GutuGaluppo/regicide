import { SvgNumberSprite } from "@/components/SvgNumberSprite";
import React from "react";

const TYPE_COLOR: Record<
	"attack" | "health" | "deckstatus" | "shield",
	string
> = {
	attack: "#70373c",
	health: "#9a3114",
	deckstatus: "#541212",
	shield: "#d6e7c0",
};

interface NumberSpriteProps {
	value: number;
	type: "attack" | "health" | "deckstatus" | "shield";
	height?: number;
	color?: string;
}

export const NumberSprite = ({
	value,
	type,
	height = 32,
	color,
}: NumberSpriteProps) => {
	return (
		<SvgNumberSprite
			value={value}
			height={height}
			color={color ?? TYPE_COLOR[type]}
		/>
	);
};
