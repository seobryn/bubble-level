# US-005 - Pay to Remove Ads

## User Story

As a user,
I want to pay once to remove ads,
so that I can enjoy an uninterrupted experience.

## Priority

High

## Description

Implement a one-time in-app purchase that disables ads across the app for the purchasing user, including restore purchases support.

## Acceptance Criteria

1. Given I am on the free plan,
   when I choose Remove Ads,
   then I can complete a one-time purchase through the platform store.
2. Given purchase succeeds,
   when entitlement updates,
   then ads are removed immediately and persist across app restarts.
3. Given I reinstall or switch devices on the same account,
   when I tap Restore Purchases,
   then ad-free entitlement is restored.
4. Given purchase fails or is canceled,
   when flow ends,
   then I see a clear message and can retry safely.
5. Given entitlement is active,
   when ad components would render,
   then they are skipped and no ad requests are sent.

## Non-Functional Requirements

- Purchase state must be persisted securely.
- Entitlement checks should be resilient to temporary offline states.
- UX copy must clearly explain one-time purchase behavior.

## TDD Hints

- Unit test entitlement state transitions.
- Integration test purchase success, cancel, and restore flows.
- Test ad suppression logic when entitlement is active.
