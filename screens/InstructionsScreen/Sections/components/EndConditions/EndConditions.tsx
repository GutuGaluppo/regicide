import { t } from "i18next";
import { Image, Text, View } from "react-native";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./EndConditions.styles";

export default function EndConditions() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("endConditions")}.title`)}>
			<Text style={styles.bodyText}>{t(`${s("endConditions")}.body`)}</Text>
			<View style={styles.victoryBlock}>
				<Text style={styles.victoryTitle}>
					{t(`${s("endConditions")}.victoryTitle`)}
				</Text>
				<Text style={styles.endText}>
					{t(`${s("endConditions")}.victoryText`)}
				</Text>
			</View>
			<View style={styles.defeatBlock}>
				<View style={styles.defeatTitleRow}>
					<Image
						source={require("@/assets/icons/skull.png")}
						style={styles.defeatIcon}
						resizeMode="contain"
					/>
					<Text style={styles.defeatTitle}>
						{t(`${s("endConditions")}.defeatTitle`)}
					</Text>
				</View>
				<Text style={styles.endText}>
					{t(`${s("endConditions")}.defeatText`)}
				</Text>
			</View>
		</Section>
	);
}
