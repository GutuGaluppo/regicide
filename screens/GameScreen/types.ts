import { CardFlight } from "@/components/CardFlightOverlay/CardFlightOverlay";
import { EnemyCaptureFlight } from "@/components/EnemyCaptureOverlay/EnemyCaptureOverlay";
import { Card, Enemy } from "@/data/types";

export type ScreenRect = { x: number; y: number; w: number; h: number };

export type ActiveDeal = {
	id: number;
	source: ScreenRect;
	orderById: Map<string, number>;
};

export type ActiveDiscard = {
	id: number;
	flightById: Map<string, { order: number; dest: ScreenRect }>;
};

export type PendingEnemyCapture = {
	enemy: Enemy;
	card: Card;
	destination: "tavern" | "discard";
};

export type PendingAction = {
	id: number;
	kind: "play" | "discard";
	awaitShieldExit: boolean;
	incomingShieldCards: Card[];
	enemyCapture: PendingEnemyCapture | null;
};

export type ActiveShieldExit = {
	id: number;
	flights: CardFlight[];
};

export type ActiveEnemyCapture = EnemyCaptureFlight;
