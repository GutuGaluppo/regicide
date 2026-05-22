import { Image } from "expo-image";
import { t } from "i18next";
import { Text, View } from "react-native";
import { styles } from "./Intro.styles";
const HOURGLASS = require("@/assets/icons/duration.png");
const AGE_ICON = require("@/assets/icons/age_icon.png");
const PLAYERS = require("@/assets/icons/players.png");

export default function Intro() {
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
				<View>
					<Image source={PLAYERS} style={styles.gameInfoImage} />
				</View>
				<View>
					<Image source={AGE_ICON} style={styles.gameInfoImage} />
				</View>
				<View>
					<Image source={HOURGLASS} style={styles.gameInfoImage} />
				</View>
			</View>
		</View>
	);
}
