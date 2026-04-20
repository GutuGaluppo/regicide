import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { styles } from "./ActionButtonRow.styles";

export const SortButton = ({
	icon,
	handleSort,
	disabled,
}: {
	icon: number;
	handleSort: () => void;
	disabled?: boolean;
}) => {
	return (
		<TouchableOpacity
			onPress={handleSort}
			style={[styles.sortBtn, disabled && { opacity: 0.5 }]}
			activeOpacity={0.7}
			disabled={disabled}
		>
			<Image
				source={icon}
				style={{
					width: 25,
					height: 35,
				}}
				contentFit="contain"
			/>
		</TouchableOpacity>
	);
};
