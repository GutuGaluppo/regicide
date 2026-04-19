import { Text, View } from "react-native";
import { styles } from "./EnemyTable.styles";

export default function EnemyTable({
	header,
	rows,
}: {
	header: { enemy: string; atk: string; hp: string };
	rows: { enemy: string; atk: string; hp: string }[];
}) {
	return (
		<View style={styles.table}>
			<View style={[styles.tableRow, styles.tableRowHeader]}>
				<Text style={[styles.tableCell, styles.tableCellHeader, { flex: 2 }]}>
					{header.enemy}
				</Text>
				<Text
					style={[
						styles.tableCell,
						styles.tableCellHeader,
						styles.tableCellCenter,
					]}
				>
					{header.atk}
				</Text>
				<Text
					style={[
						styles.tableCell,
						styles.tableCellHeader,
						styles.tableCellRight,
					]}
				>
					{header.hp}
				</Text>
			</View>
			{rows.map((r, i) => (
				<View
					key={i}
					style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}
				>
					<Text style={[styles.tableCell, styles.tableCellBold, { flex: 2 }]}>
						{r.enemy}
					</Text>
					<Text
						style={[styles.tableCell, styles.tableCellCenter, styles.statAtk]}
					>
						{r.atk}
					</Text>
					<Text
						style={[styles.tableCell, styles.tableCellRight, styles.statHp]}
					>
						{r.hp}
					</Text>
				</View>
			))}
		</View>
	);
}
