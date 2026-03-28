let wasNearLevel = false;

/**
 * Determines if haptic feedback should trigger.
 * Only triggers on transition from not-near-level to near-level.
 * De-duplicates repeated feedback while in near-level state.
 */
export function shouldTriggerHaptic(
  prevNearLevel: boolean,
  currentNearLevel: boolean,
): boolean {
  const transitioning = !prevNearLevel && currentNearLevel;
  wasNearLevel = currentNearLevel;
  return transitioning;
}

/**
 * Resets haptic state for testing or manual override.
 */
export function resetHapticState(): void {
  wasNearLevel = false;
}
