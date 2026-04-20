import { useAudio } from "@/contexts/AudioContext";
import { GamePhase } from "@/data/types";
import { LayoutAnimation, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./ActionButtonRow.styles";
import { SortButton } from "./SortButton";

type PropsType = {
	phase: GamePhase;
	onSort?: () => void;
	onSortByClass?: () => void;
	onPlay?: () => void;
	playDisabled?: boolean;
	locked?: boolean;
};
export const ActionButtonRow = ({
	phase,
	onSort,
	onSortByClass,
	onPlay,
	playDisabled,
	locked,
}: PropsType) => {
	const { playTap } = useAudio();

	const handleSort = () => {
		if (locked) return;
		playTap();
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		onSort?.();
	};
	const handleSortByClass = () => {
		if (locked) return;
		playTap();
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		onSortByClass?.();
	};

	return (
		<View style={styles.container}>
			{phase === "player_turn" && onPlay && (
				<TouchableOpacity
					style={[styles.playBtn, playDisabled && styles.playBtnDisabled]}
					onPress={() => {
						playTap();
						onPlay();
					}}
					disabled={playDisabled || locked}
					activeOpacity={0.8}
				>
					<View style={styles.playBtnInner}>
						<Image
							source={require("@/assets/icons/sword.png")}
							style={{
								width: 35,
								height: 35,
								transform: [{ rotate: "45deg" }],
							}}
							contentFit="contain"
						/>
					</View>
				</TouchableOpacity>
			)}
			<View style={{ flexDirection: "row", marginLeft: "auto", gap: 4 }}>
				{onSort && phase === "player_turn" && (
					<SortButton
						icon={require("@/assets/icons/sort_icon.png")}
						handleSort={handleSort}
						disabled={locked}
					/>
				)}
				{onSortByClass && phase === "player_turn" && (
					<SortButton
						icon={require("@/assets/icons/suits-sort.png")}
						handleSort={handleSortByClass}
						disabled={locked}
					/>
				)}
			</View>
		</View>
	);
};
