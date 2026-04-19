import { Text, View } from "react-native";
import { styles } from "./DefeatedValueTable.styles";

export default function DefeatedValueTable({
	rows,
}: {
	rows: { rank: string; label: string; value: string }[];
}) {
	return (
		<View style={styles.defeatedTable}>
			{rows.map((r, i) => (
				<View key={i} style={styles.defeatedRow}>
					<View style={styles.defeatedRankBadge}>
						<Text style={styles.defeatedRankText}>{r.rank}</Text>
					</View>
					<Text style={styles.defeatedLabel}>{r.label}</Text>
					<Text style={styles.defeatedValue}>{r.value}</Text>
				</View>
			))}
		</View>
	);
}
