import {
  resetHapticState,
  shouldTriggerHaptic,
} from "@/features/haptics/haptic-feedback";

describe("haptic-feedback", () => {
  beforeEach(() => {
    resetHapticState();
  });

  it("triggers haptic on first near-level detection", () => {
    const result = shouldTriggerHaptic(false, true);

    expect(result).toBe(true);
  });

  it("does not trigger haptic when already near level", () => {
    shouldTriggerHaptic(false, true); // first transition

    const result = shouldTriggerHaptic(true, true); // stays near level

    expect(result).toBe(false);
  });

  it("triggers haptic again after leaving and re-entering near level", () => {
    shouldTriggerHaptic(false, true); // enter near level
    shouldTriggerHaptic(true, false); // exit near level

    const result = shouldTriggerHaptic(false, true); // re-enter near level

    expect(result).toBe(true);
  });

  it("does not trigger haptic when entering not-level state", () => {
    const result = shouldTriggerHaptic(false, false);

    expect(result).toBe(false);
  });

  it("resets haptic state and allows re-trigger", () => {
    shouldTriggerHaptic(false, true);

    resetHapticState();

    const result = shouldTriggerHaptic(false, true);

    expect(result).toBe(true);
  });
});
