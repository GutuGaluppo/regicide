import { t } from "i18next";
import { Text } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Combos.styles";

export default function Combos() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("combos")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("combos")}.body`)}</Text>
		</Section>
	);
}
