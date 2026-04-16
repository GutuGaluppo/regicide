import { useAudio } from "@/contexts/AudioContext";
import { Audio, AVPlaybackSource } from "expo-av";
import { useEffect, useRef } from "react";

export const useSoundtrack = (source: AVPlaybackSource) => {
	const { musicVolume } = useAudio();
	const soundRef = useRef<Audio.Sound | null>(null);
	// Track the latest desired volume so it can be applied after the sound loads
	const desiredVolumeRef = useRef(musicVolume);

	useEffect(() => {
		desiredVolumeRef.current = musicVolume;
		soundRef.current?.setVolumeAsync(musicVolume).catch(() => {});
	}, [musicVolume]);

	useEffect(() => {
		let mounted = true;

		Audio.Sound.createAsync(source, {
			shouldPlay: true,
			isLooping: true,
			volume: desiredVolumeRef.current,
		}).then(({ sound }) => {
			if (!mounted) {
				sound.unloadAsync();
				return;
			}
			soundRef.current = sound;
			// Apply volume that may have changed while the sound was loading
			sound.setVolumeAsync(desiredVolumeRef.current).catch(() => {});
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
