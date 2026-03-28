import { type ViewStyle } from "react-native";

import {
  ButtonVariant,
  type ButtonVariantValue,
  Opacity,
} from "@/design-system/tokens";

export type AppButtonColorTheme = {
  backgroundElement: string;
  backgroundSelected: string;
};

export function resolveAppButtonStyle(
  variant: ButtonVariantValue,
  theme: AppButtonColorTheme,
  disabled = false,
): ViewStyle {
  const base: ViewStyle = {
    backgroundColor:
      variant === ButtonVariant.solid
        ? theme.backgroundSelected
        : theme.backgroundElement,
    opacity: disabled ? Opacity.disabled : 1,
  };

  return base;
}
