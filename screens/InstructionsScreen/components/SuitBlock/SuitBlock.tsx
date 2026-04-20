import ClubsClass from "@/assets/classes/clubs.png";
import DiamondsClass from "@/assets/classes/diamonds.png";
import HeartsClass from "@/assets/classes/hearts.png";
import SpadesClass from "@/assets/classes/spades.png";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./SuitBlock.styles";

const SUIT_META: Record<string, { color: string; image: number }> = {
	hearts: { color: "#EF4444", image: HeartsClass },
	diamonds: { color: "#F59E0B", image: DiamondsClass },
	clubs: { color: "#4ADE80", image: ClubsClass },
	spades: { color: "#60A5FA", image: SpadesClass },
};

export default function SuitBlock({
	suit,
	name,
	body,
}: {
	suit: keyof typeof SUIT_META;
	name: string;
	body: string;
}) {
	const { color, image } = SUIT_META[suit];
	return (
		<View style={[styles.suitBlock, { borderLeftColor: color }]}>
			<View style={styles.suitBlockHeader}>
				<Image
					source={image}
					style={styles.suitClassIcon}
					tintColor={color}
					contentFit="contain"
				/>
				<Text style={[styles.suitBlockName, { color }]}>{name}</Text>
			</View>
			<Text style={styles.suitBlockBody}>{body}</Text>
		</View>
	);
}
