# US-004 - Monetization with Google AdMob

## User Story

As a product owner,
I want to monetize the app with Google AdMob,
so that free users can support ongoing development.

## Priority

Medium

## Description

Integrate AdMob in a way that does not disrupt the core leveling experience. Ads should be placed thoughtfully and comply with platform policies.

## Acceptance Criteria

1. Given a free user opens the app,
   when monetization is enabled,
   then approved AdMob ad units load in designated placements.
2. Given an ad fails to load,
   when fallback behavior runs,
   then the app remains stable and layout does not break.
3. Given policy constraints apply,
   when ads are rendered,
   then ad placement and interaction follow Google policy.
4. Given analytics are configured,
   when ads are shown or clicked,
   then key ad events are tracked.
5. Given test mode is enabled in development,
   when app runs locally,
   then only test ads are requested.

## Non-Functional Requirements

- No ad should block calibration or core level usage.
- Ad loading should not noticeably reduce app performance.
- Network failures should degrade gracefully.

## TDD Hints

- Unit test ad state reducer or manager (idle/loading/loaded/failed).
- Integration test UI fallback for failed ad loads.
- Test environment-based ad unit selection (test vs production).
