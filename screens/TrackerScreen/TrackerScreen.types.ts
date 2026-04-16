export type ScreenState =
	| "ENEMY_SELECTION"
	| "IN_COMBAT"
	| "ENEMY_DEFEATED_TRANSITION";

export type ModalState =
	| null
	| "ENEMY_DETAILS"
	| "HINT"
	| "IMMUNE_WARNING";
