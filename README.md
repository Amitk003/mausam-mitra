# 🌾 Mausam Mitra - AI-Powered Farming Assistant

Mausam Mitra is an AI-powered farming assistant designed specifically for Indian farmers. It provides weather updates, market prices, and farming advice in multiple Indian languages through natural conversation.

## 🎯 Project Overview

Mausam Mitra helps Indian farmers by providing:
- **Real-time weather forecasts** for Indian cities
- **Market prices (Mandi rates)** for various crops
- **AI-powered farming advice** for crop-specific guidance
- **Multi-language support** (Hindi, English, Marathi, Punjabi)
- **Natural language processing** for conversational interactions

## 🚀 Core Features

### 1. Weather Information (`get_weather`)
- Live weather data from wttr.in API
- 3-day weather forecast
- Weather alerts for extreme conditions
- City-specific weather information

### 2. Market Prices (`get_mandi_price`)
- Real-time mandi rates for crops
- Price trends (rising/falling/stable)
- State and district-wise price information
- Support for major Indian commodities

### 3. Farming Advice (`get_farming_advice`)
- Crop-specific guidance using Gemini AI
- Seasonal farming recommendations
- Best practices for planting, care, and harvesting
- Problem diagnosis and solutions

### 4. AI Conversation (`process_conversation`)
- Natural language processing with Gemini AI
- Context-aware responses
- Multi-language conversation support
- Integration with weather and price data

### 5. Voice Integration (`🎤`)
- **Speech-to-Text**: Voice input in Hindi, English, Marathi, Punjabi
- **Text-to-Speech**: AI responses spoken aloud
- **Auto-Speak Mode**: Automatic voice responses
- **Voice Input for All Sections**: Weather, market prices, farming advice
- **No Additional Software Required**: Uses browser's built-in Web Speech API

### 6. Camera & Visual Analysis (`NEW! 📷`)
- **Live Camera Capture**: Real-time photo capture using device camera
- **Gallery Upload**: Select images from device gallery
- **AI Image Analysis**: Crop disease and pest identification using Gemini Vision
- **Multi-Language Analysis**: Image analysis responses in user's preferred language
- **Mobile Optimized**: Works seamlessly on smartphones with back camera preference
- **High Resolution**: Captures images at 1280x720 for detailed analysis

## 🌍 Multi-Language Support

- **Hindi**: "Mumbai mein barish hogi kya?"
- **English**: "What's the weather in Mumbai?"
- **Marathi**: "मुंबईमध्ये पाऊस पडेल का?"
- **Punjabi**: "ਮੁੰਬਈ ਵਿੱਚ ਬਾਰਿਸ਼ ਹੋਵੇਗੀ?"

## 📊 Real-Time Data Sources

- **Weather**: wttr.in API for live weather data
- **Market Prices**: Government of India's data.gov.in API for mandi rates
- **AI Processing**: Google Gemini API for natural language understanding

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **AI**: Google Gemini API
- **APIs**: wttr.in (Weather), data.gov.in (Mandi prices)
- **Languages**: Multi-language support with Unicode fonts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mausam-mitra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Quick setup**
   ```bash
   npm run setup
   ```

4. **Configure API keys (Optional but recommended)**
   Edit `.env` file and add your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

5. **Test the APIs**
   ```bash
   npm run test-apis
   ```

6. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Access the application**
   Open your browser and go to `http://localhost:3000`

## 🔧 API Endpoints

### Weather
- `GET /api/weather/:city` - Get weather information for a city
- `GET /api/weather/:city/alerts` - Get weather alerts

### Mandi Prices
- `GET /api/mandi/prices/:commodity` - Get market prices for a commodity
- `GET /api/mandi/commodities` - Get list of supported commodities

### Farming Advice
- `POST /api/farming/advice` - Get AI-powered farming advice
- `GET /api/farming/calendar` - Get seasonal farming calendar

### Conversation
- `POST /api/conversation/chat` - Process natural language conversation

## 📱 How Each Feature Works

### 🌤️ **Weather Information Tab**

**How it works:**
1. **Data Sources**: Uses multiple weather APIs (wttr.in, OpenWeatherMap)
2. **City Recognition**: Accepts any Indian city name in English or local languages
3. **Real-time Data**: Fetches live weather conditions, forecasts, and alerts
4. **Multi-language**: Weather descriptions translated to Hindi, Marathi, Punjabi

**Usage:**
- Enter city name: "Mumbai", "Delhi", "Bangalore", etc.
- Get current temperature, humidity, wind speed
- View 3-day weather forecast
- Receive weather alerts for extreme conditions

**Example:**
```
Input: "Mumbai"
Output: 
- Current: 28°C, 75% humidity, Partly cloudy
- Today: Max 32°C, Min 24°C
- Forecast: Next 3 days with rain chances
```

### 💰 **Market Prices (Mandi Bhav) Tab**

**How Location-Based Data Extraction Works:**

**1. Smart Location Filtering System:**
```
User Input → Location Parser → Data Filter → Results
```

**2. Data Sources:**
- **Primary**: Government of India's data.gov.in API
- **Fallback**: Comprehensive location-specific mock database
- **Coverage**: 20+ crops across 15+ Indian states

**3. Location Hierarchy:**
```
Commodity → State → District → Market → Prices
```

**Usage Examples:**

**Example 1: State-Level Search**
```
Input: 
- Crop: "wheat"
- State: "haryana"
- District: (leave empty)

Output: Shows wheat prices from all major markets in Haryana:
- Kaithal Market: ₹2100-₹2180 per quintal
- Karnal Market: ₹2080-₹2160 per quintal  
- Ambala Market: ₹2090-₹2170 per quintal
```

**Example 2: District-Specific Search**
```
Input:
- Crop: "rice"
- State: "punjab"
- District: "ludhiana"

Output: Shows rice prices specifically from Ludhiana district:
- Ludhiana Market: ₹3520-₹4220 per quintal (Basmati variety)
```

**Example 3: Crop-Only Search**
```
Input:
- Crop: "onion"
- State: (leave empty)
- District: (leave empty)

Output: Shows onion prices from all major producing states:
- Maharashtra (Nashik): ₹800-₹1200 per quintal
- Gujarat (Rajkot): ₹790-₹1190 per quintal
- Karnataka (Bangalore): ₹810-₹1210 per quintal
```

**4. Price Trend Analysis:**
- **Rising** ↗️: Prices increasing (shown in green)
- **Falling** ↘️: Prices decreasing (shown in red)  
- **Stable** ➡️: Prices steady (shown in yellow)

**5. Supported Locations & Crops:**

**Major States Covered:**
- Haryana, Punjab, Uttar Pradesh, Gujarat, Maharashtra
- West Bengal, Karnataka, Rajasthan, Madhya Pradesh

**Crops Available:**
- **Cereals**: Wheat, Rice, Maize, Bajra, Jowar
- **Pulses**: Arhar, Moong, Chana, Masoor
- **Vegetables**: Onion, Potato, Tomato, Garlic, Ginger
- **Cash Crops**: Cotton, Sugarcane, Groundnut, Soybean

### 🌱 **Farming Advice Tab**

**How AI-Powered Advice Works:**

**1. Input Processing:**
```
Crop Name + Season + Language → Gemini AI → Contextual Advice
```

**2. Advice Categories:**
- **Planting Guidelines**: Best time, soil preparation, seed selection
- **Care Instructions**: Irrigation, fertilization, pest control
- **Seasonal Tips**: Weather-specific recommendations
- **Harvest Timing**: Optimal harvesting periods

**Usage:**
```
Input:
- Crop: "wheat"
- Season: "रबी" (Rabi)
- Language: Hindi

Output: Comprehensive farming advice in Hindi including:
- बुआई का समय (Sowing time)
- मिट्टी की तैयारी (Soil preparation)  
- सिंचाई की आवश्यकता (Irrigation needs)
- कटाई का समय (Harvesting time)
```

### 💬 **AI Assistant (Chat) Tab**

**How Intelligent Conversation Works:**

**1. Natural Language Processing:**
```
User Message → Language Detection → Context Analysis → AI Response
```

**2. Context-Aware Responses:**
- **Weather Queries**: "Mumbai mein barish hogi?" → Fetches live weather data
- **Price Queries**: "Wheat ka bhav kya hai?" → Shows current market prices
- **Farming Questions**: "Kharif season mein kya ugayen?" → Seasonal crop advice

**3. Multi-Language Support:**
```
Hindi: "मुंबई में बारिश होगी क्या?"
English: "Will it rain in Mumbai?"
Marathi: "मुंबईमध्ये पाऊस पडेल का?"
Punjabi: "ਮੁੰਬਈ ਵਿੱਚ ਬਾਰਿਸ਼ ਹੋਵੇਗੀ?"
```

**4. Smart Context Integration:**
- Automatically fetches weather data when discussing weather
- Pulls market prices when talking about crop rates
- Provides location-specific advice based on user queries

### 🎤 **Voice Integration (NEW!)**

**How Voice Features Work:**

**1. Speech-to-Text (Voice Input):**
```
Voice Input → Speech Recognition → Text Conversion → Auto-Send
```

**2. Text-to-Speech (Voice Output):**
```
AI Response → Language Detection → Voice Synthesis → Audio Output
```

**3. Voice Controls:**
- **🎤 Voice Input Button**: Click to start voice input in any section
- **🔊 Auto-Speak Toggle**: Enable/disable automatic voice responses
- **🔊 Speak Button**: Manual voice playback for each AI response

**4. Multi-Language Voice Support:**
- **Hindi**: "मुंबई में मौसम कैसा है?" (Voice input/output)
- **English**: "What's the weather in Mumbai?" (Voice input/output)
- **Marathi**: "मुंबईमध्ये हवामान कसे आहे?" (Voice input/output)
- **Punjabi**: "ਮੁੰਬਈ ਵਿੱਚ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਹੈ?" (Voice input/output)

**5. Voice Features Available In:**
- ✅ **Chat Section**: Full voice conversation
- ✅ **Weather Section**: Voice input for city names
- ✅ **Market Prices**: Voice input for crop/location names
- ✅ **Farming Advice**: Voice input for crop names

**6. Browser Compatibility:**
- ✅ **Chrome**: Full support (recommended)
- ✅ **Edge**: Full support
- ✅ **Safari**: Full support (iOS/macOS)
- ❌ **Firefox**: Limited support (speech recognition not available)

**7. No Additional Software Required:**
- Uses browser's built-in Web Speech API
- No downloads or installations needed
- Works offline for text-to-speech
- Requires internet for speech-to-text

### 📷 **Camera & Visual Analysis (NEW!)**

**How Camera Features Work:**

**1. Live Camera Capture:**
```
Camera Access → Live Preview → Photo Capture → Base64 Encoding → AI Analysis
```

**2. Image Analysis Process:**
```
Image Upload → Gemini Vision API → Problem Identification → Treatment Recommendations
```

**3. Camera Controls:**
- **📹 Live Camera**: Real-time camera preview with environment camera preference
- **📸 Capture Photo**: High-resolution photo capture (1280x720)
- **🖼️ Gallery Upload**: Select existing images from device storage
- **🔍 AI Analysis**: Automatic crop problem diagnosis and treatment suggestions

**4. Visual Problem Detection:**
- **🦠 Disease Identification**: Fungal, bacterial, and viral infections
- **🐛 Pest Detection**: Insect damage and infestation signs
- **🌿 Nutrient Deficiency**: Nitrogen, phosphorus, potassium deficiencies
- **💧 Water Stress**: Over/under-watering symptoms
- **🌡️ Environmental Stress**: Heat, cold, or light-related issues

**5. AI Analysis Capabilities:**
- **Crop Identification**: Automatically identifies the crop type
- **Problem Diagnosis**: Specific disease/pest identification
- **Treatment Recommendations**: Chemical and organic treatment options
- **Prevention Advice**: Steps to prevent future occurrences
- **Severity Assessment**: Estimates the severity of the problem

**6. Multi-Language Visual Analysis:**
```
Hindi: "इस पत्ती पर क्या समस्या है?" → Detailed analysis in Hindi
English: "What's wrong with this leaf?" → Analysis in English
Marathi: "या पानावर काय समस्या आहे?" → Analysis in Marathi
Punjabi: "ਇਸ ਪੱਤੇ ਵਿੱਚ ਕੀ ਸਮੱਸਿਆ ਹੈ?" → Analysis in Punjabi
```

**7. Camera Compatibility:**
- ✅ **Mobile Browsers**: Chrome, Safari, Edge (iOS/Android)
- ✅ **Desktop Browsers**: Chrome, Edge, Safari
- ✅ **Camera Features**: Front/back camera selection, high resolution
- ⚠️ **HTTPS Required**: Camera access requires secure connection
- ❌ **Firefox**: Limited camera support on some devices

**8. No Additional Apps Required:**
- Uses device's built-in camera
- Works through web browser
- No camera app downloads needed
- Instant image analysis

## 🌱 Usage Examples

### Weather API
```javascript
GET /api/weather/mumbai?language=hi
```

### Market Price API  
```javascript
GET /api/mandi/prices/wheat?state=haryana&district=kaithal&language=hi
```

### Farming Advice API
```javascript
POST /api/farming/advice
{
  "crop": "wheat",
  "season": "रबी", 
  "language": "hi"
}
```

### AI Chat API
```javascript
POST /api/conversation/chat
{
  "message": "Gujarat mein wheat ka rate kya hai?",
  "language": "hi"
}
```

## 🔧 Technical Implementation

### **Location-Based Market Price Extraction**

**1. Data Flow Architecture:**
```
User Input → Input Validation → API Call → Data Processing → Location Filtering → Response
```

**2. Multi-Source Data Strategy:**
```javascript
// Primary: Government API
https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
?api-key=XXX&filters[commodity]=wheat&filters[state]=haryana

// Fallback: Location-Specific Mock Database
mockDataByLocation = {
  'wheat': {
    'haryana': [
      { market: 'Kaithal', district: 'Kaithal', prices: {...} },
      { market: 'Karnal', district: 'Karnal', prices: {...} }
    ]
  }
}
```

**3. Smart Location Matching:**
```javascript
// Case-insensitive partial matching
filterByLocation(data, state, district) {
  // State filtering
  if (state) {
    data = data.filter(item => 
      item.state.toLowerCase().includes(state.toLowerCase())
    );
  }
  
  // District filtering  
  if (district) {
    data = data.filter(item =>
      item.district.toLowerCase().includes(district.toLowerCase())
    );
  }
  
  return data;
}
```

**4. Price Trend Calculation:**
```javascript
calculateTrend(minPrice, maxPrice) {
  const avg = (parseInt(minPrice) + parseInt(maxPrice)) / 2;
  if (avg > 2000) return 'rising';
  if (avg < 1000) return 'falling'; 
  return 'stable';
}
```

### **Weather Data Integration**

**1. Multi-API Approach:**
```javascript
// Primary: wttr.in (Free, no API key needed)
https://wttr.in/mumbai?format=j1

// Secondary: OpenWeatherMap (Requires API key)
https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=XXX
```

**2. Fallback Strategy:**
```
API 1 (wttr.in) → API 2 (OpenWeather) → Mock Data → Error
```

### **AI Integration Architecture**

**1. Context-Aware Processing:**
```javascript
// Detect intent and enrich context
if (message.includes('weather') || message.includes('मौसम')) {
  context.weather = await weatherService.getWeather(extractedCity);
}

if (message.includes('price') || message.includes('भाव')) {
  context.prices = await mandiService.getMandiPrices(extractedCrop);
}
```

**2. Multi-Language Prompt Engineering:**
```javascript
buildPrompt(message, language, context) {
  return `You are Mausam Mitra, farming assistant for Indian farmers.
  
  Context: ${JSON.stringify(context)}
  User Language: ${languageMap[language]}
  User Message: ${message}
  
  Instructions:
  1. Respond in ${language} language
  2. Use context data if available
  3. Provide practical farming advice
  4. Keep responses farmer-friendly`;
}
```

## 🎨 Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Support**: Basic functionality works without internet
- **Fast Loading**: Optimized for slow internet connections
- **Accessibility**: Screen reader friendly and keyboard navigation
- **Progressive Web App**: Can be installed on mobile devices
- **Smart Caching**: Reduces API calls with intelligent data caching
- **Error Recovery**: Graceful fallbacks when APIs are unavailable

## 🚀 Deployment

### For Web Deployment
1. Build the application for production
2. Deploy to platforms like Heroku, Vercel, or Netlify
3. Set environment variables in your deployment platform

### For Mobile App (Future)
- React Native or Flutter wrapper planned
- Native mobile features integration
- Offline data caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for natural language processing
- wttr.in for weather data
- Government of India's data.gov.in for mandi price data
- Indian farming community for inspiration and feedback

## 🔍 Troubleshooting

### **Common Issues & Solutions**

**1. Market Prices Not Showing Correct Location**
```bash
# Problem: Shows prices from different state/district
# Solution: Check input format

✅ Correct: state="haryana", district="kaithal"
❌ Wrong: state="Haryana State", district="Kaithal District"

# The system uses partial matching, so simple names work better
```

**2. Weather Data Not Loading**
```bash
# Problem: Weather API timeout
# Solution: Check city name format

✅ Correct: "Mumbai", "Delhi", "Bangalore"  
❌ Wrong: "Mumbai City", "New Delhi NCR"

# Use simple, commonly known city names
```

**3. AI Assistant Not Responding**
```bash
# Problem: Gemini API key not configured
# Solution: Add API key to .env file

GEMINI_API_KEY=your_actual_api_key_here

# Get free API key from: https://makersuite.google.com/app/apikey
```

**4. Language Switching Not Working**
```bash
# Problem: Text not updating after language change
# Solution: Refresh the page or clear browser cache

# The app should auto-update, but browser cache might interfere
```

### **Testing Your Setup**

**1. Quick API Test:**
```bash
npm run test-apis
```

**2. Manual Testing Checklist:**
- [ ] Weather: Try "Mumbai", "Delhi", "Chennai"
- [ ] Market Prices: Try "wheat + haryana", "rice + punjab", "onion + maharashtra"  
- [ ] Farming Advice: Try "wheat + rabi season"
- [ ] AI Chat: Try "Mumbai mein barish hogi kya?"
- [ ] Language Switch: Change language and verify all text updates

**3. Expected Results:**
```
✅ Weather: Shows temperature, humidity, forecast
✅ Market Prices: Shows location-specific rates with trends
✅ Farming Advice: Shows detailed crop guidance  
✅ AI Chat: Responds in selected language
✅ Language: All UI text updates correctly
✅ Voice Input: Converts speech to text accurately
✅ Voice Output: Speaks responses in selected language
```

**4. Voice Feature Testing:**
```bash
# Open voice test page
open test-voice.html

# Or test within the main app:
1. Go to Chat section
2. Click 🎤 button and speak
3. Enable 🔊 Auto-Speak mode
4. Try voice input in different languages
```

**Voice Test Examples:**
```
Hindi: "मुंबई में मौसम कैसा है?"
English: "What's the weather in Delhi?"
Marathi: "पुण्यात पाऊस पडेल का?"
Punjabi: "ਲੁਧਿਆਣਾ ਵਿੱਚ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਹੈ?"
```

**5. Camera Feature Testing:**
```bash
# Open camera test page
open test-camera.html

# Or test within the main app:
1. Go to Chat section
2. Click 📷 camera button
3. Choose "Live Camera" or "Gallery"
4. Capture/select crop image
5. Ask question about the image
6. Get AI analysis in your language
```

**Camera Test Examples:**
```
Take photo of yellowing wheat leaves → 
Ask: "What's wrong with my crop?" →
Get: Detailed analysis with treatment recommendations

Upload image of pest damage →
Ask: "How to treat this problem?" →
Get: Pest identification and control measures
```

### **Performance Optimization**

**1. For Slow Internet:**
- App uses progressive loading
- Images are optimized
- API calls have 10-second timeout
- Fallback data ensures functionality

**2. For Mobile Devices:**
- Responsive design adapts to screen size
- Touch-friendly buttons and inputs
- Optimized for thumb navigation

## 📞 Support

### **Getting Help**
- **Issues**: Create an issue in this repository
- **Questions**: Check the troubleshooting section above
- **API Problems**: Run `npm run test-apis` for diagnostics

### **Contributing**
1. Fork the repository
2. Create a feature branch
3. Test your changes with `npm run test-apis`
4. Submit a pull request

### **API Key Resources**
- **Gemini AI**: https://makersuite.google.com/app/apikey (Free tier available)
- **OpenWeather**: https://openweathermap.org/api (Free tier: 1000 calls/day)
- **Government Data**: https://data.gov.in (Free, no registration needed)

---

**Made with ❤️ for Indian Farmers** 🌾

*Empowering farmers with AI-powered insights for better agricultural decisions*