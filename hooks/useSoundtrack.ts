import { useAudio } from "@/contexts/AudioContext";
import { AVPlaybackSource } from "expo-av";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

/**
 * Plays a looping soundtrack while the screen is focused. The track is keyed,
 * so screens sharing the same `key` keep the music playing seamlessly across
 * navigation (the AudioContext only switches when the key changes).
 */
export const useSoundtrack = (source: AVPlaybackSource, key: string) => {
	const { playSoundtrack } = useAudio();
	useFocusEffect(
		useCallback(() => {
			playSoundtrack(source, key);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [source, key]),
	);
};
