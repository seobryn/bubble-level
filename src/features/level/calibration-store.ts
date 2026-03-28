import { type LevelAngles } from "@/features/level/level-engine";

export const CALIBRATION_STORAGE_KEY = "level.calibration.v1";

export type StorageLike = {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem?: (key: string) => void | Promise<void>;
};

function isValidCalibration(value: unknown): value is LevelAngles {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LevelAngles>;

  return Number.isFinite(candidate.pitch) && Number.isFinite(candidate.roll);
}

export async function saveCalibration(
  storage: StorageLike,
  calibration: LevelAngles,
): Promise<void> {
  await storage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(calibration));
}

export async function loadCalibration(
  storage: StorageLike,
): Promise<LevelAngles | null> {
  const raw = await storage.getItem(CALIBRATION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!isValidCalibration(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
