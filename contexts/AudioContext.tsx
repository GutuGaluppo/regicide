import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio, AVPlaybackSource } from "expo-av";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

const MUSIC_VOL_KEY = "audio_music_volume";
const SFX_VOL_KEY = "audio_sfx_volume";
const MUSIC_MUTE_KEY = "audio_music_muted";
const SFX_MUTE_KEY = "audio_sfx_muted";

const DEFAULT_MUSIC = 0.35;
const DEFAULT_SFX = 0.6;

interface AudioContextValue {
	playTap: () => void;
	playShuffleCards: () => void;
	playChatMessage: () => void;
	playTurnAlert: () => void;
	playSoundtrack: (source: AVPlaybackSource, key: string) => void;
	stopSoundtrack: () => void;
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
	playChatMessage: () => {},
	playTurnAlert: () => {},
	playSoundtrack: () => {},
	stopSoundtrack: () => {},
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
	const chatRef = useRef<Audio.Sound | null>(null);
	const turnRef = useRef<Audio.Sound | null>(null);
	const soundtrackRef = useRef<Audio.Sound | null>(null);
	const soundtrackKeyRef = useRef<string | null>(null);
	const desiredSoundtrackRef = useRef<{ source: AVPlaybackSource; key: string } | null>(null);
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

		Audio.Sound.createAsync(require("@/assets/folley/chat-message.mp3"), {
			shouldPlay: false,
			volume: sfxVolume,
		}).then(({ sound }) => {
			if (mounted) chatRef.current = sound;
		});

		Audio.Sound.createAsync(require("@/assets/folley/turn-alert.mp3"), {
			shouldPlay: false,
			volume: sfxVolume,
		}).then(({ sound }) => {
			if (mounted) turnRef.current = sound;
		});

		return () => {
			mounted = false;
			tapRef.current?.unloadAsync();
			shuffleRef.current?.unloadAsync();
			chatRef.current?.unloadAsync();
			turnRef.current?.unloadAsync();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Sync effective SFX volume to all sounds whenever volume or mute state changes
	useEffect(() => {
		tapRef.current?.setVolumeAsync(effectiveSfxVolume).catch(() => {});
		shuffleRef.current?.setVolumeAsync(effectiveSfxVolume).catch(() => {});
		chatRef.current?.setVolumeAsync(effectiveSfxVolume).catch(() => {});
		turnRef.current?.setVolumeAsync(effectiveSfxVolume).catch(() => {});
	}, [effectiveSfxVolume]);

	// Mobile browsers ignore setVolumeAsync(0) — use setIsMutedAsync as fallback
	useEffect(() => {
		tapRef.current?.setIsMutedAsync(sfxMuted).catch(() => {});
		shuffleRef.current?.setIsMutedAsync(sfxMuted).catch(() => {});
		chatRef.current?.setIsMutedAsync(sfxMuted).catch(() => {});
		turnRef.current?.setIsMutedAsync(sfxMuted).catch(() => {});
	}, [sfxMuted]);

	// Soundtrack (música) — aplica volume/mudo à faixa atual
	useEffect(() => {
		soundtrackRef.current?.setVolumeAsync(effectiveMusicVolume).catch(() => {});
	}, [effectiveMusicVolume]);
	useEffect(() => {
		soundtrackRef.current?.setIsMutedAsync(musicMuted).catch(() => {});
	}, [musicMuted]);

	// Web: navegadores bloqueiam autoplay sem gesto do usuário. A intro (tocada
	// ao abrir o app, antes de qualquer interação) fica em pausa silenciosa.
	// Destrava no primeiro gesto: retoma a faixa carregada ou recarrega a desejada.
	useEffect(() => {
		if (Platform.OS !== "web" || typeof window === "undefined") return;
		const unlock = () => {
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
			window.removeEventListener("touchstart", unlock);
			const s = soundtrackRef.current;
			if (s) {
				s.playAsync().catch(() => {});
			} else {
				const d = desiredSoundtrackRef.current;
				if (d) {
					soundtrackKeyRef.current = null;
					playSoundtrack(d.source, d.key);
				}
			}
		};
		window.addEventListener("pointerdown", unlock);
		window.addEventListener("keydown", unlock);
		window.addEventListener("touchstart", unlock);
		return () => {
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
			window.removeEventListener("touchstart", unlock);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const playTap = () => {
		if (sfxMuted) return;
		tapRef.current?.replayAsync().catch(() => {});
	};

	const playShuffleCards = () => {
		if (sfxMuted) return;
		shuffleRef.current?.replayAsync().catch(() => {});
	};

	const playChatMessage = () => {
		if (sfxMuted) return;
		chatRef.current?.replayAsync().catch(() => {});
	};

	const playTurnAlert = () => {
		if (sfxMuted) return;
		turnRef.current?.replayAsync().catch(() => {});
	};

	// Trilha sonora em loop, trocada por tela/fase. Se a faixa atual já é `key`,
	// não reinicia — garante continuidade entre telas de menu.
	const playSoundtrack = async (source: AVPlaybackSource, key: string) => {
		desiredSoundtrackRef.current = { source, key };
		if (soundtrackKeyRef.current === key) return;
		soundtrackKeyRef.current = key;

		const prev = soundtrackRef.current;
		soundtrackRef.current = null;
		if (prev) prev.stopAsync().then(() => prev.unloadAsync()).catch(() => {});

		try {
			const { sound } = await Audio.Sound.createAsync(source, {
				shouldPlay: true,
				isLooping: true,
				volume: effectiveMusicVolume,
				isMuted: musicMuted,
			});
			// A faixa pode ter mudado enquanto carregava
			if (soundtrackKeyRef.current !== key) {
				sound.unloadAsync().catch(() => {});
				return;
			}
			soundtrackRef.current = sound;
		} catch {}
	};

	const stopSoundtrack = () => {
		soundtrackKeyRef.current = null;
		const s = soundtrackRef.current;
		soundtrackRef.current = null;
		s?.stopAsync().then(() => s.unloadAsync()).catch(() => {});
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
			playChatMessage,
			playTurnAlert,
			playSoundtrack,
			stopSoundtrack,
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
