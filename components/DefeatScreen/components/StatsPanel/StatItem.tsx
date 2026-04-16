import { Image, ImageSourcePropType, Text, View } from "react-native";
import { styles } from "./StatsPanel.styles";

export const StatItem = ({
	icon,
	label,
	value,
}: {
	icon: ImageSourcePropType;
	label: string;
	value: string;
}) => (
	<View style={styles.item}>
		<Image source={icon} style={styles.itemIcon} resizeMode="contain" />
		<Text style={styles.itemValue}>{value}</Text>
		<Text style={styles.itemLabel}>{label}</Text>
	</View>
);
