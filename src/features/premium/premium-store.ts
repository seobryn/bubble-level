import type { StorageLike } from "../level/calibration-store";

export const PREMIUM_STATUS_KEY = "premium.isPremium";

export async function isPremium(storage: StorageLike): Promise<boolean> {
  const flag = await storage.getItem(PREMIUM_STATUS_KEY);
  return flag === "true";
}

export async function setPremiumStatus(
  storage: StorageLike,
  status: boolean,
): Promise<void> {
  await storage.setItem(PREMIUM_STATUS_KEY, status ? "true" : "false");
}
