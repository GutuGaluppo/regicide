import { create } from "zustand";

/** Retângulo do alvo em coordenadas absolutas da janela (measureInWindow). */
export interface TutorialRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Registro das posições medidas dos elementos que o tutorial spotlight pode
 * destacar. Cada `TutorialTarget` publica seu retângulo aqui (por `id`) ao
 * montar/medir e o remove ao desmontar. O overlay lê `targets[id]` para abrir
 * o recorte no lugar certo.
 */
interface TutorialTargetStore {
	targets: Record<string, TutorialRect>;
	setTarget: (id: string, rect: TutorialRect) => void;
	clearTarget: (id: string) => void;
}

const rectsEqual = (a: TutorialRect | undefined, b: TutorialRect): boolean =>
	!!a && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

export const useTutorialTargets = create<TutorialTargetStore>((set, get) => ({
	targets: {},
	setTarget: (id, rect) => {
		// Evita re-render quando a medição não mudou (layout re-dispara igual).
		if (rectsEqual(get().targets[id], rect)) return;
		set((state) => ({ targets: { ...state.targets, [id]: rect } }));
	},
	clearTarget: (id) => {
		set((state) => {
			if (!(id in state.targets)) return state;
			const next = { ...state.targets };
			delete next[id];
			return { targets: next };
		});
	},
}));

/** Hook de conveniência para ler o retângulo de um alvo específico. */
export const useTutorialTarget = (id: string | null): TutorialRect | undefined =>
	useTutorialTargets((s) => (id ? s.targets[id] : undefined));
