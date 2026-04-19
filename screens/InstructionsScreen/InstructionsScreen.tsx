import React from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import { styles } from "./InstructionsScreen.styles";

import BG from "@/assets/backgrounds/gold_mountains.webp";
import { ScreenHeader } from "@/components/ScreenHeader";

import Combos from "./Sections/components/Combos";
import Communication from "./Sections/components/Communication";
import Companions from "./Sections/components/Companions";
import DefeatedEnemy from "./Sections/components/DefeatedEnemy";
import EndConditions from "./Sections/components/EndConditions";
import HowToPlay from "./Sections/components/HowToPlay";
import Immunity from "./Sections/components/Immunity";
import Intro from "./Sections/components/Intro";
import Jester from "./Sections/components/Jester";
import Objective from "./Sections/components/Objective";
import Pass from "./Sections/components/Pass";
import Preparation from "./Sections/components/Preparation";
import Solo from "./Sections/components/Solo";
import StepFour from "./Sections/components/StepFour";
import StepOne from "./Sections/components/StepOne";
import StepThree from "./Sections/components/StepThree";
import StepTwo from "./Sections/components/StepTwo";

export const InstructionsScreen = () => {
	return (
		<ImageBackground
			source={BG}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<ScreenHeader />
				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{/* ── Intro ── */}
					<Intro />

					{/* ── Objetivo do Jogo ── */}
					<Objective />

					{/* ── Preparação ── */}
					<Preparation />

					{/* ── Como Jogar — 4 passos ── */}
					<HowToPlay />

					{/* ── Passo 1 ── */}
					<StepOne />

					{/* ── Passo 2 — Poderes dos Naipes ── */}
					<StepTwo />

					{/* ── Passo 3 — Dano e Derrota ── */}
					<StepThree />

					{/* ── Passo 4 ── */}
					<StepFour />

					{/* ── Animais Companheiros ── */}
					<Companions />

					{/* ── Combinações ── */}
					<Combos />

					{/* ── Imunidade Inimiga ── */}
					<Immunity />

					{/* ── Usando o Jóquer ── */}
					<Jester />

					{/* ── Aproveitando Inimigos Derrotados ── */}
					<DefeatedEnemy />

					{/* ── Passar ── */}
					<Pass />

					{/* ── Comunicação ── */}
					<Communication />

					{/* ── Final do Jogo ── */}
					<EndConditions />

					{/* ── Jogo Solo ── */}
					<Solo />

					<View style={{ height: 32 }} />
				</ScrollView>
			</View>
		</ImageBackground>
	);
};
