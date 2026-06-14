import { AVATARS, DEFAULT_AVATAR_ID, resolveAvatar } from "@/data/avatars";

describe("avatars catalog", () => {
	it("has a DEFAULT_AVATAR_ID present in the catalog", () => {
		expect(AVATARS.some((a) => a.id === DEFAULT_AVATAR_ID)).toBe(true);
	});

	it("has unique ids", () => {
		const ids = AVATARS.map((a) => a.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe("resolveAvatar", () => {
	it("returns the matching avatar for a valid id", () => {
		const target = AVATARS[2];
		expect(resolveAvatar(target.id)).toBe(target);
	});

	it("falls back to the default for unknown/missing ids", () => {
		const def = resolveAvatar(DEFAULT_AVATAR_ID);
		expect(resolveAvatar(undefined)).toBe(def);
		expect(resolveAvatar(null)).toBe(def);
		expect(resolveAvatar("does_not_exist")).toBe(def);
	});
});
