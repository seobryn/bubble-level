import { Accelerometer, Gyroscope } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

import { type LevelAngles } from "@/features/level/level-engine";
import { computeLevelFromSensors } from "@/features/level/sensor-adapter";

type SensorStatus = "loading" | "ready" | "error";

export type LevelSensorState = {
  status: SensorStatus;
  angles: LevelAngles;
  nearLevel: boolean;
  errorMessage?: string;
};

const DEFAULT_ANGLES: LevelAngles = { pitch: 0, roll: 0 };

export function useLevelSensor(): LevelSensorState {
  const [state, setState] = useState<LevelSensorState>({
    status: "loading",
    angles: DEFAULT_ANGLES,
    nearLevel: true,
  });

  const latestGyroscope = useRef({ x: 0, y: 0, z: 0 });
  const latestAngles = useRef<LevelAngles>(DEFAULT_ANGLES);

  useEffect(() => {
    let active = true;

    async function setup() {
      try {
        const [accelerometerAvailable, gyroscopeAvailable] = await Promise.all([
          Accelerometer.isAvailableAsync(),
          Gyroscope.isAvailableAsync(),
        ]);

        if (!accelerometerAvailable || !gyroscopeAvailable) {
          if (active) {
            setState({
              status: "error",
              angles: DEFAULT_ANGLES,
              nearLevel: true,
              errorMessage:
                "Required motion sensors are not available on this device.",
            });
          }

          return;
        }

        Accelerometer.setUpdateInterval(100);
        Gyroscope.setUpdateInterval(100);

        const gyroscopeSubscription = Gyroscope.addListener((measurement) => {
          latestGyroscope.current = {
            x: measurement.x,
            y: measurement.y,
            z: measurement.z,
          };
        });

        const accelerometerSubscription = Accelerometer.addListener(
          (measurement) => {
            const result = computeLevelFromSensors({
              accelerometer: {
                x: measurement.x,
                y: measurement.y,
                z: measurement.z,
              },
              gyroscope: latestGyroscope.current,
              previousAngles: latestAngles.current,
              alpha: 0.2,
              toleranceDeg: 1,
            });

            if (!result || !active) {
              return;
            }

            latestAngles.current = result.angles;

            setState({
              status: "ready",
              angles: result.angles,
              nearLevel: result.nearLevel,
            });
          },
        );

        if (!active) {
          accelerometerSubscription.remove();
          gyroscopeSubscription.remove();
          return;
        }

        return () => {
          accelerometerSubscription.remove();
          gyroscopeSubscription.remove();
        };
      } catch {
        if (active) {
          setState({
            status: "error",
            angles: DEFAULT_ANGLES,
            nearLevel: true,
            errorMessage: "Unable to start motion sensors. Please try again.",
          });
        }
      }
    }

    let teardown: (() => void) | undefined;

    setup().then((cleanup) => {
      teardown = cleanup;
    });

    return () => {
      active = false;
      teardown?.();
    };
  }, []);

  return state;
}
