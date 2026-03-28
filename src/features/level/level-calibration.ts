import { type LevelAngles } from "@/features/level/level-engine";

export function deriveCalibrationOffset(
  currentOffset: LevelAngles,
  currentDisplayedAngles: LevelAngles,
): LevelAngles {
  return {
    pitch: currentOffset.pitch + currentDisplayedAngles.pitch,
    roll: currentOffset.roll + currentDisplayedAngles.roll,
  };
}

export function resetCalibrationOffset(): LevelAngles {
  return { pitch: 0, roll: 0 };
}
