// Mock global __DEV__ for tests
global.__DEV__ = true;

// Mock AsyncStorage since it's commonly used in the app
// Using require inside ensure variable isn't out of scope for jest.mock
jest.mock("@react-native-async-storage/async-storage", () => 
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Add any other global mocks or setup logic here
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

// Suppress react-test-renderer deprecation warning from @testing-library/react-native
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = String(args[0] || "");
  if (
    msg.includes("react-test-renderer is deprecated") ||
    msg.includes("Failed to execute haptic")
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};
