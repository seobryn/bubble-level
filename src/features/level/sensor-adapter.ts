import {
  applyCalibration,
  gravityToAngles,
  isNearLevel,
  smoothAngles,
  type GravityVector,
  type LevelAngles,
} from "@/features/level/level-engine";
import { SMOOTHING_CONFIG } from "@/features/level/sensor-tuning";

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
  deadbandDeg?: number;
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

function gyroscopeMagnitude(sample: GyroscopeSample): number {
  return Math.sqrt(sample.x ** 2 + sample.y ** 2 + sample.z ** 2);
}

function applyDeadband(
  previous: LevelAngles,
  next: LevelAngles,
  deadbandDeg: number,
): LevelAngles {
  return {
    pitch:
      Math.abs(next.pitch - previous.pitch) < deadbandDeg
        ? previous.pitch
        : next.pitch,
    roll:
      Math.abs(next.roll - previous.roll) < deadbandDeg
        ? previous.roll
        : next.roll,
  };
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
  const explicitAlpha = input.alpha;
  let adaptiveAlpha = explicitAlpha ?? SMOOTHING_CONFIG.baseAlpha;

  if (input.alpha === undefined) {
    const motion = gyroscopeMagnitude(frame.rotationRate);
    const { motionFactors } = SMOOTHING_CONFIG;

    if (motion < motionFactors.stationaryMaxMotion) {
      adaptiveAlpha *= motionFactors.stationaryMultiplier;
    } else if (motion < motionFactors.slowMaxMotion) {
      adaptiveAlpha *= motionFactors.slowMultiplier;
    } else if (motion < motionFactors.moderateMaxMotion) {
      adaptiveAlpha *= motionFactors.moderateMultiplier;
    } else {
      adaptiveAlpha *= motionFactors.highMultiplier;
    }
  }

  const effectiveAlpha =
    explicitAlpha !== undefined
      ? Math.max(0, Math.min(1, explicitAlpha))
      : Math.min(SMOOTHING_CONFIG.maxEffectiveAlpha, adaptiveAlpha);

  const smoothedAngles = smoothAngles(
    previousAngles,
    calibratedAngles,
    effectiveAlpha,
  );
  const stableAngles = applyDeadband(
    previousAngles,
    smoothedAngles,
    input.deadbandDeg ?? 0.08,
  );

  return {
    angles: stableAngles,
    nearLevel: isNearLevel(stableAngles, input.toleranceDeg ?? 1),
    rotationRate: frame.rotationRate,
  };
}
