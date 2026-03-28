import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { OnboardingHint } from "@/features/onboarding/onboarding-hints";

type OnboardingCarouselProps = {
  hints: OnboardingHint[];
  onDismiss: () => void;
};

export function OnboardingCarousel({
  hints,
  onDismiss,
}: OnboardingCarouselProps) {
  if (hints.length === 0) {
    return null;
  }

  return (
    <ThemedView style={styles.container} type="backgroundElement">
      <View style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          Quick Tips
        </ThemedText>

        {hints.map((hint, index) => (
          <View key={hint.id} style={styles.hintRow}>
            <ThemedText type="small" style={styles.hintNumber}>
              {index + 1}.
            </ThemedText>
            <ThemedText type="small" style={styles.hintText}>
              {hint.text}
            </ThemedText>
          </View>
        ))}
      </View>

      <ThemedText
        type="smallBold"
        onPress={onDismiss}
        style={styles.dismissButton}
      >
        Got it →
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  content: {
    gap: Spacing.three,
  },
  title: {
    marginBottom: Spacing.one,
  },
  hintRow: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "flex-start",
  },
  hintNumber: {
    fontWeight: "600",
    minWidth: Spacing.three,
  },
  hintText: {
    flex: 1,
    lineHeight: 18,
  },
  dismissButton: {
    textAlign: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontWeight: "600",
  },
});
