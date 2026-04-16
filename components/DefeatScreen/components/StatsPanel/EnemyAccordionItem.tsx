import { getCardImage, getHandCardImage } from "@/data/images";
import { Card, Enemy } from "@/data/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
	Animated,
	Image,
	ImageSourcePropType,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./StatsPanel.styles";

const MiniCard = ({ card }: { card: Card }) => {
	const src = getHandCardImage(card.rank, card.suit, card.id);
	if (!src) return null;
	return <Image source={src} style={styles.cardImage} resizeMode="contain" />;
};

export const EnemyAccordionItem = ({
	enemy,
	sectionIcon,
	cards,
	label,
	emptyLabel,
}: {
	enemy?: Enemy;
	sectionIcon?: ImageSourcePropType;
	cards: Card[];
	label: string;
	emptyLabel: string;
}) => {
	const [expanded, setExpanded] = useState(false);
	const rotation = useRef(new Animated.Value(0)).current;

	const toggle = () => {
		Animated.spring(rotation, {
			toValue: expanded ? 0 : 1,
			useNativeDriver: true,
			tension: 80,
			friction: 14,
		}).start();
		setExpanded((v) => !v);
	};

	const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });

	return (
		<View style={styles.accordionItem}>
			<TouchableOpacity style={styles.accordionHeader} onPress={toggle} activeOpacity={0.7}>
				{enemy ? (
					<Image
						source={getCardImage(enemy.rank, enemy.suit)}
						style={styles.accordionThumb}
						resizeMode="contain"
					/>
				) : sectionIcon ? (
					<Image
						source={sectionIcon}
						style={styles.accordionIcon}
						resizeMode="contain"
					/>
				) : null}
				<Text style={styles.accordionLabel} numberOfLines={1}>
					{label}
				</Text>
				<Text style={styles.accordionCount}>{cards.length}</Text>
				<Animated.View style={{ transform: [{ rotate }] }}>
					<Ionicons name="chevron-down" size={16} color="#94A3B8" />
				</Animated.View>
			</TouchableOpacity>

			{expanded && (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.accordionContent}
					contentContainerStyle={styles.cardImageRow}
				>
					{cards.length === 0 ? (
						<Text style={styles.accordionEmpty}>{emptyLabel}</Text>
					) : (
						cards.map((c) => <MiniCard key={c.id} card={c} />)
					)}
				</ScrollView>
			)}
		</View>
	);
};
