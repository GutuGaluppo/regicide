export const ENEMY_NAMES: Record<string, string> = {
	"J-hearts": "Letholdus",
	"J-diamonds": "Kalannar",
	"J-clubs": "Tezfur",
	"J-spades": "Nobutada",
	"Q-hearts": "Catherine",
	"Q-diamonds": "Malice",
	"Q-clubs": "Hostla",
	"Q-spades": "Lilith",
	"K-hearts": "Edward",
	"K-diamonds": "Tathzaer",
	"K-clubs": "Fyrnod",
	"K-spades": "Vexx",
};

export const getEnemyName = (rank: string, suit: string): string =>
	ENEMY_NAMES[`${rank}-${suit}`] ?? `${rank} ${suit}`;
