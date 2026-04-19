import { Image, ImageSourcePropType, TouchableOpacity } from "react-native";
import { styles } from "./ActionButtonRow.styles";

export const SortButton = ({
	icon,
	handleSort,
}: {
	icon: ImageSourcePropType;
	handleSort: () => void;
}) => {
	return (
		<TouchableOpacity
			onPress={handleSort}
			style={styles.sortBtn}
			activeOpacity={0.7}
		>
			<Image
				source={icon}
				style={{
					width: 25,
					height: 35,
				}}
				resizeMode="contain"
			/>
		</TouchableOpacity>
	);
};
