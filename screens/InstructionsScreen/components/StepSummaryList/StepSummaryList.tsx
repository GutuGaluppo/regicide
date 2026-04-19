import { Text, View } from "react-native";
import { styles } from "./StepSummaryList.styles";

export default function StepSummaryList({ steps }: { steps: string[] }) {
	return (
		<View style={styles.stepSummaryList}>
			{steps.map((s, i) => (
				<Text
					key={i}
					style={[styles.stepSummaryText, i === 0 && styles.stepSummaryFirst]}
				>
					{s}
				</Text>
			))}
		</View>
	);
}
