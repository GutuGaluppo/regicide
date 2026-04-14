import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./SettingsDrawer.styles";

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
				<Pressable style={styles.backdropFill} onPress={onClose} />
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
