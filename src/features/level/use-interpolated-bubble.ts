import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import type { BubbleOffset } from "@/features/level/bubble-visual";

type InterpolationConfig = {
  /**
   * Damping ratio for spring animation (0-1).
   * Lower = more bouncy, Higher = more damped
   * Default: 0.8
   */
  damping?: number;

  /**
   * Mass of the animated object
   * Default: 0.5
   */
  mass?: number;

  /**
   * Stiffness of the spring (how quickly it moves)
   * Default: 100
   */
  stiffness?: number;
};

/**
 * Hook to smoothly interpolate bubble position using spring animation.
 * Prevents jumpy/cutted movement by smoothly transitioning between
 * discrete sensor updates.
 *
 * @param targetOffset - Target bubble position {x, y}
 * @param config - Spring animation configuration
 * @returns Animated style object for use with Animated.View
 *
 * @example
 * const bubbleAnimatedStyle = useInterpolatedBubblePosition(bubbleOffset);
 * <Animated.View style={[styles.bubble, bubbleAnimatedStyle]} />
 */
export function useInterpolatedBubblePosition(
  targetOffset: BubbleOffset,
  config: InterpolationConfig = {},
) {
  const { damping = 0.8, mass = 0.5, stiffness = 100 } = config;

  const animatedX = useSharedValue(targetOffset.x);
  const animatedY = useSharedValue(targetOffset.y);

  // Update animated values when target changes
  useEffect(() => {
    animatedX.value = withSpring(targetOffset.x, {
      damping,
      mass,
      stiffness,
    });

    animatedY.value = withSpring(targetOffset.y, {
      damping,
      mass,
      stiffness,
    });
  }, [targetOffset.x, targetOffset.y, damping, mass, stiffness]);

  return useAnimatedStyle(() => ({
    transform: [
      { translateX: animatedX.value },
      { translateY: animatedY.value },
    ],
  }));
}

/**
 * Alternative hook using linear interpolation with custom duration.
 * Useful if you prefer predictable timing over spring physics.
 *
 * @param targetOffset - Target bubble position {x, y}
 * @param durationMs - Animation duration in milliseconds (default: 100)
 * @returns Animated style object for use with Animated.View
 *
 * @example
 * const bubbleAnimatedStyle = useLinearInterpolatedBubblePosition(
 *   bubbleOffset,
 *   150  // 150ms smooth transition
 * );
 */
export function useLinearInterpolatedBubblePosition(
  targetOffset: BubbleOffset,
  durationMs: number = 100,
) {
  const animatedX = useSharedValue(targetOffset.x);
  const animatedY = useSharedValue(targetOffset.y);

  useEffect(() => {
    animatedX.value = withTiming(targetOffset.x, {
      duration: durationMs,
      easing: Easing.inOut(Easing.ease),
    });

    animatedY.value = withTiming(targetOffset.y, {
      duration: durationMs,
      easing: Easing.inOut(Easing.ease),
    });
  }, [targetOffset.x, targetOffset.y, durationMs]);

  return useAnimatedStyle(() => ({
    transform: [
      { translateX: animatedX.value },
      { translateY: animatedY.value },
    ],
  }));
}
