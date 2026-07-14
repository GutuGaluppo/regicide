import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { t } from "i18next";
import { Text, View } from "react-native";
import DefeatedValueTable from "@/screens/InstructionsScreen/components/DefeatedValueTable";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import {
	columnFlex,
	sectionLayout,
} from "@/screens/InstructionsScreen/Sections/sectionLayout.styles";
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
					sectionLayout.content,
					isTablet ? sectionLayout.contentRow : sectionLayout.contentColumn,
				]}
			>
				<View style={[sectionLayout.column, columnFlex(1.1, isTablet)]}>
					<Text style={styles.bodyText}>{t(`${s("defeatedEnemy")}.body`)}</Text>
				</View>
				<View style={[sectionLayout.column, columnFlex(0.9, isTablet)]}>
					<DefeatedValueTable rows={rows} />
				</View>
			</View>
		</Section>
	);
}
