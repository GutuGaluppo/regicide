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

export type TutorialStep = "welcome" | "select_card" | "attack" | "suffer_damage" | "complete";

type Options = {
	phase: GamePhase;
	selectedIdsSize: number;
	handlePlay: () => void;
};

export const useTutorialFlow = ({ phase, selectedIdsSize, handlePlay }: Options) => {
	const [isTutorial, setIsTutorial] = useState(false);
	const [step, setStep] = useState<TutorialStep>("welcome");
	const [attackProcessed, setAttackProcessed] = useState(false);

	useEffect(() => {
		checkDone().then((done) => { if (!done) setIsTutorial(true); });
	}, []);

	const advanceStep = useCallback((to: TutorialStep) => {
		setStep(to);
		if (to === "complete") markDone();
	}, []);

	const exitTutorial = useCallback(() => {
		setIsTutorial(false);
		markDone();
	}, []);

	// select_card → attack when a card is selected
	useEffect(() => {
		if (!isTutorial || step !== "select_card" || selectedIdsSize === 0) return;
		advanceStep("attack");
	}, [isTutorial, step, selectedIdsSize, advanceStep]);

	// attack → select_card if player deselects all cards (before attack is performed)
	useEffect(() => {
		if (!isTutorial || step !== "attack" || attackProcessed || selectedIdsSize > 0) return;
		advanceStep("select_card");
	}, [isTutorial, step, selectedIdsSize, attackProcessed, advanceStep]);

	// After attack animation completes (selectedIds clears), determine next step
	useEffect(() => {
		if (!attackProcessed || selectedIdsSize > 0) return;
		setAttackProcessed(false);
		if (phase === "suffer_damage") advanceStep("suffer_damage");
		else advanceStep("complete");
	}, [attackProcessed, selectedIdsSize, phase, advanceStep]);

	// suffer_damage → complete when back in player_turn
	useEffect(() => {
		if (!isTutorial || step !== "suffer_damage" || phase !== "player_turn") return;
		advanceStep("complete");
	}, [isTutorial, step, phase, advanceStep]);

	// Exit tutorial early if game ends before tutorial steps complete
	useEffect(() => {
		if (!isTutorial || (phase !== "victory" && phase !== "defeat")) return;
		exitTutorial();
	}, [isTutorial, phase, exitTutorial]);

	// Wrap handlePlay to track when the attack is performed
	const tutorialHandlePlay = useCallback(() => {
		handlePlay();
		setAttackProcessed(true);
	}, [handlePlay]);

	const effectiveOnPlay =
		!isTutorial ? handlePlay
		: step === "attack" ? tutorialHandlePlay
		: undefined;

	return {
		isTutorial,
		step,
		advanceStep,
		exitTutorial,
		effectiveOnPlay,
		yieldBlocked: isTutorial,
	};
};
