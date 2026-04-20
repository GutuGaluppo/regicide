/**
 * Returns a color based on the HP percentage.
 * Green > 50%, Yellow > 25%, Red ≤ 25%.
 */
export const getHpColor = (hpPercent: number): string =>
	hpPercent > 0.5 ? "#22C55E" : hpPercent > 0.25 ? "#FBBF24" : "#EF4444";
