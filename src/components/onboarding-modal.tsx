import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import {
  CalibrateIllustration,
  CenterBubbleIllustration,
  TiltDeviceIllustration,
} from "@/components/onboarding-illustrations";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { OnboardingHint } from "@/features/onboarding/onboarding-hints";
import {
  canGoNext,
  canGoPrevious,
  createInitialStepState,
  getNextStep,
  getPreviousStep,
  getStepProgress,
  isLastStep,
} from "@/features/onboarding/step-manager";

type OnboardingModalProps = {
  hints: OnboardingHint[];
  visible: boolean;
  onDismiss: () => void;
};

const ILLUSTRATION_MAP: Record<
  string,
  React.ComponentType<{ size?: number }>
> = {
  "tilt-device": TiltDeviceIllustration,
  "center-bubble": CenterBubbleIllustration,
  "tap-to-calibrate": CalibrateIllustration,
};

export function OnboardingModal({
  hints,
  visible,
  onDismiss,
}: OnboardingModalProps) {
  const [stepState, setStepState] = useState(() =>
    createInitialStepState(hints.length),
  );

  useEffect(() => {
    setStepState(createInitialStepState(hints.length));
  }, [hints.length]);

  const currentHint = hints[stepState.currentStep];
  const IllustrationComponent = currentHint
    ? ILLUSTRATION_MAP[currentHint.id] || TiltDeviceIllustration
    : null;

  const handleNext = () => {
    setStepState(getNextStep);
  };

  const handlePrevious = () => {
    setStepState(getPreviousStep);
  };

  const handleComplete = () => {
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onDismiss}
    >
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          {/* Illustration */}
          {IllustrationComponent && (
            <View style={styles.illustrationContainer}>
              <IllustrationComponent size={160} />
            </View>
          )}

          {/* Hint Text */}
          {currentHint && (
            <View style={styles.textContainer}>
              <ThemedText type="subtitle" style={styles.stepTitle}>
                Step {stepState.currentStep + 1}
              </ThemedText>
              <ThemedText type="default" style={styles.hintText}>
                {currentHint.text}
              </ThemedText>
            </View>
          )}

          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            {hints.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === stepState.currentStep && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Progress Text */}
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.progressText}
          >
            {getStepProgress(stepState)}
          </ThemedText>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handlePrevious}
            disabled={!canGoPrevious(stepState)}
            style={({ pressed }) => [
              styles.navButton,
              !canGoPrevious(stepState) && styles.navButtonDisabled,
              pressed && styles.navButtonPressed,
            ]}
          >
            <ThemedText
              type="smallBold"
              style={[
                styles.navButtonText,
                !canGoPrevious(stepState) && styles.navButtonTextDisabled,
              ]}
            >
              ← Back
            </ThemedText>
          </Pressable>

          <View style={styles.buttonSpacer} />

          {isLastStep(stepState) ? (
            <Pressable
              onPress={handleComplete}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <ThemedText type="smallBold" style={styles.primaryButtonText}>
                Get Started →
              </ThemedText>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNext}
              disabled={!canGoNext(stepState)}
              style={({ pressed }) => [
                styles.navButton,
                !canGoNext(stepState) && styles.navButtonDisabled,
                pressed && styles.navButtonPressed,
              ]}
            >
              <ThemedText
                type="smallBold"
                style={[
                  styles.navButtonText,
                  !canGoNext(stepState) && styles.navButtonTextDisabled,
                ]}
              >
                Next →
              </ThemedText>
            </Pressable>
          )}
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.six,
  },
  illustrationContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Spacing.four,
  },
  textContainer: {
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  hintText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.two,
    marginVertical: Spacing.four,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cbd5e1",
  },
  dotActive: {
    backgroundColor: "#22c55e",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    textAlign: "center",
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },
  navButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonPressed: {
    backgroundColor: "#f1f5f9",
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    opacity: 0.5,
  },
  buttonSpacer: {
    width: Spacing.two,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonPressed: {
    backgroundColor: "#16a34a",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
