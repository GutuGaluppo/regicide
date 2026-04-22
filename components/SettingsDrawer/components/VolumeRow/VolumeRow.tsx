import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import VolumeSlider from "../VolumeSlider";
import { styles } from "./VolumeRow.styles";

export default function VolumeRow({
	icon,
	label,
	value,
	onChange,
	onPreview,
	muted,
	onToggleMute,
}: {
	icon: React.ComponentProps<typeof Ionicons>["name"];
	label: string;
	value: number;
	onChange: (v: number) => void;
	onPreview?: () => void;
	muted?: boolean;
	onToggleMute?: () => void;
}) {
	return (
		<View style={[styles.volumeRow, muted && styles.volumeRowMuted]}>
			<View style={styles.volumeHeader}>
				<Ionicons name={icon} size={18} color={muted ? "#475569" : "#94A3B8"} />
				<Text style={[styles.volumeLabel, muted && styles.volumeLabelMuted]}>
					{label}
				</Text>
				<Text style={styles.volumePct}>
					{muted ? "—" : `${Math.round(value * 100)}%`}
				</Text>
				{onToggleMute && (
					<TouchableOpacity
						onPress={onToggleMute}
						hitSlop={8}
						style={styles.muteBtn}
						activeOpacity={0.65}
					>
						<Ionicons
							name={muted ? "volume-mute" : "volume-high"}
							size={20}
							color={muted ? "#EF4444" : "#94A3B8"}
						/>
					</TouchableOpacity>
				)}
			</View>
			<VolumeSlider
				value={value}
				onChange={onChange}
				onPreview={onPreview}
				disabled={muted}
			/>
		</View>
	);
}
