/**
 * Sensor tuning constants for optimal precision and stability.
 * These values are carefully tuned for:
 * - Precision: Bubble centers quickly when phone is stationary
 * - Stability: Smooth readings without jitter or oscillation
 * - Responsiveness: Quick feedback during manual tilting
 */

/**
 * Smoothing parameters (low-pass filter alpha values).
 * Alpha ranges from 0 (no change/maximum stability) to 1 (instant response/maximum noise).
 */
export const SMOOTHING_CONFIG = {
  /**
   * Base smoothing factor applied to all readings.
   * This is multiplied by motion-specific factors.
   */
  baseAlpha: 0.12,

  /**
   * Motion thresholds and their alpha multipliers.
   * Lower thresholds use lower multipliers (more stable).
   * Higher thresholds use higher multipliers (more responsive).
   */
  motionFactors: {
    // Stationary or near-stationary (< 0.02 rad/s): Very stable, slow convergence
    // Previously 0.35x (too slow: 0.042 alpha)
    // Now 0.6x (improved: 0.072 alpha) - ~70% faster convergence
    stationaryMaxMotion: 0.02,
    stationaryMultiplier: 0.6,

    // Very slow motion (0.02-0.05 rad/s): Balanced stability and responsiveness
    slowMaxMotion: 0.05,
    slowMultiplier: 1.0,

    // Moderate motion (0.05-0.15 rad/s): More responsive
    moderateMaxMotion: 0.15,
    moderateMultiplier: 1.2,

    // High motion (> 0.15 rad/s): Very responsive
    // Previously 1.6x, now 1.5x (slightly more stable in high-motion scenarios)
    highMultiplier: 1.5,
  },

  /**
   * Maximum effective alpha (clamping).
   * Prevents alpha from exceeding this value even with high motion.
   */
  maxEffectiveAlpha: 0.4,
};

/**
 * Deadband configuration: prevents tiny jitter from being displayed.
 * When change is smaller than this threshold, ignore it.
 */
export const DEADBAND_CONFIG = {
  /**
   * Angle change threshold in degrees below which updates are ignored.
   * Helps eliminate sensor noise while maintaining responsiveness.
   * Default: 0.08 degrees
   */
  deadbandDeg: 0.08,

  /**
   * When motion is very low, we can use a slightly smaller deadband
   * to improve precision without introducing noise.
   * Motion threshold to switch to precision deadband.
   */
  precisionMotionThreshold: 0.01,

  /**
   * Precision deadband for stationary state (stricter filtering).
   * Allows finer movement detection when phone is mostly still.
   */
  precisionDeadbandDeg: 0.04,
};

/**
 * Near-level threshold: angle tolerance to declare device as "level".
 */
export const LEVEL_DETECTION_CONFIG = {
  /**
   * Tolerance in degrees for near-level detection.
   * Device is considered level when both pitch and roll <= this value.
   * Default: 1 degree (good balance between sensitivity and stability)
   */
  toleranceDeg: 1,
};
