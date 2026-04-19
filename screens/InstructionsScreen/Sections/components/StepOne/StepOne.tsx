import { t } from "i18next";
import { Text } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./StepOne.styles";

export default function StepOne() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("step1")}.title`)}>
			<Text style={styles.stepSubtitle}>{t(`${s("step1")}.subtitle`)}</Text>
			<Text style={styles.bodyText}>{t(`${s("step1")}.body`)}</Text>
		</Section>
	);
}
