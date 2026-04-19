import { t } from "i18next";
import { Image, Text, View } from "react-native";
import SetupTable from "@/screens/InstructionsScreen/components/SetupTable";
import Section from "@/screens/InstructionsScreen/Sections/Section";
import { styles } from "./Preparation.styles";

export default function Preparation() {
	const s = (key: string) => `instructions.sections.${key}`;

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
					resizeMode="contain"
				/>
			</View>
			<Text style={styles.bodyText}>{t(`${s("setup")}.body`)}</Text>
			<SetupTable header={setupHeader} rows={setupRows} />
			<View style={styles.noteBlock}>
				<Text style={styles.noteText}>{t(`${s("setup")}.startNote`)}</Text>
			</View>
		</Section>
	);
}
