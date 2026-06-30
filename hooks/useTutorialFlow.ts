import AsyncStorage from "@react-native-async-storage/async-storage";
import { GamePhase } from "@/data/types";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

const STORAGE_KEY = "regicide_tutorial_done";

const markDone = (): void => {
	try {
		if (Platform.OS === "web") { localStorage.setItem(STORAGE_KEY, "1"); return; }
		AsyncStorage.setItem(STORAGE_KEY, "1").catch(() => {});
	} catch {}
};

const checkDone = async (): Promise<boolean> => {
	try {
		if (Platform.OS === "web") return localStorage.getItem(STORAGE_KEY) === "1";
		return (await AsyncStorage.getItem(STORAGE_KEY)) === "1";
	} catch { return false; }
};

// Como cada passo avança: "next" → botão Próximo do tooltip; os demais → ação do
// jogo (selecionar carta, atacar, cobrir dano).
export type TutorialAdvance = "next" | "select_card" | "attack" | "suffer_damage";

export interface TutorialStepConfig {
	/** Sufixo da chave i18n: tutorial.steps.<id>.title / .body */
	id: string;
	/** id do TutorialTarget a destacar; null → balão central (tela escurecida). */
	targetId: string | null;
	advance: TutorialAdvance;
}

// Tour guiado: passos informativos (Próximo) seguidos da prática hands-on.
export const TUTORIAL_STEPS: TutorialStepConfig[] = [
	{ id: "enemy_intro", targetId: "tutorial-enemy", advance: "next" },
	{ id: "enemy_immunity", targetId: "tutorial-enemy", advance: "next" },
	{ id: "enemy_life", targetId: "tutorial-enemy-hp", advance: "next" },
	{ id: "enemy_attack", targetId: "tutorial-enemy-attack", advance: "next" },
	{ id: "deck_castle", targetId: "tutorial-deck-castle", advance: "next" },
	{ id: "deck_tavern", targetId: "tutorial-deck-tavern", advance: "next" },
	{ id: "deck_discard", targetId: "tutorial-deck-discard", advance: "next" },
	{ id: "suit_tracker", targetId: "tutorial-suit-tracker", advance: "next" },
	{ id: "btn_sort_value", targetId: "tutorial-sort-value", advance: "next" },
	{ id: "btn_sort_suit", targetId: "tutorial-sort-suit", advance: "next" },
	{ id: "btn_attack_info", targetId: "tutorial-attack", advance: "next" },
	{ id: "hand_info", targetId: "tutorial-hand", advance: "next" },
	{ id: "history_info", targetId: "tutorial-history", advance: "next" },
	{ id: "skip_info", targetId: null, advance: "next" },
	{ id: "select_card", targetId: "tutorial-hand", advance: "select_card" },
	{ id: "attack", targetId: "tutorial-attack", advance: "attack" },
	// Destaca a seção da mão inteira (cartas + botão Descartar) para o jogador
	// selecionar cartas E descartar.
	{ id: "defend", targetId: "tutorial-hand", advance: "suffer_damage" },
	{ id: "complete", targetId: null, advance: "next" },
];

const indexOfStep = (id: string) => TUTORIAL_STEPS.findIndex((s) => s.id === id);

const noop = () => {};

type Options = {
	phase: GamePhase;
	selectedIdsSize: number;
	handlePlay: () => void;
};

export const useTutorialFlow = ({ phase, selectedIdsSize, handlePlay }: Options) => {
	const [isTutorial, setIsTutorial] = useState(false);
	const [index, setIndex] = useState(0);
	const [attackProcessed, setAttackProcessed] = useState(false);

	useEffect(() => {
		checkDone().then((done) => { if (!done) setIsTutorial(true); });
	}, []);

	const current = isTutorial ? TUTORIAL_STEPS[index] : null;
	const advance = current?.advance;
	const currentId = current?.id;

	const next = useCallback(() => {
		setIndex((i) => Math.min(i + 1, TUTORIAL_STEPS.length - 1));
	}, []);

	const goTo = useCallback((id: string) => {
		const i = indexOfStep(id);
		if (i >= 0) setIndex(i);
	}, []);

	const exitTutorial = useCallback(() => {
		setIsTutorial(false);
		markDone();
	}, []);

	// Marca como concluído ao chegar no passo final (mesmo que feche depois).
	useEffect(() => {
		if (currentId === "complete") markDone();
	}, [currentId]);

	// select_card → próximo quando uma carta é selecionada.
	useEffect(() => {
		if (advance !== "select_card" || selectedIdsSize === 0) return;
		next();
	}, [advance, selectedIdsSize, next]);

	// attack → volta para select_card se o jogador desmarcar tudo antes de atacar.
	useEffect(() => {
		if (advance !== "attack" || attackProcessed || selectedIdsSize > 0) return;
		goTo("select_card");
	}, [advance, attackProcessed, selectedIdsSize, goTo]);

	// Após o ataque (cartas saem da mão): vai para "defend" se houve contra-ataque,
	// senão pula direto para "complete" (ex.: inimigo derrotado de primeira).
	useEffect(() => {
		if (!attackProcessed || selectedIdsSize > 0) return;
		setAttackProcessed(false);
		goTo(phase === "suffer_damage" ? "defend" : "complete");
	}, [attackProcessed, selectedIdsSize, phase, goTo]);

	// defend → complete quando o turno volta ao jogador (dano coberto).
	useEffect(() => {
		if (currentId !== "defend" || phase !== "player_turn") return;
		goTo("complete");
	}, [currentId, phase, goTo]);

	// Encerra cedo se o jogo terminar antes do tutorial completar.
	useEffect(() => {
		if (!isTutorial || (phase !== "victory" && phase !== "defeat")) return;
		exitTutorial();
	}, [isTutorial, phase, exitTutorial]);

	// Envolve handlePlay para marcar quando o ataque foi executado (só na prática).
	const tutorialHandlePlay = useCallback(() => {
		handlePlay();
		setAttackProcessed(true);
	}, [handlePlay]);

	// O botão Atacar só é renderizado quando `onPlay` existe. Durante o tutorial
	// ele só ataca de fato na prática (passo "attack"); no passo informativo
	// `btn_attack_info` damos um no-op para o botão aparecer (inerte, e ainda
	// bloqueado pelo overlay) e poder ser destacado. Nos demais passos fica oculto.
	const effectiveOnPlay =
		!isTutorial ? handlePlay
		: advance === "attack" ? tutorialHandlePlay
		: current?.targetId === "tutorial-attack" ? noop
		: undefined;

	return {
		isTutorial,
		current,
		stepIndex: index,
		stepTotal: TUTORIAL_STEPS.length,
		next,
		exitTutorial,
		effectiveOnPlay,
		yieldBlocked: isTutorial,
	};
};
