import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { type Language } from "@/i18n/translations";
import { useTranslation } from "@/i18n/use-translation";

type LanguageSelectorProps = {
  onLanguageChange?: (language: Language) => void;
  variant?: "default" | "compact";
};

export function LanguageSelector({
  onLanguageChange,
  variant = "default",
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useTranslation();

  const handleLanguageChange = async (newLanguage: Language) => {
    await setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <View
      style={[
        styles.container,
        variant === "compact" && styles.containerCompact,
      ]}
    >
      {variant === "default" ? (
        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.label}
        >
          {t("language.label")}
        </ThemedText>
      ) : null}

      <View style={styles.buttonGroup}>
        <Pressable
          onPress={() => handleLanguageChange("en")}
          style={({ pressed }) => [
            styles.button,
            variant === "compact" && styles.buttonCompact,
            language === "en" && styles.buttonActive,
            pressed && styles.buttonPressed,
          ]}
        >
          <ThemedText
            type="smallBold"
            style={[
              styles.buttonText,
              language === "en" && styles.buttonTextActive,
            ]}
          >
            EN
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => handleLanguageChange("es")}
          style={({ pressed }) => [
            styles.button,
            variant === "compact" && styles.buttonCompact,
            language === "es" && styles.buttonActive,
            pressed && styles.buttonPressed,
          ]}
        >
          <ThemedText
            type="smallBold"
            style={[
              styles.buttonText,
              language === "es" && styles.buttonTextActive,
            ]}
          >
            ES
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  containerCompact: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    gap: 0,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 42,
    alignItems: "center",
  },
  buttonCompact: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: Spacing.two,
  },
  buttonActive: {
    backgroundColor: "#4ade80",
    borderColor: "#22c55e",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 13,
    color: "#666",
  },
  buttonTextActive: {
    color: "#fff",
  },
});
