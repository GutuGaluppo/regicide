// /components/SettingsDrawer.tsx
import { router } from "expo-router";
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

export const SettingsDrawer = ({
	visible,
	onClose,
	onReset,
}: {
	visible: boolean;
	onClose: () => void;
	onReset: () => void;
}) => {
	const { t } = useTranslation();
	const [mounted, setMounted] = useState(false);
	const slideY = useRef(new Animated.Value(400)).current;
	const backdropOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			setMounted(true);
			slideY.setValue(400);
			backdropOpacity.setValue(0);
			Animated.parallel([
				Animated.timing(backdropOpacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.spring(slideY, {
					toValue: 0,
					tension: 80,
					friction: 14,
					useNativeDriver: true,
				}),
			]).start();
		} else if (mounted) {
			Animated.parallel([
				Animated.timing(backdropOpacity, {
					toValue: 0,
					duration: 160,
					useNativeDriver: true,
				}),
				Animated.timing(slideY, {
					toValue: 400,
					duration: 200,
					useNativeDriver: true,
				}),
			]).start(() => setMounted(false));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	if (!mounted) return null;

	const handleReset = () => {
		onClose();
		setTimeout(() => onReset(), 220);
	};

	const handleExit = () => {
		onClose();
		setTimeout(() => router.back(), 220);
	};

	return (
		<Modal
			transparent
			visible={mounted}
			onRequestClose={onClose}
			statusBarTranslucent
			animationType="none"
		>
			<Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
			</Animated.View>

			<Animated.View
				style={[styles.panel, { transform: [{ translateY: slideY }] }]}
				pointerEvents="box-none"
			>
				<View style={styles.handle} />
				<Text style={styles.title}>{t("settings.title")}</Text>

				<TouchableOpacity style={styles.row} onPress={handleReset} activeOpacity={0.7}>
					<Text style={styles.rowIcon}>↺</Text>
					<Text style={styles.rowLabel}>{t("settings.restart")}</Text>
				</TouchableOpacity>

				<View style={styles.divider} />

				<TouchableOpacity style={styles.row} onPress={handleExit} activeOpacity={0.7}>
					<Text style={styles.rowIcon}>←</Text>
					<Text style={[styles.rowLabel, styles.rowLabelMuted]}>{t("settings.exit")}</Text>
				</TouchableOpacity>
			</Animated.View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.6)",
	},
	panel: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#0F172A",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderTopWidth: 1,
		borderColor: "rgba(148,163,184,0.2)",
		paddingBottom: 48,
		paddingHorizontal: 24,
	},
	handle: {
		alignSelf: "center",
		width: 36,
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(148,163,184,0.35)",
		marginTop: 10,
		marginBottom: 20,
	},
	title: {
		color: "#94A3B8",
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 1.2,
		textTransform: "uppercase",
		marginBottom: 16,
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(148,163,184,0.12)",
		marginVertical: 4,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		paddingVertical: 14,
	},
	rowIcon: {
		color: "#F1F5F9",
		fontSize: 20,
		width: 24,
		textAlign: "center",
	},
	rowLabel: {
		color: "#F1F5F9",
		fontSize: 16,
		fontWeight: "600",
	},
	rowLabelMuted: {
		color: "#64748B",
	},
});
