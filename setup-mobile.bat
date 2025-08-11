@echo off
echo 🌾 Mausam Mitra - Mobile Setup
echo ================================
echo.

REM Create icons directory
if not exist "public\icons" mkdir "public\icons"

REM Create simple app icons (placeholder)
echo 📱 Creating app icons...

REM Create a simple HTML file to generate icons
echo ^<html^>^<head^>^<style^>canvas{border:1px solid #ccc;}^</style^>^</head^>^<body^> > temp-icon-generator.html
echo ^<h2^>Mausam Mitra Icon Generator^</h2^> >> temp-icon-generator.html
echo ^<canvas id="canvas" width="512" height="512"^>^</canvas^>^<br^>^<br^> >> temp-icon-generator.html
echo ^<button onclick="downloadIcon()"^>Download Icon^</button^> >> temp-icon-generator.html
echo ^<script^> >> temp-icon-generator.html
echo const canvas = document.getElementById('canvas'); >> temp-icon-generator.html
echo const ctx = canvas.getContext('2d'); >> temp-icon-generator.html
echo ctx.fillStyle = '#2E7D32'; >> temp-icon-generator.html
echo ctx.fillRect(0, 0, 512, 512); >> temp-icon-generator.html
echo ctx.font = '200px Arial'; >> temp-icon-generator.html
echo ctx.fillStyle = 'white'; >> temp-icon-generator.html
echo ctx.textAlign = 'center'; >> temp-icon-generator.html
echo ctx.fillText('🌾', 256, 320); >> temp-icon-generator.html
echo ctx.font = '48px Arial'; >> temp-icon-generator.html
echo ctx.fillStyle = '#E8F5E8'; >> temp-icon-generator.html
echo ctx.fillText('Mausam Mitra', 256, 420); >> temp-icon-generator.html
echo function downloadIcon() { >> temp-icon-generator.html
echo   const link = document.createElement('a'); >> temp-icon-generator.html
echo   link.download = 'icon-512x512.png'; >> temp-icon-generator.html
echo   link.href = canvas.toDataURL(); >> temp-icon-generator.html
echo   link.click(); >> temp-icon-generator.html
echo } >> temp-icon-generator.html
echo ^</script^>^</body^>^</html^> >> temp-icon-generator.html

echo ✅ Created icon generator
echo 📝 Open temp-icon-generator.html in browser to download app icon

REM Update package.json with mobile scripts
echo 📦 Adding mobile build scripts to package.json...

REM Create mobile build configuration
echo { > mobile-config.json
echo   "name": "mausam-mitra-mobile", >> mobile-config.json
echo   "version": "1.0.0", >> mobile-config.json
echo   "scripts": { >> mobile-config.json
echo     "mobile:setup": "npm install @capacitor/cli @capacitor/core @capacitor/android", >> mobile-config.json
echo     "mobile:init": "npx cap init \"Mausam Mitra\" \"com.mausammitra.app\" --web-dir=public", >> mobile-config.json
echo     "mobile:add-android": "npx cap add android", >> mobile-config.json
echo     "mobile:sync": "npx cap sync android", >> mobile-config.json
echo     "mobile:build": "npx cap build android", >> mobile-config.json
echo     "mobile:run": "npx cap run android" >> mobile-config.json
echo   } >> mobile-config.json
echo } >> mobile-config.json

echo ✅ Created mobile configuration

echo.
echo 🎉 Mobile setup complete!
echo.
echo 📋 Next steps:
echo 1. Install Android Studio: https://developer.android.com/studio
echo 2. Install Android SDK and tools
echo 3. Run: build-apk.bat
echo 4. Connect your Android device
echo 5. Install the generated APK
echo.
echo 📱 Quick test (without APK):
echo 1. Run: npm start
echo 2. Open http://localhost:3000 on your phone browser
echo 3. Add to home screen for app-like experience
echo.
pause