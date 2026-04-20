import CARD_BACK from "@/assets/images/cards_back.png";
import { View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./GhostElements.styles";
export const GhostStatusBar = () => (
	<View style={styles.statusRow}>
		{[0, 1, 2].map((i) => (
			<Image
				key={i}
				source={CARD_BACK}
				style={styles.statusCard}
				contentFit="contain"
			/>
		))}
	</View>
);

export const GhostHand = () => (
	<View style={styles.handRow}>
		{[0, 1, 2, 3, 4, 5, 6].map((i) => (
			<Image
				key={i}
				source={CARD_BACK}
				style={styles.handCard}
				contentFit="contain"
			/>
		))}
	</View>
);

export const GhostActions = () => (
	<View style={styles.actionsRow}>
		<View style={styles.btnPrimary} />
		<View style={styles.btnSecondary} />
	</View>
);

export const GhostFooter = () => (
	<View style={styles.footerRow}>
		{[0, 1, 2, 3].map((i) => (
			<Image
				key={i}
				source={CARD_BACK}
				style={styles.footerCard}
				contentFit="contain"
			/>
		))}
	</View>
);
