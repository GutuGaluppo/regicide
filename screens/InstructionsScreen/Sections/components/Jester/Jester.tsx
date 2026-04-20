import { t } from "i18next";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Jester.styles";

export default function Jester() {
	const s = (key: string) => `instructions.sections.${key}`;

	return (
		<Section title={t(`${s("jester")}.title`)}>
			<View style={styles.sectionIconRow}>
				<Image
					source={require("@/assets/icons/jester_icon.png")}
					style={styles.sectionIconMd}
					contentFit="contain"
				/>
			</View>
			<Text style={styles.bodyText}>{t(`${s("jester")}.body`)}</Text>
			<View style={styles.noteBlock}>
				<Text style={styles.noteText}>{t(`${s("jester")}.note`)}</Text>
			</View>
		</Section>
	);
}
