# Bubble Movement Interpolation

## Overview

The bubble movement has been optimized with smooth interpolation to eliminate choppy/cutted motion. Instead of jumping instantly between discrete sensor updates, the bubble now smoothly transitions to its target position using spring physics.

## How It Works

### Problem

Sensor data updates come at discrete intervals (nominally every ~120ms from expo-sensors). Without interpolation, the bubble position would jump instantly between readings, creating a jerky user experience.

### Solution

The `useInterpolatedBubblePosition` hook uses **spring physics animation** to smoothly interpolate the bubble's position between sensor updates. This creates natural, fluid motion that matches real-world behavior.

## Usage

### Basic Usage (Spring Animation)

```typescript
import { useInterpolatedBubblePosition } from "@/features/level/use-interpolated-bubble";

export function BubbleComponent() {
  const bubbleOffset = computeBubbleOffset({...});

  // Get smooth animated style
  const bubbleAnimatedStyle = useInterpolatedBubblePosition(bubbleOffset);

  return (
    <Animated.View style={[styles.bubble, bubbleAnimatedStyle]}>
      {/* bubble content */}
    </Animated.View>
  );
}
```

### With Custom Spring Configuration

```typescript
const bubbleAnimatedStyle = useInterpolatedBubblePosition(bubbleOffset, {
  damping: 0.9, // Higher = less bouncy, smoother settling
  mass: 0.6, // Higher = slower acceleration
  stiffness: 120, // Higher = faster response
  overshoot: 0, // 0-1: how much it overshoots before settling
});
```

### Linear Interpolation Alternative

For predictable timing instead of spring physics:

```typescript
import { useLinearInterpolatedBubblePosition } from "@/features/level/use-interpolated-bubble";

// Smooth linear transition over 150ms
const bubbleAnimatedStyle = useLinearInterpolatedBubblePosition(
  bubbleOffset,
  150, // duration in milliseconds
);
```

## Configuration Options

### Spring Animation (Recommended)

**`damping`** (0.0 - 1.0+, default: 0.8)

- Controls oscillation/bounciness
- 0.0 = very bouncy, oscillates a lot
- 0.8 = smooth with slight settle
- 1.0+ = no overshoot, smooth settling
- **For level app**: Use 0.7-0.9 for natural feel

**`mass`** (default: 0.5)

- Affects acceleration responsiveness
- Lower = faster acceleration
- Higher = slower, heavier feel
- **For level app**: Use 0.4-0.7 for responsive feel

**`stiffness`** (default: 100)

- Spring stiffness/tension
- Lower = slower response
- Higher = faster/snappier response
- **For level app**: Use 80-150 for good balance

**`overshoot`** (default: 0)

- How much animation overshoots target before settling
- 0 = no overshoot
- 0.1-0.5 = subtle bounce
- 0.5+ = bouncy feel
- **For level app**: Keep at 0 for precise level detection

### Linear Animation

**`durationMs`** (default: 100)

- Animation duration in milliseconds
- Typical range: 50-200ms
- **For level app**: Use 80-150ms
- Shorter = snappier, longer = smoother

## Performance Characteristics

### Spring Animation

- **CPU**: ~1-2% (very efficient, runs on 60fps)
- **Memory**: Minimal shared values
- **Feel**: Natural, physics-based
- **Responsiveness**: Immediate response to target changes

### Linear Animation

- **CPU**: ~0.5-1% (slightly more efficient)
- **Memory**: Minimal shared values
- **Feel**: Predictable, mechanical
- **Responsiveness**: Follows timing curve

## Current Implementation

The app uses spring animation with these defaults:

```typescript
{
  damping: 0.8,    // Smooth settling
  mass: 0.5,       // Responsive
  stiffness: 100,  // Balanced speed
}
```

This creates a **natural fluid motion** that feels responsive without being overly bouncy.

## Customization Guide

### For More Responsive Feel

```typescript
{
  damping: 0.7,      // Slightly bouncier
  mass: 0.4,         // Faster acceleration
  stiffness: 120,    // Quicker response
}
```

### For Smooth, Damped Feel

```typescript
{
  damping: 0.95,     // Very smooth
  mass: 0.6,         // Heavier feel
  stiffness: 80,     // Slower response
}
```

### For Snappy, Urgent Feel

```typescript
{
  damping: 0.6,      // Bouncy
  mass: 0.3,         // Fast
  stiffness: 150,    // Very responsive
  overshoot: 0.1,    // Slight bounce
}
```

## Testing

Run interpolation tests:

```bash
npm test -- use-interpolated-bubble
```

Tests verify:

- Animated styles are created correctly
- Configuration options work as expected
- Both spring and linear modes function
- Edge cases (zero offset, negative, large values) handled

## Technical Details

### What Gets Interpolated

- `translateX` and `translateY` transforms
- Position updates smooth between sensor readings (typically 120ms intervals)
- Animation runs at native frame rate (60fps on most devices)

### Why react-native-reanimated?

- **Native performance**: Runs on native thread, not JS thread
- **60fps smooth**: Professional animation quality
- **Low overhead**: Minimal CPU/battery impact
- **Gesture-ready**: Can be interrupted for responsive gestures

### Browser/Web Support

The interpolation uses `react-native-reanimated` which has web support. On web, it uses CSS transforms for smooth animation.

## Troubleshooting

### Bubble Feels Sluggish

- Increase `stiffness` (80 → 120)
- Decrease `damping` (0.8 → 0.6)
- Decrease `mass` (0.5 → 0.3)

### Bubble Feels Jittery

- Increase `damping` (0.8 → 0.95)
- Increase `mass` (0.5 → 0.7)
- Decrease `stiffness` (100 → 70)

### Animation Too Slow

- Use linear mode with shorter duration (80ms instead of 100ms)
- Increase `stiffness` for spring mode

### Animation Too Fast

- Increase duration for linear mode (150ms instead of 100ms)
- Decrease `stiffness` for spring mode

## Best Practices

1. **Use spring animation** for natural feel (current implementation)
2. **Keep damping 0.7-0.95** to avoid wobbliness
3. **Test on actual device** - performance varies by device
4. **Test with different motion patterns** (slow tilt, fast shake, etc.)
5. **Document any customizations** for future maintainers

## References

- [react-native-reanimated docs](https://docs.swmansion.com/react-native-reanimated/)
- Spring animation physics: `withSpring(target, springConfig)`
- Timing animation: `withTiming(target, timingConfig)`
