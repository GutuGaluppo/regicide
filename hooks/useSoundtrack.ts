import { useAudio } from "@/contexts/AudioContext";
import { Audio, AVPlaybackSource } from "expo-av";
import { useEffect, useRef } from "react";

export const useSoundtrack = (source: AVPlaybackSource) => {
	const { effectiveMusicVolume, musicMuted } = useAudio();
	const soundRef = useRef<Audio.Sound | null>(null);
	// Track latest desired values so they can be applied after the sound loads
	const desiredVolumeRef = useRef(effectiveMusicVolume);
	const desiredMutedRef = useRef(musicMuted);

	useEffect(() => {
		desiredVolumeRef.current = effectiveMusicVolume;
		soundRef.current?.setVolumeAsync(effectiveMusicVolume).catch(() => {});
	}, [effectiveMusicVolume]);

	// Mobile browsers ignore setVolumeAsync(0) — use setIsMutedAsync as fallback
	useEffect(() => {
		desiredMutedRef.current = musicMuted;
		soundRef.current?.setIsMutedAsync(musicMuted).catch(() => {});
	}, [musicMuted]);

	useEffect(() => {
		let mounted = true;

		Audio.Sound.createAsync(source, {
			shouldPlay: true,
			isLooping: true,
			volume: desiredVolumeRef.current,
			isMuted: desiredMutedRef.current,
		}).then(({ sound }) => {
			if (!mounted) {
				sound.unloadAsync();
				return;
			}
			soundRef.current = sound;
			// Apply state that may have changed while the sound was loading
			sound.setVolumeAsync(desiredVolumeRef.current).catch(() => {});
			sound.setIsMutedAsync(desiredMutedRef.current).catch(() => {});
		});

		return () => {
			mounted = false;
			const s = soundRef.current;
			soundRef.current = null;
			s?.stopAsync().then(() => s.unloadAsync()).catch(() => {});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
