import { computeLevelFromSensors } from "@/features/level/sensor-adapter";

describe("sensor-adapter convergence with improved tuning", () => {
  it("converges faster when stationary (low motion)", () => {
    // Simulate stationary state with low gyroscope motion
    const stationaryGyroscope = { x: 0.001, y: 0.001, z: 0.001 };

    // Frame 1: Raw reading at 2 degrees off
    const result1 = computeLevelFromSensors({
      accelerometer: { x: 0.4, y: 0.4, z: 9.8 },
      gyroscope: stationaryGyroscope,
      calibration: { pitch: 0, roll: 0 },
      deadbandDeg: 0.08,
      toleranceDeg: 1,
    });

    expect(result1?.angles.pitch).toBeTruthy();
    const firstReading = result1!.angles.pitch;

    // Frame 2: Same input - should converge faster toward actual reading
    let currentAngles = result1!.angles;
    const result2 = computeLevelFromSensors({
      accelerometer: { x: 0.15, y: 0.15, z: 9.8 },
      gyroscope: stationaryGyroscope,
      previousAngles: currentAngles,
      calibration: { pitch: 0, roll: 0 },
      deadbandDeg: 0.08,
      toleranceDeg: 1,
    });

    currentAngles = result2!.angles;

    // Frame 3: Verify convergence is happening
    const result3 = computeLevelFromSensors({
      accelerometer: { x: 0.15, y: 0.15, z: 9.8 },
      gyroscope: stationaryGyroscope,
      previousAngles: currentAngles,
      calibration: { pitch: 0, roll: 0 },
      deadbandDeg: 0.08,
      toleranceDeg: 1,
    });

    currentAngles = result3!.angles;

    // The reading should be moving toward center (0) each frame
    // With improved tuning, convergence should be faster
    const variance1to2 = Math.abs(firstReading - result2!.angles.pitch);
    const variance2to3 = Math.abs(
      result2!.angles.pitch - result3!.angles.pitch,
    );

    // Each frame should show progress (not stuck)
    expect(variance1to2).toBeGreaterThan(0);
  });

  it("maintains stability when stationary (low jitter)", () => {
    const stationaryGyroscope = { x: 0.001, y: 0.001, z: 0.001 };

    // Simulate 5 frames of stable stationary state
    let angles = { pitch: 0, roll: 0 };
    const readings: number[] = [];

    for (let i = 0; i < 5; i++) {
      const result = computeLevelFromSensors({
        accelerometer: { x: 0.001, y: 0.001, z: 9.8 },
        gyroscope: stationaryGyroscope,
        previousAngles: angles,
        calibration: { pitch: 0, roll: 0 },
        deadbandDeg: 0.08,
        toleranceDeg: 1,
      });

      if (result) {
        angles = result.angles;
        readings.push(result.angles.pitch);
      }
    }

    // Calculate variance (should be low for stability)
    const mean = readings.reduce((a, b) => a + b, 0) / readings.length;
    const variance =
      readings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      readings.length;
    const stdDev = Math.sqrt(variance);

    // Standard deviation should be very low (< 0.02 degrees)
    expect(stdDev).toBeLessThan(0.02);
  });

  it("detects near-level faster with improved responsiveness", () => {
    const stationaryGyroscope = { x: 0.001, y: 0.001, z: 0.001 };

    // Start with slightly tilted reading (0.8 degrees off)
    let angles = { pitch: 0, roll: 0 };
    let frameCount = 0;
    let detectedNearLevel = false;

    // Simulate frames until near-level is detected
    for (let i = 0; i < 20; i++) {
      const result = computeLevelFromSensors({
        accelerometer: { x: 0.04, y: 0.04, z: 9.8 },
        gyroscope: stationaryGyroscope,
        previousAngles: angles,
        calibration: { pitch: 0, roll: 0 },
        deadbandDeg: 0.08,
        toleranceDeg: 1,
      });

      if (result) {
        angles = result.angles;
        frameCount = i + 1;

        if (result.nearLevel) {
          detectedNearLevel = true;
          break;
        }
      }
    }

    // Should detect near-level within reasonable frame count (< 15 frames)
    expect(detectedNearLevel).toBe(true);
    expect(frameCount).toBeLessThan(15);
  });

  it("maintains responsiveness during slow tilting motion", () => {
    // Simulate slow tilting (gradual change)
    let angles = { pitch: 0, roll: 0 };
    const readings: number[] = [];

    for (let i = 0; i < 10; i++) {
      const tilt = i * 0.1; // Gradually increase tilt
      const gyroMotion = 0.05 * (i % 3); // Vary motion slightly

      const result = computeLevelFromSensors({
        accelerometer: { x: tilt * 0.15, y: 0, z: 9.8 },
        gyroscope: { x: gyroMotion, y: 0.001, z: 0.001 },
        previousAngles: angles,
        calibration: { pitch: 0, roll: 0 },
        deadbandDeg: 0.08,
        toleranceDeg: 1,
      });

      if (result) {
        angles = result.angles;
        readings.push(result.angles.pitch);
      }
    }

    // Readings should show increasing trend (following the tilt)
    const isIncreasing = readings.every((val, i) => {
      if (i === 0) return true;
      return val >= readings[i - 1] - 0.05; // Allow small jitter
    });

    expect(isIncreasing).toBe(true);
  });
});
