import { t } from "i18next";
import { Text } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Pass.styles";

export default function Pass() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("pass")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("pass")}.body`)}</Text>
		</Section>
	);
}
