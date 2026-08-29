#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export JAVA_HOME="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

if [[ ! -x "$JAVA_HOME/bin/java" ]]; then
  echo "JAVA_HOME is not a valid JDK: $JAVA_HOME" >&2
  exit 1
fi

if [[ ! -d "$ANDROID_HOME/platforms" ]]; then
  echo "ANDROID_HOME is not a valid SDK: $ANDROID_HOME" >&2
  exit 1
fi

npx expo prebuild --platform android --non-interactive

cd android
./gradlew assembleRelease

APK="$(find app/build/outputs/apk/release -name '*.apk' | head -n 1)"
if [[ -z "$APK" ]]; then
  echo "Release APK was not produced" >&2
  exit 1
fi

mkdir -p "$ROOT/dist"
cp "$APK" "$ROOT/dist/babyvisor.apk"
echo "APK: $ROOT/dist/babyvisor.apk"
