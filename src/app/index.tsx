import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguageSelector } from "@/components/language-selector";
import { OnboardingModal } from "@/components/onboarding-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import {
  hapticTriggerTracker,
  logHapticDiagnostics,
} from "@/features/haptics/haptic-diagnostics";
import { useHapticFeedback } from "@/features/haptics/use-haptic-feedback";
import { computeBubbleOffset } from "@/features/level/bubble-visual";
import { useInterpolatedBubblePosition } from "@/features/level/use-interpolated-bubble";
import { useLevelSensor } from "@/features/level/use-level-sensor";
import { useOnboarding } from "@/features/onboarding/use-onboarding";
import { useTranslation } from "@/i18n/use-translation";

export default function HomeScreen() {
  const level = useLevelSensor();
  const { hints, dismissHints } = useOnboarding();
  const { triggerOnNearLevel } = useHapticFeedback();
  const { t } = useTranslation();
  const prevNearLevelRef = useRef(false);

  // Initialize diagnostics on mount
  useEffect(() => {
    console.log("[App] Initializing haptic diagnostics");
    hapticTriggerTracker.enable();
    logHapticDiagnostics();

    return () => {
      hapticTriggerTracker.disable();
    };
  }, []);

  const bubbleOffset = computeBubbleOffset({
    angles: level.angles,
    travelRadius: 88,
    maxTiltDeg: 10,
  });

  // Smooth interpolation for bubble movement
  const bubbleAnimatedStyle = useInterpolatedBubblePosition(bubbleOffset);

  // Trigger haptic feedback on near-level state change
  useEffect(() => {
    const shouldTrigger = !prevNearLevelRef.current && level.nearLevel;
    hapticTriggerTracker.logTrigger(
      prevNearLevelRef.current,
      level.nearLevel,
      shouldTrigger,
    );

    if (shouldTrigger) {
      console.log("[App] Calling triggerOnNearLevel");
      triggerOnNearLevel(prevNearLevelRef.current, level.nearLevel);
    }

    prevNearLevelRef.current = level.nearLevel;
  }, [level.nearLevel, triggerOnNearLevel]);

  const statusIndicator =
    level.status === "loading"
      ? { text: t("status.initializing"), color: "#999" }
      : level.status === "error"
        ? { text: t("status.error"), color: "#ef4444" }
        : level.nearLevel
          ? { text: t("status.level"), color: "#22c55e" }
          : { text: t("status.adjustPosition"), color: "#f97316" };

  return (
    <>
      <OnboardingModal
        hints={hints}
        visible={hints.length > 0}
        onDismiss={dismissHints}
      />

      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection} type="backgroundElement">
            <View>
              <ThemedText type="title" style={styles.title}>
                {t("app.title")}
              </ThemedText>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.subtitle}
              >
                {t("app.subtitle")}
              </ThemedText>
            </View>
            <LanguageSelector />
          </ThemedView>

          <ThemedView style={styles.levelCard} type="backgroundElement">
            <View style={styles.vialOuter}>
              <View
                style={[
                  styles.vialInner,
                  level.nearLevel && styles.vialInnerLevel,
                ]}
              >
                <View style={styles.liquidBase} />
                <View style={styles.liquidDepth} />
                <View style={styles.liquidGlow} />
                <View style={styles.liquidSheen} />
                <View style={styles.liquidBloom} />

                <View style={styles.centerCross}>
                  <View style={styles.crossHorizontal} />
                  <View style={styles.crossVertical} />
                </View>

                <Animated.View
                  style={[
                    styles.bubble,
                    level.nearLevel && styles.bubbleLevel,
                    bubbleAnimatedStyle,
                  ]}
                >
                  <View style={styles.bubbleCrossHorizontal} />
                  <View style={styles.bubbleCrossVertical} />
                </Animated.View>
              </View>
            </View>

            <View style={styles.statusIndicatorContainer}>
              <ThemedText
                type="smallBold"
                style={[
                  styles.statusIndicatorText,
                  { color: statusIndicator.color },
                ]}
              >
                {statusIndicator.text}
              </ThemedText>
            </View>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "stretch",
    gap: Spacing.three,
    paddingBottom: Spacing.four,
    maxWidth: MaxContentWidth,
    width: "100%",
    justifyContent: "flex-start",
    alignSelf: "center",
  },
  heroSection: {
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    lineHeight: 50,
  },
  subtitle: {
    lineHeight: 20,
  },
  levelCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
    gap: Spacing.three,
  },
  vialOuter: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: "90%",
    borderRadius: 999,
    padding: 10,
    backgroundColor: "#0f2012",
    borderWidth: 3,
    borderColor: "#29462e",
  },
  vialInner: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#64c56f",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  vialInnerLevel: {
    backgroundColor: "#5cea8e",
    borderColor: "#2dd46f",
  },
  liquidBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#58bb66",
  },
  liquidDepth: {
    position: "absolute",
    left: -10,
    right: -10,
    bottom: -8,
    height: "56%",
    borderRadius: 999,
    backgroundColor: "rgba(24, 107, 55, 0.42)",
  },
  liquidGlow: {
    position: "absolute",
    left: 18,
    top: 16,
    right: 18,
    height: 92,
    borderRadius: 999,
    backgroundColor: "rgba(226, 255, 206, 0.58)",
  },
  liquidSheen: {
    position: "absolute",
    width: "36%",
    height: "70%",
    top: "8%",
    left: "10%",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ rotate: "-18deg" }],
  },
  liquidBloom: {
    position: "absolute",
    width: 140,
    height: 140,
    right: -12,
    bottom: -6,
    borderRadius: 999,
    backgroundColor: "rgba(147, 255, 165, 0.2)",
  },
  centerCross: {
    position: "absolute",
    width: 76,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
  },
  crossHorizontal: {
    position: "absolute",
    width: 76,
    height: 2,
    backgroundColor: "#0f0f0f",
  },
  crossVertical: {
    position: "absolute",
    width: 2,
    height: 76,
    backgroundColor: "#0f0f0f",
  },
  bubble: {
    width: 76,
    height: 76,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#244227",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleLevel: {
    borderColor: "#16a34a",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  bubbleCrossHorizontal: {
    position: "absolute",
    width: 28,
    height: 2,
    backgroundColor: "#070707",
  },
  bubbleCrossVertical: {
    position: "absolute",
    width: 2,
    height: 28,
    backgroundColor: "#070707",
  },
  statusIndicatorContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  statusIndicatorText: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
