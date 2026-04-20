import { useWindowDimensions } from "react-native";

export type CardSize = {
	w: number;     // card width
	h: number;     // card height
	mx: number;    // wrapper marginHorizontal
	liftY: number; // selected card lift (translateY)
	icon: number;  // immune icon size
};

/**
 * Returns card dimensions that scale with screen width.
 * Breakpoints: phone < 600, tablet 600–899, large ≥ 900.
 */
export const useCardSize = (): CardSize => {
	const { width } = useWindowDimensions();
	if (width >= 900) return { w: 96, h: 138, mx: 8, liftY: 18, icon: 32 };
	if (width >= 600) return { w: 80, h: 115, mx: 6, liftY: 14, icon: 28 };
	return { w: 64, h: 92, mx: 4, liftY: 10, icon: 26 };
};
