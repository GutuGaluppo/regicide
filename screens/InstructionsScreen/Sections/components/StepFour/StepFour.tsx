import { t } from "i18next";
import React from "react";
import { Text } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./StepFour.styles";

export default function StepFour() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("step4")}.title`)}>
			<Text style={styles.stepSubtitle}>{t(`${s("step4")}.subtitle`)}</Text>
			<Text style={styles.bodyText}>{t(`${s("step4")}.body`)}</Text>
		</Section>
	);
}
