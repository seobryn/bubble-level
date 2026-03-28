# US-001 - Accurate Bubble Level with Sensor Fusion

## User Story

As a user,
I want a precise and responsive bubble level,
so that I can align surfaces reliably in real-world situations.

## Priority

High

## Description

The app must use device sensors needed for leveling, including accelerometer and gyroscope. Sensor fusion should smooth readings and reduce jitter while preserving responsiveness.

## Acceptance Criteria

1. Given I open the app on a supported device,
   when sensors initialize,
   then I see live pitch and roll values update continuously.
2. Given the device is held still,
   when readings are displayed,
   then visible jitter stays within an agreed tolerance window.
3. Given I move the device slowly,
   when the angle changes,
   then the bubble animation follows movement without noticeable lag.
4. Given I place the device on a known flat surface,
   when I calibrate,
   then the app stores calibration and uses it in future sessions.
5. Given sensors are unavailable or permission fails,
   when initialization is attempted,
   then I see a clear fallback message and guidance.

## Non-Functional Requirements

- Startup to first reading under 2 seconds on target devices.
- Sensor updates should not cause frame drops under normal usage.
- Calibration data persisted locally and loaded safely.

## TDD Hints

- Start with failing tests for angle normalization and calibration offset logic.
- Add integration tests for sensor event mapping and smoothing.
- Add edge-case tests for orientation changes and null sensor payloads.
