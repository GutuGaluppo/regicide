import { TUTORIAL_STEPS, canGoBackAt } from "@/hooks/useTutorialFlow";

const indexOf = (id: string) => TUTORIAL_STEPS.findIndex((step) => step.id === id);

describe("canGoBackAt", () => {
	it("não oferece voltar no primeiro passo", () => {
		expect(canGoBackAt(0)).toBe(false);
	});

	it("permite revisar os passos informativos", () => {
		const informative = TUTORIAL_STEPS.map((step, index) => ({ step, index })).filter(
			({ step, index }) => index > 0 && step.advance === "next",
		);

		// Todo passo informativo depois do primeiro é precedido por outro informativo,
		// exceto os que vêm logo após a prática (ex.: "complete").
		expect(informative.length).toBeGreaterThan(1);
		expect(canGoBackAt(indexOf("enemy_immunity"))).toBe(true);
		expect(canGoBackAt(indexOf("skip_info"))).toBe(true);
	});

	it("permite voltar do primeiro passo prático, cujo anterior ainda é informativo", () => {
		expect(canGoBackAt(indexOf("select_card"))).toBe(true);
	});

	// Abrir o detalhe de uma carta não muda o estado do jogo: dá para refazer.
	it("permite voltar para o passo do clique longo", () => {
		expect(canGoBackAt(indexOf("card_detail") + 1)).toBe(true);
		expect(canGoBackAt(indexOf("card_detail"))).toBe(true);
	});

	it.each(["attack", "defend", "complete"])(
		"bloqueia voltar em %s — o passo anterior consome estado do jogo",
		(id) => {
			expect(canGoBackAt(indexOf(id))).toBe(false);
		},
	);
});

describe("TUTORIAL_STEPS", () => {
	it("tem o clique longo como único passo interativo antes da prática", () => {
		const interactiveBeforePractice = TUTORIAL_STEPS.slice(
			0,
			indexOf("select_card"),
		)
			.filter((step) => step.advance !== "next")
			.map((step) => step.id);

		expect(interactiveBeforePractice).toEqual(["card_detail"]);
	});

	it("destaca a mão no passo do clique longo", () => {
		expect(TUTORIAL_STEPS[indexOf("card_detail")].targetId).toBe("tutorial-hand");
	});
});
