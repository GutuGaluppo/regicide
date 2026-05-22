import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { t } from "i18next";
import { Text, View } from "react-native";
import DefeatedValueTable from "@/screens/InstructionsScreen/components/DefeatedValueTable";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./DefeatedEnemy.styles";

export default function DefeatedEnemy() {
	const s = (key: string) => `instructions.sections.${key}`;
	const { isTablet } = useResponsiveLayout();

	const rows = t(`${s("defeatedEnemy")}.tableRows`, {
		returnObjects: true,
	}) as { rank: string; label: string; value: string }[];

	return (
		<Section title={t(`${s("defeatedEnemy")}.title`)}>
			<View
				style={[
					styles.contentLayout,
					isTablet ? styles.contentLayoutRow : styles.contentLayoutColumn,
				]}
			>
				<View style={styles.textColumn}>
					<Text style={styles.bodyText}>{t(`${s("defeatedEnemy")}.body`)}</Text>
				</View>
				<View style={styles.tableColumn}>
					<DefeatedValueTable rows={rows} />
				</View>
			</View>
		</Section>
	);
}
