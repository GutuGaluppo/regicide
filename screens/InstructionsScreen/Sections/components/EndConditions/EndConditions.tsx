import Section from "@/screens/InstructionsScreen/Sections/Section";
import {
	columnFlex,
	sectionLayout,
} from "@/screens/InstructionsScreen/Sections/sectionLayout.styles";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { t } from "i18next";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./EndConditions.styles";

export default function EndConditions() {
	const s = (key: string) => `instructions.sections.${key}`;
	const { isTablet } = useResponsiveLayout();

	return (
		<Section title={t(`${s("endConditions")}.title`)}>
			<View
				style={[
					sectionLayout.content,
					isTablet ? sectionLayout.contentRow : sectionLayout.contentColumn,
				]}
			>
				<View style={[sectionLayout.column, columnFlex(1.1, isTablet)]}>
					<Text style={styles.bodyText}>{t(`${s("endConditions")}.body`)}</Text>
				</View>
				<View
					style={[
						sectionLayout.column,
						styles.statusColumn,
						columnFlex(0.9, isTablet),
					]}
				>
					<View style={styles.victoryBlock}>
						<View style={styles.defeatTitleRow}>
							<Image
								source={require("@/assets/icons/crown_outlined.png")}
								style={styles.defeatIcon}
								contentFit="contain"
							/>
							<Text style={styles.victoryTitle}>
								{t(`${s("endConditions")}.victoryTitle`)}
							</Text>
						</View>
						<Text style={styles.endText}>
							{t(`${s("endConditions")}.victoryText`)}
						</Text>
					</View>
					<View style={styles.defeatBlock}>
						<View style={styles.defeatTitleRow}>
							<Image
								source={require("@/assets/icons/skull.png")}
								style={styles.defeatIcon}
								contentFit="contain"
							/>
							<Text style={styles.defeatTitle}>
								{t(`${s("endConditions")}.defeatTitle`)}
							</Text>
						</View>
						<Text style={styles.endText}>
							{t(`${s("endConditions")}.defeatText`)}
						</Text>
					</View>
				</View>
			</View>
		</Section>
	);
}
