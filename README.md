# STOCKMACHINE Mobile

[![AI Ready](https://img.shields.io/badge/AI--Ready-yes-brightgreen?style=flat)](https://github.com/johnpapa/ai-ready)

Expo/React Native client for STOCKMACHINE inventory, dashboard, history, profile, settings, offline use, and synchronized API access.

## Setup

Use the [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/) for version-specific behavior.

```bash
cp .env.example .env
npm ci
npm start
```

Android release builds generate the native project before invoking Gradle:

```bash
npm run prebuild
npm run build-android
```

## Validation

```bash
npm test
npx tsc --noEmit
```

## Contributing

Fork the repository, create a focused branch, and use Expo SDK 57-compatible APIs. Keep API work in feature modules, tokens in SecureStore, navigation keys centralized, and visible text synchronized across en, es, fr, ja, and ru. Run the validation commands above before opening a pull request and describe native or cross-client impact.
