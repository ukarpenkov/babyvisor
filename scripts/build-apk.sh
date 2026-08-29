#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

JDK17_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
AS_JBR="/Applications/Android Studio.app/Contents/jbr/Contents/Home"

if [[ -x "$JDK17_HOME/bin/java" ]]; then
  export JAVA_HOME="$JDK17_HOME"
elif [[ -x "${JAVA_HOME:-}/bin/java" ]]; then
  :
elif [[ -x "$AS_JBR/bin/java" ]]; then
  export JAVA_HOME="$AS_JBR"
fi

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

if [[ ! -x "${JAVA_HOME:-}/bin/java" ]]; then
  echo "JAVA_HOME is not a valid JDK: ${JAVA_HOME:-unset}" >&2
  exit 1
fi

if [[ ! -d "$ANDROID_HOME/platforms" ]]; then
  echo "ANDROID_HOME is not a valid SDK: $ANDROID_HOME" >&2
  exit 1
fi

echo "Using JAVA_HOME=$JAVA_HOME"
"$JAVA_HOME/bin/java" -version

CI=1 npx expo prebuild --platform android

GRADLE_PROPS="$ROOT/android/gradle.properties"
if ! grep -q '^org.gradle.java.home=' "$GRADLE_PROPS"; then
  {
    echo ""
    echo "org.gradle.java.home=$JAVA_HOME"
    echo "org.gradle.java.installations.paths=$JAVA_HOME"
  } >> "$GRADLE_PROPS"
fi

cd android
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a

APK="$(find app/build/outputs/apk/release -name '*.apk' | head -n 1)"
if [[ -z "$APK" ]]; then
  echo "Release APK was not produced" >&2
  exit 1
fi

mkdir -p "$ROOT/dist"
cp "$APK" "$ROOT/dist/babyvisor.apk"
echo "APK: $ROOT/dist/babyvisor.apk"
