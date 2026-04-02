import type { LevelAngles } from "@/features/level/level-engine";

export type BubbleVisualConfig = {
  angles: LevelAngles;
  travelRadius: number;
  maxTiltDeg?: number;
};

export type BubbleOffset = {
  x: number;
  y: number;
};

const DEFAULT_MAX_TILT_DEG = 10;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function computeBubbleOffset({
  angles,
  travelRadius,
  maxTiltDeg = DEFAULT_MAX_TILT_DEG,
}: BubbleVisualConfig): BubbleOffset {
  const safeTravelRadius = Math.max(travelRadius, 0);
  const tiltRange = Math.max(maxTiltDeg, 0.01);
  const unitsPerDegree = safeTravelRadius / tiltRange;

  return {
    // A spirit-level bubble moves opposite to the tilt direction.
    x: clamp(
      -angles.roll * unitsPerDegree,
      -safeTravelRadius,
      safeTravelRadius,
    ) + 0,
    y: clamp(
      -angles.pitch * unitsPerDegree,
      -safeTravelRadius,
      safeTravelRadius,
    ) + 0,
  };
}
