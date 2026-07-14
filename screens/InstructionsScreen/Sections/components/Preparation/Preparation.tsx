import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import SetupTable from "@/screens/InstructionsScreen/components/SetupTable";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import {
	columnFlex,
	sectionLayout,
} from "@/screens/InstructionsScreen/Sections/sectionLayout.styles";
import { Image } from "expo-image";
import { t } from "i18next";
import { Text, View } from "react-native";
import { styles } from "./Preparation.styles";

export default function Preparation() {
	const s = (key: string) => `instructions.sections.${key}`;
	const { isTablet } = useResponsiveLayout();

	const setupHeader = t(`${s("setup")}.tableHeader`, {
		returnObjects: true,
	}) as {
		players: string;
		jesters: string;
		hand: string;
	};

	const setupRows = t(`${s("setup")}.tableRows`, { returnObjects: true }) as {
		players: string;
		jesters: string;
		hand: string;
	}[];
	return (
		<Section title={t(`${s("setup")}.title`)}>
			<View style={styles.sectionIconRow}>
				<Image
					source={require("@/assets/icons/tavern.png")}
					style={styles.sectionIconMd}
					contentFit="contain"
				/>
			</View>
			<View
				style={[
					sectionLayout.content,
					isTablet ? sectionLayout.contentRow : sectionLayout.contentColumn,
				]}
			>
				<View style={[sectionLayout.column, columnFlex(1.15, isTablet)]}>
					<Text style={styles.bodyText}>{t(`${s("setup")}.body`)}</Text>
				</View>
				<View style={[sectionLayout.column, columnFlex(0.85, isTablet)]}>
					<SetupTable header={setupHeader} rows={setupRows} />
				</View>
			</View>
			<View style={styles.noteBlock}>
				<Text style={styles.noteText}>{t(`${s("setup")}.startNote`)}</Text>
			</View>
		</Section>
	);
}
