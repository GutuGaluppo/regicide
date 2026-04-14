// /components/SvgNumberSprite/SvgNumberSprite.tsx
// Renders numeric digits from SVG assets with a configurable fill color.
// SVG paths use `fill="currentColor"` — pass `color` to tint them.
import React from "react";
import { View } from "react-native";

import Svg0 from "../../assets/images/numbers/svg/0.svg";
import Svg1 from "../../assets/images/numbers/svg/1.svg";
import Svg2 from "../../assets/images/numbers/svg/2.svg";
import Svg3 from "../../assets/images/numbers/svg/3.svg";
import Svg4 from "../../assets/images/numbers/svg/4.svg";
import Svg5 from "../../assets/images/numbers/svg/5.svg";
import Svg6 from "../../assets/images/numbers/svg/6.svg";
import Svg7 from "../../assets/images/numbers/svg/7.svg";
import Svg8 from "../../assets/images/numbers/svg/8.svg";
import Svg9 from "../../assets/images/numbers/svg/9.svg";

// Natural width (px) of each digit at height=300
const NATURAL_W: Record<string, number> = {
	"0": 193, "1": 58,  "2": 208, "3": 203, "4": 203,
	"5": 192, "6": 217, "7": 228, "8": 206, "9": 194,
};

const DIGITS = { "0": Svg0, "1": Svg1, "2": Svg2, "3": Svg3, "4": Svg4,
                 "5": Svg5, "6": Svg6, "7": Svg7, "8": Svg8, "9": Svg9 } as const;

interface SvgNumberSpriteProps {
	value: number;
	/** Height in dp; width is derived from each glyph's natural aspect ratio. */
	height?: number;
	/** CSS/hex color forwarded to `currentColor` inside the SVG paths. */
	color: string;
	gap?: number;
}

export const SvgNumberSprite = ({
	value,
	height = 32,
	color,
	gap = 1,
}: SvgNumberSpriteProps) => {
	const digits = String(Math.max(0, Math.floor(value))).split("");

	return (
		<View style={{ flexDirection: "row", alignItems: "center", gap }}>
			{digits.map((d, i) => {
				const Digit = DIGITS[d as keyof typeof DIGITS];
				const w = Math.round(height * (NATURAL_W[d] / 300));
				return <Digit key={i} width={w} height={height} color={color} />;
			})}
		</View>
	);
};
