import cardBack from "@/assets/images/cardBack.png";
import { NumberSprite } from "@/components/NumberSprite";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../GameScreen.styles";

type Props = { count: number; label: string };

export const StatusCard = ({ count, label }: Props) => (
	<View style={styles.statusItem}>
		<View style={styles.statusCard}>
			<Image source={cardBack} style={styles.statusCardImg} contentFit="contain" />
			<View style={styles.statusCardOverlay}>
				<NumberSprite value={count} type="deckstatus" height={25} />
			</View>
		</View>
		<Text style={styles.deckLabel}>{label}</Text>
	</View>
);
