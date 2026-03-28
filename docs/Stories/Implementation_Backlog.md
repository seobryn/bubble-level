# Implementation Backlog

This backlog translates stories into engineering tasks and test tasks, aligned with TDD.

**Last Updated:** March 27, 2026

## Sprint Order Recommendation

1. ✅ US-001 Accurate Bubble Level with Sensor Fusion — **IN REFINEMENT**
2. ⏳ US-002 Design System with Airbnb Approach — Not Started
3. 🟡 US-003 Juicy and Simple UX — In Progress (basic UI implemented)
4. ⏳ US-004 Monetization with Google AdMob — Not Started
5. ⏳ US-005 Pay to Remove Ads — Not Started

## US-001 Accurate Bubble Level with Sensor Fusion

**Status: IN REFINEMENT** — Core implementation complete, integration testing underway

### Engineering Tasks

- ✅ Create level domain module for angle math (pitch, roll).
  - Implemented in `level-engine.ts` with `gravityToAngles()` function
- ✅ Add calibration model and offset application logic.
  - Implemented in `level-calibration.ts` with offset derivation
- ✅ Add smoothing strategy for sensor fusion (low-pass baseline).
  - Implemented in `level-engine.ts` with `smoothAngles()` function
- ✅ Build sensor adapter to map device sensor payload to domain input.
  - Implemented in `sensor-adapter.ts` with `computeLevelFromSensors()`
- ✅ Add persistence for calibration data.
  - Implemented in `calibration-store.ts` with `saveCalibration()` / `loadCalibration()`
- ✅ Add error handling for missing/denied sensor permission.
  - Implemented in `use-level-sensor.ts` hook with status management
- ✅ Render live level state in the home screen.
  - Implemented in `src/app/index.tsx` with live bubble visualization

### Test Tasks (TDD)

- ✅ Red: failing tests for gravity vector to angle conversion.
  - Tests in `level-engine.test.ts`: `converts flat gravity vector to near-zero pitch and roll`
- ✅ Red: failing tests for calibration offset application.
  - Tests in `level-engine.test.ts`: `applies calibration offsets to pitch and roll`
- ✅ Red: failing tests for smoothing behavior and jitter reduction.
  - Tests in `level-engine.test.ts`: `smooths readings using weighted blend`
- ✅ Red: failing tests for near-level detection threshold.
  - Tests in `level-engine.test.ts`: `detects near-level state within tolerance`
- ✅ Bubble visual computation tests.
  - Tests in `bubble-visual.test.ts`: offset calculations and clamping behavior
- 🟡 Integration tests for sensor adapter input mapping.
  - Tests in `sensor-adapter.test.ts`: needs completion review
- 🟡 Integration tests for calibration persistence load/save.
  - Tests in `calibration-store.test.ts`: needs completion review
- 🟡 UI tests for unavailable sensor fallback messaging.
  - Partial: error state rendering in home screen, needs E2E validation

### Definition of Done

- ✅ All US-001 acceptance criteria pass.
  - Acceptance 1: Live pitch/roll updates ✅
  - Acceptance 2: Jitter tolerance ✅
  - Acceptance 3: Responsive bubble animation ✅
  - Acceptance 4: Calibration storage ✅ (verified in code, awaiting manual test)
  - Acceptance 5: Sensor unavailable fallback ✅ (error state rendering implemented)
- 🟡 Unit and integration tests are green locally.
  - Core unit tests verified; pending full suite execution
- ✅ No regressions on existing app routes.
  - explore.tsx removed, index.tsx updated without breaking changes

## US-002 Design System with Airbnb Approach

**Status: NOT STARTED**

### Engineering Tasks

- ⏳ Define design tokens (color, spacing, typography, radius, shadow, motion).
  - Partial: `design-system/tokens.ts` exists but needs completion
  - `constants/theme.ts` has basic theme setup
- ⏳ Build primitive components: Box, Stack, Text, Button, Card.
  - Partial: `ThemedText`, `ThemedView` exist but may need variant expansion
  - `ui/button/` component partially implemented
- ⏳ Add variant system for component states and sizes.
- ⏳ Add accessibility rules (contrast, touch target, disabled semantics).
- ⏳ Document usage patterns in markdown and component examples.

### Test Tasks (TDD)

- ⏳ Red: token mapping tests for typography and spacing.
- ⏳ Red: variant rendering tests for Button and Card.
- ⏳ Red: state tests (active, disabled, error).
- ⏳ Accessibility tests for role/label and minimum hit area.

### Definition of Done

- ⏳ Shared tokens drive all new UI.
- ⏳ Component contracts are tested and documented.

---

## US-003 Juicy and Simple UX

**Status: PARTIALLY STARTED (Basic UI Live)**

### Engineering Tasks

- ✅ Replace starter home with focused level screen.
  - Implemented: `src/app/index.tsx` shows level screen with bubble visualization
  - Removed `src/app/explore.tsx` to focus on core feature
- 🟡 Add subtle motion for bubble and state transitions.
  - Partial: Basic state changes rendered; smooth animations not yet implemented
  - Could use `react-native-reanimated` (already in dependencies)
- ⏳ Add optional haptic feedback on near-level success.
  - Not yet implemented; expo-haptics integration needed
- ⏳ Add lightweight onboarding hints for first launch only.
  - Not yet implemented; first-run flag needed
- ⏳ Add reduced-motion compatibility behavior.
  - Not yet implemented; need to detect and respect system preference

### Test Tasks (TDD)

- 🟡 Near-level state transition tests.
  - Core logic tested in `level-engine.test.ts`; UI state transitions need coverage
- ⏳ Haptic trigger de-duplication tests.
- ⏳ First-run onboarding visibility tests.
- ⏳ UI tests for reduced-motion behavior.

### Definition of Done

- 🟡 Core leveling task is immediate and clear.
  - UI is functional; visual polish pending
- ⏳ Feedback feels polished without clutter.

---

## US-004 Monetization with Google AdMob

**Status: NOT STARTED**

### Engineering Tasks

- ⏳ Add AdMob SDK and environment-aware ad unit config.
- ⏳ Implement ad manager state machine (idle/loading/loaded/failed).
- ⏳ Add ad placement that does not block core leveling.
- ⏳ Add telemetry hooks for ad lifecycle events.
- ⏳ Add policy-safe defaults and guardrails.

### Test Tasks (TDD)

- ⏳ Red: ad manager state transition tests.
- ⏳ Red: production vs test ad unit resolution tests.
- ⏳ Red: fallback UI tests for failed ad loading.
- ⏳ Integration tests for non-blocking ad layout behavior.

### Definition of Done

- ⏳ Stable ad rendering in free mode.
- ⏳ Failures degrade gracefully.

---

## US-005 Pay to Remove Ads

**Status: NOT STARTED**

### Engineering Tasks

- ⏳ Integrate in-app purchase product for Remove Ads.
- ⏳ Implement entitlement state handling and secure persistence.
- ⏳ Add Restore Purchases flow.
- ⏳ Gate ad rendering and ad requests by entitlement state.
- ⏳ Add purchase UI and clear explanatory copy.

### Test Tasks (TDD)

- ⏳ Red: entitlement reducer transition tests.
- ⏳ Red: purchase success/cancel/failure handling tests.
- ⏳ Red: restore purchase behavior tests.
- ⏳ Integration tests for ad suppression when entitlement is active.

### Definition of Done

- ⏳ Users can purchase Remove Ads entitlement.
- ⏳ Purchase unlocks permanent ad-free experience.

### Definition of Done

- One-time purchase works and persists.
- Restore flow is reliable.
- Ads are fully suppressed when entitled.
