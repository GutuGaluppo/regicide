import { Text, View } from "react-native";
import { styles } from "./DefeatStepList.styles";

const ROMAN = ["I", "II", "III", "IV"];

export default function DefeatStepList({ steps }: { steps: string[] }) {
	return (
		<View style={styles.defeatStepList}>
			{steps.map((s, i) => (
				<View key={i} style={styles.defeatStepRow}>
					<Text style={styles.defeatStepNum}>({ROMAN[i]})</Text>
					<Text style={styles.defeatStepText}>{s}</Text>
				</View>
			))}
		</View>
	);
}
