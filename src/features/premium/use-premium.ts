import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as RNIap from "react-native-iap";

import type { StorageLike } from "@/features/level/calibration-store";
import { useTranslation } from "@/i18n/use-translation";
import {
  isPremium as isPremiumStore,
  setPremiumStatus,
} from "@/features/premium/premium-store";

const REMOVE_ADS_PRODUCT_ID = "remove_ads";

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
  const { t } = useTranslation();

  const purchaseRemoveAds = useCallback(async () => {
    try {
      await RNIap.initConnection();
      const products = await RNIap.fetchProducts({ skus: [REMOVE_ADS_PRODUCT_ID] });
      
      if (!products || products.length === 0) {
        throw new Error(t("premium.errorNotConfigured", { productId: REMOVE_ADS_PRODUCT_ID }));
      }
      
      const purchaseResponse = await RNIap.requestPurchase({
        type: "in-app",
        request: {
          apple: { sku: REMOVE_ADS_PRODUCT_ID },
          google: { skus: [REMOVE_ADS_PRODUCT_ID] }
        }
      });
      
      const purchase = Array.isArray(purchaseResponse) ? purchaseResponse[0] : purchaseResponse;

      if (purchase && purchase.productId === REMOVE_ADS_PRODUCT_ID) {
        await setPremiumStatus(storage, true);
        setIsPremium(true);
      }
    } catch (error: any) {
      console.error("Failed to purchase remove ads:", error);
      Alert.alert(
        t("premium.errorTitle"),
        error?.message || t("premium.errorFallback")
      );
    }
  }, [storage, t]);

  useEffect(() => {
    let active = true;

    async function loadPremiumStatus() {
      try {
        let finalStatus = false;
        
        // 1. Check local storage first (fast)
        const localStatus = await isPremiumStore(storage);
        if (localStatus) {
          finalStatus = true;
        } else {
          // 2. If not local, check IAP store (single source of truth)
          try {
            await RNIap.initConnection();
            
            // Clean up old transactions platform implicitly
            try {
              if (process.env.NODE_ENV !== "test") {
                await RNIap.clearTransactionIOS();
              }
            } catch (e) {
              // Ignore platform specific errors 
            }

            const purchases = await RNIap.getAvailablePurchases();
            const hasPurchased = purchases.find(
              (p) => p.productId === REMOVE_ADS_PRODUCT_ID
            );

            if (hasPurchased) {
              finalStatus = true;
              // Sync local storage
              await setPremiumStatus(storage, true);
            }
          } catch (e) {
            console.warn("Failed to fetch from react-native-iap, defaulting to local fallback:", e);
          }
        }

        if (active) {
          setIsPremium(finalStatus);
        }
      } catch (error) {
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
