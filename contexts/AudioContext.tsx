import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const MUSIC_VOL_KEY = "audio_music_volume";
const SFX_VOL_KEY = "audio_sfx_volume";
const MUSIC_MUTE_KEY = "audio_music_muted";
const SFX_MUTE_KEY = "audio_sfx_muted";

const DEFAULT_MUSIC = 0.35;
const DEFAULT_SFX = 0.6;

interface AudioContextValue {
	playTap: () => void;
	playShuffleCards: () => void;
	musicVolume: number;
	sfxVolume: number;
	musicMuted: boolean;
	sfxMuted: boolean;
	effectiveMusicVolume: number;
	setMusicVolume: (v: number) => void;
	setSfxVolume: (v: number) => void;
	toggleMusicMute: () => void;
	toggleSfxMute: () => void;
}

const AudioContext = createContext<AudioContextValue>({
	playTap: () => {},
	playShuffleCards: () => {},
	musicVolume: DEFAULT_MUSIC,
	sfxVolume: DEFAULT_SFX,
	musicMuted: false,
	sfxMuted: false,
	effectiveMusicVolume: DEFAULT_MUSIC,
	setMusicVolume: () => {},
	setSfxVolume: () => {},
	toggleMusicMute: () => {},
	toggleSfxMute: () => {},
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
	const tapRef = useRef<Audio.Sound | null>(null);
	const shuffleRef = useRef<Audio.Sound | null>(null);
	const [musicVolume, setMusicVolumeState] = useState(DEFAULT_MUSIC);
	const [sfxVolume, setSfxVolumeState] = useState(DEFAULT_SFX);
	const [musicMuted, setMusicMuted] = useState(false);
	const [sfxMuted, setSfxMuted] = useState(false);

	const effectiveMusicVolume = musicMuted ? 0 : musicVolume;
	const effectiveSfxVolume = sfxMuted ? 0 : sfxVolume;

	// Load persisted volumes and mute states on mount
	useEffect(() => {
		AsyncStorage.getItem(MUSIC_VOL_KEY).then((v) => {
			if (v !== null) setMusicVolumeState(parseFloat(v));
		}).catch(() => {});
		AsyncStorage.getItem(SFX_VOL_KEY).then((v) => {
			if (v !== null) setSfxVolumeState(parseFloat(v));
		}).catch(() => {});
		AsyncStorage.getItem(MUSIC_MUTE_KEY).then((v) => {
			if (v === "1") setMusicMuted(true);
		}).catch(() => {});
		AsyncStorage.getItem(SFX_MUTE_KEY).then((v) => {
			if (v === "1") setSfxMuted(true);
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

	// Sync effective SFX volume to all sounds whenever volume or mute state changes
	useEffect(() => {
		tapRef.current?.setVolumeAsync(effectiveSfxVolume).catch(() => {});
		shuffleRef.current?.setVolumeAsync(effectiveSfxVolume).catch(() => {});
	}, [effectiveSfxVolume]);

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

	const toggleMusicMute = () => {
		setMusicMuted((prev) => {
			const next = !prev;
			AsyncStorage.setItem(MUSIC_MUTE_KEY, next ? "1" : "0").catch(() => {});
			return next;
		});
	};

	const toggleSfxMute = () => {
		setSfxMuted((prev) => {
			const next = !prev;
			AsyncStorage.setItem(SFX_MUTE_KEY, next ? "1" : "0").catch(() => {});
			return next;
		});
	};

	return (
		<AudioContext.Provider value={{
			playTap,
			playShuffleCards,
			musicVolume,
			sfxVolume,
			musicMuted,
			sfxMuted,
			effectiveMusicVolume,
			setMusicVolume,
			setSfxVolume,
			toggleMusicMute,
			toggleSfxMute,
		}}>
			{children}
		</AudioContext.Provider>
	);
};

export const useAudio = () => useContext(AudioContext);
