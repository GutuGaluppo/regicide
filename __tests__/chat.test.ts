import { ChatMessage } from "@/data/types";
import {
	computeUnread,
	parseIncomingMessage,
	validateOutgoingText,
} from "@/utils/chat";

const base = { playerId: "p1", playerName: "Augusto", createdAt: 1000 };

describe("parseIncomingMessage", () => {
	it("parses a valid text message and trims the text", () => {
		const msg = parseIncomingMessage("id1", { ...base, kind: "text", text: "  oi  " });
		expect(msg).toEqual({ id: "id1", ...base, kind: "text", text: "oi" });
	});

	it("parses a valid system message", () => {
		const msg = parseIncomingMessage("id1", { ...base, kind: "system", systemType: "join" });
		expect(msg).toMatchObject({ kind: "system", systemType: "join" });
	});

	it("rejects unknown kinds and invalid systemType", () => {
		expect(parseIncomingMessage("id1", { ...base, kind: "bogus" })).toBeNull();
		expect(
			parseIncomingMessage("id1", { ...base, kind: "system", systemType: "kick" }),
		).toBeNull();
	});

	it("rejects empty or oversized text", () => {
		expect(parseIncomingMessage("id1", { ...base, kind: "text", text: "   " })).toBeNull();
		expect(
			parseIncomingMessage("id1", { ...base, kind: "text", text: "x".repeat(181) }),
		).toBeNull();
	});

	it("rejects missing/invalid fields", () => {
		expect(parseIncomingMessage("", { ...base, kind: "text", text: "hi" })).toBeNull();
		expect(parseIncomingMessage("id1", null)).toBeNull();
		expect(parseIncomingMessage("id1", { ...base, createdAt: "nope", kind: "text", text: "hi" })).toBeNull();
		expect(parseIncomingMessage("id1", { playerId: "", playerName: "A", createdAt: 1, kind: "text", text: "hi" })).toBeNull();
	});
});

describe("validateOutgoingText", () => {
	it("accepts and trims valid text", () => {
		expect(validateOutgoingText("  boa jogada ")).toEqual({ ok: true, value: "boa jogada" });
	});

	it("rejects empty/whitespace", () => {
		expect(validateOutgoingText("   ")).toEqual({ ok: false, reason: "empty" });
	});

	it("rejects text over the limit", () => {
		expect(validateOutgoingText("x".repeat(181))).toEqual({ ok: false, reason: "tooLong" });
	});
});

describe("computeUnread", () => {
	const msgs: ChatMessage[] = [
		{ id: "a", playerId: "me", playerName: "Me", createdAt: 1, kind: "text", text: "1" },
		{ id: "b", playerId: "other", playerName: "O", createdAt: 2, kind: "text", text: "2" },
		{ id: "c", playerId: "other", playerName: "O", createdAt: 3, kind: "text", text: "3" },
		{ id: "d", playerId: "me", playerName: "Me", createdAt: 4, kind: "text", text: "4" },
	];

	it("counts all non-own messages when nothing was seen", () => {
		expect(computeUnread(msgs, null, "me")).toBe(2);
	});

	it("counts only non-own messages after lastSeenId", () => {
		expect(computeUnread(msgs, "b", "me")).toBe(1); // only "c" (d is own)
	});

	it("returns 0 when the latest message is already seen", () => {
		expect(computeUnread(msgs, "d", "me")).toBe(0);
	});
});
