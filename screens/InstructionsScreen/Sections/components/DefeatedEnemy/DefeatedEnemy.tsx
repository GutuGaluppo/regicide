import { t } from "i18next";
import { Text } from "react-native";
import DefeatedValueTable from "@/screens/InstructionsScreen/components/DefeatedValueTable";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./DefeatedEnemy.styles";

export default function DefeatedEnemy() {
	const s = (key: string) => `instructions.sections.${key}`;

	const rows = t(`${s("defeatedEnemy")}.tableRows`, {
		returnObjects: true,
	}) as { rank: string; label: string; value: string }[];

	return (
		<Section title={t(`${s("defeatedEnemy")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("defeatedEnemy")}.body`)}</Text>
			<DefeatedValueTable rows={rows} />
		</Section>
	);
}
