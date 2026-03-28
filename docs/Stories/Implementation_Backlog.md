# Implementation Backlog

This backlog translates stories into engineering tasks and test tasks, aligned with TDD.

## Sprint Order Recommendation

1. US-001 Accurate Bubble Level with Sensor Fusion
2. US-002 Design System with Airbnb Approach
3. US-003 Juicy and Simple UX
4. US-004 Monetization with Google AdMob
5. US-005 Pay to Remove Ads

## US-001 Accurate Bubble Level with Sensor Fusion

### Engineering Tasks

- Create level domain module for angle math (pitch, roll).
- Add calibration model and offset application logic.
- Add smoothing strategy for sensor fusion (low-pass baseline).
- Build sensor adapter to map device sensor payload to domain input.
- Add persistence for calibration data.
- Add error handling for missing/denied sensor permission.
- Render live level state in the home screen.

### Test Tasks (TDD)

- Red: failing tests for gravity vector to angle conversion.
- Red: failing tests for calibration offset application.
- Red: failing tests for smoothing behavior and jitter reduction.
- Red: failing tests for near-level detection threshold.
- Integration tests for sensor adapter input mapping.
- Integration tests for calibration persistence load/save.
- UI tests for unavailable sensor fallback messaging.

### Definition of Done

- All US-001 acceptance criteria pass.
- Unit and integration tests are green locally.
- No regressions on existing app routes.

## US-002 Design System with Airbnb Approach

### Engineering Tasks

- Define design tokens (color, spacing, typography, radius, shadow, motion).
- Build primitive components: Box, Stack, Text, Button, Card.
- Add variant system for component states and sizes.
- Add accessibility rules (contrast, touch target, disabled semantics).
- Document usage patterns in markdown and component examples.

### Test Tasks (TDD)

- Red: token mapping tests for typography and spacing.
- Red: variant rendering tests for Button and Card.
- Red: state tests (active, disabled, error).
- Accessibility tests for role/label and minimum hit area.

### Definition of Done

- Shared tokens drive all new UI.
- Component contracts are tested and documented.

## US-003 Juicy and Simple UX

### Engineering Tasks

- Replace starter home with focused level screen.
- Add subtle motion for bubble and state transitions.
- Add optional haptic feedback on near-level success.
- Add lightweight onboarding hints for first launch only.
- Add reduced-motion compatibility behavior.

### Test Tasks (TDD)

- Red: near-level state transition tests.
- Red: haptic trigger de-duplication tests.
- Red: first-run onboarding visibility tests.
- UI tests for reduced-motion behavior.

### Definition of Done

- Core leveling task is immediate and clear.
- Feedback feels polished without clutter.

## US-004 Monetization with Google AdMob

### Engineering Tasks

- Add AdMob SDK and environment-aware ad unit config.
- Implement ad manager state machine (idle/loading/loaded/failed).
- Add ad placement that does not block core leveling.
- Add telemetry hooks for ad lifecycle events.
- Add policy-safe defaults and guardrails.

### Test Tasks (TDD)

- Red: ad manager state transition tests.
- Red: production vs test ad unit resolution tests.
- Red: fallback UI tests for failed ad loading.
- Integration tests for non-blocking ad layout behavior.

### Definition of Done

- Stable ad rendering in free mode.
- Failures degrade gracefully.

## US-005 Pay to Remove Ads

### Engineering Tasks

- Integrate in-app purchase product for Remove Ads.
- Implement entitlement state handling and secure persistence.
- Add Restore Purchases flow.
- Gate ad rendering and ad requests by entitlement state.
- Add purchase UI and clear explanatory copy.

### Test Tasks (TDD)

- Red: entitlement reducer transition tests.
- Red: purchase success/cancel/failure handling tests.
- Red: restore purchase behavior tests.
- Integration tests for ad suppression when entitlement is active.

### Definition of Done

- One-time purchase works and persists.
- Restore flow is reliable.
- Ads are fully suppressed when entitled.
