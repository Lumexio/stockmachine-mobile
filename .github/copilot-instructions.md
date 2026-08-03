# Copilot instructions

## Architecture and conventions

- Use the exact [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/) before changing Expo configuration or native integration.
- Keep feature code under `src/features/<feature>/` and shared API/state/navigation code under `src/api`, `src/store`, and `src/navigation`.
- Route authenticated requests through `src/api/axios-client.ts`; keep tokens in Expo SecureStore and preserve one-retry refresh behavior.
- Centralize route names in `src/constants/nav-keys.ts` and register screens in `src/navigation/AppNavigator.tsx` or the owning feature navigator.
- Keep all visible text aligned across `src/i18n/locales/{en,es,fr,ja,ru}.ts`.
- Preserve all eight themes through `src/constants/theme.ts` and `src/store/theme-store.ts`.
- Keep touch targets accessible and layouts usable on phone and tablet sizes.

No merged pull-request review history was available to mine; repository and family conventions are authoritative.

## Testing and style

- Use TypeScript and existing path aliases.
- Run `npm test` and `npx tsc --noEmit`.
- Add focused Jest tests for API, store, navigation, quota, and offline behavior.

## Maintenance matrix

| When changing | Also update or verify |
| --- | --- |
| Feature entity or screen | Feature API/types/screens/navigator exports, `src/constants/nav-keys.ts`, `src/navigation/AppNavigator.tsx` when global, and five locale files |
| Backend route or payload | Feature API module, `src/api/axios-client.ts` assumptions, types, auth/location context, offline sync, and backend/client parity |
| Authentication or token flow | SecureStore keys, `src/api/axios-client.ts`, `src/store/auth-store.ts`, auth feature screens/API, and root navigator gating |
| Offline or sync behavior | `src/store/sync-store.ts`, feature data stores/APIs, app foreground polling in `App.tsx`, conflict behavior, and tests |
| Theme or appearance | `src/constants/theme.ts`, `src/store/theme-store.ts`, NativeWind variables in `App.tsx`, settings UI, and all eight schemes |
| User-facing text | All five files in `src/i18n/locales/` and any navigation option titles |
| Expo or native config | `app.json`, config plugins, `package.json`, generated prebuild expectations, Android/iOS workflows, and SDK 57 docs |
| Plans, billing, or team roles | Stripe/provider code, profile/settings UI, backend limits, and matching web/desktop/SPA content |
| Release build | `package.json` version/scripts, `app.json`, Gradle/prebuild inputs, and `.github/workflows/release-mobile.yml`/`release-ios.yml` |
