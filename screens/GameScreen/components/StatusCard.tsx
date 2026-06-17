import cardBack from "@/assets/images/cardBack.png";
import { NumberSprite } from "@/components/NumberSprite";
import { getHandCardImage } from "@/data/images";
import { Card } from "@/data/types";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../GameScreen.styles";

type Props = {
	count: number;
	label: string;
	/** Quando presente, mostra esta carta com a face para cima (ex.: topo do descarte). */
	faceCard?: Card | null;
};

export const StatusCard = ({ count, label, faceCard }: Props) => {
	const faceImg =
		faceCard && count > 0
			? getHandCardImage(faceCard.rank, faceCard.suit, faceCard.id)
			: null;

	return (
		<View style={styles.statusItem}>
			<View style={styles.statusCard}>
				<Image
					source={faceImg ?? cardBack}
					style={styles.statusCardImg}
					contentFit="contain"
				/>
				{faceImg ? (
					<View style={styles.statusCountBadge}>
						<Text style={styles.statusCountBadgeText}>{count}</Text>
					</View>
				) : (
					<View style={styles.statusCardOverlay}>
						<NumberSprite value={count} type="deckstatus" height={25} />
					</View>
				)}
			</View>
			<Text style={styles.deckLabel}>{label}</Text>
		</View>
	);
};
