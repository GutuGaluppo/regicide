import { t } from "i18next";
import { Text } from "react-native";
import StepSummaryList from "@/screens/InstructionsScreen/components/StepSummaryList";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./HowToPlay.styles";

export default function HowToPlay() {
	const s = (key: string) => `instructions.sections.${key}`;

	const howToPlaySteps = t(`${s("howToPlay")}.steps`, {
		returnObjects: true,
	}) as string[];

	return (
		<Section title={t(`${s("howToPlay")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("howToPlay")}.intro`)}</Text>
			<Text style={styles.labelText}>{t(`${s("howToPlay")}.stepsLabel`)}</Text>
			<StepSummaryList steps={howToPlaySteps} />
		</Section>
	);
}
