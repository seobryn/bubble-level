import type { StorageLike } from "@/features/level/calibration-store";

export const FIRST_RUN_FLAG_KEY = "onboarding.firstRun";

export async function isFirstRun(storage: StorageLike): Promise<boolean> {
  const flag = await storage.getItem(FIRST_RUN_FLAG_KEY);
  return flag === null;
}

export async function markFirstRunComplete(
  storage: StorageLike,
): Promise<void> {
  await storage.setItem(FIRST_RUN_FLAG_KEY, "true");
}
