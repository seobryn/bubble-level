import { getVisibleHints } from "@/features/onboarding/onboarding-hints";

describe("onboarding-hints", () => {
  it("returns three hints for first-time user", () => {
    const hints = getVisibleHints(true);

    expect(hints.length).toBe(3);
    expect(hints.every((h) => h.id && h.text)).toBe(true);
  });

  it("returns empty array for returning user", () => {
    const hints = getVisibleHints(false);

    expect(hints.length).toBe(0);
  });

  it("each hint has required fields", () => {
    const hints = getVisibleHints(true);

    hints.forEach((hint) => {
      expect(hint.id).toBeTruthy();
      expect(hint.text).toBeTruthy();
      expect(hint.text.length).toBeGreaterThan(0);
    });
  });

  it("hints explain essential actions only", () => {
    const hints = getVisibleHints(true);

    // Total characters across 3 hints should stay lean (under 200 chars)
    const totalText = hints.map((h) => h.text).join(" ");
    expect(totalText.length).toBeLessThan(200);
  });
});
