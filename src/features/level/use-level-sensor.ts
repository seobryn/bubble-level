import AsyncStorage from "@react-native-async-storage/async-storage";
import { Accelerometer, Gyroscope } from "expo-sensors";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  loadCalibration,
  saveCalibration,
} from "@/features/level/calibration-store";
import {
  deriveCalibrationOffset,
  resetCalibrationOffset,
} from "@/features/level/level-calibration";
import { type LevelAngles } from "@/features/level/level-engine";
import { computeLevelFromSensors } from "@/features/level/sensor-adapter";

type SensorStatus = "loading" | "ready" | "error";

type LevelSensorStateData = {
  status: SensorStatus;
  angles: LevelAngles;
  nearLevel: boolean;
  calibrationOffset: LevelAngles;
  errorMessage?: string;
};

export type LevelSensorState = LevelSensorStateData & {
  calibrate: () => Promise<void>;
  resetCalibration: () => Promise<void>;
};

const DEFAULT_ANGLES: LevelAngles = { pitch: 0, roll: 0 };

type MotionPermissionSummary = {
  granted: boolean;
  canAskAgain: boolean;
};

async function requestMotionPermissions(): Promise<MotionPermissionSummary> {
  const responses = await Promise.all([
    Accelerometer.requestPermissionsAsync?.(),
    Gyroscope.requestPermissionsAsync?.(),
  ]);

  const validResponses = responses.filter(
    (response): response is { status: string; canAskAgain?: boolean } =>
      Boolean(response),
  );

  // Web/unsupported platforms may not expose permission APIs.
  if (validResponses.length === 0) {
    return { granted: true, canAskAgain: true };
  }

  return {
    granted: validResponses.every((response) => response.status === "granted"),
    canAskAgain: validResponses.some(
      (response) => response.canAskAgain !== false,
    ),
  };
}

export function useLevelSensor(): LevelSensorState {
  const [state, setState] = useState<LevelSensorStateData>({
    status: "loading",
    angles: DEFAULT_ANGLES,
    nearLevel: true,
    calibrationOffset: resetCalibrationOffset(),
  });

  const latestGyroscope = useRef({ x: 0, y: 0, z: 0 });
  const latestAngles = useRef<LevelAngles>(DEFAULT_ANGLES);
  const calibrationOffset = useRef<LevelAngles>(resetCalibrationOffset());

  const calibrate = useCallback(async () => {
    const nextOffset = deriveCalibrationOffset(
      calibrationOffset.current,
      latestAngles.current,
    );

    calibrationOffset.current = nextOffset;
    await saveCalibration(AsyncStorage, nextOffset);

    setState((current) => ({
      ...current,
      calibrationOffset: nextOffset,
    }));
  }, []);

  const resetCalibration = useCallback(async () => {
    const nextOffset = resetCalibrationOffset();

    calibrationOffset.current = nextOffset;
    await saveCalibration(AsyncStorage, nextOffset);

    setState((current) => ({
      ...current,
      calibrationOffset: nextOffset,
    }));
  }, []);

  useEffect(() => {
    let active = true;

    async function setup() {
      try {
        const permissionSummary = await requestMotionPermissions();

        if (!permissionSummary.granted) {
          if (active) {
            setState({
              status: "error",
              angles: DEFAULT_ANGLES,
              nearLevel: true,
              calibrationOffset: calibrationOffset.current,
              errorMessage: permissionSummary.canAskAgain
                ? "Motion permission is required. Please allow access and reopen the app."
                : "Motion permission was denied. Please enable Motion & Fitness access in Settings.",
            });
          }

          return;
        }

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
              calibrationOffset: calibrationOffset.current,
              errorMessage:
                "Required motion sensors are not available on this device.",
            });
          }

          return;
        }

        const storedCalibration = await loadCalibration(AsyncStorage);
        calibrationOffset.current =
          storedCalibration ?? resetCalibrationOffset();

        Accelerometer.setUpdateInterval(120);
        Gyroscope.setUpdateInterval(120);

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
              calibration: calibrationOffset.current,
              deadbandDeg: 0.08,
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
              calibrationOffset: calibrationOffset.current,
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
            calibrationOffset: calibrationOffset.current,
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

  return {
    ...state,
    calibrate,
    resetCalibration,
  };
}
