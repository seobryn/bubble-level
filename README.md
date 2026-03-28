# Bubble Level

Bubble Level is a React Native and Expo app that turns your phone into a fluid, high-precision spirit level.

The app combines accelerometer and gyroscope data, smooths movement for stability, supports calibration, includes first-run onboarding, haptic feedback near level, and bilingual UI (English and Spanish).

## Features

- Accurate level estimation using accelerometer and gyroscope fusion
- Bubble movement smoothing and interpolation for fluid UX
- Deadband and near-level tolerance for practical stability
- One-tap calibration with persisted offsets
- First-run onboarding with step-by-step guidance
- Haptic feedback when transitioning into near-level state
- Language switcher with persistent preference (English and Spanish)
- Motion permission handling on first launch

## Tech Stack

- Expo 55 (canary)
- React 19
- React Native 0.83
- TypeScript
- Expo Router
- Expo Sensors
- Expo Haptics
- AsyncStorage
- Jest

## Project Structure

- src/app: App screens and layout
- src/features/level: Core level math, sensor adapter, calibration, hook
- src/features/haptics: Haptic trigger logic and diagnostics
- src/features/onboarding: First-run onboarding flow and state
- src/i18n: Translation tables, language context, translation hook
- src/components: Reusable UI components
- docs: Product stories and implementation notes

## Requirements

- Node.js 20+
- Yarn 1.22+ (project packageManager is Yarn)
- Xcode for iOS simulator
- Android Studio for Android emulator

## Getting Started

1. Install dependencies

   yarn install

2. Install native-compatible Expo packages (recommended whenever dependencies change)

   npx expo install

3. Start the development server

   yarn start

4. Run on platform

   yarn ios
   yarn android
   yarn web

## Permissions

The app requests motion permissions on first launch so sensors can work correctly.

- iOS: NSMotionUsageDescription is configured in app.json
- Android: sensor availability is validated at runtime

If motion permission is denied, level sensing remains unavailable until permission is granted.

## Haptics Setup

Haptic feedback uses expo-haptics.

If you ever see module errors, run:

npx expo install expo-haptics

Then restart the app.

## Internationalization

Supported languages:

- English (en)
- Spanish (es)

Language can be changed in-app and is persisted locally.

Main i18n files:

- src/i18n/translations.ts
- src/i18n/language-context.tsx
- src/i18n/use-translation.ts

## Testing and Linting

- Run tests

  yarn test

- Watch mode

  yarn test:watch

- Lint

  yarn lint

## Troubleshooting

1. Sensors not working

- Verify motion permission is granted
- Reopen the app after granting permission

2. Haptics not triggering

- Ensure expo-haptics is installed
- Test on physical device (simulators may not provide haptic hardware)

3. Choppy or oscillating bubble

- Check interpolation and spring tuning in src/features/level/use-interpolated-bubble.ts

## Development Notes

- The app uses feature-oriented architecture under src/features
- Sensor logic and UI are intentionally separated for testability
- Calibration and language preference are persisted in AsyncStorage

## Scripts

- yarn start: Start Expo dev server
- yarn ios: Start and open iOS
- yarn android: Start and open Android
- yarn web: Start for web
- yarn test: Run Jest tests
- yarn test:watch: Run Jest in watch mode
- yarn lint: Run ESLint
- yarn reset-project: Reset scaffold helper script

## License

Private project.
