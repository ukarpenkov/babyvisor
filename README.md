# BabyVisor

A mobile app that approximates how visual perception changes from birth to one year of age. A reference section describes developmental stages. The camera and editor apply CSS filters that correspond to those stages.

App version: `2.0.2`. Android package: `com.yurijs.babyvisor`.

Published on [RuStore](https://www.rustore.ru/catalog/app/com.yurijs.babyvisor).

## Purpose

The app does not replace an ophthalmology exam. Filters are a simplified model (blur, desaturation, contrast), not a clinical simulation of acuity, visual field, or binocularity. Stage copy is a parent-facing guide: focus distance, contrast, the onset of color, tracking, and eye–hand coordination.

## Screens

Navigation is a bottom tab bar (`expo-router`, file-based routes under `app/(tabs)`).

| Tab | File | Behavior |
| --- | --- | --- |
| Information | `app/(tabs)/index.tsx` | Accordion of stages at 0–1 month, 1, 2, 3, 4, and 6 months, and 1 year, plus practical recommendations |
| Camera | `app/(tabs)/camera.tsx` | Rear-camera preview, capture via `expo-camera`, save to the media library, then open the editor with `imageUri` |
| Editor | `app/(tabs)/editor.tsx` | Load a photo from the camera or the gallery, pick an age filter, save the result |

## Filter model

Presets live in `FILTERS` (`app/(tabs)/editor.tsx`). The image is encoded as base64 and drawn in a `WebView`, where a CSS `filter` is applied. The finished frame is captured with `react-native-view-shot` and written to the gallery (`expo-media-library`).

| Preset | CSS `filter` |
| --- | --- |
| Original | no filter |
| Newborn | `blur(30px) grayscale(1) contrast(1.2)` |
| 1 month | `blur(25px) grayscale(0.9) sepia(0.3) hue-rotate(-20deg)` |
| 2 months | `blur(15px) grayscale(0.7) contrast(1.1)` |
| 3 months | `blur(10px) grayscale(0.5) contrast(1.1)` |
| 4 months | `blur(6px) grayscale(0.3)` |
| 6 months | `blur(3px) grayscale(0.1)` |
| 1 year | `none` |

## Stack

- React Native `0.79.4`, React `19`, TypeScript
- Expo SDK `53`, New Architecture (`newArchEnabled`)
- Expo Router `5` (typed routes), React Navigation bottom tabs
- `expo-camera`, `expo-image-picker`, `expo-media-library`, `expo-file-system`
- `react-native-webview` for filter rendering, `react-native-view-shot` for export
- `@shopify/react-native-skia` and `expo-gl` are dependencies; the current preview filter is CSS inside a WebView
- Theming: light and dark, `constants/theme.ts`, `hooks/useAppTheme.ts`

App config: `app.config.ts`. Deep link scheme: `babyvisor`. Orientation: portrait. The EAS project id is set in `extra.eas`.

Config plugins:

- `plugins/with-adi-registration.js`
- `plugins/with-camera-preview-fix.js` — Android native preview patch for `expo-camera` (module built from source via `expo.autolinking.android.buildFromSource`)
- `expo-camera` (microphone disabled, `recordAudioAndroid: false`)
- `expo-splash-screen`, `expo-media-library`, `expo-image-picker`

Android permissions: camera, plus photo access to pick and save images.

## Build

Requires Node.js and an Expo CLI compatible with SDK 53. EAS profiles are in `eas.json` (`development`, `preview` APK, `production` with `autoIncrement`).

```bash
npm install
npm start          # Metro
npm run android    # native Android build
npm run ios
npm run web
npm run lint
npm run build:apk  # scripts/build-apk.sh
```
