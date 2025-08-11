# 🚀 Mausam Mitra - Setup Guide

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## 🔧 Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mausam-mitra.git
cd mausam-mitra
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your API keys
nano .env  # or use any text editor
```

### 4. Required API Keys

#### 🤖 Gemini AI API (Required for AI features)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env` file:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

#### 🌤️ OpenWeather API (Optional - for enhanced weather)
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Get API key (1000 calls/day free)
4. Add to `.env` file:
   ```
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

### 5. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 6. Access the Application
- **Web**: http://localhost:3000
- **Mobile**: Use your computer's IP address (e.g., http://192.168.1.100:3000)

## 📱 Mobile Setup

### PWA Installation (Recommended)
1. Open the app in Chrome/Edge on your phone
2. Tap "Add to Home Screen" or use the install prompt
3. Use like a native app

### APK Generation (Advanced)
```bash
# Setup mobile build environment
npm run mobile:setup

# Install Android Studio and SDK
# Then build APK
npm run mobile:build
```

## 🧪 Testing

### Test All APIs
```bash
npm run test-apis
```

### Test Chat Functionality
```bash
npm run test-chat
```

### Test Voice Features
Open `test-voice.html` in browser

### Test Camera Features
Open `test-camera.html` in browser

## 🌍 Multi-Language Support

The app supports:
- **Hindi** (हिंदी) - Default
- **English**
- **Marathi** (मराठी)
- **Punjabi** (ਪੰਜਾਬੀ)

## 🔧 Configuration Options

### Environment Variables
```bash
# Server Configuration
PORT=3000                    # Server port
NODE_ENV=development         # Environment mode

# Language Settings
DEFAULT_LANGUAGE=hi          # Default language
SUPPORTED_LANGUAGES=hi,en,mr,pa

# API Endpoints (usually don't need to change)
WEATHER_API_URL=https://wttr.in
MANDI_API_URL=https://api.data.gov.in/resource/...
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Gemini API key not configured"
- Make sure you've added your Gemini API key to `.env` file
- Restart the server after adding the key

#### 2. Weather data not loading
- Check internet connection
- Weather API (wttr.in) is free and doesn't require API key
- For enhanced weather, add OpenWeather API key

#### 3. Voice features not working
- Use HTTPS or localhost (required for microphone access)
- Allow microphone permissions in browser
- Use Chrome/Edge for best compatibility

#### 4. Camera not working
- Use HTTPS or localhost (required for camera access)
- Allow camera permissions in browser
- Use Chrome/Edge/Safari for best compatibility

#### 5. Mobile app not installing
- Use Chrome/Edge on mobile
- Make sure you're on HTTPS or localhost
- Try "Add to Home Screen" from browser menu

### Getting Help

1. Check the [Issues](https://github.com/yourusername/mausam-mitra/issues) page
2. Create a new issue with:
   - Your operating system
   - Browser version
   - Error messages
   - Steps to reproduce

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for Indian Farmers** 🌾