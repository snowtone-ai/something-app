# Builds the store-submittable Android App Bundle (.aab).
# Requires: Android SDK + JDK 17+ (ANDROID_HOME set), or run the CI workflow instead.
$ErrorActionPreference = 'Stop'

npm run build
npx cap sync android

Push-Location android
try {
  ./gradlew.bat bundleRelease
} finally {
  Pop-Location
}

Write-Host "`nAAB written to android/app/build/outputs/bundle/release/app-release.aab"
Write-Host "Sign it for Play upload with your upload key, e.g.:"
Write-Host "  jarsigner -keystore your-upload.keystore android/app/build/outputs/bundle/release/app-release.aab upload"
