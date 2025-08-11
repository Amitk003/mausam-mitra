#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🤖 Setting up Android APK build for Mausam Mitra...\n');

// Create package.json for mobile build if it doesn't exist
const mobilePackageJson = {
  "name": "mausam-mitra-mobile",
  "version": "1.0.0",
  "description": "Mausam Mitra Mobile App",
  "main": "index.js",
  "scripts": {
    "build": "echo 'Building for production...'",
    "android:dev": "npx cap run android",
    "android:build": "npx cap build android",
    "android:sync": "npx cap sync android",
    "ios:dev": "npx cap run ios",
    "ios:build": "npx cap build ios",
    "ios:sync": "npx cap sync ios"
  },
  "dependencies": {
    "@capacitor/android": "^5.0.0",
    "@capacitor/cli": "^5.0.0",
    "@capacitor/core": "^5.0.0",
    "@capacitor/camera": "^5.0.0",
    "@capacitor/geolocation": "^5.0.0",
    "@capacitor/splash-screen": "^5.0.0",
    "@capacitor/status-bar": "^5.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^5.0.0"
  }
};

// Write mobile package.json
fs.writeFileSync('package-mobile.json', JSON.stringify(mobilePackageJson, null, 2));

console.log('✅ Created package-mobile.json');

// Create build script
const buildScript = `#!/bin/bash

echo "🚀 Building Mausam Mitra APK..."

# Install Capacitor dependencies
echo "📦 Installing Capacitor dependencies..."
npm install @capacitor/cli @capacitor/core @capacitor/android @capacitor/camera @capacitor/geolocation @capacitor/splash-screen @capacitor/status-bar

# Initialize Capacitor (if not already done)
if [ ! -d "android" ]; then
    echo "🔧 Initializing Capacitor..."
    npx cap init "Mausam Mitra" "com.mausammitra.app" --web-dir=public
fi

# Add Android platform
if [ ! -d "android" ]; then
    echo "🤖 Adding Android platform..."
    npx cap add android
fi

# Copy web assets and sync
echo "🔄 Syncing web assets..."
npx cap copy android
npx cap sync android

# Build APK
echo "🏗️ Building APK..."
cd android
./gradlew assembleDebug

echo "✅ APK built successfully!"
echo "📱 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "🔧 To install on device:"
echo "adb install android/app/build/outputs/apk/debug/app-debug.apk"
`;

fs.writeFileSync('build-apk.sh', buildScript);
fs.chmodSync('build-apk.sh', '755');

console.log('✅ Created build-apk.sh script');

// Create Android app icons directory structure
const iconsDir = 'public/icons';
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple icon generator script
const iconScript = `#!/usr/bin/env node

const fs = require('fs');

console.log('📱 Generating app icons...');

// Create simple SVG icon
const svgIcon = \`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2E7D32" rx="64"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" text-anchor="middle" fill="white">🌾</text>
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="#E8F5E8">Mausam Mitra</text>
</svg>\`;

fs.writeFileSync('public/icons/icon.svg', svgIcon);

console.log('✅ Created app icon SVG');
console.log('📝 Note: For production, generate proper PNG icons using online tools or design software');
console.log('   Recommended sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512');
`;

fs.writeFileSync('generate-icons.js', iconScript);
fs.chmodSync('generate-icons.js', '755');

console.log('✅ Created generate-icons.js script');

console.log('\n🎉 Android setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Run: chmod +x build-apk.sh');
console.log('2. Run: ./build-apk.sh');
console.log('3. Install Android Studio and SDK if not already installed');
console.log('4. Connect your Android device or start emulator');
console.log('5. Run: adb install android/app/build/outputs/apk/debug/app-debug.apk');
console.log('\n📱 Your APK will be ready for testing!');