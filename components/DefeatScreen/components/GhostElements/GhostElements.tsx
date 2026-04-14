import { Image, View } from "react-native";
import { styles } from "./GhostElements.styles";
const CARD_BACK = require("../assets/images/cards_back.png");
export const GhostStatusBar = () => (
	<View style={styles.statusRow}>
		{[0, 1, 2].map((i) => (
			<Image
				key={i}
				source={CARD_BACK}
				style={styles.statusCard}
				resizeMode="contain"
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
				resizeMode="contain"
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
				resizeMode="contain"
			/>
		))}
	</View>
);
