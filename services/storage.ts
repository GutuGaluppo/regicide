// /services/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Enemy } from "../data/types";

const KEY = "regicide_save";

type SaveData = { castle: Enemy[]; history: Enemy[] };

export const saveGame = async (data: SaveData): Promise<void> => {
	await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const loadGame = async (): Promise<SaveData | null> => {
	const data = await AsyncStorage.getItem(KEY);
	return data ? (JSON.parse(data) as SaveData) : null;
};
