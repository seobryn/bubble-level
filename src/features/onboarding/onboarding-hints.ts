export type OnboardingHint = {
  id: string;
  text: string;
};

const HINTS: OnboardingHint[] = [
  {
    id: "tilt-device",
    text: "Tilt your device to move the bubble.",
  },
  {
    id: "center-bubble",
    text: "Keep the bubble on the center cross.",
  },
  {
    id: "tap-to-calibrate",
    text: "Tap calibrate on a known level surface.",
  },
];

export function getVisibleHints(isFirstRun: boolean): OnboardingHint[] {
  return isFirstRun ? HINTS : [];
}
