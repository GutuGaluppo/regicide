import { Text, View } from "react-native";
import { styles } from "./SetupTable.styles";

export default function SetupTable({
	header,
	rows,
}: {
	header: { players: string; jesters: string; hand: string };
	rows: { players: string; jesters: string; hand: string }[];
}) {
	return (
		<View style={styles.table}>
			<View style={[styles.tableRow, styles.tableRowHeader]}>
				<Text style={[styles.tableCell, styles.tableCellHeader]}>
					{header.players}
				</Text>
				<Text
					style={[
						styles.tableCell,
						styles.tableCellHeader,
						styles.tableCellCenter,
					]}
				>
					{header.jesters}
				</Text>
				<Text
					style={[
						styles.tableCell,
						styles.tableCellHeader,
						styles.tableCellRight,
					]}
				>
					{header.hand}
				</Text>
			</View>
			{rows.map((r, i) => (
				<View
					key={i}
					style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}
				>
					<Text style={[styles.tableCell, styles.tableCellBold]}>
						{r.players}
					</Text>
					<Text style={[styles.tableCell, styles.tableCellCenter]}>
						{r.jesters}
					</Text>
					<Text style={[styles.tableCell, styles.tableCellRight]}>
						{r.hand}
					</Text>
				</View>
			))}
		</View>
	);
}
