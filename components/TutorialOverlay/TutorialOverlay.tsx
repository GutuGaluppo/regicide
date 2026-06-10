import { TutorialStep } from "@/hooks/useTutorialFlow";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./TutorialOverlay.styles";

// ── Welcome modal — rendered via Modal so it blocks all underlying touches ──

type WelcomeProps = {
	onStart: () => void;
	onSkip: () => void;
};

export const TutorialWelcomeModal = ({ onStart, onSkip }: WelcomeProps) => {
	const { t } = useTranslation();
	return (
		<Modal transparent visible animationType="fade">
			<View style={styles.modalBackdrop}>
				<View style={styles.modalCard}>
					<Text style={styles.modalTitle}>{t("tutorial.welcome.title")}</Text>
					<Text style={styles.modalBody}>{t("tutorial.welcome.body")}</Text>
					<TouchableOpacity style={styles.primaryBtn} onPress={onStart}>
						<Text style={styles.primaryBtnText}>{t("tutorial.welcome.btn")}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.skipLink} onPress={onSkip}>
						<Text style={styles.skipText}>{t("tutorial.skip")}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

// ── Step panel — rendered inline between the enemy card and the player hand ──

type StepPanelProps = {
	step: TutorialStep;
	onComplete: () => void;
	onSkip: () => void;
};

export const TutorialStepPanel = ({ step, onComplete, onSkip }: StepPanelProps) => {
	const { t } = useTranslation();

	if (step === "welcome") return null;

	const isComplete = step === "complete";

	return (
		<View style={styles.panel}>
			<View style={styles.panelHeader}>
				<Text style={styles.panelTitle}>{t(`tutorial.${step}.title`)}</Text>
				{!isComplete && (
					<TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
						<Text style={styles.skipText}>{t("tutorial.skip")}</Text>
					</TouchableOpacity>
				)}
			</View>
			<Text style={styles.panelBody}>{t(`tutorial.${step}.body`)}</Text>
			{isComplete && (
				<TouchableOpacity style={styles.primaryBtn} onPress={onComplete}>
					<Text style={styles.primaryBtnText}>{t("tutorial.complete.btn")}</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};
