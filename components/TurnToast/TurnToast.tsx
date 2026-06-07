import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
	signal: number;
	isMyTurn: boolean;
	playerName: string;
};

const ANIM_DURATION = 280;

export const TurnToast = ({ signal, isMyTurn, playerName }: Props) => {
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);
	const scale = useRef(new Animated.Value(0.85)).current;
	const opacity = useRef(new Animated.Value(0)).current;
	const backdropOpacity = useRef(new Animated.Value(0)).current;
	const mountSignalRef = useRef(signal);

	const show = () => {
		setVisible(true);
		scale.setValue(0.85);
		opacity.setValue(0);
		backdropOpacity.setValue(0);
		Animated.parallel([
			Animated.timing(backdropOpacity, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: true }),
			Animated.spring(scale, { toValue: 1, bounciness: 8, speed: 14, useNativeDriver: true }),
			Animated.timing(opacity, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: true }),
		]).start();
	};

	const dismiss = () => {
		Animated.parallel([
			Animated.timing(backdropOpacity, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
			Animated.timing(opacity, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
			Animated.timing(scale, { toValue: 0.9, duration: ANIM_DURATION, useNativeDriver: true }),
		]).start(() => setVisible(false));
	};

	// Ao montar (retorno à tela): exibe se já é a vez do jogador
	useEffect(() => {
		if (isMyTurn) {
			mountSignalRef.current = signal;
			show();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Durante o jogo: exibe quando o turno muda para este jogador
	useEffect(() => {
		if (signal === 0 || signal <= mountSignalRef.current) return;
		show();
	}, [signal]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!visible) return null;

	return (
		<Modal transparent visible animationType="none" statusBarTranslucent>
			<Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
				<Pressable style={styles.backdropFill} />
			</Animated.View>

			<View style={styles.centered}>
				<Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
					<Text style={styles.swordIcon}>⚔️</Text>
					<Text style={styles.title} numberOfLines={1}>
						{t("multiplayer.turnToast.title", { name: playerName })}
					</Text>
					<Text style={styles.subtitle}>{t("multiplayer.turnToast.subtitle")}</Text>

					<TouchableOpacity style={styles.confirmBtn} onPress={dismiss} activeOpacity={0.8}>
						<Ionicons name="checkmark" size={28} color="#0f172a" />
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
		borderColor: "rgba(74,222,128,0.45)",
		alignItems: "center",
		paddingTop: 32,
		paddingBottom: 28,
		paddingHorizontal: 24,
		gap: 8,
	},
	swordIcon: {
		fontSize: 40,
		marginBottom: 4,
	},
	title: {
		fontFamily: "Cinzel",
		fontSize: 16,
		color: "#4ADE80",
		letterSpacing: 0.5,
		textAlign: "center",
	},
	subtitle: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#64748B",
		textAlign: "center",
		marginBottom: 16,
	},
	confirmBtn: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#4ADE80",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 4,
	},
});
