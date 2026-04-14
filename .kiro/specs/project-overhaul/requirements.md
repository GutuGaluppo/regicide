# Requirements Document

## Introduction

This document covers a comprehensive overhaul of the **Regicide Tracker** — a React Native / Expo companion app for the cooperative card game Regicide. The overhaul encompasses five major areas: (1) code refactoring and clean architecture, (2) descriptive naming conventions, (3) English as the standard language for all code comments, (4) a living documentation file (DOC.md), and (5) the foundational infrastructure required to support multiplayer gameplay.

The app currently supports a 2-player digital mode and a physical tracker mode. After the overhaul it must remain fully functional in both modes while gaining a clean, maintainable codebase and the ability to host or join multiplayer sessions.

---

## Glossary

- **App**: The Regicide Tracker React Native / Expo application.
- **Game_Engine**: The set of pure functions and hooks (`useGame`, `gameLogic.ts`, `deck.ts`, `enemies.ts`) that implement Regicide rules.
- **Tracker**: The physical-game companion mode implemented in `useTracker` and `TrackerScreen`.
- **Component**: A React Native UI component located in the `components/` directory.
- **Screen**: A top-level view located in the `screens/` directory and routed via Expo Router in `app/`.
- **Hook**: A React custom hook located in the `hooks/` directory.
- **Asset**: Any static file (image, audio, font) located under `assets/`.
- **Foley**: Sound-effect audio files located in `assets/folley/`.
- **Soundtrack**: Background music files located in `assets/soundtrack/`.
- **Character_Card**: An illustrated enemy card image located in `assets/cards/`.
- **DOC_File**: The `DOC.md` file at the project root that serves as the living documentation.
- **Multiplayer_Session**: A real-time game session shared between two or more players over a network.
- **Session_Host**: The player who creates and owns a Multiplayer_Session.
- **Session_Guest**: A player who joins an existing Multiplayer_Session.
- **Session_Code**: A short alphanumeric code used to identify and join a Multiplayer_Session.
- **Game_State**: The serialisable object (`GameState`) that represents the complete state of a game at any point in time.
- **State_Sync**: The mechanism by which Game_State changes are propagated to all participants in a Multiplayer_Session.
- **Storage_Service**: The `services/storage.ts` module responsible for persisting Game_State locally via AsyncStorage.
- **i18n**: The internationalisation system (`i18n/`) that provides translated strings for the UI.

---

## Requirements

### Requirement 1: Component Refactoring and Clean Architecture

**User Story:** As a developer, I want the codebase to be clean and well-organised, so that I can navigate, maintain, and extend the app without friction.

#### Acceptance Criteria

1. THE App SHALL contain no commented-out code blocks in any source file after the refactoring is complete.
2. THE App SHALL contain no `console.log` statements in production source files; only `console.warn` and `console.error` are permitted for non-critical and critical runtime issues respectively.
3. WHEN a UI pattern is used in three or more places, THE Component SHALL be extracted into a reusable component in the `components/` directory.
4. THE App SHALL organise source files according to the following top-level structure: `app/`, `assets/`, `components/`, `data/`, `hooks/`, `i18n/`, `screens/`, `services/`, `utils/`.
5. THE App SHALL organise asset files so that background images reside in `assets/backgrounds/`, character card images reside in `assets/cards/`, suit and class icons reside in `assets/classes/`, foley audio resides in `assets/folley/`, soundtrack audio resides in `assets/soundtrack/`, fonts reside in `assets/fonts/`, game card images reside in `assets/game/cards/`, UI icons reside in `assets/icons/`, and general images reside in `assets/images/`.
6. WHEN a component file exceeds 200 lines of JSX/TSX, THE Component SHALL be split into smaller sub-components or helper components.
7. THE App SHALL use TypeScript strict mode with no `any` types in production source files.

---

### Requirement 2: Descriptive Naming Conventions

**User Story:** As a developer, I want all functions, variables, and components to have highly descriptive names, so that the intent of each piece of code is immediately clear without needing to read its implementation.

#### Acceptance Criteria

1. THE App SHALL use camelCase for all variable and function names, PascalCase for all component and type names, and SCREAMING_SNAKE_CASE for all module-level constants.
2. WHEN a boolean variable or prop represents a state condition, THE App SHALL prefix its name with `is`, `has`, `can`, or `should` (e.g., `isImmune`, `hasSelectedCards`, `canConfirmDiscard`).
3. WHEN a function performs a side-effectful action, THE App SHALL prefix its name with a verb that describes the action (e.g., `handleCardPress`, `applyAttackDamage`, `persistGameState`).
4. WHEN a variable holds a derived or computed value, THE App SHALL name it to reflect what it represents, not how it is computed (e.g., `remainingEnemyHealth` instead of `enemyHealth - currentDamage`).
5. THE App SHALL not use single-letter variable names except as loop indices in `for` loops.
6. THE App SHALL not use abbreviations in names unless the abbreviation is a well-known domain term defined in the Glossary (e.g., `HP` is acceptable; `dmg` is not).

---

### Requirement 3: English Code Comments

**User Story:** As a developer, I want all code comments to be written in English, so that the codebase is accessible to any developer regardless of their primary language.

#### Acceptance Criteria

1. THE App SHALL write all inline code comments in English.
2. THE App SHALL write all JSDoc-style block comments in English.
3. THE App SHALL write all TODO and FIXME annotations in English.
4. WHEN a comment exists in a language other than English, THE App SHALL replace it with an equivalent English comment during the refactoring pass.
5. THE App SHALL not duplicate information already expressed by the code itself; comments SHALL explain _why_, not _what_.

---

### Requirement 4: Living Documentation File (DOC.md)

**User Story:** As a developer or contributor, I want a single comprehensive documentation file, so that I can understand the project structure, game rules, characters, and API surface without reading every source file.

#### Acceptance Criteria

1. THE App SHALL include a `DOC.md` file at the project root.
2. THE DOC_File SHALL contain a section describing the overall folder structure with a brief explanation of each top-level directory.
3. THE DOC_File SHALL contain a section listing every Screen with its file path, purpose, and the primary Hook it consumes.
4. THE DOC_File SHALL contain a section listing every Component with its file path, its props interface, and a one-sentence description of its responsibility.
5. THE DOC_File SHALL contain a section listing every Hook with its file path, its return type, and a description of the state it manages.
6. THE DOC_File SHALL contain a section listing every utility function in `utils/` with its signature and a description of its behaviour.
7. THE DOC_File SHALL contain a section listing every Asset category (backgrounds, cards, classes, foley, soundtrack, fonts, game cards, icons, images) with the file naming convention used in each category.
8. THE DOC_File SHALL contain a section describing each Character_Card (enemy character) with the character's name, associated suit, rank, base HP, base attack, and a brief lore description.
9. THE DOC_File SHALL contain a section describing the Regicide game rules as implemented in the App, including suit powers, immunity rules, Animal Companion rules, Jester rules, and combo rules.
10. WHEN a new component, hook, screen, or utility function is added to the codebase, THE DOC_File SHALL be updated to reflect the addition.

---

### Requirement 5: Multiplayer Infrastructure

**User Story:** As a player, I want to play Regicide digitally with friends on separate devices, so that I can enjoy the cooperative experience remotely.

#### Acceptance Criteria

1. THE App SHALL provide a "Create Session" action on the Home Screen that generates a unique Session_Code and establishes the current device as the Session_Host.
2. THE App SHALL provide a "Join Session" action on the Home Screen that accepts a Session_Code and connects the current device as a Session_Guest.
3. WHEN a Multiplayer_Session is created, THE App SHALL display the Session_Code to the Session_Host so it can be shared with Session_Guests.
4. WHEN a Session_Guest enters a valid Session_Code, THE App SHALL connect the Session_Guest to the Multiplayer_Session within 5 seconds under normal network conditions.
5. IF a Session_Code is invalid or the session no longer exists, THEN THE App SHALL display a descriptive error message to the user.
6. WHEN the Session_Host performs any game action that changes Game_State, THE App SHALL propagate the updated Game_State to all Session_Guests within 2 seconds under normal network conditions.
7. WHEN a Session_Guest receives an updated Game_State, THE App SHALL render the new state without requiring a manual refresh.
8. IF a Session_Guest loses network connectivity, THEN THE App SHALL display a reconnection indicator and attempt to reconnect automatically for up to 30 seconds.
9. IF a Session_Guest fails to reconnect within 30 seconds, THEN THE App SHALL notify the user and return to the Home Screen.
10. WHEN all players in a Multiplayer_Session disconnect, THE App SHALL terminate the session and release server-side resources.
11. THE App SHALL support a minimum of 2 and a maximum of 4 simultaneous players in a single Multiplayer_Session, consistent with the Regicide rules for player count.
12. WHEN a Multiplayer_Session is active, THE App SHALL display the number of currently connected players to all participants.
13. THE Game_Engine SHALL remain a pure, side-effect-free module so that Game_State transitions can be computed on any device and verified by the Session_Host.
14. THE App SHALL use the existing `GameState` type as the canonical serialisable unit for State_Sync; no additional state fields SHALL be introduced solely for multiplayer without updating the `GameState` type definition.

---

### Requirement 6: Audio Organisation and Playback

**User Story:** As a player, I want consistent and well-organised audio feedback during gameplay, so that the game feels immersive and responsive.

#### Acceptance Criteria

1. THE App SHALL organise all sound-effect files under `assets/folley/` with descriptive, lowercase, hyphen-separated filenames (e.g., `sword-draw.mp3`, `card-shuffle.mp3`).
2. THE App SHALL organise all background music files under `assets/soundtrack/` with descriptive, lowercase, hyphen-separated filenames.
3. WHEN a card is played, THE App SHALL play an appropriate Foley sound effect.
4. WHEN an enemy is defeated, THE App SHALL play an appropriate Foley sound effect.
5. IF the device is in silent mode, THEN THE App SHALL suppress all audio playback without crashing.
6. THE App SHALL expose audio playback through a dedicated `useAudio` hook so that audio logic is not embedded directly in Screen or Component files.
