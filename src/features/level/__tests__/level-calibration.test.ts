import {
  deriveCalibrationOffset,
  resetCalibrationOffset,
} from "@/features/level/level-calibration";

describe("level-calibration", () => {
  it("derives a new offset using current displayed angles", () => {
    expect(
      deriveCalibrationOffset(
        { pitch: 1.2, roll: -0.8 },
        { pitch: -0.2, roll: 0.3 },
      ),
    ).toEqual({ pitch: 1, roll: -0.5 });
  });

  it("resets calibration offset to zero", () => {
    expect(resetCalibrationOffset()).toEqual({ pitch: 0, roll: 0 });
  });
});
