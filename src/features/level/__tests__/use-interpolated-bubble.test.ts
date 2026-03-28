import { useInterpolatedBubblePosition } from "@/features/level/use-interpolated-bubble";

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => ({
  useSharedValue: (initialValue: number) => ({
    value: initialValue,
  }),
  useAnimatedStyle: (callback: () => any) => callback(),
  withSpring: (target: number) => target,
  withTiming: (target: number) => target,
  Easing: {
    inOut: (easing: any) => easing,
    ease: () => {},
  },
}));

describe("useInterpolatedBubblePosition", () => {
  it("should return animated style object", () => {
    const result = useInterpolatedBubblePosition({ x: 10, y: 20 });

    expect(result).toBeDefined();
    expect(result.transform).toBeDefined();
  });

  it("should initialize with default config", () => {
    const result = useInterpolatedBubblePosition({ x: 5, y: 15 });

    expect(result).toBeDefined();
    expect(Array.isArray(result.transform)).toBe(true);
  });

  it("should accept custom config", () => {
    const result = useInterpolatedBubblePosition(
      { x: 10, y: 20 },
      {
        damping: 0.9,
        mass: 0.8,
        stiffness: 150,
      },
    );

    expect(result).toBeDefined();
  });

  it("should handle zero offset", () => {
    const result = useInterpolatedBubblePosition({ x: 0, y: 0 });

    expect(result).toBeDefined();
    expect(result.transform).toHaveLength(2);
  });

  it("should handle negative offsets", () => {
    const result = useInterpolatedBubblePosition({ x: -50, y: -75 });

    expect(result).toBeDefined();
    expect(result.transform).toHaveLength(2);
  });

  it("should handle large offsets", () => {
    const result = useInterpolatedBubblePosition({ x: 500, y: 1000 });

    expect(result).toBeDefined();
    expect(result.transform).toHaveLength(2);
  });
});

describe("useLinearInterpolatedBubblePosition", () => {
  it("should create animated style with default duration", () => {
    const { useLinearInterpolatedBubblePosition } = require("@/features/level/use-interpolated-bubble");
    const result = useLinearInterpolatedBubblePosition({ x: 10, y: 20 });

    expect(result).toBeDefined();
    expect(result.transform).toBeDefined();
  });

  it("should accept custom duration", () => {
    const { useLinearInterpolatedBubblePosition } = require("@/features/level/use-interpolated-bubble");
    const result = useLinearInterpolatedBubblePosition({ x: 10, y: 20 }, 200);

    expect(result).toBeDefined();
  });

  it("should handle fast animations (50ms)", () => {
    const { useLinearInterpolatedBubblePosition } = require("@/features/level/use-interpolated-bubble");
    const result = useLinearInterpolatedBubblePosition({ x: 5, y: 10 }, 50);

    expect(result).toBeDefined();
  });

  it("should handle slow animations (500ms)", () => {
    const { useLinearInterpolatedBubblePosition } = require("@/features/level/use-interpolated-bubble");
    const result = useLinearInterpolatedBubblePosition({ x: 20, y: 30 }, 500);

    expect(result).toBeDefined();
  });
});
