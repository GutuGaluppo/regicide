import { resolveEnemyCardScale } from "@/hooks/useEnemyCardScale";

/** Altura devolvida ao centro quando a mão entra em espaçamento compacto. */
const RECLAIMED = 30;

/**
 * Simula o ciclo real de layout: o centro é medido, a medição decide se a mão
 * compacta, e a mão compacta devolve altura ao centro — que é medido de novo.
 * Retorna os estados visitados a partir de `compactHand: false`.
 */
const runLayoutLoop = (baseCenterHeight: number, steps = 8) => {
	let compactHand = false;
	const states: { compactHand: boolean; scale: number }[] = [];

	for (let i = 0; i < steps; i++) {
		// Com a mão compacta o centro medido é maior — a realimentação do bug.
		const containerHeight = baseCenterHeight + (compactHand ? RECLAIMED : 0);

		const { scale, nextCompactHand } = resolveEnemyCardScale({
			containerWidth: 800,
			containerHeight,
			topReserved: 0,
			bottomGap: 0,
			widthGap: 0,
			compactReclaimedHeight: RECLAIMED,
			compactHand,
		});

		states.push({ compactHand, scale });
		compactHand = nextCompactHand;
	}

	return states;
};

const isSettled = (states: { compactHand: boolean; scale: number }[]) => {
	const tail = states.slice(-3);
	return tail.every(
		(state) =>
			state.compactHand === tail[0].compactHand && state.scale === tail[0].scale,
	);
};

describe("resolveEnemyCardScale", () => {
	it("estabiliza a compacidade em telas altas (mão com espaçamento normal)", () => {
		const states = runLayoutLoop(400);

		expect(isSettled(states)).toBe(true);
		expect(states[states.length - 1].compactHand).toBe(false);
	});

	it("estabiliza a compacidade em telas baixas (mão compacta)", () => {
		const states = runLayoutLoop(200);

		expect(isSettled(states)).toBe(true);
		expect(states[states.length - 1].compactHand).toBe(true);
	});

	// Faixa em que a altura devolvida pela mão compacta cruza o limiar: era aqui
	// que o inimigo alternava de escala a cada frame.
	it.each([258, 265, 270, 280, 287])(
		"não oscila na faixa limítrofe (centro base de %ipx)",
		(baseCenterHeight) => {
			const states = runLayoutLoop(baseCenterHeight);

			expect(isSettled(states)).toBe(true);
			expect(states[states.length - 1].compactHand).toBe(true);
		},
	);
});
