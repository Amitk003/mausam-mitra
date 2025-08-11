@echo off
echo 🚀 Building Mausam Mitra APK for Android...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found

REM Install Capacitor dependencies
echo 📦 Installing Capacitor dependencies...
call npm install @capacitor/cli @capacitor/core @capacitor/android @capacitor/camera @capacitor/geolocation @capacitor/splash-screen @capacitor/status-bar

REM Initialize Capacitor if not already done
if not exist "android" (
    echo 🔧 Initializing Capacitor...
    call npx cap init "Mausam Mitra" "com.mausammitra.app" --web-dir=public
)

REM Add Android platform if not exists
if not exist "android" (
    echo 🤖 Adding Android platform...
    call npx cap add android
)

REM Copy web assets and sync
echo 🔄 Syncing web assets...
call npx cap copy android
call npx cap sync android

REM Check if Android SDK is available
echo 🔍 Checking Android SDK...
if not exist "android\gradlew.bat" (
    echo ❌ Android project not properly initialized
    echo 📝 Please install Android Studio and SDK
    pause
    exit /b 1
)

REM Build APK
echo 🏗️ Building APK...
cd android
call gradlew.bat assembleDebug

if errorlevel 1 (
    echo ❌ APK build failed
    echo 📝 Make sure Android SDK is properly installed
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ APK built successfully!
echo 📱 APK location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 🔧 To install on device:
echo adb install android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📝 Or copy the APK file to your phone and install manually
pause