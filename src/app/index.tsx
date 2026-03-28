import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { computeBubbleOffset } from "@/features/level/bubble-visual";
import { useLevelSensor } from "@/features/level/use-level-sensor";

export default function HomeScreen() {
  const level = useLevelSensor();
  const bubbleOffset = computeBubbleOffset({
    angles: level.angles,
    travelRadius: 88,
    maxTiltDeg: 10,
  });

  const statusIndicator =
    level.status === "loading"
      ? { text: "Initializing...", color: "#999" }
      : level.status === "error"
        ? { text: "Error", color: "#ef4444" }
        : level.nearLevel
          ? { text: "✓ Level", color: "#22c55e" }
          : { text: "Adjust Position", color: "#f97316" };

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
            Tilt the device and keep the bubble on the center cross
          </ThemedText>
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
    justifyContent: "space-evenly",
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
  levelCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.three,
  },
  vialOuter: {
    width: "100%",
    maxWidth: 320,
    aspectRatio: 1,
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
