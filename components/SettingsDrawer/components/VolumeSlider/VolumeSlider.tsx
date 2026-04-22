import { useRef } from "react";
import { PanResponder, View } from "react-native";
import { styles } from "./VolumeSlide.styles";

export default function VolumeSlider({
	value,
	onChange,
	onPreview,
	disabled,
}: {
	value: number;
	onChange: (v: number) => void;
	onPreview?: () => void;
	disabled?: boolean;
}) {
	const trackWidthRef = useRef(0);
	// Absolute pageX of the hit area — avoids locationX being relative to a child view (thumb)
	const trackPageXRef = useRef(0);
	const hitAreaRef = useRef<View>(null);
	const onPreviewRef = useRef(onPreview);
	onPreviewRef.current = onPreview;
	const disabledRef = useRef(disabled);
	disabledRef.current = disabled;
	const lastPreviewAt = useRef(0);

	const clamp = (v: number) => Math.max(0, Math.min(1, v));

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onStartShouldSetPanResponderCapture: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderTerminationRequest: () => false,
			onPanResponderGrant: (evt) => {
				if (disabledRef.current || trackWidthRef.current === 0) return;
				onChange(
					clamp(
						(evt.nativeEvent.pageX - trackPageXRef.current) /
							trackWidthRef.current,
					),
				);
			},
			onPanResponderMove: (evt) => {
				if (disabledRef.current || trackWidthRef.current === 0) return;
				onChange(
					clamp(
						(evt.nativeEvent.pageX - trackPageXRef.current) /
							trackWidthRef.current,
					),
				);
				const now = Date.now();
				if (onPreviewRef.current && now - lastPreviewAt.current > 200) {
					lastPreviewAt.current = now;
					onPreviewRef.current();
				}
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
			style={[styles.sliderHitArea, disabled && { opacity: 0.35 }]}
		>
			<View style={styles.sliderTrack} pointerEvents="none">
				<View style={[styles.sliderFill, { width: fillPct as `${number}%` }]} />
				<View style={[styles.sliderThumb, { left: fillPct as `${number}%` }]} />
			</View>
		</View>
	);
}
