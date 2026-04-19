const ptBR = {
	common: {
		attack: "Ataque",
		health: "Vida",
		newGame: "Novo jogo",
		back: "← Voltar",
		home: "← Início",
	},
	suits: {
		hearts: "Copas",
		diamonds: "Ouros",
		clubs: "Paus",
		spades: "Espadas",
	},
	suitLabels: {
		hearts: "♥ Copas",
		diamonds: "♦ Ouros",
		clubs: "♣ Paus",
		spades: "♠ Espadas",
	},
	suitPowers: {
		hearts: "Embaralha o descarte e adiciona N cartas no fundo da taverna.",
		diamonds: "Compra N cartas da taverna para a mão.",
		clubs: "Dobra o dano causado (×2).",
		spades: "Acumula N de escudo que reduz o ataque do inimigo.",
	},
	ranks: {
		J: "Valete",
		Q: "Rainha",
		K: "Rei",
	},
	action: {
		play: "Jogar",
		yield: "Ceder",
		discard: "Descartar ({{current}}/{{needed}})",
		discard_label: "Descartar",
		newGame: "Novo jogo",
	},
	hand: {
		title: "Mão ({{count}})",
		empty: "Mão vazia",
		sufferDiscard: "Selecione cartas para descartar",
		sort: "Ordenar",
		sortByClass: "Por Classe",
	},
	footer: {
		jacks: "Valetes",
		queens: "Rainhas",
		kings: "Reis",
	},
	game: {
		status: {
			castle: "Castelo",
			tavern: "Taverna",
			discard: "Descarte",
		},
		sufferDamage: "⚠️ Sofra {{damage}} de dano — descarte cartas suficientes",
		errors: {
			discardNotEnough:
				"Selecione cartas com valor total ≥ {{needed}} (atual: {{current}})",
		},
	},
	enemy: {
		attack: "Ataque",
		health: "Vida",
		suitPowers: "Poderes dos naipes",
		immune: "— Imune",
		immuneDesc: "Este inimigo ignora o poder deste naipe.",
	},
	classes: {
		hearts: {
			name: "Clérigo",
			lore: "Clérigos usam seu profundo conhecimento de cura e alquimia para criar poções e unguentos. Com a chegada da corrupção, seus serviços agora são necessários na linha de frente da batalha.",
		},
		diamonds: {
			name: "Bardo",
			lore: "Bardos são não apenas especialistas musicais, mas também líderes habilidosos. Suas habilidades únicas inspiram aqueles ao redor, garantindo que a linha de frente esteja sempre completa e preparada para o combate.",
		},
		clubs: {
			name: "Guerreiro",
			lore: "Desde as antigas guerras, Guerreiros aperfeiçoaram suas habilidades mesmo em tempos de paz. Agora que a luta recomeçou, eles avançam para a batalha ansiosos por desferir o primeiro e o último golpe.",
		},
		spades: {
			name: "Paladino",
			lore: "Paladinos atuam como guardas reais. São hábeis em dissuadir conflitos e em defender quando o confronto é inevitável. Suas habilidades defensivas serão cruciais nesta guerra.",
		},
		jester: {
			name: "Curinga",
			lore: "O Curinga não pertence a nenhuma classe. Sua presença caótica e imprevisível confunde o inimigo, anulando temporariamente qualquer imunidade que ele possua.",
		},
	},
	cardDetail: {
		value: "Valor: {{value}}",
		suitPower: "Poder do naipe",
		jesterTitle: "Curinga",
		jesterPower:
			"Cancela a imunidade do inimigo atual por um turno. Os poderes dos naipes continuam se aplicando normalmente.",
	},
	defeat: {
		message: "O reino caiu",
		newGame: "Novo jogo",
		stats: {
			time: "Tempo",
			turns: "Turnos",
			enemies: "Inimigos derrotados",
			discarded: "Descartadas",
			defeated: "Derrotado",
			discardPile: "🗑 Descarte",
			hand: "🃏 Mão disponível",
			noCards: "Nenhuma carta",
		},
	},
	settings: {
		title: "Configurações",
		music: "Música",
		sfx: "Efeitos sonoros",
		restart: "Reiniciar partida",
		exit: "Sair para o início",
	},
	victory: {
		title: "Vitória!",
		subtitle: "O reino foi salvo",
		playAgain: "Jogar novamente",
		home: "← Início",
	},
	tracker: {
		title: "Tracker",
		reset: "Reiniciar",
		dead: "HP zerado!",
		immune: "Imunidade — ",
		damage: "Dano: -{{value}}",
		confirmDefeat: "💀 Confirmar derrota",
		defeatEnemy: "Derrotar inimigo",
	},
	modal: {
		ok: "Entendido",
		immuneWarning: {
			title: "Inimigo imune!",
			body: "Este inimigo é imune ao poder deste naipe. O dano ainda é aplicado, mas o poder especial não tem efeito.",
		},
		hint: {
			title: "Dica",
			body: "Selecione um naipe e uma carta para atacar. Cartas de Paus dobram o dano, Copas curam o descarte, Ouros compram cartas e Espadas acumulam escudo.",
		},
	},
	home: {
		play: {
			title: "PLAY",
			desc: "Versão digital completa — deck, mão e poderes dos naipes",
		},
		tracker: {
			title: "TRACKER",
			desc: "Placar para o baralho físico — rastreie HP e ataque dos inimigos",
		},
		instructions: {
			title: "COMO JOGAR",
			desc: "Regras, poderes dos naipes e tabela dos nobres do castelo",
		},
	},
	instructions: {
		header: "Como Jogar",
		gameName: "REGICIDE",
		gameSubtitle: "Um jogo cooperativo para 1–4 jogadores",
		gameInfo: { players: "1–4", age: "10+", time: "20 min" },
		sections: {
			objective: {
				title: "Objetivo do Jogo",
				body: "Regicide é um jogo cooperativo em que os jogadores unem esforços para derrotar 12 poderosos inimigos. Os jogadores efetuam turnos em que usam cartas para atacar o inimigo e, assim que causam dano suficiente, este é derrotado. Os jogadores vencem quando o último Rei é derrotado. Mas cuidado! O inimigo contra-ataca em cada turno. Os jogadores terão de descartar cartas em função do dano sofrido e, caso não tenham cartas suficientes, todos perdem!",
			},
			setup: {
				title: "Preparação",
				body: "Mistura os 4 Reis (K) e coloca-os na mesa, numa pilha com a face para baixo. Mistura as 4 Damas (Q) e coloca-as sobre os Reis. Mistura os 4 Valetes (J) e coloca-os sobre as Damas. Este é o Baralho Castelo. Coloca-o no centro da mesa e revela o Valete superior — este será o inimigo atual.\n\nMistura, em conjunto, todas as cartas numeradas de 2 a 10, os 4 Animais Companheiros (A) e um número de Joqueres (Curingas) conforme a tabela abaixo, para formar o Baralho Taverna.",
				tableHeader: { players: "Jogadores", jesters: "Joqueres", hand: "Máx. de Mão" },
				tableRows: [
					{ players: "1", jesters: "0", hand: "8" },
					{ players: "2", jesters: "0", hand: "7" },
					{ players: "3", jesters: "1", hand: "6" },
					{ players: "4", jesters: "2", hand: "5" },
				],
				startNote: "Começa o jogador que mais recentemente cometeu regicídio.",
			},
			howToPlay: {
				title: "Como Jogar",
				intro: "No seu turno, um jogador usa cartas da sua mão para infligir dano no inimigo atual, tentando derrotá-lo. Os valores das cartas determinam o dano, enquanto o naipe confere um poder especial.",
				stepsLabel: "Cada turno tem quatro passos:",
				steps: [
					"Passo 1 — Joga uma carta ou passa",
					"Passo 2 — Ativa o poder do naipe",
					"Passo 3 — Causa dano ao inimigo e verifica",
					"Passo 4 — Recebe dano do inimigo",
				],
			},
			step1: {
				title: "Passo 1 — Jogar",
				subtitle: "Joga uma carta da mão para atacar o inimigo",
				body: "Coloca uma carta da tua mão na mesa, à tua frente. O número da carta determina o valor de ataque. Assim, se jogas o 7 de Copas, o valor de ataque é 7. Em vez de jogar uma carta, podes escolher passar (ver Passar mais abaixo).",
			},
			step2: {
				title: "Passo 2 — Poderes dos Naipes",
				subtitle: "Ativa o poder do naipe da carta jogada",
				intro: "Usar uma carta para causar dano no inimigo também confere um poder associado ao naipe dessa carta. Os poderes dos naipes vermelhos (♥ ♦) são resolvidos imediatamente; os dos naipes pretos (♣ ♠) têm efeito em passos seguintes.",
				suits: {
					hearts: {
						name: "COPAS",
						body: "Curar a partir do descarte: mistura a pilha de descarte e depois separa, com a face para baixo, um número de cartas igual ao valor do ataque. Coloca-as debaixo do Baralho Taverna. Volta a colocar a pilha de descarte na mesa, com a face para cima.",
					},
					diamonds: {
						name: "OUROS",
						body: "Receber cartas: o jogador corrente recebe uma carta. Seguem-se os restantes jogadores, no sentido dos ponteiros do relógio, tirando uma carta à vez, até ser retirado um número de cartas igual ao valor do ataque. Os jogadores não podem receber cartas acima do seu tamanho máximo de mão.",
					},
					clubs: {
						name: "PAUS",
						body: "Dano duplo: durante o Passo 3, o dano causado por Paus conta a dobrar. P. ex.: o 8 de Paus causa 16 de dano.",
					},
					spades: {
						name: "ESPADAS",
						body: "Proteção contra um ataque inimigo: durante o Passo 4, reduz o valor de ataque do inimigo atual pelo valor de ataque jogado. O valor de proteção de todas as Espadas jogadas contra este inimigo, por qualquer jogador, é cumulativo e permanece em efeito até ao inimigo ser derrotado.",
					},
				},
				note: "Os poderes dos naipes são obrigatórios e não podem ser desconsiderados.",
			},
			step3: {
				title: "Passo 3 — Dano e Derrota",
				subtitle: "Causa dano ao inimigo e verifica se foi derrotado",
				body: "O dano infligido ao inimigo é igual ao valor de ataque da carta usada. Verifica se o dano total infligido até agora, por todos os jogadores, é maior ou igual à vitalidade do inimigo.",
				enemyHeader: { enemy: "Inimigo", atk: "Ataque", hp: "Vitalidade" },
				enemyRows: [
					{ enemy: "Valete", atk: "10", hp: "20" },
					{ enemy: "Rainha", atk: "15", hp: "30" },
					{ enemy: "Rei", atk: "20", hp: "40" },
				],
				defeatTitle: "Se o inimigo é derrotado, faz o seguinte:",
				defeatSteps: [
					"Coloca o inimigo na pilha de descarte. Caso o dano seja exatamente igual à vitalidade, coloca-o no topo do Baralho Taverna, com a face para baixo.",
					"Coloca na pilha de descarte todas as cartas usadas pelos jogadores contra o inimigo.",
					"Revela a carta seguinte do Baralho Castelo, virando-a.",
					"O jogador que acabou de derrotar o inimigo salta o Passo 4 e inicia um novo turno contra o inimigo agora revelado, voltando ao Passo 1.",
				],
			},
			step4: {
				title: "Passo 4 — Sofrer Dano",
				subtitle: "Recebe dano causado pelo inimigo, descartando cartas",
				body: "Se o inimigo não foi derrotado, ataca o jogador atual causando dano igual ao seu valor de ataque — não te esqueças de reduzir pelo valor de todas as Espadas jogadas pelos jogadores. O jogador deve descartar cartas que totalizem um valor pelo menos igual ao dano. Ao descartar, os Animais Companheiros (A) valem 1 e o Jóquer vale 0. Se o jogador não tem cartas suficientes para descartar, todos perdem o jogo.\n\nDepois de sofrer o dano, o próximo jogador, no sentido dos ponteiros do relógio, inicia um novo turno, voltando ao Passo 1.",
			},
			companions: {
				title: "Animais Companheiros",
				body: "No Passo 1, os Animais Companheiros (Ás) podem ser usados isoladamente ou emparelhados com outra carta (exceto o Jóquer). Contam como 1 para o valor total de ataque e o poder do seu naipe aplica-se normalmente. Também podem emparelhar com outro Animal Companheiro. Se jogares um Animal Companheiro com outra carta do mesmo naipe, o poder aplica-se apenas uma vez.",
			},
			combos: {
				title: "Combinações",
				body: "No Passo 1, é possível combinar cartas com o mesmo número, em conjuntos de 2, 3 ou 4, desde que o valor total das cartas usadas seja 10 ou inferior. Os Animais Companheiros não podem ser adicionados a uma combinação. Assim, os jogadores podem jogar pares de 2–5, trios de 2–3, ou uma quadra de 2. Todos os poderes são resolvidos com base no valor total de ataque.",
			},
			immunity: {
				title: "Imunidade Inimiga",
				body: "Cada inimigo é imune aos poderes dos naipes de cartas jogadas contra ele que sejam idênticos ao seu naipe. Por isso, os jogadores não recebem cartas quando Ouros são jogados contra o Valete de Ouros — no entanto, o seu valor conta para causar dano. O Jóquer pode ser usado para anular a imunidade de um inimigo.",
			},
			jester: {
				title: "Usando o Jóquer (Curinga)",
				body: "No Passo 1, pode jogar-se o Jóquer (sempre sozinho). O Jóquer tem um valor de ataque de 0 e o seu poder é anular a imunidade do inimigo, fazendo com que o poder do naipe igual ao naipe do inimigo se aplique normalmente. Depois de jogar o Jóquer, saltam-se os Passos 3 e 4; em lugar de passar o turno ao jogador seguinte, aquele que usou o Jóquer escolhe livremente quem será o próximo jogador.",
				note: "Depois de jogar o Jóquer, as restrições de comunicação são temporariamente levantadas até o próximo jogador iniciar o seu turno. Os jogadores podem exprimir o desejo de ir numa determinada direção, mas não podem revelar o conteúdo da mão.",
			},
			defeatedEnemy: {
				title: "Aproveitando Inimigos Derrotados",
				body: "Nobres derrotados na mão contam com os valores abaixo, tanto para atacar como para descartar ao sofrer dano. Quando usados, o poder do naipe aplica-se normalmente.",
				tableRows: [
					{ rank: "J", label: "Valete", value: "10" },
					{ rank: "Q", label: "Rainha", value: "15" },
					{ rank: "K", label: "Rei", value: "20" },
				],
			},
			pass: {
				title: "Passar",
				body: "Durante o Passo 1 pode ser vantajoso passar, em vez de jogar uma carta. Diz simplesmente \"Passo\" e vai diretamente para o Passo 4 (Sofrer dano do inimigo), saltando os Passos 2 e 3. Um jogador não pode passar se todos os outros jogadores passaram no seu último turno.",
			},
			communication: {
				title: "Comunicação",
				body: "Os jogadores não podem comunicar entre si qualquer informação que possa revelar ou sugerir o conteúdo das suas mãos. Podem, no entanto, lembrar outros jogadores de qualquer informação pública.",
				allowed: "Permitido: \"Tenho duas cartas na mão\" · \"Sobram 3 cartas no Baralho Taverna!\"",
				forbidden: "Proibido: \"Tenho um 10 de Paus\" · \"Espero que alguém jogue Ouros em breve!\"",
			},
			endConditions: {
				title: "Final do Jogo",
				body: "A partida termina com a vitória dos jogadores quando derrotam o último Rei, ou com a derrota dos jogadores quando um jogador não consegue resolver o dano causado por um inimigo. Os jogadores perdem também quando um jogador não pode jogar uma carta ou passar no seu turno.",
				victoryTitle: "Vitória 👑",
				victoryText: "Derrote todos os 12 nobres do Castelo.",
				defeatTitle: "Derrota 💀",
				defeatText: "Um jogador não consegue descartar cartas suficientes para cobrir o dano sofrido, ou precisa jogar uma carta e não tem nenhuma na mão.",
			},
			solo: {
				title: "Jogo Solo",
				body: "Para uma partida com um único jogador, coloca os dois Joqueres (Curingas) de lado. Jogas com uma única mão, limitada a 8 cartas. Podes virar um Jóquer para descartar a tua mão e repor 8 cartas (não conta como compra para efeito da imunidade a Ouros). Podes fazer isto no início do Passo 1, antes de jogares uma carta, ou no início do Passo 4, antes de receberes dano. Esta ação não anula a imunidade do inimigo.",
				tiersLabel: "Categorias de vitória:",
				tiers: [
					{ label: "2 Joqueres usados", value: "🥉 Vitória de Bronze" },
					{ label: "1 Jóquer usado", value: "🥈 Vitória de Prata" },
					{ label: "0 Joqueres usados", value: "🥇 Vitória de Ouro" },
				],
			},
		},
	},
};

export default ptBR;
export type Translations = typeof ptBR;
