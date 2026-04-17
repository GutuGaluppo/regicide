import { Dimensions } from "react-native";

export const SHIFT_PER_ENEMY = 18;
const TOTAL_ENEMIES = 12;
const MAX_SHIFT = -(TOTAL_ENEMIES * SHIFT_PER_ENEMY);
const SCREEN_WIDTH = Dimensions.get("window").width;
export const BG_WIDTH = SCREEN_WIDTH + Math.abs(MAX_SHIFT);
