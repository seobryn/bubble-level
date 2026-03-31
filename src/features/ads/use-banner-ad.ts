import { useReducer } from "react";

import { AD_UNIT_IDS } from "@/features/ads/ad-config";
import { adReducer, initialAdState } from "@/features/ads/ad-state";

export function useBannerAd() {
  const [state, dispatch] = useReducer(adReducer, initialAdState);

  const adUnitId = AD_UNIT_IDS.banner;

  function onAdLoaded() {
    dispatch({ type: "LOAD_SUCCESS" });
  }

  function onAdFailedToLoad(errorCode: number) {
    dispatch({ type: "LOAD_FAIL", errorCode });
  }

  function onAdStartedLoading() {
    dispatch({ type: "LOAD_START" });
  }

  return {
    adState: state,
    adUnitId,
    onAdLoaded,
    onAdFailedToLoad,
    onAdStartedLoading,
  };
}
