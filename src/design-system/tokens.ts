export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const Motion = {
  quick: 120,
  standard: 200,
  relaxed: 320,
} as const;

export const ComponentSize = {
  controlHeight: 44,
} as const;

export const Opacity = {
  disabled: 0.5,
  pressed: 0.85,
} as const;

export const ButtonVariant = {
  solid: "solid",
  ghost: "ghost",
} as const;

export type ButtonVariantValue =
  (typeof ButtonVariant)[keyof typeof ButtonVariant];
