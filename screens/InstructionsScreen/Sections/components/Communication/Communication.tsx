import CommunicationExample from "@/screens/InstructionsScreen/components/CommunicationExample";
import { t } from "i18next";
import { Text } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Communication.styles";

export default function Communication() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("communication")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("communication")}.body`)}</Text>
			<CommunicationExample text={t(`${s("communication")}.allowed`)} allowed />
			<CommunicationExample
				text={t(`${s("communication")}.forbidden`)}
				allowed={false}
			/>
		</Section>
	);
}
