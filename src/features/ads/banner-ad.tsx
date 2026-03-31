import React, { useEffect } from "react";
import { NativeModules, StyleSheet, View } from "react-native";

import { useBannerAd } from "@/features/ads/use-banner-ad";

export function BannerAdBanner() {
  const {
    adUnitId,
    onAdLoaded,
    onAdFailedToLoad,
    onAdStartedLoading,
    adState,
  } = useBannerAd();

  useEffect(() => {
    onAdStartedLoading();
    // Run once when banner mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expo Go does not include custom native modules such as AdMob.
  if (!NativeModules?.RNGoogleMobileAdsModule) {
    return null;
  }

  const {
    BannerAdSize,
    BannerAd: GoogleBannerAd,
  } = require("react-native-google-mobile-ads");

  if (adState.status === "failed") {
    // Graceful degradation: render nothing on failure, no layout break.
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <GoogleBannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={(error: { code: number }) =>
          onAdFailedToLoad(error.code)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    width: "100%",
  },
});
