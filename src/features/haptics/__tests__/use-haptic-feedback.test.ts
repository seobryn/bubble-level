import {
  resetHapticState,
  shouldTriggerHaptic,
} from "@/features/haptics/haptic-feedback";

describe("useHapticFeedback - haptic trigger logic", () => {
  beforeEach(() => {
    resetHapticState();
  });

  it("triggers haptic on transition to near-level", () => {
    const result = shouldTriggerHaptic(false, true);

    expect(result).toBe(true);
  });

  it("does not trigger haptic when staying near-level", () => {
    shouldTriggerHaptic(false, true); // enter near-level

    const result = shouldTriggerHaptic(true, true); // stay near-level

    expect(result).toBe(false);
  });

  it("triggers again after exiting and re-entering near-level", () => {
    shouldTriggerHaptic(false, true); // enter
    shouldTriggerHaptic(true, false); // exit

    const result = shouldTriggerHaptic(false, true); // re-enter

    expect(result).toBe(true);
  });
});
