import { t } from "i18next";
import { Text } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Companions.styles";

export default function Companions() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("companions")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("companions")}.body`)}</Text>
		</Section>
	);
}
