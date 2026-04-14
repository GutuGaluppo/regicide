import { Text, View } from "react-native";
import { styles } from "./StatsPanel.styles";

export const StatItem = ({
	icon,
	label,
	value,
}: {
	icon: string;
	label: string;
	value: string;
}) => (
	<View style={styles.item}>
		<Text style={styles.itemIcon}>{icon}</Text>
		<Text style={styles.itemValue}>{value}</Text>
		<Text style={styles.itemLabel}>{label}</Text>
	</View>
);
