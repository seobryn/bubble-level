import { StyleSheet, View } from "react-native";

/**
 * Simple illustrations for onboarding steps.
 * These are SVG-inspired geometric shapes showing device tilting behavior.
 */

type IllustrationProps = {
  size?: number;
};

const ILLUSTRATION_SIZE = 120;

export function TiltDeviceIllustration({
  size = ILLUSTRATION_SIZE,
}: IllustrationProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Device frame */}
      <View
        style={[
          styles.device,
          {
            width: size * 0.7,
            height: size * 0.85,
            borderRadius: size * 0.1,
          },
        ]}
      >
        {/* Screen */}
        <View
          style={[
            styles.screen,
            {
              width: size * 0.65,
              height: size * 0.8,
            },
          ]}
        />
      </View>

      {/* Tilt indicator arrows */}
      <View
        style={[
          styles.arrow,
          {
            width: size * 0.3,
            height: 3,
            left: size * 0.35,
            top: size * 0.15,
          },
        ]}
      />
      <View
        style={[
          styles.arrow,
          {
            width: 3,
            height: size * 0.3,
            left: size * 0.15,
            top: size * 0.35,
          },
        ]}
      />
    </View>
  );
}

export function CenterBubbleIllustration({
  size = ILLUSTRATION_SIZE,
}: IllustrationProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Vial */}
      <View
        style={[
          styles.vial,
          {
            width: size * 0.15,
            height: size * 0.7,
            borderRadius: size * 0.075,
          },
        ]}
      >
        {/* Liquid inside vial */}
        <View
          style={[
            styles.liquid,
            {
              width: size * 0.12,
              height: size * 0.4,
            },
          ]}
        />
      </View>

      {/* Bubble in center */}
      <View
        style={[
          styles.bubble,
          {
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: size * 0.1,
            left: size * 0.4,
            top: size * 0.38,
          },
        ]}
      >
        {/* Cross inside bubble */}
        <View
          style={[
            styles.crossH,
            {
              width: size * 0.12,
              height: 1.5,
            },
          ]}
        />
        <View
          style={[
            styles.crossV,
            {
              width: 1.5,
              height: size * 0.12,
            },
          ]}
        />
      </View>

      {/* Success indicator */}
      <View
        style={[
          styles.checkmark,
          {
            width: size * 0.25,
            height: size * 0.25,
            right: size * 0.1,
            top: size * 0.25,
          },
        ]}
      />
    </View>
  );
}

export function CalibrateIllustration({
  size = ILLUSTRATION_SIZE,
}: IllustrationProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Device outline */}
      <View
        style={[
          styles.deviceOutline,
          {
            width: size * 0.5,
            height: size * 0.7,
            borderRadius: size * 0.08,
          },
        ]}
      />

      {/* Flat surface indicator */}
      <View
        style={[
          styles.flatSurface,
          {
            width: size * 0.6,
            height: 2,
            bottom: size * 0.1,
          },
        ]}
      />

      {/* Plus icon (settings) */}
      <View
        style={[
          styles.settingsPlus,
          {
            width: size * 0.15,
            height: size * 0.15,
            right: size * 0.15,
            top: size * 0.3,
          },
        ]}
      >
        <View
          style={{
            width: size * 0.1,
            height: 1.5,
            backgroundColor: "#22c55e",
          }}
        />
        <View
          style={{
            width: 1.5,
            height: size * 0.1,
            backgroundColor: "#22c55e",
            position: "absolute",
            left: size * 0.045,
            top: size * 0.045,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  device: {
    borderWidth: 2,
    borderColor: "#1f3122",
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    backgroundColor: "#1a1a1a",
    borderRadius: 4,
  },
  arrow: {
    backgroundColor: "#f97316",
    borderRadius: 2,
    position: "absolute",
    opacity: 0.7,
  },
  vial: {
    borderWidth: 2,
    borderColor: "#1f3122",
    backgroundColor: "#0f1f0f",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    left: "50%",
    marginLeft: -7.5,
  },
  liquid: {
    backgroundColor: "#22c55e",
    borderRadius: 4,
    opacity: 0.6,
  },
  bubble: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#244227",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  crossH: {
    backgroundColor: "#070707",
    borderRadius: 1,
  },
  crossV: {
    backgroundColor: "#070707",
    borderRadius: 1,
    position: "absolute",
  },
  checkmark: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#22c55e",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  deviceOutline: {
    borderWidth: 2,
    borderColor: "#4b5563",
    backgroundColor: "#0f1419",
  },
  flatSurface: {
    backgroundColor: "#94a3b8",
    position: "absolute",
  },
  settingsPlus: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
