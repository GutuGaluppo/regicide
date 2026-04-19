import { t } from "i18next";
import { Text } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Objective.styles";

export default function Objective() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("objective")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("objective")}.body`)}</Text>
		</Section>
	);
}
