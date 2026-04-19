import { t } from "i18next";
import { Text } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Immunity.styles";

export default function Immunity() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("immunity")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("immunity")}.body`)}</Text>
		</Section>
	);
}
