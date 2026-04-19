import { Text, View } from "react-native";
import { styles } from "./CommunicationExample.styles";

export default function CommunicationExample({
	text,
	allowed,
}: {
	text: string;
	allowed: boolean;
}) {
	return (
		<View
			style={[
				styles.commExample,
				allowed ? styles.commAllowed : styles.commForbidden,
			]}
		>
			<Text
				style={[styles.commText, { color: allowed ? "#4ADE80" : "#F87171" }]}
			>
				{text}
			</Text>
		</View>
	);
}
