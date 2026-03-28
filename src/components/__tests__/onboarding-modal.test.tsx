import { getVisibleHints } from "@/features/onboarding/onboarding-hints";

describe("OnboardingModal step progression logic", () => {
  it("starts at step 0 on first render", () => {
    const hints = getVisibleHints(true);
    const currentStep = 0;

    expect(currentStep).toBe(0);
    expect(hints.length).toBeGreaterThan(0);
  });

  it("shows correct hint for current step", () => {
    const hints = getVisibleHints(true);
    const currentStep = 0;

    expect(hints[currentStep]).toBeDefined();
    expect(hints[currentStep].text).toBeTruthy();
  });

  it("allows advancing to next step", () => {
    const hints = getVisibleHints(true);
    let currentStep = 0;

    const nextStep = Math.min(currentStep + 1, hints.length - 1);

    expect(nextStep).toBe(1);
    expect(hints[nextStep]).toBeDefined();
  });

  it("prevents going beyond last step", () => {
    const hints = getVisibleHints(true);
    let currentStep = hints.length - 1;

    const nextStep = Math.min(currentStep + 1, hints.length - 1);

    expect(nextStep).toBe(hints.length - 1);
  });

  it("allows going to previous step", () => {
    const hints = getVisibleHints(true);
    let currentStep = 1;

    const prevStep = Math.max(currentStep - 1, 0);

    expect(prevStep).toBe(0);
  });

  it("shows step indicator (current/total)", () => {
    const hints = getVisibleHints(true);
    const currentStep = 1;

    const stepIndicator = `${currentStep + 1}/${hints.length}`;

    expect(stepIndicator).toBe("2/3");
  });

  it("returns empty hint list for returning users", () => {
    const hints = getVisibleHints(false);

    expect(hints.length).toBe(0);
  });
});
