import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import SoloTierList from "@/screens/InstructionsScreen/components/SoloTierList";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { t } from "i18next";
import { Text, View } from "react-native";
import { styles } from "./Solo.styles";

export default function Solo() {
	const { isTablet } = useResponsiveLayout();
	const s = (key: string) => `instructions.sections.${key}`;

	const tiers = t(`${s("solo")}.tiers`, { returnObjects: true }) as {
		label: string;
		value: string;
	}[];

	return (
		<Section title={t(`${s("solo")}.title`)}>
			<View
				style={[
					styles.contentLayout,
					isTablet ? styles.contentLayoutRow : styles.contentLayoutColumn,
				]}
			>
				<View style={styles.textColumn}>
					<Text style={styles.bodyText}>{t(`${s("solo")}.body`)}</Text>
				</View>
				<View style={styles.tableColumn}>
					<Text style={styles.labelText}>{t(`${s("solo")}.tiersLabel`)}</Text>
					<SoloTierList tiers={tiers} />
				</View>
			</View>
		</Section>
	);
}
