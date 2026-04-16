import { useAudio } from "@/contexts/AudioContext";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { JesterCard } from "./JesterCard";
import { styles } from "./JesterStack.styles";

export const JesterStack = ({
	jestersAvailable,
	jestersUsed,
	jesterActive,
	onUseJester,
}: {
	jestersAvailable: number;
	jestersUsed: number;
	jesterActive: boolean;
	onUseJester?: () => void;
}) => {
	const { playTap } = useAudio();
	const prevUsed = useRef(jestersUsed);
	const [flips, setFlips] = useState<[boolean, boolean]>([false, false]);

	useEffect(() => {
		if (jestersUsed > prevUsed.current) {
			const idx = jestersUsed - 1;
			if (idx < 2) {
				setFlips((prev) => {
					const next: [boolean, boolean] = [prev[0], prev[1]];
					next[idx] = true;
					return next;
				});
				const t = setTimeout(() => {
					setFlips((prev) => {
						const next: [boolean, boolean] = [prev[0], prev[1]];
						next[idx] = false;
						return next;
					});
				}, 350);
				return () => clearTimeout(t);
			}
		}
		prevUsed.current = jestersUsed;
	}, [jestersUsed]);

	const totalCards = jestersAvailable + jestersUsed;
	if (totalCards === 0) return null;

	return (
		<TouchableOpacity
			style={[styles.stack, jesterActive && styles.stackActive]}
			onPress={jestersAvailable > 0 && onUseJester ? () => { playTap(); onUseJester(); } : undefined}
			activeOpacity={jestersAvailable > 0 ? 0.75 : 1}
			disabled={!onUseJester || jestersAvailable === 0}
		>
			{[0, 1].map((i) => (
				<JesterCard
					key={i}
					index={i}
					startUsed={jestersUsed > i}
					flip={flips[i]}
					offsetX={i * 7}
					offsetY={i * 7}
					zIndex={i}
				/>
			))}
			{jesterActive && <View style={styles.activeDot} />}
		</TouchableOpacity>
	);
};
