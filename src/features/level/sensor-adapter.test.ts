import { type LevelAngles } from "@/features/level/level-engine";
import {
  computeLevelFromSensors,
  mapSensorSamples,
  type AccelerometerSample,
  type GyroscopeSample,
} from "@/features/level/sensor-adapter";

describe("sensor-adapter", () => {
  it("maps accelerometer and gyroscope samples into a sensor frame", () => {
    const accelerometer: AccelerometerSample = { x: 0.1, y: -0.2, z: -0.97 };
    const gyroscope: GyroscopeSample = { x: 0.01, y: 0.02, z: 0.03 };

    expect(mapSensorSamples(accelerometer, gyroscope)).toEqual({
      gravity: { x: 0.1, y: -0.2, z: -0.97 },
      rotationRate: { x: 0.01, y: 0.02, z: 0.03 },
    });
  });

  it("returns null when accelerometer payload is invalid", () => {
    const gyroscope: GyroscopeSample = { x: 0, y: 0, z: 0 };

    const invalid = mapSensorSamples(
      { x: Number.NaN, y: 0, z: -1 } as AccelerometerSample,
      gyroscope,
    );

    expect(invalid).toBeNull();
  });

  it("computes calibrated and smoothed level state from sensor samples", () => {
    const previousAngles: LevelAngles = { pitch: 0, roll: 0 };
    const calibration: LevelAngles = { pitch: 1, roll: -1 };

    const result = computeLevelFromSensors({
      accelerometer: { x: 0, y: 0, z: -1 },
      gyroscope: { x: 0.1, y: 0.2, z: 0.3 },
      previousAngles,
      calibration,
      alpha: 0.5,
      toleranceDeg: 1,
    });

    expect(result).toEqual({
      angles: { pitch: -0.5, roll: 0.5 },
      nearLevel: true,
      rotationRate: { x: 0.1, y: 0.2, z: 0.3 },
    });
  });
});
