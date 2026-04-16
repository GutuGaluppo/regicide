import { getHandCardImage } from "@/data/images";
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

const SWORD = require("@/assets/icons/sword.png");
const SHIELD = require("@/assets/icons/shield.png");

const MiniCard = ({ card }: { card: Card }) => {
	const src = getHandCardImage(card.rank, card.suit, card.id);
	if (!src) return null;
	return <Image source={src} style={styles.cardImage} resizeMode="contain" />;
};

const CardSection = ({
	icon,
	title,
	cards,
	emptyLabel,
}: {
	icon: ImageSourcePropType;
	title: string;
	cards: Card[];
	emptyLabel: string;
}) => (
	<View style={styles.cardSection}>
		<View style={styles.cardSectionHeader}>
			<Image
				source={icon}
				style={styles.cardSectionIcon}
				resizeMode="contain"
			/>
			<Text style={styles.cardSectionTitle}>{title}</Text>
			<Text style={styles.cardSectionCount}>{cards.length}</Text>
		</View>
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.cardImageRow}
		>
			{cards.length === 0 ? (
				<Text style={styles.accordionEmpty}>{emptyLabel}</Text>
			) : (
				cards.map((c) => <MiniCard key={c.id} card={c} />)
			)}
		</ScrollView>
	</View>
);

export const EnemyAccordionItem = ({
	enemy,
	sectionIcon,
	attackCards,
	discardedCards,
	cards,
	label,
	emptyLabel,
}: {
	enemy?: Enemy;
	sectionIcon?: ImageSourcePropType;
	attackCards?: Card[];
	discardedCards?: Card[];
	cards?: Card[];
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

	const rotate = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "180deg"],
	});

	const thumbSrc = enemy ? getHandCardImage(enemy.rank, enemy.suit) : null;

	const totalCount =
		attackCards !== undefined
			? attackCards.length + (discardedCards?.length ?? 0)
			: (cards?.length ?? 0);

	return (
		<View style={styles.accordionItem}>
			<TouchableOpacity
				style={styles.accordionHeader}
				onPress={toggle}
				activeOpacity={0.7}
			>
				{thumbSrc ? (
					<Image
						source={thumbSrc}
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
				<Text style={styles.accordionCount}>{totalCount}</Text>
				<Animated.View style={{ transform: [{ rotate }] }}>
					<Ionicons name="chevron-down" size={18} color="#94A3B8" />
				</Animated.View>
			</TouchableOpacity>

			{expanded && (
				<View style={styles.accordionContent}>
					{attackCards !== undefined ? (
						<>
							<CardSection
								icon={SWORD}
								title="Heróis utilizados"
								cards={attackCards}
								emptyLabel={emptyLabel}
							/>
							<CardSection
								icon={SHIELD}
								title="Dano sofrido"
								cards={discardedCards ?? []}
								emptyLabel={emptyLabel}
							/>
						</>
					) : (
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.cardImageRow}
						>
							{(cards?.length ?? 0) === 0 ? (
								<Text style={styles.accordionEmpty}>{emptyLabel}</Text>
							) : (
								(cards ?? []).map((c) => <MiniCard key={c.id} card={c} />)
							)}
						</ScrollView>
					)}
				</View>
			)}
		</View>
	);
};
