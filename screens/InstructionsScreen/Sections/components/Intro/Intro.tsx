import { t } from "i18next";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./Intro.styles";

export default function Intro() {
	const gameInfo = t("instructions.gameInfo", { returnObjects: true }) as {
		players: string;
		age: string;
		time: string;
	};
	return (
		<View style={styles.introBlock}>
			<Image
				source={require("@/assets/images/crown.png")}
				style={styles.crownImage}
				contentFit="contain"
			/>
			<Text style={styles.gameName}>{t("instructions.gameName")}</Text>
			<Text style={styles.gameSubtitle}>{t("instructions.gameSubtitle")}</Text>
			<View style={styles.gameInfoRow}>
				<View style={styles.gameInfoBadge}>
					<Text style={styles.gameInfoIcon}>👥</Text>
					<Text style={styles.gameInfoText}>{gameInfo.players}</Text>
				</View>
				<View style={styles.gameInfoBadge}>
					<Text style={styles.gameInfoIcon}>📅</Text>
					<Text style={styles.gameInfoText}>{gameInfo.age}</Text>
				</View>
				<View style={styles.gameInfoBadge}>
					<Text style={styles.gameInfoIcon}>⏱</Text>
					<Text style={styles.gameInfoText}>{gameInfo.time}</Text>
				</View>
			</View>
		</View>
	);
}
