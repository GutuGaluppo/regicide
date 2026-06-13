import { Image } from "expo-image";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./ActionButtonRow.styles";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
	icon: number;
	label: string;
	onPress: () => void;
	disabled?: boolean;
	variant?: Variant;
};

const VARIANT_STYLES = {
	primary: {
		button: styles.textBtnPrimary,
		label: styles.textBtnLabelPrimary,
		icon: styles.btnIcon,
		iconTint: "#F5F8F3",
	},
	secondary: {
		button: styles.textBtnSecondary,
		label: styles.textBtnLabel,
		icon: styles.btnIcon,
		iconTint: "#F6E7B2",
	},
	ghost: {
		button: styles.textBtnGhost,
		label: styles.textBtnLabelGhost,
		icon: styles.btnIconGhost,
		iconTint: "#F5E7BB",
	},
} as const;

export const IconLabelButton = ({
	icon,
	label,
	onPress,
	disabled,
	variant = "ghost",
}: Props) => {
	const variantStyles = VARIANT_STYLES[variant];

	return (
		<TouchableOpacity
			style={[styles.textBtn, variantStyles.button, disabled && styles.textBtnDisabled]}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.85}
		>
			<Image
				source={icon}
				style={[variantStyles.icon, { tintColor: variantStyles.iconTint }]}
				contentFit="contain"
			/>
			<Text style={[styles.textBtnLabel, variantStyles.label]}>{label}</Text>
		</TouchableOpacity>
	);
};
