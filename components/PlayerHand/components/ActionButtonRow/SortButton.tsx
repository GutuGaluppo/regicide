import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { styles } from "./ActionButtonRow.styles";

export const SortButton = ({
	icon,
	handleSort,
}: {
	icon: number;
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
				contentFit="contain"
			/>
		</TouchableOpacity>
	);
};
