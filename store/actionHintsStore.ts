import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const KEY = "regicide_action_hints_enabled";

/**
 * Guia de uso para ações só-ícone (histórico, chat, etc.) em telas de toque.
 * `enabled` é persistido: na primeira sessão fica ligado (mostra os rótulos
 * curtos sob os ícones); o jogador pode dispensar (tocar num rótulo) ou
 * alternar nos Ajustes. Reativar nos Ajustes traz os rótulos de volta.
 */
interface ActionHintsStore {
	enabled: boolean;
	_hydrated: boolean;
	hydrate: () => Promise<void>;
	setEnabled: (value: boolean) => void;
	dismiss: () => void;
}

export const useActionHints = create<ActionHintsStore>((set, get) => ({
	enabled: true,
	_hydrated: false,
	hydrate: async () => {
		if (get()._hydrated) return;
		try {
			const stored = await AsyncStorage.getItem(KEY);
			set({ enabled: stored === null ? true : stored === "1", _hydrated: true });
		} catch {
			set({ _hydrated: true });
		}
	},
	setEnabled: (value: boolean) => {
		set({ enabled: value });
		AsyncStorage.setItem(KEY, value ? "1" : "0").catch(() => {});
	},
	dismiss: () => {
		set({ enabled: false });
		AsyncStorage.setItem(KEY, "0").catch(() => {});
	},
}));
