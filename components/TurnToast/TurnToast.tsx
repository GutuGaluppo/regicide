import { AvatarBadge } from "@/components/AvatarBadge";
import { AvatarId } from "@/data/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type Props = {
	// Id do jogador da vez; quando muda, o toast aparece.
	activePlayerId: string | null;
	isMyTurn: boolean;
	playerName: string;
	avatarId?: AvatarId;
};

const ANIM_DURATION = 280;
const AUTO_DISMISS_MS = 2200;

export const TurnToast = ({ activePlayerId, isMyTurn, playerName, avatarId }: Props) => {
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);
	const scale = useRef(new Animated.Value(0.85)).current;
	const opacity = useRef(new Animated.Value(0)).current;
	const backdropOpacity = useRef(new Animated.Value(0)).current;
	const prevActiveRef = useRef<string | null | undefined>(undefined);
	const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const show = () => {
		setVisible(true);
		scale.setValue(0.85);
		opacity.setValue(0);
		backdropOpacity.setValue(0);
		Animated.parallel([
			Animated.timing(backdropOpacity, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: true }),
			Animated.spring(scale, { toValue: 1, bounciness: 3, speed: 11, useNativeDriver: true }),
			Animated.timing(opacity, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: true }),
		]).start();
		if (dismissTimer.current) clearTimeout(dismissTimer.current);
		dismissTimer.current = setTimeout(dismiss, AUTO_DISMISS_MS);
	};

	const dismiss = () => {
		if (dismissTimer.current) {
			clearTimeout(dismissTimer.current);
			dismissTimer.current = null;
		}
		Animated.parallel([
			Animated.timing(backdropOpacity, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
			Animated.timing(opacity, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
			Animated.timing(scale, { toValue: 0.9, duration: ANIM_DURATION, useNativeDriver: true }),
		]).start(() => setVisible(false));
	};

	// Exibe quando a vez muda de jogador. No mount, só exibe se for a vez do
	// próprio jogador (evita "piscar" o turno de outro ao reentrar na tela).
	useEffect(() => {
		const prev = prevActiveRef.current;
		prevActiveRef.current = activePlayerId;
		if (!activePlayerId) return;
		if (prev === undefined) {
			if (isMyTurn) show();
			return;
		}
		if (prev !== activePlayerId) show();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activePlayerId]);

	useEffect(() => () => {
		if (dismissTimer.current) clearTimeout(dismissTimer.current);
	}, []);

	if (!visible) return null;

	return (
		<Modal transparent visible animationType="none" statusBarTranslucent>
			<Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
				<Pressable style={styles.backdropFill} onPress={dismiss} />
			</Animated.View>

			<View style={styles.centered} pointerEvents="box-none">
				<Animated.View
					style={[
						styles.card,
						isMyTurn ? styles.cardMine : styles.cardOther,
						{ transform: [{ scale }], opacity },
					]}
				>
					<AvatarBadge avatarId={avatarId} size={56} highlighted />
					<Text style={styles.name} numberOfLines={1}>
						{playerName}
					</Text>
					<Text style={[styles.title, isMyTurn ? styles.titleMine : styles.titleOther]}>
						{isMyTurn
							? t("multiplayer.turnToast.yourTurn")
							: t("multiplayer.turnToast.othersTurn")}
					</Text>
					{isMyTurn && (
						<Text style={styles.subtitle}>{t("multiplayer.turnToast.subtitle")}</Text>
					)}

					<TouchableOpacity style={styles.confirmBtn} onPress={dismiss} activeOpacity={0.8}>
						<Ionicons name="checkmark" size={26} color="#0f172a" />
					</TouchableOpacity>
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.55)",
	},
	backdropFill: {
		...StyleSheet.absoluteFillObject,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		width: 280,
		backgroundColor: "#0F172A",
		borderRadius: 20,
		borderWidth: 1,
		alignItems: "center",
		paddingTop: 28,
		paddingBottom: 24,
		paddingHorizontal: 24,
		gap: 6,
	},
	cardMine: {
		borderColor: "rgba(74,222,128,0.45)",
	},
	cardOther: {
		borderColor: "rgba(232,213,163,0.35)",
	},
	name: {
		fontFamily: "IMFellEnglish",
		fontSize: 15,
		color: "#E8D5A3",
		textAlign: "center",
		marginTop: 4,
	},
	title: {
		fontFamily: "Cinzel",
		fontSize: 16,
		letterSpacing: 0.5,
		textAlign: "center",
	},
	titleMine: {
		color: "#4ADE80",
	},
	titleOther: {
		color: "#F8E7BC",
	},
	subtitle: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#64748B",
		textAlign: "center",
		marginBottom: 12,
	},
	confirmBtn: {
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: "#4ADE80",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
});
