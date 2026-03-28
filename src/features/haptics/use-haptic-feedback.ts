import { useCallback, useRef } from "react";

import { shouldTriggerHaptic } from "@/features/haptics/haptic-feedback";

type UseHapticFeedbackProps = {
  executeHaptic?: () => Promise<void> | void;
};

type UseHapticFeedbackState = {
  triggerOnNearLevel: (
    prevNearLevel: boolean,
    currentNearLevel: boolean,
  ) => void;
};

/**
 * Hook to manage haptic feedback with de-duplication.
 * Triggers haptic on transition to near-level state.
 */
export function useHapticFeedback({
  executeHaptic = defaultHaptic,
}: UseHapticFeedbackProps = {}): UseHapticFeedbackState {
  const prevNearLevelRef = useRef(false);

  const triggerOnNearLevel = useCallback(
    (prevNearLevel: boolean, currentNearLevel: boolean) => {
      const shouldTrigger = shouldTriggerHaptic(
        prevNearLevel,
        currentNearLevel,
      );

      if (shouldTrigger) {
        try {
          executeHaptic();
        } catch (error) {
          // Silently fail if haptics unavailable
          console.debug("Haptic feedback failed:", error);
        }
      }

      prevNearLevelRef.current = currentNearLevel;
    },
    [executeHaptic],
  );

  return { triggerOnNearLevel };
}

async function defaultHaptic(): Promise<void> {
  // Import dynamically to avoid issues when expo-haptics is not available
  try {
    const { vibrate } = await import("expo-haptics");
    await vibrate(30); // 30ms light haptic
  } catch {
    // Haptics not available on this platform
  }
}
