import { t } from "i18next";
import { Text } from "react-native";
import SoloTierList from "@/screens/InstructionsScreen/components/SoloTierList";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Solo.styles";

export default function Solo() {
	const s = (key: string) => `instructions.sections.${key}`;

	const tiers = t(`${s("solo")}.tiers`, { returnObjects: true }) as {
		label: string;
		value: string;
	}[];

	return (
		<Section title={t(`${s("solo")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("solo")}.body`)}</Text>
			<Text style={styles.labelText}>{t(`${s("solo")}.tiersLabel`)}</Text>
			<SoloTierList tiers={tiers} />
		</Section>
	);
}
