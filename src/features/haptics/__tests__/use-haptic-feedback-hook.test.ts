import { resetHapticState } from "@/features/haptics/haptic-feedback";
import { useHapticFeedback } from "@/features/haptics/use-haptic-feedback";

describe("useHapticFeedback hook", () => {
  beforeEach(() => {
    resetHapticState();
  });

  it("triggers haptic callback when transitioning to near-level", () => {
    const mockHaptic = jest.fn().mockResolvedValue(undefined);
    const { result } = require("@testing-library/react-native").renderHook(() =>
      useHapticFeedback({ executeHaptic: mockHaptic }),
    );

    // Simulate transition from not near-level to near-level
    result.current.triggerOnNearLevel(false, true);

    expect(mockHaptic).toHaveBeenCalledTimes(1);
  });

  it("does not trigger when staying near-level", () => {
    const mockHaptic = jest.fn();
    const { result } = require("@testing-library/react-native").renderHook(() =>
      useHapticFeedback({ executeHaptic: mockHaptic }),
    );

    // First transition
    result.current.triggerOnNearLevel(false, true);
    expect(mockHaptic).toHaveBeenCalledTimes(1);

    // Stay near-level
    result.current.triggerOnNearLevel(true, true);
    expect(mockHaptic).toHaveBeenCalledTimes(1); // No additional call
  });

  it("handles async haptic execution", async () => {
    const mockHaptic = jest.fn().mockImplementation(() =>
      Promise.resolve().then(() => {
        // Simulate async execution
      }),
    );

    const { result } = require("@testing-library/react-native").renderHook(() =>
      useHapticFeedback({ executeHaptic: mockHaptic }),
    );

    result.current.triggerOnNearLevel(false, true);

    expect(mockHaptic).toHaveBeenCalledTimes(1);

    // Wait for promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockHaptic).toHaveBeenCalledTimes(1);
  });

  it("handles haptic execution errors gracefully", () => {
    const mockError = new Error("Haptic not available");
    const mockHaptic = jest.fn().mockRejectedValue(mockError);

    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    const { result } = require("@testing-library/react-native").renderHook(() =>
      useHapticFeedback({ executeHaptic: mockHaptic }),
    );

    result.current.triggerOnNearLevel(false, true);

    expect(mockHaptic).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it("uses default haptic when not provided", () => {
    const { result } = require("@testing-library/react-native").renderHook(() =>
      useHapticFeedback(),
    );

    // Should not throw
    result.current.triggerOnNearLevel(false, true);
  });
});
