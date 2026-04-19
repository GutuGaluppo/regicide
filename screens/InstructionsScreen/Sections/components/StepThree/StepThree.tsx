import { t } from "i18next";
import React from "react";
import { Text } from "react-native";
import DefeatStepList from "@/screens/InstructionsScreen/components/DefeatStepList";
import EnemyTable from "@/screens/InstructionsScreen/components/EnemyTable";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./StepThree.styles";

export default function StepThree() {
	const s = (key: string) => `instructions.sections.${key}`;

	const enemyHeader = t(`${s("step3")}.enemyHeader`, {
		returnObjects: true,
	}) as {
		enemy: string;
		atk: string;
		hp: string;
	};

	const enemyRows = t(`${s("step3")}.enemyRows`, { returnObjects: true }) as {
		enemy: string;
		atk: string;
		hp: string;
	}[];

	const defeatSteps = t(`${s("step3")}.defeatSteps`, {
		returnObjects: true,
	}) as string[];

	return (
		<Section title={t(`${s("step3")}.title`)}>
			<Text style={styles.stepSubtitle}>{t(`${s("step3")}.subtitle`)}</Text>
			<Text style={styles.bodyText}>{t(`${s("step3")}.body`)}</Text>
			<EnemyTable header={enemyHeader} rows={enemyRows} />
			<Text style={styles.labelText}>{t(`${s("step3")}.defeatTitle`)}</Text>
			<DefeatStepList steps={defeatSteps} />
		</Section>
	);
}
