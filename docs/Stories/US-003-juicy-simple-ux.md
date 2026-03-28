# US-003 - Juicy and Simple UX

## User Story

As a user,
I want the app to feel juicy yet simple,
so that it is delightful to use without learning friction.

## Priority

High

## Description

The interface should feel lively through meaningful motion, tactile feedback, and polished micro-interactions, while staying minimal and uncluttered.

## Acceptance Criteria

1. Given I open the app,
   when the main screen appears,
   then the core level interaction is immediately visible without extra steps.
2. Given the bubble enters near-level range,
   when alignment is achieved,
   then I receive subtle feedback (visual and optional haptic).
3. Given I interact with controls,
   when tapping buttons and toggles,
   then transitions are smooth and consistent.
4. Given I am a first-time user,
   when I launch the app,
   then onboarding hints explain only essential actions in under 3 steps.
5. Given I return later,
   when opening the app,
   then I can resume leveling immediately.

## Non-Functional Requirements

- Keep the primary screen focused on one main job.
- Motion should not harm readability or responsiveness.
- Respect reduced motion settings when available.

## TDD Hints

- Test display logic for near-level and level states.
- Test onboarding visibility rules for first run vs returning user.
- Test haptic trigger gating to avoid repeated noisy feedback.
