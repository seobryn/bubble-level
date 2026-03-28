import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useLevelSensor } from "@/features/level/use-level-sensor";

function formatAngle(value: number) {
  return `${value.toFixed(2)}°`;
}

export default function HomeScreen() {
  const level = useLevelSensor();
  const canCalibrate = level.status === "ready";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection} type="backgroundElement">
          <ThemedText type="title" style={styles.title}>
            Bubble Level
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.subtitle}
          >
            Live pitch and roll from device sensors
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.readingCard} type="backgroundElement">
          <ThemedView style={styles.readingRow}>
            <ThemedText type="small" themeColor="textSecondary">
              Pitch
            </ThemedText>
            <ThemedText type="subtitle">
              {formatAngle(level.angles.pitch)}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.readingRow}>
            <ThemedText type="small" themeColor="textSecondary">
              Roll
            </ThemedText>
            <ThemedText type="subtitle">
              {formatAngle(level.angles.roll)}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.statusCard} type="backgroundElement">
          {level.status === "loading" && (
            <ThemedText type="small">Initializing sensors...</ThemedText>
          )}
          {level.status === "ready" && (
            <ThemedText type="smallBold">
              {level.nearLevel ? "Level detected" : "Adjust device position"}
            </ThemedText>
          )}
          {level.status === "error" && (
            <ThemedText type="small" themeColor="textSecondary">
              {level.errorMessage}
            </ThemedText>
          )}

          <ThemedText type="small" themeColor="textSecondary">
            Calibration offset: pitch{" "}
            {formatAngle(level.calibrationOffset.pitch)} / roll{" "}
            {formatAngle(level.calibrationOffset.roll)}
          </ThemedText>

          <ThemedView style={styles.actionsRow}>
            <AppButton
              disabled={!canCalibrate}
              label="Set Current as Level"
              onPress={() => {
                void level.calibrate();
              }}
            />
            <AppButton
              label="Reset Calibration"
              variant="ghost"
              onPress={() => {
                void level.resetCalibration();
              }}
            />
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
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
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
  },
  heroSection: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
  readingCard: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.three,
  },
  readingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusCard: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
});
