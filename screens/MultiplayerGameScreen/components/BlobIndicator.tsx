import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { styles } from "./BottomTurnHud.styles";

type Props = {
	// Cor do jogador ativo (borda do blob + halo), preservando a identidade do jogo.
	color: string;
	// Estilo animado (translateX + width + opacity) vindo de useBlobIndicator.
	animatedStyle: StyleProp<ViewStyle>;
};

/**
 * Destaque deslizante ("blob") atrás do chip do jogador ativo: preenchimento
 * dourado translúcido + borda e halo na cor do jogador. Puramente decorativo.
 */
export const BlobIndicator = ({ color, animatedStyle }: Props) => (
	<Animated.View pointerEvents="none" style={[styles.blobWrap, animatedStyle]}>
		<View style={[styles.blobHalo, { backgroundColor: color }]} />
		{/* <View style={[styles.blobFill, { borderColor: color }]} /> */}
	</Animated.View>
);
