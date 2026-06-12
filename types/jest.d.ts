// Makes Jest's global test APIs (describe, it, expect, jest, …) explicitly
// available to the TypeScript program. This is additive — unlike a tsconfig
// `types` array it does not disable automatic inclusion of other @types
// packages (e.g. @types/node used by services/firebase.ts).
/// <reference types="jest" />
