import {
	CHOSEN_CARDS,
	ComboOption,
	RegularSuit,
	SuitRank,
} from "@/components/AttackInput/AttackInput.constants";
import React from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

interface ComboBarProps {
	/** Valid additions not yet selected (from getComboOptions) */
	comboOptions: ComboOption[];
	/** Already-selected combo cards */
	selectedComboCards: Array<{ suit: RegularSuit; rank: SuitRank }>;
	/** Tap to add (option) or remove (selected) */
	onToggleCombo: (suit: RegularSuit, rank: SuitRank) => void;
	/** Formatted power preview for all selected cards combined */
	powerPreview: string;
	totalDamage: number;
	immune: boolean;
}

export const ComboBar = ({
	comboOptions,
	selectedComboCards,
	onToggleCombo,
	powerPreview,
	totalDamage,
	immune,
}: ComboBarProps) => {
	const hasCards = selectedComboCards.length > 0 || comboOptions.length > 0;

	return (
		<View style={[styles.wrapper, immune && styles.wrapperImmune]}>
			{hasCards && (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.scrollView}
					contentContainerStyle={styles.cardRow}
				>
					{/* Selected combo cards — highlighted, tap to remove */}
					{selectedComboCards.map(({ suit, rank }) => (
						<TouchableOpacity
							key={`sel-${suit}-${rank}`}
							style={[styles.cardBtn, styles.cardBtnSelected, styles.cardBtnLifted]}
							onPress={() => onToggleCombo(suit, rank)}
							activeOpacity={0.7}
						>
							<Image
								source={CHOSEN_CARDS[suit][rank]}
								style={styles.cardThumb}
								resizeMode="cover"
							/>
						</TouchableOpacity>
					))}
					{/* Available combo options — tap to add */}
					{comboOptions.map(({ suit, rank, image }) => (
						<TouchableOpacity
							key={`opt-${suit}-${rank}`}
							style={styles.cardBtn}
							onPress={() => onToggleCombo(suit, rank)}
							activeOpacity={0.7}
						>
							<Image source={image} style={styles.cardThumb} resizeMode="cover" />
						</TouchableOpacity>
					))}
				</ScrollView>
			)}
			<View style={styles.infoRow}>
				<Text style={[styles.powerText, immune && styles.powerTextImmune]} numberOfLines={2}>
					{powerPreview}
				</Text>
				<View style={styles.damageWrapper}>
					<Text style={styles.damageLabel}>DMG</Text>
					<Text style={styles.damage}>{totalDamage}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: "rgba(30,41,59,0.9)",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderLeftWidth: 3,
		borderLeftColor: "#334155",
		marginHorizontal: 4,
		gap: 4,
	},
	wrapperImmune: {
		borderLeftColor: "#EF4444",
	},
	scrollView: {
		height: 76,
	},
	cardRow: {
		gap: 6,
		paddingTop: 6,
		paddingBottom: 4,
		alignItems: "center",
	},
	cardBtn: {
		width: 46,
		height: 66,
		borderRadius: 8,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "transparent",
	},
	cardBtnSelected: {
		borderColor: "#FBBF24",
	},
	cardBtnLifted: {
		transform: [{ translateY: -6 }],
	},
	cardThumb: {
		width: "100%",
		height: "100%",
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	powerText: {
		flex: 1,
		color: "#94A3B8",
		fontSize: 11,
	},
	powerTextImmune: {
		color: "#FCA5A5",
	},
	damageWrapper: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: 3,
	},
	damageLabel: {
		color: "#64748B",
		fontSize: 10,
		fontWeight: "600",
		textTransform: "uppercase",
	},
	damage: {
		color: "#FBBF24",
		fontWeight: "800",
		fontSize: 17,
	},
});
