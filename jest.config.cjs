module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^react-native$": "react-native-web",
  },
  globals: {
    __DEV__: true,
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
