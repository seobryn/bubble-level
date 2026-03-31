// Google's official test Ad Unit IDs — safe to use during development.
// See: https://developers.google.com/admob/android/test-ads
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";

// TODO: Replace with real production Ad Unit IDs before release.
const PROD_BANNER_ID = "ca-app-pub-REPLACE_ME/REPLACE_ME";

export function getAdUnitIds(isDev: boolean) {
  return {
    banner: isDev ? TEST_BANNER_ID : PROD_BANNER_ID,
  } as const;
}

export const AD_UNIT_IDS = getAdUnitIds(__DEV__);
