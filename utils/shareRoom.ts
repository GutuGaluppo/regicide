import * as Linking from "expo-linking";
import { Platform, Share } from "react-native";

export type ShareOutcome = "shared" | "copied" | "dismissed" | "unavailable";

/**
 * Production web origin used to build shareable https links on native, where
 * there is no `window.location`. Set `EXPO_PUBLIC_WEB_URL` in `.env` to your
 * deployed site (e.g. https://regicide-tracker.vercel.app), no trailing slash.
 */
const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_URL?.replace(/\/+$/, "");

/**
 * Builds a link that pre-fills the room code on the join screen.
 * - Web: an absolute URL to the current origin — always correct, no config.
 * - Native: the configured https site, so the link is tappable in any chat app
 *   and opens the web game for guests without the native app.
 * - Native fallback (web URL not configured): a `regicidetracker://` deep link.
 */
export const buildJoinUrl = (code: string): string => {
	const path = `/lobby?code=${encodeURIComponent(code)}`;

	if (Platform.OS === "web" && typeof window !== "undefined") {
		return `${window.location.origin}${path}`;
	}

	if (WEB_BASE_URL) {
		return `${WEB_BASE_URL}${path}`;
	}

	return Linking.createURL("/lobby", { queryParams: { code } });
};

interface ShareStrings {
	/** Title shown by the OS share sheet / Web Share API. */
	title: string;
	/** Full message body (already localized, includes the code and join link). */
	message: string;
}

/**
 * Shares the room code through the best channel available on each platform,
 * degrading gracefully:
 *   Native            → OS share sheet (Share.share)
 *   Web w/ Web Share  → navigator.share (mobile browsers)
 *   Web w/o Web Share → clipboard copy (desktop browsers)
 */
export const shareRoom = async ({ title, message }: ShareStrings): Promise<ShareOutcome> => {
	if (Platform.OS === "web") {
		const nav = typeof navigator !== "undefined" ? navigator : undefined;

		if (nav?.share) {
			try {
				await nav.share({ title, text: message });
				return "shared";
			} catch (e) {
				// User dismissed the share sheet — don't fall back to clipboard.
				if (e instanceof Error && e.name === "AbortError") return "dismissed";
				// Otherwise fall through to the clipboard attempt below.
			}
		}

		if (nav?.clipboard?.writeText) {
			try {
				await nav.clipboard.writeText(message);
				return "copied";
			} catch {
				return "unavailable";
			}
		}

		return "unavailable";
	}

	// Native (iOS / Android)
	try {
		const result = await Share.share({ title, message });
		return result.action === Share.dismissedAction ? "dismissed" : "shared";
	} catch {
		return "unavailable";
	}
};
