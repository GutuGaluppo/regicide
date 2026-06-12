import { getHpColor } from "@/utils/hpColor";

describe("getHpColor", () => {
	it("is green above 50%", () => {
		expect(getHpColor(1)).toBe("#22C55E");
		expect(getHpColor(0.51)).toBe("#22C55E");
	});

	it("is yellow in the (25%, 50%] band", () => {
		expect(getHpColor(0.5)).toBe("#FBBF24");
		expect(getHpColor(0.26)).toBe("#FBBF24");
	});

	it("is red at or below 25%", () => {
		expect(getHpColor(0.25)).toBe("#EF4444");
		expect(getHpColor(0)).toBe("#EF4444");
	});
});
