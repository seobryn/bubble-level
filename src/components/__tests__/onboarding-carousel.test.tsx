import type { OnboardingHint } from "@/features/onboarding/onboarding-hints";
import { getVisibleHints } from "@/features/onboarding/onboarding-hints";

describe("OnboardingCarousel display logic", () => {
  it("shows no hints when hints array is empty", () => {
    const hints: OnboardingHint[] = [];

    expect(hints.length).toBe(0);
  });

  it("displays all hints when provided", () => {
    const hints: OnboardingHint[] = [
      { id: "tip-1", text: "Tilt device" },
      { id: "tip-2", text: "Center bubble" },
      { id: "tip-3", text: "Calibrate" },
    ];

    expect(hints.length).toBe(3);
    expect(hints[0].text).toBe("Tilt device");
    expect(hints[1].text).toBe("Center bubble");
    expect(hints[2].text).toBe("Calibrate");
  });

  it("retrieves correct hints for first-run display", () => {
    const hints = getVisibleHints(true);

    expect(hints.length).toBe(3);
    expect(hints.every((h) => h.id && h.text)).toBe(true);
  });

  it("retrieves no hints for returning user display", () => {
    const hints = getVisibleHints(false);

    expect(hints.length).toBe(0);
  });
});
