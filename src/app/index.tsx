import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
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
                <View style={styles.liquidGlow} />

                <View style={styles.centerCross}>
                  <View style={styles.crossHorizontal} />
                  <View style={styles.crossVertical} />
                </View>

                <View
                  style={[
                    styles.bubble,
                    level.nearLevel && styles.bubbleLevel,
                    {
                      transform: [
                        { translateX: bubbleOffset.x },
                        { translateY: bubbleOffset.y },
                      ],
                    },
                  ]}
                >
                  <View style={styles.bubbleCrossHorizontal} />
                  <View style={styles.bubbleCrossVertical} />
                </View>
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
    backgroundColor: "#102111",
    borderWidth: 3,
    borderColor: "#1f3122",
  },
  vialInner: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#69c56d",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  vialInnerLevel: {
    backgroundColor: "#4ade80",
    borderColor: "#22c55e",
  },
  liquidBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#5aba60",
  },
  liquidGlow: {
    position: "absolute",
    left: 16,
    top: 20,
    right: 16,
    height: 80,
    borderRadius: 999,
    backgroundColor: "rgba(229, 255, 210, 0.52)",
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
