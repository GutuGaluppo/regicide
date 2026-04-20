import { Text, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./StatsPanel.styles";

export const StatItem = ({
	icon,
	label,
	value,
}: {
	icon: number;
	label: string;
	value: string;
}) => (
	<View style={styles.item}>
		<Image source={icon} style={styles.itemIcon} contentFit="contain" />
		<Text style={styles.itemValue}>{value}</Text>
		<Text style={styles.itemLabel}>{label}</Text>
	</View>
);
