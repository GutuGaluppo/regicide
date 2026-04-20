import { SvgNumberSprite } from "@/components/SvgNumberSprite";
import { useAudio } from "@/contexts/AudioContext";
import { t } from "i18next";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../../PlayerHand.styles";

type PropsType = {
	enough: boolean;
	damageSubtraction: number;
	onDiscard: () => void;
	locked?: boolean;
};
export const DiscardButton = ({
	enough,
	damageSubtraction,
	onDiscard,
	locked,
}: PropsType) => {
	const { playTap } = useAudio();
	const totalColor = "#fff";

	return (
		<TouchableOpacity
			style={[styles.discardBtn, enough && styles.discardBtnActive]}
			onPress={() => {
				playTap();
				onDiscard?.();
			}}
			disabled={!enough || locked}
			activeOpacity={0.8}
		>
			<Text style={styles.discardLabel}>{t("action.discard_label")}:</Text>
			<SvgNumberSprite
				value={damageSubtraction}
				height={26}
				color={totalColor}
			/>
		</TouchableOpacity>
	);
};
