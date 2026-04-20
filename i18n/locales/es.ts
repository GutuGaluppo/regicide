import type { Translations } from "./pt-BR";

const es: Translations = {
	common: {
		attack: "Ataque",
		health: "Vida",
		newGame: "Nueva partida",
		back: "← Volver",
		home: "← Inicio",
	},
	suits: {
		hearts: "Corazones",
		diamonds: "Diamantes",
		clubs: "Tréboles",
		spades: "Picas",
	},
	suitLabels: {
		hearts: "♥ Corazones",
		diamonds: "♦ Diamantes",
		clubs: "♣ Tréboles",
		spades: "♠ Picas",
	},
	suitPowers: {
		hearts: "Baraja el descarte y añade N cartas al fondo de la taberna.",
		diamonds: "Roba N cartas de la taberna a tu mano.",
		clubs: "Dobla el daño causado (×2).",
		spades: "Acumula N de escudo que reduce el ataque del enemigo.",
	},
	ranks: {
		J: "Sota",
		Q: "Reina",
		K: "Rey",
	},
	action: {
		play: "Jugar",
		yield: "Ceder",
		discard: "Descartar ({{current}}/{{needed}})",
		discard_label: "Descartar",
		newGame: "Nueva partida",
	},
	hand: {
		title: "Mano ({{count}})",
		empty: "Mano vacía",
		sufferDiscard: "Selecciona cartas para descartar",
		sort: "Ordenar",
		sortByClass: "Por Palo",
	},
	footer: {
		jacks: "Sotas",
		queens: "Reinas",
		kings: "Reyes",
	},
	game: {
		status: {
			castle: "Castillo",
			tavern: "Taberna",
			discard: "Descarte",
		},
		sufferDamage: "⚠️ Sufre {{damage}} de daño — descarta cartas suficientes",
		errors: {
			discardNotEnough:
				"Selecciona cartas con valor total ≥ {{needed}} (actual: {{current}})",
		},
	},
	enemy: {
		attack: "Ataque",
		health: "Vida",
		suitPowers: "Poderes de palos",
		immune: "— Inmune",
		immuneDesc: "Este enemigo ignora el poder de este palo.",
	},
	classes: {
		hearts: {
			name: "Clérigo",
			lore: "Los Clérigos usan su profundo conocimiento de curación y alquimia para crear pociones y ungüentos. Con la llegada de la corrupción, sus servicios ahora son necesarios en las líneas de batalla.",
		},
		diamonds: {
			name: "Bardo",
			lore: "Los Bardos no son solo expertos musicales, sino también líderes hábiles. Sus habilidades únicas inspiran a los que les rodean, garantizando que el frente de batalla siempre esté completo y preparado.",
		},
		clubs: {
			name: "Guerrero",
			lore: "Desde las guerras antiguas, los Guerreros han perfeccionado sus habilidades incluso en tiempos de paz. Ahora que la lucha ha vuelto a comenzar, se lanzan ansiosamente a la batalla.",
		},
		spades: {
			name: "Paladín",
			lore: "Los Paladines actúan como guardias reales. Son hábiles para disuadir conflictos y defenderse cuando el enfrentamiento es inevitable. Sus habilidades defensivas serán cruciales en esta guerra.",
		},
		jester: {
			name: "Comodín",
			lore: "El Comodín no pertenece a ninguna clase. Su presencia caótica e impredecible confunde al enemigo, anulando temporalmente cualquier inmunidad que posea.",
		},
	},
	cardDetail: {
		value: "Valor: {{value}}",
		suitPower: "Poder del palo",
		jesterTitle: "Comodín",
		jesterPower:
			"Cancela la inmunidad del enemigo actual durante un turno. Los poderes de palo siguen aplicándose normalmente.",
	},
	defeat: {
		message: "El reino ha caído",
		newGame: "Nueva partida",
		stats: {
			time: "Tiempo",
			turns: "Turnos",
			enemies: "Enemigos derrotados",
			discarded: "Descartadas",
			defeated: "Derrotado",
			discardPile: "🗑 Descarte",
			hand: "🃏 Mano disponible",
			noCards: "Sin cartas",
		},
	},
	settings: {
		title: "Configuración",
		music: "Música",
		sfx: "Efectos de sonido",
		restart: "Reiniciar partida",
		exit: "Salir al inicio",
	},
	victory: {
		title: "¡Victoria!",
		subtitle: "El reino está a salvo",
		playAgain: "Jugar de nuevo",
		home: "← Inicio",
	},
	tracker: {
		title: "Marcador",
		reset: "Reiniciar",
		dead: "¡HP a cero!",
		immune: "Inmunidad — ",
		damage: "Daño: -{{value}}",
		confirmDefeat: "💀 Confirmar derrota",
		defeatEnemy: "Derrotar enemigo",
	},
	modal: {
		ok: "Entendido",
		immuneWarning: {
			title: "¡Enemigo inmune!",
			body: "Este enemigo es inmune al poder de este palo. El daño se aplica igual, pero el poder especial no tiene efecto.",
		},
		hint: {
			title: "Pista",
			body: "Selecciona un palo y una carta para atacar. Tréboles duplican el daño, Corazones curan el descarte, Diamantes roban cartas y Picas acumulan escudo.",
		},
	},
	home: {
		play: {
			title: "JUGAR",
			desc: "Versión digital completa — mazo, mano y poderes de palos",
		},
		tracker: {
			title: "MARCADOR",
			desc: "Marcador para el mazo físico — rastrea HP y ataque de enemigos",
		},
		instructions: {
			title: "CÓMO JUGAR",
			desc: "Reglas, poderes de palos y tabla de nobles del castillo",
		},
	},
	instructions: {
		header: "Cómo Jugar",
		gameName: "REGICIDE",
		gameSubtitle: "Un juego cooperativo para 1–4 jugadores",
		gameInfo: { players: "1–4", age: "10+", time: "20 min" },
		sections: {
			objective: {
				title: "Objetivo del Juego",
				body: "Regicide es un juego cooperativo en el que los jugadores unen fuerzas para derrotar a 12 poderosos enemigos. Los jugadores usan cartas en sus turnos para atacar al enemigo y, una vez causado suficiente daño, el enemigo es derrotado. Los jugadores ganan cuando el último Rey cae. ¡Pero cuidado! El enemigo contraataca cada turno. Los jugadores deben descartar cartas para absorber el daño — si se quedan sin cartas, ¡todos pierden!",
			},
			setup: {
				title: "Preparación",
				body: "Baraja los 4 Reyes (K) y colócalos boca abajo sobre la mesa. Baraja las 4 Reinas (Q) y colócalas encima. Baraja las 4 Sotas (J) y colócalas encima. Este es el Mazo Castillo. Ponlo en el centro de la mesa y revela la Sota superior — este será el enemigo actual.\n\nBaraja juntas todas las cartas numéricas (2–10), los 4 Animales Compañeros (A) y un número de Comodines según la tabla para formar el Mazo Taberna.",
				tableHeader: {
					players: "Jugadores",
					jesters: "Comodines",
					hand: "Máx. mano",
				},
				tableRows: [
					{ players: "1", jesters: "0", hand: "8" },
					{ players: "2", jesters: "0", hand: "7" },
					{ players: "3", jesters: "1", hand: "6" },
					{ players: "4", jesters: "2", hand: "5" },
				],
				startNote:
					"Empieza el jugador que más recientemente cometió regicidio.",
			},
			howToPlay: {
				title: "Cómo Jugar",
				intro:
					"En tu turno, usas cartas de tu mano para infligir daño al enemigo actual, intentando derrotarlo. Los valores de las cartas determinan el daño, mientras que el palo otorga un poder especial.",
				stepsLabel: "Cada turno tiene cuatro pasos:",
				steps: [
					"Paso 1 — Juega una carta o pasa",
					"Paso 2 — Activa el poder del palo",
					"Paso 3 — Causa daño al enemigo y comprueba",
					"Paso 4 — Recibe daño del enemigo",
				],
			},
			step1: {
				title: "Paso 1 — Jugar",
				subtitle: "Juega una carta de tu mano para atacar al enemigo",
				body: "Coloca una carta de tu mano sobre la mesa frente a ti. El número de la carta determina el valor de ataque — p. ej., el 7 de Corazones causa 7 de daño. En lugar de jugar una carta, puedes elegir pasar (ver Pasar más adelante).",
			},
			step2: {
				title: "Paso 2 — Poderes de los Palos",
				subtitle: "Activa el poder del palo de la carta jugada",
				intro:
					"Usar una carta para causar daño también otorga un poder asociado a su palo. Los poderes de palos rojos (♥ ♦) se resuelven inmediatamente; los de palos negros (♣ ♠) surten efecto en pasos posteriores.",
				suits: {
					hearts: {
						name: "CORAZONES",
						body: "Curar del descarte: baraja la pila de descarte, aparta boca abajo un número de cartas igual al valor de ataque y colócalas debajo del Mazo Taberna. Vuelve a poner el descarte sobre la mesa boca arriba.",
					},
					diamonds: {
						name: "DIAMANTES",
						body: "Robar cartas: el jugador actual roba una carta. Los demás jugadores siguen en el sentido de las agujas del reloj, robando una carta cada vez, hasta que se hayan robado tantas cartas como el valor de ataque. Los jugadores no pueden superar su tamaño máximo de mano.",
					},
					clubs: {
						name: "TRÉBOLES",
						body: "Daño doble: durante el Paso 3, el daño causado por Tréboles cuenta el doble. P. ej.: el 8 de Tréboles causa 16 de daño.",
					},
					spades: {
						name: "PICAS",
						body: "Escudo: durante el Paso 4, reduce el valor de ataque del enemigo actual por el valor de ataque jugado. El escudo de todas las Picas jugadas contra este enemigo por cualquier jugador es acumulativo y permanece hasta que el enemigo sea derrotado.",
					},
				},
				note: "Los poderes de los palos son obligatorios y no pueden ignorarse.",
			},
			step3: {
				title: "Paso 3 — Daño y Derrota",
				subtitle: "Causa daño al enemigo y comprueba si ha sido derrotado",
				body: "El daño infligido al enemigo es igual al valor de ataque de la carta jugada. Comprueba si el daño total causado hasta ahora por todos los jugadores es mayor o igual a la vitalidad del enemigo.",
				enemyHeader: { enemy: "Enemigo", atk: "Ataque", hp: "Vitalidad" },
				enemyRows: [
					{ enemy: "Sota", atk: "10", hp: "20" },
					{ enemy: "Reina", atk: "15", hp: "30" },
					{ enemy: "Rey", atk: "20", hp: "40" },
				],
				defeatTitle: "Si el enemigo es derrotado, haz lo siguiente:",
				defeatSteps: [
					"Coloca al enemigo en el descarte. Si el daño es exactamente igual a la vitalidad, colócalo boca abajo en la parte superior del Mazo Taberna.",
					"Coloca en el descarte todas las cartas jugadas por los jugadores contra el enemigo.",
					"Revela la siguiente carta del Mazo Castillo, girándola.",
					"El jugador que acaba de derrotar al enemigo se salta el Paso 4 e inicia un nuevo turno contra el enemigo recién revelado, volviendo al Paso 1.",
				],
			},
			step4: {
				title: "Paso 4 — Sufrir Daño",
				subtitle: "Recibe daño del enemigo descartando cartas",
				body: "Si el enemigo no fue derrotado, ataca al jugador actual causando daño igual a su valor de ataque — reducido por el escudo total de Picas. El jugador debe descartar cartas cuyo valor total sea al menos igual al daño. Al descartar, los Animales Compañeros (A) valen 1 y el Comodín vale 0. Si el jugador no tiene cartas suficientes, todos los jugadores pierden.\n\nTras sufrir el daño, el siguiente jugador en el sentido de las agujas del reloj inicia un nuevo turno, volviendo al Paso 1.",
			},
			companions: {
				title: "Animales Compañeros",
				body: "En el Paso 1, los Animales Compañeros (Ases) pueden jugarse solos o en pareja con otra carta (excepto el Comodín). Cuentan como 1 en el valor total de ataque y su poder de palo se aplica normalmente. También pueden emparejarse con otro Animal Compañero. Si juegas un Animal Compañero con otra carta del mismo palo, el poder se aplica una sola vez.",
			},
			combos: {
				title: "Combinaciones",
				body: "En el Paso 1, puedes combinar cartas del mismo número en grupos de 2, 3 o 4, siempre que el valor total no supere 10. Los Animales Compañeros no pueden añadirse a una combinación. Los jugadores pueden jugar pares de 2–5, tríos de 2–3 o un póker de 2. Todos los poderes se resuelven según el valor total de ataque.",
			},
			immunity: {
				title: "Inmunidad Enemiga",
				body: "Cada enemigo es inmune al poder del palo de las cartas jugadas contra él que coincidan con su propio palo. Los jugadores no roban cartas cuando se juegan Diamantes contra la Sota de Diamantes — sin embargo, su valor sí cuenta para el daño. El Comodín puede usarse para cancelar la inmunidad de un enemigo.",
			},
			jester: {
				title: "Usando el Comodín",
				body: "En el Paso 1, el Comodín puede jugarse solo. Tiene un valor de ataque de 0 y su poder es cancelar la inmunidad del enemigo, haciendo que el poder del palo coincidente con el enemigo se aplique normalmente. Tras jugar el Comodín, se saltan los Pasos 3 y 4; en lugar de pasar al siguiente jugador, quien jugó el Comodín elige libremente quién juega a continuación.",
				note: "Tras jugar el Comodín, las restricciones de comunicación se levantan temporalmente hasta que el siguiente jugador inicie su turno. Los jugadores pueden expresar una dirección general, pero no pueden revelar el contenido de su mano.",
			},
			defeatedEnemy: {
				title: "Aprovechando Enemigos Derrotados",
				body: "Los nobles derrotados en mano cuentan con los valores siguientes, tanto para atacar como para descartar al sufrir daño. Cuando se usan, el poder del palo se aplica normalmente.",
				tableRows: [
					{ rank: "J", label: "Sota", value: "10" },
					{ rank: "Q", label: "Reina", value: "15" },
					{ rank: "K", label: "Rey", value: "20" },
				],
			},
			pass: {
				title: "Pasar",
				body: 'Durante el Paso 1, puede ser ventajoso pasar en lugar de jugar una carta. Di simplemente "Paso" y ve directamente al Paso 4, saltándote los Pasos 2 y 3. Un jugador no puede pasar si todos los demás jugadores pasaron en su último turno.',
			},
			communication: {
				title: "Comunicación",
				body: "Los jugadores no pueden comunicar ninguna información que pueda revelar o sugerir el contenido de sus manos. Sin embargo, pueden recordar a otros jugadores cualquier información pública.",
				allowed:
					'Permitido: "Tengo dos cartas en mano" · "¡Quedan 3 cartas en la Taberna!"',
				forbidden:
					'Prohibido: "Tengo el 10 de Tréboles" · "¡Espero que alguien juegue Diamantes pronto!"',
			},
			endConditions: {
				title: "Final del Juego",
				body: "La partida termina en victoria cuando todos los Reyes son derrotados, o en derrota cuando un jugador no puede resolver el daño causado por un enemigo. Los jugadores también pierden cuando un jugador no puede jugar una carta ni pasar en su turno.",
				victoryTitle: "Victoria",
				victoryText: "Derrota a los 12 nobles del Castillo.",
				defeatTitle: "Derrota",
				defeatText:
					"Un jugador no puede descartar cartas suficientes para cubrir el daño sufrido, o necesita jugar una carta y no tiene ninguna en la mano.",
			},
			solo: {
				title: "Juego en Solitario",
				body: "Para una partida de un solo jugador, aparta los dos Comodines. Juegas con una sola mano limitada a 8 cartas. Puedes girar un Comodín para descartar tu mano y reponer 8 cartas (no cuenta como robo a efectos de la inmunidad a Diamantes). Puedes hacerlo al inicio del Paso 1 antes de jugar una carta, o al inicio del Paso 4 antes de sufrir daño. Esta acción no cancela la inmunidad del enemigo.",
				tiersLabel: "Categorías de victoria:",
				tiers: [
					{ label: "2 Comodines usados", value: "🥉 Victoria de Bronce" },
					{ label: "1 Comodín usado", value: "🥈 Victoria de Plata" },
					{ label: "0 Comodines usados", value: "🥇 Victoria de Oro" },
				],
			},
		},
	},
};

export default es;
