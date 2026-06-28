# Implementation Plan for `BUG&MELHORIAS.md`

Source: [`BUG&MELHORIAS.md`](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/docs/BUG&MELHORIAS.md)

Note: the commented list in the source file is already implemented. This document covers only the current `TODO` items.

> **Status (verified against the code):** workstreams 1–4 are implemented; workstream 5 (audio) is now implemented too.
> - **1. Chat polish:** ✅ backdrop tap-to-close for overlay mode, refocus after every send (button + keyboard) via `submitBehavior="submit"`, safe-area bottom padding on the mobile bottom-sheet.
> - **2. Flicker:** ✅ the GameScreen layout handlers and `useEnemyCardScale` were already guarded/memoized (and `center` is `flex:1`, so the scale can't feed back into the container); the blob `measure` already de-dupes. Concrete fix: `PlayerChip` now rounds and only reports `onMeasure` when `x`/`width` actually change.
> - **3. Mobile guidance:** ✅ persisted `useActionHints` store (AsyncStorage), reusable `ActionHint` coachmark on the history + chat buttons (touch only; web keeps hover `title`), dismiss-on-tap, and a Settings toggle to re-enable.
> - **4. Reveal clarity:** ✅ the second section is now "Defended with" (blue/defense accent) vs. the red attack block, with stronger Cinzel section headers and boxed separation; empty sections already hide.
> - **5. Audio mute persistence:** ✅ `AudioContext` now gates soundtrack creation on AsyncStorage hydration and reads the latest mute/volume from refs, so a muted track stays muted after a reload (see workstream 5 below).

## Goal

Ship the remaining UX and stability fixes in four small workstreams:

1. Chat drawer polish on mobile.
2. Layout flicker investigation and stabilization.
3. Mobile guidance for icon-only actions.
4. Turn reveal clarity improvements.

## 1. Chat drawer polish

### Scope

- Reduce/adjust chat drawer width on mobile-sized layouts.
- Keep the input visible when the keyboard opens.
- Clear the input and keep focus after sending.
- Close the drawer when the user taps outside it.

### Files

- [components/RoomChat/RoomChat.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/RoomChat/RoomChat.tsx)
- [components/RoomChat/RoomChat.styles.ts](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/RoomChat/RoomChat.styles.ts)

### Steps

1. Add an overlay/backdrop for non-docked chat mode.
   The backdrop should sit behind the drawer and call `closeChat()` on press.
2. Split mobile behavior from tablet behavior more explicitly.
   Today `panelMobile` is full-width and fixed-height; reduce the effective width on narrow devices if needed, or keep full-width but tighten internal paddings first.
3. Make keyboard behavior deterministic.
   Use `KeyboardAvoidingView` plus safe bottom spacing, and ensure the input row is not hidden by the keyboard.
4. Keep focus after every send path.
   `handleSend()` should also refocus the input, not only `handleSubmitEditing()`.
5. Keep the input cleared only after a successful local send trigger.
   Preserve the current optimistic UX, but avoid any path that blurs the field.

### Validation

- Mobile portrait: open chat, type, send via keyboard submit, send via button, tap outside to close.
- Tablet: confirm the overlay still behaves correctly and does not block the whole game when closed.
- Desktop docked mode: no backdrop, no regression.

## 2. Layout flicker and render stability

### Scope

Investigate the flicker reported on certain screen sizes, likely caused by repeated layout measurements or state churn around the active player/game layout.

### Likely hotspots

- [screens/GameScreen/GameScreen.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/GameScreen/GameScreen.tsx)
- [hooks/useEnemyCardScale.ts](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/hooks/useEnemyCardScale.ts)
- [screens/MultiplayerGameScreen/components/PlayerChip.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/MultiplayerGameScreen/components/PlayerChip.tsx)
- [screens/MultiplayerGameScreen/components/BottomTurnHud.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/MultiplayerGameScreen/components/BottomTurnHud.tsx)

### Steps

1. Reproduce the issue at the reported breakpoints.
   Focus on mobile landscape, small tablet heights, and transitions where the active player changes.
2. Audit measurement-driven state updates.
   Check `handleStatusBarLayout`, `handleCenterLayout`, and HUD chip measurements for values that oscillate by 1px and retrigger renders.
3. Stabilize `PlayerChip` measurement writes.
   Only report layout changes when `x` or `width` actually changed.
4. Check whether active/inactive player size changes are causing blob remeasurement loops.
   If yes, keep the outer chip width stable and animate only inner visual emphasis.
5. Re-check `useEnemyCardScale`.
   Confirm the scale calculation is not bouncing because of container height changes caused by its own result.
6. Reduce oversized image cost where relevant.
   Keep heavy assets smaller where possible, especially icons/images rendered in repeated lists or overlays.

### Validation

- No visible flicker when turns change.
- No repeated jumping of the enemy card or bottom HUD at stable viewport sizes.
- React DevTools/profiling pass if available, otherwise targeted console instrumentation during local verification.

## 3. Mobile guidance for icon-only actions

### Recommendation

Instead of classic tooltips only, use a lightweight first-use guidance pattern for mobile:

- first-open coachmarks or inline callouts for icon-only actions;
- optional persistent help toggle in settings;
- allow the player to dismiss guidance permanently.

This is better than hover-style tooltip parity because mobile has no hover and repeated popups become noisy fast.

### Scope

Explain actions such as history, settings, chat, and any icon-only button that loses meaning without labels on touch devices.

### Files

- [components/ScreenHeader/ScreenHeader.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/ScreenHeader/ScreenHeader.tsx)
- [screens/GameScreen/components/GameLogButton.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/GameScreen/components/GameLogButton.tsx)
- [screens/MultiplayerGameScreen/components/ChatButton.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/screens/MultiplayerGameScreen/components/ChatButton.tsx)
- [components/SettingsDrawer/SettingsDrawer.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/SettingsDrawer/SettingsDrawer.tsx)

### Steps

1. Identify which icon-only actions need explanation on mobile.
2. Add a small reusable guidance state.
   Example: `showActionHints`, persisted locally with AsyncStorage.
3. On first visits, show short labels/callouts anchored to the relevant buttons.
4. Add a dismiss action and a settings toggle so the player can disable hints later.
5. Keep web hover `title` attributes where they already help, but do not rely on them for mobile.

### Validation

- First mobile session: hints are visible and understandable.
- After dismissal: they stay off.
- Re-enabled from settings: they return.

## 4. Turn reveal clarity improvements

### Scope

- Clarify the reveal modal content for attack and defense.
- Ensure section titles are more readable.
- Show defense/discard cards clearly when they exist.

### Files

- [components/TurnRevealOverlay/TurnRevealOverlay.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/components/TurnRevealOverlay/TurnRevealOverlay.tsx)
- [data/types.ts](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/data/types.ts)
- [store/multiplayerStore.ts](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/store/multiplayerStore.ts)
- `i18n/locales/*`

### Steps

1. Review the naming of the second section.
   If `discardCards` are being used as defense/payment cards, the player-facing label should say `Defend` or `Defense`, not an internal discard term.
2. Increase title contrast and emphasis.
   Section headers should be larger and visually stronger than the current body styling.
3. Keep attack and defense blocks visually separated.
   Different accent colors are fine, but the hierarchy must stay readable against the overlay background.
4. Confirm the payload is complete.
   If the reveal needs more than the current `attackCards` and `discardCards`, extend `RevealState` and the commit point in `multiplayerStore`.
5. Preserve the yielded/no-defense case.
   If no defense card exists, hide the section instead of showing an empty container.

### Validation

- Turn with attack only.
- Turn with attack + damage payment.
- Turn with yielded/no cards.
- Very small widths: cards remain readable and titles do not collapse visually.

## 5. Audio mute persistence (music + SFX)

### Scope

When the player mutes music (or SFX) in the browser, closes the window, and reopens the game, the mute state
must persist. Previously the icon showed muted but audio still played.

### Files

- [contexts/AudioContext.tsx](/Users/augustogaluppo/development/portifolio-projects/regicide-tracker/contexts/AudioContext.tsx)

### Root cause

- Persisted mute flags load **async** on mount and start as `false`.
- `playSoundtrack` created the `Audio.Sound` from a **stale closure** (`musicMuted` still `false` on first
  load), so the track started **unmuted**.
- The reactive `setIsMutedAsync` sync effect fired while `soundtrackRef.current` was still `null` (the
  `createAsync` was still awaiting), so it no-op'd and nothing re-applied the persisted state.
- SFX was masked by the `if (sfxMuted) return` guards in the play functions, but the sound objects themselves
  were created unmuted.

### Steps (implemented)

1. Added a `hydrated` flag set after a single `Promise.all` over the four `AsyncStorage.getItem` reads.
2. Mirrored the latest `musicMuted`/`musicVolume`/`sfxMuted` into refs so async callbacks read current values.
3. `playSoundtrack` defers creation until `hydratedRef.current` is true; a `[hydrated]` effect (re)starts the
   `desiredSoundtrackRef` track once persisted state is ready, so it is created with the correct mute/volume.
4. After the track loads, re-apply `setIsMutedAsync`/`setVolumeAsync` from the refs to cover a toggle during load.
5. SFX sounds are created with `isMuted: sfxMutedRef.current`; the existing sync effect and play-function
   guards remain as additional layers.

### Validation

- Web: mute music → reload → music stays muted **and** silent; unmute → plays.
- Web: mute SFX → reload → trigger tap/chat/turn sounds → silent; unmute → audible.
- Volume sliders still persist independently of mute.

## Suggested delivery order

1. Chat drawer polish.
2. Turn reveal clarity.
3. Mobile action guidance.
4. Audio mute persistence.
5. Flicker investigation and stabilization.

Reason: the first four are contained UX/bug fixes, while the flicker task may require a longer investigation pass.
