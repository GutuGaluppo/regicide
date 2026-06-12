/** @type {import('jest').Config} */
module.exports = {
	preset: "jest-expo",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	// Only files ending in .test.ts(x) are suites; lets us colocate helpers.
	testMatch: ["**/*.test.ts", "**/*.test.tsx"],
	// Only run our own unit tests; ignore build output and native folders.
	testPathIgnorePatterns: [
		"/node_modules/",
		"/dist/",
		"/ios/",
		"/android/",
		"/.expo/",
	],
	clearMocks: true,
};
