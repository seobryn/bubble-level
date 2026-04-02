import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import type { StorageLike } from "@/features/level/calibration-store";
import {
  isPremium as isPremiumStore,
  setPremiumStatus,
} from "@/features/premium/premium-store";

type UsePremiumProps = {
  storage?: StorageLike;
};

type UsePremiumState = {
  isPremium: boolean;
  isLoading: boolean;
  purchaseRemoveAds: () => Promise<void>;
};

export function usePremium({
  storage = AsyncStorage,
}: UsePremiumProps = {}): UsePremiumState {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const purchaseRemoveAds = useCallback(async () => {
    try {
      // Here we would typically integrate with an IAP provider (e.g. RevenueCat or react-native-iap).
      // For now, we simulate a successful purchase by updating the local storage.
      await setPremiumStatus(storage, true);
      setIsPremium(true);
    } catch (error) {
      console.error("Failed to purchase remove ads:", error);
    }
  }, [storage]);

  useEffect(() => {
    let active = true;

    async function loadPremiumStatus() {
      try {
        const premiumStatus = await isPremiumStore(storage);
        if (active) {
          setIsPremium(premiumStatus);
        }
      } catch (error) {
        // Fallback to false if storage fails
        console.error("Failed to load premium status:", error);
        if (active) {
          setIsPremium(false);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadPremiumStatus();

    return () => {
      active = false;
    };
  }, [storage]);

  return { isPremium, isLoading, purchaseRemoveAds };
}
