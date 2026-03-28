import { renderHook } from "@testing-library/react-native";

import {
  useInterpolatedBubblePosition,
  useLinearInterpolatedBubblePosition,
} from "@/features/level/use-interpolated-bubble";

describe("useInterpolatedBubblePosition", () => {
  it("should create animated style", () => {
    const { result } = renderHook(() =>
      useInterpolatedBubblePosition({ x: 10, y: 20 }),
    );

    expect(result.current).toBeDefined();
    expect(result.current.transform).toBeDefined();
  });

  it("should initialize with default config", () => {
    const { result } = renderHook(() =>
      useInterpolatedBubblePosition({ x: 5, y: 15 }),
    );

    expect(result.current).toBeDefined();
  });

  it("should accept custom config", () => {
    const { result } = renderHook(() =>
      useInterpolatedBubblePosition(
        { x: 10, y: 20 },
        {
          damping: 0.9,
          mass: 0.8,
          stiffness: 150,
          overshoot: 0.1,
        },
      ),
    );

    expect(result.current).toBeDefined();
  });

  it("should handle zero offset", () => {
    const { result } = renderHook(() =>
      useInterpolatedBubblePosition({ x: 0, y: 0 }),
    );

    expect(result.current).toBeDefined();
  });

  it("should handle negative offsets", () => {
    const { result } = renderHook(() =>
      useInterpolatedBubblePosition({ x: -50, y: -75 }),
    );

    expect(result.current).toBeDefined();
  });

  it("should handle large offsets", () => {
    const { result } = renderHook(() =>
      useInterpolatedBubblePosition({ x: 500, y: 1000 }),
    );

    expect(result.current).toBeDefined();
  });
});

describe("useLinearInterpolatedBubblePosition", () => {
  it("should create animated style with default duration", () => {
    const { result } = renderHook(() =>
      useLinearInterpolatedBubblePosition({ x: 10, y: 20 }),
    );

    expect(result.current).toBeDefined();
    expect(result.current.transform).toBeDefined();
  });

  it("should accept custom duration", () => {
    const { result } = renderHook(() =>
      useLinearInterpolatedBubblePosition({ x: 10, y: 20 }, 200),
    );

    expect(result.current).toBeDefined();
  });

  it("should handle fast animations (50ms)", () => {
    const { result } = renderHook(() =>
      useLinearInterpolatedBubblePosition({ x: 5, y: 10 }, 50),
    );

    expect(result.current).toBeDefined();
  });

  it("should handle slow animations (500ms)", () => {
    const { result } = renderHook(() =>
      useLinearInterpolatedBubblePosition({ x: 20, y: 30 }, 500),
    );

    expect(result.current).toBeDefined();
  });
});
