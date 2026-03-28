export type GravityVector = {
  x: number;
  y: number;
  z: number;
};

export type LevelAngles = {
  pitch: number;
  roll: number;
};

const RAD_TO_DEG = 180 / Math.PI;

export function gravityToAngles(vector: GravityVector): LevelAngles {
  const pitch =
    Math.atan2(vector.x, Math.sqrt(vector.y ** 2 + vector.z ** 2)) * RAD_TO_DEG;
  const roll =
    Math.atan2(vector.y, Math.sqrt(vector.x ** 2 + vector.z ** 2)) * RAD_TO_DEG;

  return { pitch, roll };
}

export function applyCalibration(
  raw: LevelAngles,
  offset: LevelAngles,
): LevelAngles {
  return {
    pitch: raw.pitch - offset.pitch,
    roll: raw.roll - offset.roll,
  };
}

export function smoothAngles(
  prev: LevelAngles,
  next: LevelAngles,
  alpha: number,
): LevelAngles {
  const blend = Math.max(0, Math.min(1, alpha));

  return {
    pitch: prev.pitch + (next.pitch - prev.pitch) * blend,
    roll: prev.roll + (next.roll - prev.roll) * blend,
  };
}

export function isNearLevel(angles: LevelAngles, toleranceDeg = 1): boolean {
  return (
    Math.abs(angles.pitch) <= toleranceDeg &&
    Math.abs(angles.roll) <= toleranceDeg
  );
}
