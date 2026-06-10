import { CardView } from "@/components/CardView";
import { Card } from "@/data/types";
import { View } from "react-native";

const WAITING_SCALE = 0.75;

// Renderiza CardView em tamanho reduzido usando margens negativas para
// colapsar o espaço de layout extra criado pelo transform: scale.
export default function ScaledCard({ card }: { card: Card }) {
	return (
		<View
			style={{
				transform: [{ scale: WAITING_SCALE }],
			}}
		>
			<CardView card={card} selected={false} pressDisabled />
		</View>
	);
}
