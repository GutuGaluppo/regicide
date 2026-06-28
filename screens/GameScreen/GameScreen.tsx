import { CardFlightOverlay } from "@/components/CardFlightOverlay/CardFlightOverlay";
// LAYOUT_TEST: import mantido — não deletar
// import { CastleFooter } from "@/components/CastleFooter";
import { ConfirmModal } from "@/components/ConfirmModal";
import { DefeatScreen } from "@/components/DefeatScreen";
import { EnemyCaptureOverlay } from "@/components/EnemyCaptureOverlay/EnemyCaptureOverlay";
import { EnemyCard } from "@/components/EnemyCard";
import { EnemyModal } from "@/components/EnemyModal";
import { GameLogModal } from "@/components/GameLog";
import { PlayerHand } from "@/components/PlayerHand";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { SuitTracker } from "@/components/SuitTracker";
import { TurnRevealOverlay } from "@/components/TurnRevealOverlay/TurnRevealOverlay";
import {
	TutorialStepPanel,
	TutorialWelcomeModal,
} from "@/components/TutorialOverlay";
import { VictoryScreen } from "@/components/VictoryScreen";
import { useAudio } from "@/contexts/AudioContext";
import { useGameScreenStore } from "@/contexts/GameStoreContext";
import { useActionHints } from "@/store/actionHintsStore";
import { useBackgroundCaching } from "@/hooks/useBackgroundCaching";
import { useEnemyCardScale } from "@/hooks/useEnemyCardScale";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useTutorialFlow } from "@/hooks/useTutorialFlow";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, LayoutChangeEvent, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GameLogButton } from "./components/GameLogButton";
import { ParticipantsSidebar } from "./components/ParticipantsSidebar";
import { StatusCard } from "./components/StatusCard";
import { styles } from "./GameScreen.styles";
import { useGameAnimations } from "./hooks/useGameAnimations";

export const GameScreen = () => {
	const { t } = useTranslation();
	const { playShuffleCards, playSoundtrack } = useAudio();
	const insets = useSafeAreaInsets();
	const { contentMaxWidth, screenPadding, isDesktop, isTablet } =
		useResponsiveLayout();
	useBackgroundCaching("game_bg", require("@/assets/backgrounds/bg_cave.webp"));

	const {
		gameState,
		selectedIds,
		selectedCards,
		playError,
		currentEnemy,
		currentHP,
		effectiveAttack,
		selectedTotal,
		previewDamage,
		previewShieldGain,
		cardsDrawnSignal,
		dealSignal,
		autoJesterSignal,
		autoJesterPending,
		isMyTurn,
		initialize,
		toggleCard,
		playSelected,
		yieldTurn,
		confirmDiscard,
		completeAutoJesterAnimation,
		useJester,
		sortHand,
		sortHandByClass,
		resetGame,
		onAbandon,
		lastPlayedCards,
		roomPlayers,
		myPlayerId,
		playerOrder,
		currentPlayerIndex,
		reveal,
		gameLog,
	} = useGameScreenStore();

	useEffect(() => {
		initialize();
		useActionHints.getState().hydrate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (cardsDrawnSignal === 0) return;
		playShuffleCards();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardsDrawnSignal]);

	const {
		phase,
		spadesShield,
		tavernDeck,
		discardPile,
		pendingDamage,
		jesterActive,
	} = gameState;
	const shieldCards = gameState.playedThisFight.filter(
		(c) => c.suit === "spades",
	);

	// Trilha do jogo dirigida por fase: derrota troca para a faixa "defeat".
	useEffect(() => {
		if (phase === "defeat") {
			playSoundtrack(
				require("@/assets/soundtrack/defeat.mp3") as import("expo-av").AVPlaybackSource,
				"defeat",
			);
		} else {
			playSoundtrack(
				require("@/assets/soundtrack/battle.mp3") as import("expo-av").AVPlaybackSource,
				"battle",
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phase]);

	const tavernRef = useRef<View>(null);
	const discardRef = useRef<View>(null);

	const [modalVisible, setModalVisible] = useState(false);
	const [settingsVisible, setSettingsVisible] = useState(false);
	const [logVisible, setLogVisible] = useState(false);
	const [confirmYieldVisible, setConfirmYieldVisible] = useState(false);
	const [statusBarHeight, setStatusBarHeight] = useState(0);
	const [centerLayout, setCenterLayout] = useState({ width: 0, height: 0 });

	const statusBarTop = Math.max(insets.top + 12, 50);
	const effectiveStatusBarHeight = statusBarHeight || 76;
	const centerTopPadding = statusBarTop + effectiveStatusBarHeight + 12;

	const handleStatusBarLayout = ({ nativeEvent }: LayoutChangeEvent) => {
		const nextHeight = Math.round(nativeEvent.layout.height);
		setStatusBarHeight((current) =>
			current === nextHeight ? current : nextHeight,
		);
	};

	const handleCenterLayout = ({ nativeEvent }: LayoutChangeEvent) => {
		const nextWidth = Math.round(nativeEvent.layout.width);
		const nextHeight = Math.round(nativeEvent.layout.height);
		setCenterLayout((current) =>
			current.width === nextWidth && current.height === nextHeight
				? current
				: { width: nextWidth, height: nextHeight },
		);
	};

	const {
		dealingIds,
		activeDeal,
		activeDiscard,
		activeShieldExit,
		activeEnemyCapture,
		hideShieldPile,
		actionLocked,
		setJesterAnimating,
		handlePlay,
		handleYield,
		handleConfirmDiscard,
		handleCardDealComplete,
		handleCardDiscardComplete,
		handleShieldFlightComplete,
		handleEnemyCaptureComplete,
		handleShieldPileMeasure,
		handleEnemyCardMeasure,
	} = useGameAnimations({
		tavernRef,
		discardRef,
		shieldCards,
		currentEnemy,
		currentHP,
		previewDamage,
		previewShieldGain,
		pendingDamage,
		selectedCards,
		selectedTotal,
		phase,
		isMyTurn,
		autoJesterPending,
		dealSignal,
		playerHand: gameState.playerHand,
		playSelected,
		confirmDiscard,
		yieldTurn,
	});

	const {
		isTutorial,
		step,
		advanceStep,
		exitTutorial,
		effectiveOnPlay,
		yieldBlocked,
	} = useTutorialFlow({
		phase,
		selectedIdsSize: selectedIds.size,
		handlePlay,
	});

	// Cálculo de fase para o SuitTracker — mesmo critério do CastleFooter
	const allEnemies = [...gameState.defeatedEnemies, ...gameState.castle];
	const defeatedIds = gameState.defeatedEnemies.map((e) => e.id);
	const jEnemies = allEnemies.filter((e) => e.rank === "J");
	const qEnemies = allEnemies.filter((e) => e.rank === "Q");
	const jAllDefeated =
		jEnemies.length > 0 && jEnemies.every((e) => defeatedIds.includes(e.id));
	const qAllDefeated =
		qEnemies.length > 0 && qEnemies.every((e) => defeatedIds.includes(e.id));
	const footerPhase = jAllDefeated ? (qAllDefeated ? "K" : "Q") : "J";
	const phaseEnemies = allEnemies.filter((e) => e.rank === footerPhase);
	const orderedPlayers =
		roomPlayers && playerOrder
			? [...roomPlayers].sort((left, right) => {
					const leftIndex = playerOrder.indexOf(left.id);
					const rightIndex = playerOrder.indexOf(right.id);
					return (
						(leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
						(rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex)
					);
				})
			: [];
	const activePlayerId = playerOrder?.[currentPlayerIndex ?? 0] ?? null;
	const showParticipantsSidebar = isTablet && orderedPlayers.length > 0;
	const { layout: enemyCardLayout, compactHand } = useEnemyCardScale({
		containerWidth: centerLayout.width,
		containerHeight: centerLayout.height,
		topReserved: centerTopPadding,
		horizontalPadding: screenPadding,
		widthReserve: showParticipantsSidebar ? 132 : 0,
	});

	if (phase === "victory")
		return <VictoryScreen onReset={resetGame} gameLog={gameLog} />;

	if (phase === "defeat" && currentEnemy) {
		return (
			<DefeatScreen
				enemy={currentEnemy}
				stats={gameState.stats}
				defeatedEnemies={gameState.defeatedEnemies}
				playerHand={gameState.playerHand}
				onReset={resetGame}
				gameLog={gameLog}
			/>
		);
	}

	return (
		<ImageBackground
			source={require("@/assets/backgrounds/bg_cave.webp")}
			style={styles.container}
			resizeMode="cover"
			imageStyle={{ width: "100%", height: "100%" }}
		>
			<View style={styles.overlay}>
				<View
					style={[
						styles.frame,
						{ maxWidth: contentMaxWidth },
						isDesktop && styles.frameDesktop,
					]}
				>
					<View
						style={[
							styles.statusBar,
							{ paddingHorizontal: screenPadding, top: statusBarTop },
						]}
						onLayout={handleStatusBarLayout}
					>
						<StatusCard
							count={gameState.castle.length}
							label={t("game.status.castle")}
						/>
						<View ref={tavernRef} collapsable={false}>
							<StatusCard
								count={tavernDeck.length}
								label={t("game.status.tavern")}
							/>
						</View>
						<View ref={discardRef} collapsable={false}>
							<StatusCard
								count={discardPile.length}
								label={t("game.status.discard")}
								faceCard={discardPile[discardPile.length - 1] ?? null}
							/>
						</View>
					</View>

					<View
						style={[
							styles.center,
							{
								paddingHorizontal: screenPadding,
								paddingTop: centerTopPadding,
							},
						]}
						onLayout={handleCenterLayout}
					>
						{(phase === "player_turn" || phase === "suffer_damage") &&
							currentEnemy && (
								<EnemyCard
									enemy={currentEnemy}
									currentHP={currentHP}
									effectiveAttack={effectiveAttack}
									jesterActive={jesterActive}
									spadesShield={spadesShield}
									shieldCards={shieldCards}
									jestersAvailable={gameState.jestersAvailable}
									jestersUsed={gameState.jestersUsed}
									autoJesterSignal={autoJesterSignal}
									hidden={activeEnemyCapture !== null}
									hideShieldPile={hideShieldPile}
									layout={enemyCardLayout}
									onCardMeasure={handleEnemyCardMeasure}
									onShieldPileMeasure={handleShieldPileMeasure}
									onUseJester={
										phase === "player_turn" && !actionLocked && isMyTurn
											? useJester
											: undefined
									}
									onAutoJesterComplete={completeAutoJesterAnimation}
									onJesterAnimationStateChange={setJesterAnimating}
									onPress={
										!actionLocked ? () => setModalVisible(true) : undefined
									}
									previewDamage={phase === "player_turn" ? previewDamage : 0}
									previewShieldGain={
										phase === "player_turn" ? previewShieldGain : 0
									}
								/>
							)}
					</View>

					{isTutorial && (
						<TutorialStepPanel
							step={step}
							onComplete={exitTutorial}
							onSkip={exitTutorial}
						/>
					)}

					{playError && <Text style={styles.error}>{playError}</Text>}

					{(phase === "player_turn" || phase === "suffer_damage") && (
						<View
							style={[styles.handSection, { paddingHorizontal: screenPadding }]}
						>
							<PlayerHand
								hand={gameState.playerHand}
								compactVerticalSpacing={compactHand}
								selectedIds={selectedIds}
								phase={phase}
								immuneSuit={jesterActive ? null : currentEnemy?.suit}
								dealingIds={dealingIds}
								activeDeal={activeDeal}
								activeDiscard={activeDiscard}
								locked={actionLocked}
								pendingDamage={pendingDamage}
								selectedTotal={selectedTotal}
								onCardPress={toggleCard}
								onDiscard={handleConfirmDiscard}
								onSort={sortHand}
								onSortByClass={sortHandByClass}
								onPlay={effectiveOnPlay}
								onYield={
									!yieldBlocked && isMyTurn && onAbandon
										? () => setConfirmYieldVisible(true)
										: undefined
								}
								playDisabled={selectedIds.size === 0 || !isMyTurn}
								waitingPlayedCards={!isMyTurn ? lastPlayedCards : undefined}
								onCardDealComplete={handleCardDealComplete}
								onCardDiscardComplete={handleCardDiscardComplete}
							/>
						</View>
					)}

					<SuitTracker
						enemies={phaseEnemies}
						defeatedIds={defeatedIds}
						currentSuit={currentEnemy?.suit ?? null}
					/>
					{showParticipantsSidebar && (
						<ParticipantsSidebar
							players={orderedPlayers}
							activePlayerId={activePlayerId}
							myPlayerId={myPlayerId}
						/>
					)}

					{/* LAYOUT_TEST: CastleFooter oculto — não deletar
					<CastleFooter
						castle={gameState.castle}
						defeatedEnemies={gameState.defeatedEnemies}
						currentEnemyId={currentEnemy?.id ?? ""}
					/>
					*/}
				</View>

				<ScreenHeader
					onSettingsPress={() => setSettingsVisible(true)}
					rightExtra={<GameLogButton onPress={() => setLogVisible(true)} />}
				/>
			</View>

			{activeShieldExit && (
				<CardFlightOverlay
					flights={activeShieldExit.flights}
					onFlightComplete={handleShieldFlightComplete}
				/>
			)}

			{activeEnemyCapture && (
				<EnemyCaptureOverlay
					capture={activeEnemyCapture}
					onCaptureComplete={handleEnemyCaptureComplete}
				/>
			)}

			{currentEnemy && (
				<EnemyModal
					enemy={currentEnemy}
					currentHP={currentHP}
					effectiveAttack={effectiveAttack}
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
				/>
			)}

			<SettingsDrawer
				visible={settingsVisible}
				onClose={() => setSettingsVisible(false)}
				onReset={resetGame}
				onAbandon={onAbandon}
			/>

			<ConfirmModal
				visible={confirmYieldVisible}
				title={t("game.confirmYield.title")}
				message={
					effectiveAttack > 0
						? t("game.confirmYield.bodyDamage", { damage: effectiveAttack })
						: t("game.confirmYield.body")
				}
				confirmLabel={t("game.confirmYield.confirm")}
				cancelLabel={t("game.confirmYield.cancel")}
				onConfirm={() => {
					setConfirmYieldVisible(false);
					handleYield();
				}}
				onCancel={() => setConfirmYieldVisible(false)}
			/>

			{isTutorial && step === "welcome" && (
				<TutorialWelcomeModal
					onStart={() => advanceStep("select_card")}
					onSkip={exitTutorial}
				/>
			)}

			{reveal && <TurnRevealOverlay reveal={reveal} />}

			<GameLogModal
				visible={logVisible}
				entries={gameLog}
				onClose={() => setLogVisible(false)}
			/>
		</ImageBackground>
	);
};
