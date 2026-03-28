import { Pressable, StyleSheet, type PressableProps } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  resolveAppButtonStyle,
  type AppButtonColorTheme,
} from "@/components/ui/app-button.styles";
import { Spacing } from "@/constants/theme";
import {
  ButtonVariant,
  ComponentSize,
  Opacity,
  Radius,
  type ButtonVariantValue,
} from "@/design-system/tokens";
import { useTheme } from "@/hooks/use-theme";

type AppButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariantValue;
};

export function AppButton({
  label,
  variant = ButtonVariant.solid,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        resolveAppButtonStyle(variant, theme as AppButtonColorTheme, disabled),
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <ThemedText type="smallBold">{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: ComponentSize.controlHeight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  pressed: {
    opacity: Opacity.pressed,
  },
});
