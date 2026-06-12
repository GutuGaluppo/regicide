import { shuffle } from "@/utils/shuffle";

describe("shuffle", () => {
	it("returns a new array (does not mutate the input)", () => {
		const input = [1, 2, 3, 4, 5];
		const result = shuffle(input);
		expect(result).not.toBe(input);
		expect(input).toEqual([1, 2, 3, 4, 5]);
	});

	it("preserves length and multiset of elements", () => {
		const input = [1, 2, 3, 4, 5, 5, 5];
		const result = shuffle(input);
		expect(result).toHaveLength(input.length);
		expect([...result].sort()).toEqual([...input].sort());
	});

	it("handles empty and single-element arrays", () => {
		expect(shuffle([])).toEqual([]);
		expect(shuffle([42])).toEqual([42]);
	});

	it("produces a deterministic order when Math.random is stubbed", () => {
		const spy = jest.spyOn(Math, "random").mockReturnValue(0);
		// With random() === 0, each swap targets index 0.
		expect(shuffle([1, 2, 3])).toEqual([2, 3, 1]);
		spy.mockRestore();
	});
});
