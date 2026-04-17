import { useAudio } from "@/contexts/AudioContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Modal,
	PanResponder,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { styles } from "./SettingsDrawer.styles";

// ─── Volume Slider ────────────────────────────────────────────────────────────

const VolumeSlider = ({
	value,
	onChange,
}: {
	value: number;
	onChange: (v: number) => void;
}) => {
	const trackWidthRef = useRef(0);
	// Absolute pageX of the hit area — avoids locationX being relative to a child view (thumb)
	const trackPageXRef = useRef(0);
	const hitAreaRef = useRef<View>(null);

	const clamp = (v: number) => Math.max(0, Math.min(1, v));

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onStartShouldSetPanResponderCapture: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderTerminationRequest: () => false,
			onPanResponderGrant: (evt) => {
				if (trackWidthRef.current === 0) return;
				onChange(clamp((evt.nativeEvent.pageX - trackPageXRef.current) / trackWidthRef.current));
			},
			onPanResponderMove: (evt) => {
				if (trackWidthRef.current === 0) return;
				onChange(clamp((evt.nativeEvent.pageX - trackPageXRef.current) / trackWidthRef.current));
			},
		}),
	).current;

	const fillPct = `${Math.round(value * 100)}%`;

	return (
		<View
			ref={hitAreaRef}
			collapsable={false}
			{...panResponder.panHandlers}
			onLayout={(e) => {
				trackWidthRef.current = e.nativeEvent.layout.width;
				hitAreaRef.current?.measure((_x, _y, _w, _h, pageX) => {
					if (pageX !== undefined) trackPageXRef.current = pageX;
				});
			}}
			style={styles.sliderHitArea}
		>
			<View style={styles.sliderTrack} pointerEvents="none">
				<View style={[styles.sliderFill, { width: fillPct as `${number}%` }]} />
				<View style={[styles.sliderThumb, { left: fillPct as `${number}%` }]} />
			</View>
		</View>
	);
};

// ─── Volume Row ───────────────────────────────────────────────────────────────

const VolumeRow = ({
	icon,
	label,
	value,
	onChange,
}: {
	icon: React.ComponentProps<typeof Ionicons>["name"];
	label: string;
	value: number;
	onChange: (v: number) => void;
}) => (
	<View style={styles.volumeRow}>
		<View style={styles.volumeHeader}>
			<Ionicons name={icon} size={18} color="#94A3B8" />
			<Text style={styles.volumeLabel}>{label}</Text>
			<Text style={styles.volumePct}>{Math.round(value * 100)}%</Text>
		</View>
		<VolumeSlider value={value} onChange={onChange} />
	</View>
);

// ─── SettingsDrawer ───────────────────────────────────────────────────────────

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
	const { playTap, musicVolume, sfxVolume, setMusicVolume, setSfxVolume } = useAudio();
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
		playTap();
		onClose();
		setTimeout(() => onReset(), 220);
	};

	const handleExit = () => {
		playTap();
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
			>
				<View style={styles.handle} />
				<Text style={styles.title}>{t("settings.title")}</Text>

				{/* Volume Controls */}
				<VolumeRow
					icon="musical-notes-outline"
					label={t("settings.music")}
					value={musicVolume}
					onChange={setMusicVolume}
				/>
				<VolumeRow
					icon="volume-medium-outline"
					label={t("settings.sfx")}
					value={sfxVolume}
					onChange={setSfxVolume}
				/>

				<View style={styles.divider} />

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
