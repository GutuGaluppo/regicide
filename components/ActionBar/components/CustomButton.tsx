import { useAudio } from "@/contexts/AudioContext";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../ActionBar.styles";

export default function Btn({
	label,
	onPress,
	variant = "default",
	disabled,
}: {
	label: string;
	onPress: () => void;
	variant?: "default" | "warning";
	disabled?: boolean;
}) {
	const { playTap } = useAudio();
	const bg = variant === "warning" ? "#D5B377" : "#67826E";
	return (
		<TouchableOpacity
			style={[
				styles.btn,
				{ backgroundColor: bg },
				disabled && styles.btnDisabled,
			]}
			onPress={() => { playTap(); onPress(); }}
			disabled={disabled}
			activeOpacity={0.8}
		>
			<Text style={styles.btnText}>{label}</Text>
		</TouchableOpacity>
	);
}
