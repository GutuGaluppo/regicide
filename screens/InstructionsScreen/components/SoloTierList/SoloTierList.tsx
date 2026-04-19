import { Text, View } from "react-native";
import { styles } from "./SoloTierList.styles";

export default function SoloTierList({
	tiers,
}: {
	tiers: { label: string; value: string }[];
}) {
	return (
		<View style={styles.soloTierList}>
			{tiers.map((t, i) => (
				<View key={i} style={styles.soloTierRow}>
					<Text style={styles.soloTierLabel}>{t.label}</Text>
					<Text style={styles.soloTierValue}>{t.value}</Text>
				</View>
			))}
		</View>
	);
}
