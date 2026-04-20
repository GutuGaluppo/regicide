import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import VolumeSlider from "../VolumeSlider";
import { styles } from "./VolumeRow.styles";

export default function VolumeRow({
	icon,
	label,
	value,
	onChange,
	onPreview,
}: {
	icon: React.ComponentProps<typeof Ionicons>["name"];
	label: string;
	value: number;
	onChange: (v: number) => void;
	onPreview?: () => void;
}) {
	return (
		<View style={styles.volumeRow}>
			<View style={styles.volumeHeader}>
				<Ionicons name={icon} size={18} color="#94A3B8" />
				<Text style={styles.volumeLabel}>{label}</Text>
				<Text style={styles.volumePct}>{Math.round(value * 100)}%</Text>
			</View>
			<VolumeSlider value={value} onChange={onChange} onPreview={onPreview} />
		</View>
	);
}
