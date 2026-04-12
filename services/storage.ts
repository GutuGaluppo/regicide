// /services/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameState } from "../data/types";

const KEY = "regicide_save";

export const saveGame = async (state: GameState): Promise<void> => {
	await AsyncStorage.setItem(KEY, JSON.stringify(state));
};

export const loadGame = async (): Promise<GameState | null> => {
	const data = await AsyncStorage.getItem(KEY);
	return data ? (JSON.parse(data) as GameState) : null;
};
