import SuitBlock from "@/screens/InstructionsScreen/components/SuitBlock";
import { t } from "i18next";
import React from "react";
import { Text, View } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./StepTwo.styles";

export default function StepTwo() {
	const s = (key: string) => `instructions.sections.${key}`;

	const Divider = () => <View style={styles.divider} />;

	return (
		<Section title={t(`${s("step2")}.title`)}>
			<Text style={styles.stepSubtitle}>{t(`${s("step2")}.subtitle`)}</Text>
			<Text style={styles.bodyText}>{t(`${s("step2")}.intro`)}</Text>
			<Divider />
			{(["hearts", "diamonds", "clubs", "spades"] as const).map((suit) => (
				<SuitBlock
					key={suit}
					suit={suit}
					name={t(`${s("step2")}.suits.${suit}.name`)}
					body={t(`${s("step2")}.suits.${suit}.body`)}
				/>
			))}
			<View style={styles.noteBlock}>
				<Text style={styles.noteText}>{t(`${s("step2")}.note`)}</Text>
			</View>
		</Section>
	);
}
