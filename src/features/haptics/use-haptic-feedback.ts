import { useCallback } from "react";

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
 *
 * Note: The caller is responsible for tracking previous state and
 * determining when to call this function.
 */
export function useHapticFeedback({
  executeHaptic = defaultHaptic,
}: UseHapticFeedbackProps = {}): UseHapticFeedbackState {
  const triggerOnNearLevel = useCallback(
    (prevNearLevel: boolean, currentNearLevel: boolean) => {
      const shouldTrigger = shouldTriggerHaptic(
        prevNearLevel,
        currentNearLevel,
      );

      if (!shouldTrigger) {
        return;
      }

      console.log(
        "[Haptics] Triggering feedback on transition:",
        `${prevNearLevel} → ${currentNearLevel}`,
      );

      try {
        const result = executeHaptic();

        // Handle async Promise
        if (result instanceof Promise) {
          result
            .then(() => {
              console.log("[Haptics] ✓ Haptic feedback executed successfully");
            })
            .catch((error) => {
              console.warn("[Haptics] ✗ Haptic execution failed:", error);
            });
        }
      } catch (error) {
        console.warn("[Haptics] ✗ Error triggering haptic:", error);
      }
    },
    [executeHaptic],
  );

  return { triggerOnNearLevel };
}

async function defaultHaptic(): Promise<void> {
  // Import dynamically to avoid issues when expo-haptics is not available
  try {
    const { vibrate } = await import("expo-haptics");
    console.log("[Haptics] Imported expo-haptics, executing vibrate");
    await vibrate(30); // 30ms light haptic
  } catch (error) {
    console.warn(
      "[Haptics] Failed to execute haptic (platform may not support it):",
      error,
    );
  }
}
