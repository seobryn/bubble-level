import {
  applyCalibration,
  gravityToAngles,
  isNearLevel,
  smoothAngles,
  type GravityVector,
  type LevelAngles,
} from "@/features/level/level-engine";

export type AccelerometerSample = {
  x: number;
  y: number;
  z: number;
};

export type GyroscopeSample = {
  x: number;
  y: number;
  z: number;
};

export type SensorFrame = {
  gravity: GravityVector;
  rotationRate: GyroscopeSample;
};

export type LevelComputationInput = {
  accelerometer: AccelerometerSample;
  gyroscope: GyroscopeSample;
  previousAngles?: LevelAngles;
  calibration?: LevelAngles;
  alpha?: number;
  toleranceDeg?: number;
};

export type LevelComputationResult = {
  angles: LevelAngles;
  nearLevel: boolean;
  rotationRate: GyroscopeSample;
};

function isFiniteSample(sample: { x: number; y: number; z: number }) {
  return (
    Number.isFinite(sample.x) &&
    Number.isFinite(sample.y) &&
    Number.isFinite(sample.z)
  );
}

export function mapSensorSamples(
  accelerometer: AccelerometerSample,
  gyroscope: GyroscopeSample,
): SensorFrame | null {
  if (!isFiniteSample(accelerometer) || !isFiniteSample(gyroscope)) {
    return null;
  }

  return {
    gravity: {
      x: accelerometer.x,
      y: accelerometer.y,
      z: accelerometer.z,
    },
    rotationRate: {
      x: gyroscope.x,
      y: gyroscope.y,
      z: gyroscope.z,
    },
  };
}

export function computeLevelFromSensors(
  input: LevelComputationInput,
): LevelComputationResult | null {
  const frame = mapSensorSamples(input.accelerometer, input.gyroscope);

  if (!frame) {
    return null;
  }

  const rawAngles = gravityToAngles(frame.gravity);
  const calibration = input.calibration ?? { pitch: 0, roll: 0 };
  const calibratedAngles = applyCalibration(rawAngles, calibration);

  const previousAngles = input.previousAngles ?? calibratedAngles;
  const alpha = input.alpha ?? 1;
  const smoothedAngles = smoothAngles(previousAngles, calibratedAngles, alpha);

  return {
    angles: smoothedAngles,
    nearLevel: isNearLevel(smoothedAngles, input.toleranceDeg ?? 1),
    rotationRate: frame.rotationRate,
  };
}
