/**
 * Diagnostic utility for debugging haptic feedback issues.
 * Use this to verify expo-haptics availability and test haptic execution.
 */

export async function testHapticAvailability(): Promise<{
  available: boolean;
  error?: string;
}> {
  try {
    const { vibrate } = await import("expo-haptics");

    if (!vibrate) {
      return {
        available: false,
        error: "expo-haptics found but vibrate function not available",
      };
    }

    // Try a minimal vibration
    await vibrate(10);

    return { available: true };
  } catch (error) {
    return {
      available: false,
      error: `${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function logHapticDiagnostics(): Promise<void> {
  console.log("[Haptics] Starting diagnostic...");

  const result = await testHapticAvailability();

  if (result.available) {
    console.log("[Haptics] ✅ Haptics available and working");
  } else {
    console.warn("[Haptics] ❌ Haptics not available", result.error);
  }
}

export type HapticTriggerLog = {
  timestamp: number;
  prevNearLevel: boolean;
  currentNearLevel: boolean;
  triggered: boolean;
};

class HapticTriggerTracker {
  private logs: HapticTriggerLog[] = [];
  private enabled = false;

  enable(): void {
    this.enabled = true;
    this.logs = [];
    console.log("[Haptics] Trigger logging enabled");
  }

  disable(): void {
    this.enabled = false;
    console.log("[Haptics] Trigger logging disabled");
  }

  logTrigger(
    prevNearLevel: boolean,
    currentNearLevel: boolean,
    triggered: boolean,
  ): void {
    if (!this.enabled) {
      return;
    }

    const log: HapticTriggerLog = {
      timestamp: Date.now(),
      prevNearLevel,
      currentNearLevel,
      triggered,
    };

    this.logs.push(log);

    const transitionStr = `${prevNearLevel} → ${currentNearLevel}`;
    const status = triggered ? "✓ TRIGGER" : "✗ skip";

    console.log(`[Haptics] ${status} | Transition: ${transitionStr}`);
  }

  getLogs(): HapticTriggerLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const hapticTriggerTracker = new HapticTriggerTracker();
