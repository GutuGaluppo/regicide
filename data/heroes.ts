// /data/heroes.ts
// Hero names per rank and suit, sourced from official card art.
import { CardRank, Suit } from "./types";

export const HERO_NAMES: Partial<Record<CardRank, Partial<Record<Suit, string>>>> = {
	A:   { hearts: "Fennec",    diamonds: "Duck",      clubs: "Badger",   spades: "Pangolin" },
	"2": { hearts: "Sprinkle",  diamonds: "Tali",      clubs: "Dinky",    spades: "Wicket"   },
	"3": { hearts: "Arabella",  diamonds: "River",     clubs: "Theodric", spades: "Fulrad"   },
	"4": { hearts: "Krozzurum", diamonds: "Glamelyn",  clubs: "Herbod",   spades: "Dhonatir" },
	"5": { hearts: "Puriri",    diamonds: "Kowhai",    clubs: "Kauri",    spades: "Totara"   },
	"6": { hearts: "James",     diamonds: "Jakhim",    clubs: "Esme",     spades: "Lee"      },
	"7": { hearts: "Elashor",   diamonds: "Folred",    clubs: "Yrneha",   spades: "Tanathil" },
	"8": { hearts: "Bronze",    diamonds: "Snow",      clubs: "Shadow",   spades: "Bite"     },
	"9": { hearts: "Eragar",    diamonds: "Elkoshoth", clubs: "Qelgrax",  spades: "Belroth"  },
	"10":{ hearts: "Kazaghan",  diamonds: "Gad",       clubs: "Oneria",   spades: "Vegarian" },
};

export const getHeroName = (rank: CardRank, suit: Suit | null): string | null => {
	if (!suit) return null;
	return HERO_NAMES[rank]?.[suit] ?? null;
};
