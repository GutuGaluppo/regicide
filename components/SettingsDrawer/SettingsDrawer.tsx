import { useAudio } from "@/contexts/AudioContext";
import { useActionHints } from "@/store/actionHintsStore";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Modal,
	Pressable,
	Switch,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { styles } from "./SettingsDrawer.styles";
import VolumeRow from "./components/VolumeRow";

export const SettingsDrawer = ({
	visible,
	onClose,
	onReset,
	onAbandon,
	showExit = true,
}: {
	visible: boolean;
	onClose: () => void;
	onReset?: () => void;
	onAbandon?: () => void;
	showExit?: boolean;
}) => {
	const { t } = useTranslation();
	const {
		playTap,
		musicVolume,
		sfxVolume,
		musicMuted,
		sfxMuted,
		setMusicVolume,
		setSfxVolume,
		toggleMusicMute,
		toggleSfxMute,
	} = useAudio();
	const hintsEnabled = useActionHints((s) => s.enabled);
	const setHintsEnabled = useActionHints((s) => s.setEnabled);
	const hydrateHints = useActionHints((s) => s.hydrate);
	const [mounted, setMounted] = useState(false);
	const slideY = useRef(new Animated.Value(400)).current;
	const backdropOpacity = useRef(new Animated.Value(0)).current;
	const { width } = useWindowDimensions();
	const isDesktop = width >= 1100;
	const panelWidth = Math.min(420, width - 48);

	useEffect(() => {
		hydrateHints();
	}, [hydrateHints]);

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
					tension: 60,
					friction: 18,
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
		playTap();
		onClose();
		setTimeout(() => onReset?.(), 220);
	};

	const handleExit = () => {
		playTap();
		onClose();
		setTimeout(() => router.back(), 220);
	};

	const handleAbandon = () => {
		playTap();
		onClose();
		setTimeout(() => onAbandon?.(), 220);
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
				style={[
					styles.panel,
					isDesktop && {
						left: (width - panelWidth) / 2,
						right: (width - panelWidth) / 2,
						bottom: 24,
						borderRadius: 20,
					},
					{ transform: [{ translateY: slideY }] },
				]}
			>
				<View style={styles.handle} />
				<Text style={styles.title}>{t("settings.title")}</Text>

				{/* Volume Controls */}
				<VolumeRow
					icon="musical-notes-outline"
					label={t("settings.music")}
					value={musicVolume}
					onChange={setMusicVolume}
					muted={musicMuted}
					onToggleMute={toggleMusicMute}
				/>
				<VolumeRow
					icon="volume-medium-outline"
					label={t("settings.sfx")}
					value={sfxVolume}
					onChange={setSfxVolume}
					onPreview={playTap}
					muted={sfxMuted}
					onToggleMute={toggleSfxMute}
				/>

				<View style={styles.divider} />

				{/* Guia de ações (dicas para botões só-ícone no mobile) */}
				<View style={styles.toggleRow}>
					<Text style={styles.rowLabel}>{t("settings.actionHints")}</Text>
					<Switch
						value={hintsEnabled}
						onValueChange={(v) => {
							playTap();
							setHintsEnabled(v);
						}}
						trackColor={{ false: "#334155", true: "rgba(232,213,163,0.6)" }}
						thumbColor={hintsEnabled ? "#E8D5A3" : "#94A3B8"}
					/>
				</View>

				{onReset && (
					<>
						<View style={styles.divider} />
						<TouchableOpacity
							style={styles.row}
							onPress={handleReset}
							activeOpacity={0.7}
						>
							<Text style={styles.rowIcon}>↺</Text>
							<Text style={styles.rowLabel}>{t("settings.restart")}</Text>
						</TouchableOpacity>
					</>
				)}

				{onAbandon && (
					<>
						<View style={styles.divider} />
						<TouchableOpacity
							style={styles.row}
							onPress={handleAbandon}
							activeOpacity={0.7}
						>
							<Text style={styles.rowIcon}>🏳️</Text>
							<Text style={[styles.rowLabel, styles.rowLabelDanger]}>
								{t("settings.abandon")}
							</Text>
						</TouchableOpacity>
					</>
				)}

				{showExit && (
					<>
						<View style={styles.divider} />
						<TouchableOpacity
							style={styles.row}
							onPress={handleExit}
							activeOpacity={0.7}
						>
							<Text style={styles.rowIcon}>←</Text>
							<Text style={[styles.rowLabel, styles.rowLabelMuted]}>
								{t("settings.exit")}
							</Text>
						</TouchableOpacity>
					</>
				)}
			</Animated.View>
		</Modal>
	);
};
