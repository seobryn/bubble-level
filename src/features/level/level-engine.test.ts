import {
  applyCalibration,
  gravityToAngles,
  isNearLevel,
  smoothAngles,
  type LevelAngles,
} from "@/features/level/level-engine";

describe("level-engine", () => {
  it("converts flat gravity vector to near-zero pitch and roll", () => {
    const angles = gravityToAngles({ x: 0, y: 0, z: -1 });

    expect(Math.abs(angles.pitch)).toBeLessThan(0.01);
    expect(Math.abs(angles.roll)).toBeLessThan(0.01);
  });

  it("applies calibration offsets to pitch and roll", () => {
    const raw: LevelAngles = { pitch: 2.5, roll: -1.2 };
    const offset: LevelAngles = { pitch: 1.0, roll: -0.7 };

    expect(applyCalibration(raw, offset)).toEqual({ pitch: 1.5, roll: -0.5 });
  });

  it("smooths readings using weighted blend", () => {
    const prev: LevelAngles = { pitch: 0, roll: 0 };
    const next: LevelAngles = { pitch: 10, roll: -10 };

    expect(smoothAngles(prev, next, 0.2)).toEqual({ pitch: 2, roll: -2 });
  });

  it("detects near-level state within tolerance", () => {
    expect(isNearLevel({ pitch: 0.6, roll: -0.4 }, 1)).toBe(true);
    expect(isNearLevel({ pitch: 1.2, roll: 0.1 }, 1)).toBe(false);
  });
});
