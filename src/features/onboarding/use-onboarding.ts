import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import type { StorageLike } from "@/features/level/calibration-store";
import {
  isFirstRun,
  markFirstRunComplete,
} from "@/features/onboarding/first-run-store";
import {
  getVisibleHints,
  type OnboardingHint,
} from "@/features/onboarding/onboarding-hints";

type UseOnboardingProps = {
  storage?: StorageLike;
};

type UseOnboardingState = {
  hints: OnboardingHint[];
  dismissHints: () => Promise<void>;
};

export function useOnboarding({
  storage = AsyncStorage,
}: UseOnboardingProps = {}): UseOnboardingState {
  const [hints, setHints] = useState<OnboardingHint[]>([]);

  const dismissHints = useCallback(async () => {
    await markFirstRunComplete(storage);
    setHints([]);
  }, [storage]);

  useEffect(() => {
    let active = true;

    async function loadOnboarding() {
      try {
        const firstRun = await isFirstRun(storage);
        if (active) {
          const visibleHints = getVisibleHints(firstRun);
          setHints(visibleHints);
        }
      } catch {
        // If storage fails, proceed without onboarding
        if (active) {
          setHints([]);
        }
      }
    }

    loadOnboarding();

    return () => {
      active = false;
    };
  }, [storage]);

  return { hints, dismissHints };
}
