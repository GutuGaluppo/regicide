import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MUSIC_VOL_KEY = "audio_music_volume";
const SFX_VOL_KEY = "audio_sfx_volume";

const DEFAULT_MUSIC = 0.35;
const DEFAULT_SFX = 0.6;

interface AudioContextValue {
	playTap: () => void;
	playShuffleCards: () => void;
	musicVolume: number;
	sfxVolume: number;
	setMusicVolume: (v: number) => void;
	setSfxVolume: (v: number) => void;
}

const AudioContext = createContext<AudioContextValue>({
	playTap: () => {},
	playShuffleCards: () => {},
	musicVolume: DEFAULT_MUSIC,
	sfxVolume: DEFAULT_SFX,
	setMusicVolume: () => {},
	setSfxVolume: () => {},
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
	const tapRef = useRef<Audio.Sound | null>(null);
	const shuffleRef = useRef<Audio.Sound | null>(null);
	const [musicVolume, setMusicVolumeState] = useState(DEFAULT_MUSIC);
	const [sfxVolume, setSfxVolumeState] = useState(DEFAULT_SFX);

	// Load persisted volumes on mount
	useEffect(() => {
		AsyncStorage.getItem(MUSIC_VOL_KEY).then((v) => {
			if (v !== null) setMusicVolumeState(parseFloat(v));
		}).catch(() => {});
		AsyncStorage.getItem(SFX_VOL_KEY).then((v) => {
			if (v !== null) setSfxVolumeState(parseFloat(v));
		}).catch(() => {});
	}, []);

	// Load SFX sounds
	useEffect(() => {
		let mounted = true;

		Audio.setAudioModeAsync({
			playsInSilentModeIOS: true,
			staysActiveInBackground: false,
		});

		Audio.Sound.createAsync(require("@/assets/folley/tap-btn.mp3"), {
			shouldPlay: false,
			volume: sfxVolume,
		}).then(({ sound }) => {
			if (mounted) tapRef.current = sound;
		});

		Audio.Sound.createAsync(require("@/assets/folley/shuffle-cards.mp3"), {
			shouldPlay: false,
			volume: sfxVolume,
		}).then(({ sound }) => {
			if (mounted) shuffleRef.current = sound;
		});

		return () => {
			mounted = false;
			tapRef.current?.unloadAsync();
			shuffleRef.current?.unloadAsync();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Sync SFX volume to all sounds whenever it changes
	useEffect(() => {
		tapRef.current?.setVolumeAsync(sfxVolume).catch(() => {});
		shuffleRef.current?.setVolumeAsync(sfxVolume).catch(() => {});
	}, [sfxVolume]);

	const playTap = () => {
		tapRef.current?.replayAsync().catch(() => {});
	};

	const playShuffleCards = () => {
		shuffleRef.current?.replayAsync().catch(() => {});
	};

	const setMusicVolume = (v: number) => {
		const clamped = Math.max(0, Math.min(1, v));
		setMusicVolumeState(clamped);
		AsyncStorage.setItem(MUSIC_VOL_KEY, String(clamped)).catch(() => {});
	};

	const setSfxVolume = (v: number) => {
		const clamped = Math.max(0, Math.min(1, v));
		setSfxVolumeState(clamped);
		AsyncStorage.setItem(SFX_VOL_KEY, String(clamped)).catch(() => {});
	};

	return (
		<AudioContext.Provider value={{ playTap, playShuffleCards, musicVolume, sfxVolume, setMusicVolume, setSfxVolume }}>
			{children}
		</AudioContext.Provider>
	);
};

export const useAudio = () => useContext(AudioContext);
