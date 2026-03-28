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

function isModuleNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("Cannot find module 'expo-haptics'");
}

async function defaultHaptic(): Promise<void> {
  // Import dynamically to avoid issues when expo-haptics is not available
  try {
    const Haptics = await import("expo-haptics");

    if (!Haptics.impactAsync) {
      console.warn(
        "[Haptics] expo-haptics loaded but impactAsync is unavailable on this platform.",
      );
      return;
    }

    console.log("[Haptics] Imported expo-haptics, executing light impact");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    if (isModuleNotFoundError(error)) {
      console.warn(
        "[Haptics] expo-haptics is not installed. Run `npx expo install expo-haptics`.",
      );
      return;
    }

    console.warn(
      "[Haptics] Failed to execute haptic (platform may not support it):",
      error,
    );
  }
}
