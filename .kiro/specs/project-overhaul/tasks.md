# Implementation Plan: Project Overhaul

## Overview

Incremental implementation of the six overhaul areas for the Regicide Tracker app. Tasks are ordered by dependency: architecture and naming first (foundation), then comments and docs (low-risk), then audio (self-contained), then multiplayer (most complex). Each task builds on the previous and ends with all code wired together.

## Tasks

- [ ] 1. Enable TypeScript strict mode and ESLint rules
  - Verify `tsconfig.json` has `"strict": true` (already present); add `"noUncheckedIndexedAccess": true`
  - Add `@typescript-eslint/no-explicit-any: "error"` and `no-console: ["error", { allow: ["warn", "error"] }]` to ESLint config
  - Fix any immediate type errors surfaced by the stricter config across `data/`, `utils/`, `hooks/`, `services/`
  - _Requirements: 1.7_

- [ ] 2. Audit and remove dead code and console.log statements
  - Remove all commented-out code blocks from every source file under `app/`, `components/`, `hooks/`, `screens/`, `services/`, `utils/`
  - Replace all `console.log` calls with `console.warn` or `console.error` as appropriate, or remove them
  - _Requirements: 1.1, 1.2_

- [ ] 3. Apply descriptive naming conventions across the codebase
  - Rename all boolean variables/props to use `is`, `has`, `can`, or `should` prefixes (e.g. `immune` → `isImmune`)
  - Rename all side-effectful functions to start with a verb (e.g. `cardPress` → `handleCardPress`, `saveGame` → `persistGameState`)
  - Rename all abbreviated names that are not Glossary terms (e.g. `dmg` → `damage`, `hp` → `health`)
  - Remove all single-letter variable names outside `for` loop indices
  - Ensure all constants at module level use SCREAMING_SNAKE_CASE
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 4. Audit and replace all non-English comments
  - Search every `.ts` and `.tsx` file for inline comments, JSDoc blocks, and TODO/FIXME annotations not written in English
  - Replace each non-English comment with an equivalent English comment that explains _why_, not _what_
  - Remove any comments that merely restate what the code already expresses
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5. Extract reusable components
  - Identify any UI pattern used in three or more places (e.g. styled text, card containers, icon buttons)
  - Extract each repeated pattern into a new component under `components/`
  - Split any component file exceeding 200 lines into smaller sub-components
  - Update all import sites
  - _Requirements: 1.3, 1.6_

- [ ] 6. Rename and organise audio assets
  - Rename files in `assets/folley/` to descriptive, lowercase, hyphen-separated names:
    - `freesound_community-shuffle-cards-46455.mp3` → `card-shuffle.mp3`
    - `draw-sword.mp3` → `sword-draw.mp3`
    - `floraphonic-swing-whoosh-weapon-1-189819.mp3` → `card-play.mp3`
    - `freesound_community-dragon-shout-roar-98277.mp3` → `enemy-defeated.mp3`
    - `lesiakower-ancient-lyre-sound-short-arpeggio-sound-effect-430628.mp3` → `victory.mp3`
    - `alexis_gaming_cam-epee-342933.mp3` → `sword-clash.mp3`
    - `u_u4pf5h7zip-click-345983.mp3` → `ui-click.mp3`
  - Create `assets/soundtrack/` directory and move any background music files into it with hyphen-separated names
  - Update all existing import references to the renamed files
  - _Requirements: 6.1, 6.2_

- [ ] 7. Implement `hooks/useAudio.ts`
  - [ ] 7.1 Create `hooks/useAudio.ts` with the `AudioHook` interface and `FOLEY_ASSETS` / `SOUNDTRACK_ASSETS` registries as specified in the design
    - Load all sound objects once on mount using `expo-av`
    - Call `Audio.setAudioModeAsync({ playsInSilentModeIOS: false })` on mount
    - Wrap every `Sound.playAsync` call in try/catch; swallow errors silently
    - Expose `playCardSound`, `playEnemyDefeatedSound`, `playVictorySound`, and `isLoaded`
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

  - [ ]\* 7.2 Write property test for audio events on game state transitions (Property 8)
    - **Property 8: Audio events fire on game state transitions**
    - **Validates: Requirements 6.3, 6.4**
    - File: `__tests__/useAudio.test.ts`
    - Use `fc.record(...)` matching `GameState` with a mock audio hook; assert `playCardSound` called exactly once per card-play transition and `playEnemyDefeatedSound` called exactly once per enemy-defeat transition

  - [ ] 7.3 Integrate `useAudio` into `screens/GameScreen.tsx`
    - Call `playCardSound` when a card is played
    - Call `playEnemyDefeatedSound` when an enemy is defeated
    - Remove any direct `expo-av` imports from `GameScreen.tsx`
    - _Requirements: 6.3, 6.4, 6.6_

- [ ] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Set up test infrastructure
  - Add `fast-check` as a direct `devDependency` (`npm install --save-dev fast-check`)
  - Create `__tests__/` directory
  - Verify Jest / the existing test runner is configured to pick up `__tests__/*.test.ts`
  - _Requirements: (testing foundation for all property tests)_

- [ ] 10. Implement game engine tests
  - [ ] 10.1 Create `__tests__/gameLogic.test.ts` with unit tests for `validatePlay` and `resolvePlay`
    - Test `validatePlay`: Jester alone, Animal Companion combos, combo total > 10, invalid combos
    - Test `resolvePlay`: hearts heal, diamonds draw, clubs double damage, spades shield — each suit power in isolation and combined
    - _Requirements: 5.13_

  - [ ]\* 10.2 Write property test for game engine referential transparency (Property 6)
    - **Property 6: Game engine is referentially transparent**
    - **Validates: Requirements 5.13**
    - File: `__tests__/gameLogic.test.ts`
    - Use `fc.record(...)` matching `GameState` shape + `fc.array(fc.string())` for card IDs; assert `resolvePlay` returns structurally equal results on two identical calls

  - [ ] 10.3 Create `__tests__/deck.test.ts` with unit tests for `createTavernDeck` and `createCastleDeck`
    - Assert correct card counts per player count for `createTavernDeck`
    - Assert 12 enemies (4 suits × 3 ranks) with correct HP/attack values for `createCastleDeck`
    - _Requirements: 5.13_

- [ ] 11. Implement storage tests
  - [ ] 11.1 Create `__tests__/storage.test.ts` with unit tests for `saveGame` / `loadGame` round-trip using an AsyncStorage mock
    - _Requirements: 5.14_

  - [ ]\* 11.2 Write property test for GameState serialisation round-trip (Property 7)
    - **Property 7: GameState serialisation round-trip**
    - **Validates: Requirements 5.14**
    - File: `__tests__/storage.test.ts`
    - Use `fc.record(...)` matching `GameState` shape; assert JSON serialise → deserialise produces a structurally equal object

- [ ] 12. Implement `services/session.ts`
  - Create `services/session.ts` implementing the `SessionService` interface from the design
  - Implement `connect`, `createRoom`, `joinRoom`, `sendState`, `onStateReceived`, `closeRoom`
  - All JSON serialisation/deserialisation of `GameState` happens in this module
  - Session codes are 6-character alphanumeric strings (e.g. `"A3F7K2"`)
  - _Requirements: 5.1, 5.2, 5.3, 5.10, 5.14_

- [ ] 13. Implement session server
  - Create `server/index.ts` — a lightweight Node.js WebSocket server using the `ws` package
  - Implement room registry: `CREATE_ROOM` generates a unique Session_Code and registers the room; `JOIN_ROOM` adds a client to an existing room (reject if at capacity or not found)
  - Implement `STATE_UPDATE` broadcast: relay the full `GameState` payload to all other clients in the room
  - Implement `PLAYER_COUNT` broadcast: send updated count to all room members on join/leave
  - Implement `CLOSE_ROOM`: when all clients in a room disconnect, remove the room from the registry
  - Implement `ERROR` messages for invalid code, capacity exceeded, and malformed JSON
  - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6, 5.10, 5.11, 5.12_

- [ ] 14. Implement session server tests
  - [ ] 14.1 Create `__tests__/session.test.ts` with unit tests for the session server room logic
    - Test `CREATE_ROOM` produces a valid 6-char alphanumeric code
    - Test `JOIN_ROOM` with invalid code returns `ERROR` message
    - Test `JOIN_ROOM` when room is at capacity (4 players) returns `ERROR` message
    - Test `CLOSE_ROOM` removes room when last client disconnects
    - _Requirements: 5.1, 5.5, 5.10, 5.11_

  - [ ]\* 14.2 Write property test for session code uniqueness (Property 1)
    - **Property 1: Session codes are unique**
    - **Validates: Requirements 5.1**
    - File: `__tests__/session.test.ts`
    - Use `fc.integer({ min: 1, max: 1000 })` for call count; assert all returned codes in a batch are distinct

  - [ ]\* 14.3 Write property test for session termination on all-disconnect (Property 4)
    - **Property 4: Session terminates when all players disconnect**
    - **Validates: Requirements 5.10**
    - File: `__tests__/session.test.ts`
    - Use `fc.integer({ min: 2, max: 4 })` for player count; assert room is removed from registry after all clients disconnect

- [ ] 15. Implement `hooks/useMultiplayer.ts`
  - Create `hooks/useMultiplayer.ts` implementing the `MultiplayerHook` interface from the design
  - Implement `createSession` (calls `session.createRoom`, sets role to `"host"`)
  - Implement `joinSession` (calls `session.joinRoom`, sets role to `"guest"`)
  - Implement `leaveSession` (calls `session.closeRoom`, resets state)
  - Implement `broadcastState` (host only — calls `session.sendState`)
  - Implement `onRemoteState` (guest only — registers handler via `session.onStateReceived`)
  - Implement reconnection loop: on disconnect, retry with exponential back-off (100 ms base, 2× multiplier) for up to 30 seconds using the `exponential-backoff` package; after timeout call `leaveSession`
  - Track `connectedPlayerCount` from `PLAYER_COUNT` messages
  - _Requirements: 5.1, 5.2, 5.4, 5.6, 5.7, 5.8, 5.9, 5.11, 5.12_

- [ ] 16. Implement multiplayer hook tests
  - [ ] 16.1 Create `__tests__/useMultiplayer.test.ts` with unit tests for reconnection state machine transitions
    - Test: connecting → reconnecting → disconnected state transitions
    - Test: `leaveSession` resets all state fields to defaults
    - _Requirements: 5.8, 5.9_

  - [ ]\* 16.2 Write property test for invalid session codes producing errors (Property 2)
    - **Property 2: Invalid session codes produce errors**
    - **Validates: Requirements 5.5**
    - File: `__tests__/useMultiplayer.test.ts`
    - Use `fc.string()` filtered to exclude valid active codes; assert `connectionError` is non-null and `role` is `"none"` after `joinSession`

  - [ ]\* 16.3 Write property test for received game state being rendered (Property 3)
    - **Property 3: Received game state is rendered**
    - **Validates: Requirements 5.7**
    - File: `__tests__/useMultiplayer.test.ts`
    - Use `fc.record(...)` matching `GameState` shape; assert hook's exposed state equals the received `GameState` after `onRemoteState` fires

  - [ ]\* 16.4 Write property test for player count bounds (Property 5)
    - **Property 5: Player count is within valid bounds**
    - **Validates: Requirements 5.11, 5.12**
    - File: `__tests__/useMultiplayer.test.ts`
    - Use `fc.integer({ min: 0, max: 10 })` for join attempts; assert `connectedPlayerCount` is always in [1, 4] and a 5th join attempt is rejected with an error

- [ ] 17. Implement multiplayer UI components
  - [ ] 17.1 Create `components/multiplayer/CreateSessionButton.tsx`
    - Props: `{ onSessionCreated: (code: string) => void; isLoading: boolean }`
    - Display generated Session_Code in a copyable text field once created
    - _Requirements: 5.1, 5.3_

  - [ ] 17.2 Create `components/multiplayer/JoinSessionInput.tsx`
    - Props: `{ onJoin: (code: string) => void; error: string | null; isLoading: boolean }`
    - Text input for Session_Code with error label below
    - _Requirements: 5.2, 5.5_

  - [ ] 17.3 Create `components/multiplayer/PlayerCountBadge.tsx`
    - Props: `{ count: number }`
    - Small badge showing connected player count
    - _Requirements: 5.12_

- [ ] 18. Wire multiplayer into screens
  - [ ] 18.1 Update `screens/HomeScreen.tsx` to integrate `useMultiplayer`
    - Add `CreateSessionButton` and `JoinSessionInput` below existing navigation cards
    - On session created/joined, navigate to the game screen
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 18.2 Update `screens/GameScreen.tsx` to integrate `useMultiplayer`
    - Add `PlayerCountBadge` to the header when a session is active (`role !== "none"`)
    - For host: call `broadcastState` after every `useGame` state change
    - For guest: call `onRemoteState` to receive state updates; pass received state as `externalState` to `useGame`
    - Show reconnection indicator when `isReconnecting` is true
    - _Requirements: 5.6, 5.7, 5.8, 5.12_

  - [ ] 18.3 Update `hooks/useGame.ts` to accept optional `externalState` parameter
    - When `externalState` is provided (guest mode), skip local state management and return the external state directly
    - _Requirements: 5.7_

- [ ] 19. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Create `DOC.md` at project root
  - Write the Folder Structure section with a brief explanation of each top-level directory
  - Write the Screens section: file path, purpose, and primary hook for each screen (`HomeScreen`, `GameScreen`, `TrackerScreen`, `InstructionsScreen`)
  - Write the Components section: file path, props interface, and one-sentence description for every component in `components/`
  - Write the Hooks section: file path, return type, and state description for `useGame`, `useTracker`, `useAudio`, `useMultiplayer`
  - Write the Utilities section: signature and behaviour description for every function in `utils/`
  - Write the Assets section: each category with its file naming convention
  - Write the Characters section: name, suit, rank, base HP, base attack, and lore description for each enemy character card in `assets/cards/`
  - Write the Game Rules section: suit powers, immunity rules, Animal Companion rules, Jester rules, and combo rules as implemented in `utils/gameLogic.ts`
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

- [ ] 21. Create `__tests__/useTracker.test.ts`
  - Unit test `applyAttack` immunity logic
  - Unit test `defeatCurrentEnemy` advances to next enemy
  - _Requirements: 1.7 (type-safe hook coverage)_

- [ ] 22. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check with a minimum of 100 iterations each
- Property test files include the comment `// Feature: project-overhaul, Property N: <property text>`
- The server (`server/index.ts`) is a separate Node.js process and is not bundled with the Expo app
