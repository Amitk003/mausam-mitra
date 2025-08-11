const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.visionModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async processConversation(message, language = 'hi', context = {}) {
    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.log('Gemini API key not configured, using intelligent fallback');
        return this.getIntelligentFallbackResponse(message, language, context);
      }
      
      const prompt = this.buildPrompt(message, language, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Use intelligent fallback instead of generic error
      return this.getIntelligentFallbackResponse(message, language, context);
    }
  }

  buildPrompt(message, language, context) {
    const languageMap = {
      'hi': 'Hindi',
      'en': 'English', 
      'mr': 'Marathi',
      'pa': 'Punjabi'
    };

    return `You are Mausam Mitra, an AI farming assistant for Indian farmers. 
    
Context: ${JSON.stringify(context)}
User Language: ${languageMap[language] || 'Hindi'}
User Message: ${message}

Instructions:
1. Respond in ${languageMap[language] || 'Hindi'} language
2. Be helpful and provide practical farming advice
3. If asked about weather, suggest checking weather API
4. If asked about market prices, suggest checking mandi prices
5. Provide seasonal farming tips when relevant
6. Keep responses conversational and farmer-friendly
7. Use simple language that farmers can understand
8. If context includes weather or price data, use it in your response
9. Be encouraging and supportive to farmers

Response:`;
  }

  // Intelligent fallback responses for when API is not available
  getIntelligentFallbackResponse(message, language, context = {}) {
    const lowerMessage = message.toLowerCase();
    
    // Weather-related queries
    if (lowerMessage.includes('rain') || lowerMessage.includes('weather') || 
        message.includes('बारिश') || message.includes('मौसम') || 
        message.includes('पाऊस') || message.includes('ਬਾਰਿਸ਼')) {
      
      return this.getWeatherResponse(message, language, context);
    }
    
    // Crop damage queries
    if (lowerMessage.includes('damage') || lowerMessage.includes('problem') ||
        message.includes('नुकसान') || message.includes('समस्या') || 
        message.includes('खराब') || message.includes('बीमारी')) {
      
      return this.getCropDamageResponse(message, language);
    }
    
    // Price-related queries
    if (lowerMessage.includes('price') || lowerMessage.includes('rate') ||
        message.includes('भाव') || message.includes('दर') || 
        message.includes('किमत') || message.includes('ਰੇਟ')) {
      
      return this.getPriceResponse(message, language);
    }
    
    // Farming advice queries
    if (lowerMessage.includes('farming') || lowerMessage.includes('crop') ||
        message.includes('खेती') || message.includes('फसल') ||
        message.includes('शेती') || message.includes('ਖੇਤੀ')) {
      
      return this.getFarmingResponse(message, language);
    }
    
    // General greeting/help
    return this.getGeneralResponse(language);
  }

  getWeatherResponse(message, language, context) {
    const responses = {
      hi: `मैं समझ सकता हूं कि आप मौसम के बारे में पूछ रहे हैं। ${context.weather ? 
        `आपके क्षेत्र में मौसम: ${context.weather.current?.temperature}°C, ${context.weather.current?.description}` : 
        'कृपया ऊपर मौसम सेक्शन में अपना शहर डालकर सटीक मौसम जानकारी प्राप्त करें।'} 
        
बारिश के लिए तैयारी:
• फसल की जल निकासी की व्यवस्था करें
• कीटनाशक का छिड़काव बारिश से पहले करें
• भंडारण की सुरक्षा करें`,

      en: `I understand you're asking about weather. ${context.weather ? 
        `Weather in your area: ${context.weather.current?.temperature}°C, ${context.weather.current?.description}` : 
        'Please use the weather section above to get accurate weather information for your city.'}
        
Rain preparation tips:
• Ensure proper drainage for crops
• Apply pesticides before rain
• Secure storage facilities`,

      mr: `मी समजू शकतो की तुम्ही हवामानाबद्दल विचारत आहात। कृपया वरील हवामान विभागात तुमचे शहर टाकून अचूक हवामान माहिती मिळवा।
        
पावसाची तयारी:
• पिकांसाठी पाणी निचरा व्यवस्था करा
• पावसापूर्वी कीटकनाशकांची फवारणी करा`,

      pa: `ਮੈਂ ਸਮਝ ਸਕਦਾ ਹਾਂ ਕਿ ਤੁਸੀਂ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛ ਰਹੇ ਹੋ। ਕਿਰਪਾ ਕਰਕੇ ਉੱਪਰ ਮੌਸਮ ਸੈਕਸ਼ਨ ਵਿੱਚ ਆਪਣਾ ਸ਼ਹਿਰ ਪਾ ਕੇ ਸਹੀ ਮੌਸਮ ਜਾਣਕਾਰੀ ਲਓ।`
    };
    
    return responses[language] || responses.hi;
  }

  getCropDamageResponse(message, language) {
    const responses = {
      hi: `फसल की समस्या के लिए मैं आपकी मदद कर सकता हूं:

सामान्य कारण और समाधान:
🌧️ **अधिक बारिश**: जल निकासी की व्यवस्था करें, फंगीसाइड का प्रयोग करें
🐛 **कीट-पतंगे**: नीम का तेल या उपयुक्त कीटनाशक का छिड़काव करें  
🦠 **बीमारी**: संक्रमित पौधों को हटाएं, बोर्डो मिश्रण का प्रयोग करें
🌡️ **मौसम**: छायादार जाल का प्रयोग करें, सिंचाई बढ़ाएं

कृपया खेती सलाह सेक्शन में अपनी फसल का नाम डालकर विस्तृत जानकारी प्राप्त करें।`,

      en: `I can help you with crop damage issues:

Common causes and solutions:
🌧️ **Excess rain**: Improve drainage, use fungicides
🐛 **Pests**: Apply neem oil or appropriate pesticides
🦠 **Disease**: Remove infected plants, use Bordeaux mixture  
🌡️ **Weather stress**: Use shade nets, increase irrigation

Please use the farming advice section with your crop name for detailed guidance.`,

      mr: `पिकांच्या समस्येसाठी मी तुमची मदत करू शकतो:

सामान्य कारणे आणि उपाय:
🌧️ **जास्त पाऊस**: पाणी निचरा सुधारा
🐛 **किडे**: कीटकनाशकांचा वापर करा
🦠 **आजार**: संक्रमित झाडे काढा`,

      pa: `ਫਸਲ ਦੀ ਸਮੱਸਿਆ ਲਈ ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:

ਆਮ ਕਾਰਨ ਅਤੇ ਹੱਲ:
🌧️ **ਜ਼ਿਆਦਾ ਬਾਰਿਸ਼**: ਪਾਣੀ ਨਿਕਾਸ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ
🐛 **ਕੀੜੇ**: ਕੀੜੇਮਾਰ ਦਵਾਈ ਦਾ ਛਿੜਕਾਅ ਕਰੋ`
    };
    
    return responses[language] || responses.hi;
  }

  getPriceResponse(message, language) {
    const responses = {
      hi: `मंडी भाव की जानकारी के लिए ऊपर "मंडी भाव" सेक्शन का उपयोग करें।

आप यहाँ पा सकते हैं:
📊 वर्तमान बाजार दरें
📈 मूल्य रुझान (बढ़ रहा/गिर रहा)
📍 राज्य और जिले के अनुसार भाव
🌾 सभी प्रमुख फसलों की कीमतें

बेहतर कीमत के लिए सुझाव:
• स्थानीय मंडी की जानकारी रखें
• फसल की गुणवत्ता बनाए रखें
• सही समय पर बेचें`,

      en: `For market price information, please use the "Market Prices" section above.

You can find:
📊 Current market rates
📈 Price trends (rising/falling)  
📍 State and district-wise prices
🌾 Prices for all major crops

Tips for better prices:
• Stay informed about local markets
• Maintain crop quality
• Time your sales properly`,

      mr: `मंडी भावाच्या माहितीसाठी वरील "मंडी भाव" विभाग वापरा।`,

      pa: `ਮੰਡੀ ਭਾਅ ਦੀ ਜਾਣਕਾਰੀ ਲਈ ਉੱਪਰ "ਮੰਡੀ ਭਾਅ" ਸੈਕਸ਼ਨ ਵਰਤੋ।`
    };
    
    return responses[language] || responses.hi;
  }

  getFarmingResponse(message, language) {
    const responses = {
      hi: `खेती की सलाह के लिए ऊपर "खेती सलाह" सेक्शन का उपयोग करें।

मैं आपकी मदद कर सकता हूं:
🌱 बुआई का सही समय
💧 सिंचाई की आवश्यकता  
🌿 उर्वरक का प्रयोग
🐛 कीट-पतंगे से बचाव
📅 फसल चक्र की योजना

सामान्य सुझाव:
• मिट्टी की जांच कराएं
• गुणवत्तापूर्ण बीज का प्रयोग करें
• मौसम के अनुसार फसल चुनें`,

      en: `For farming advice, please use the "Farming Advice" section above.

I can help you with:
🌱 Right sowing time
💧 Irrigation needs
🌿 Fertilizer application  
🐛 Pest control
📅 Crop rotation planning

General tips:
• Test your soil regularly
• Use quality seeds
• Choose crops according to season`,

      mr: `शेतीच्या सल्ल्यासाठी वरील "शेती सल्ला" विभाग वापरा।`,

      pa: `ਖੇਤੀ ਦੀ ਸਲਾਹ ਲਈ ਉੱਪਰ "ਖੇਤੀ ਸਲਾਹ" ਸੈਕਸ਼ਨ ਵਰਤੋ।`
    };
    
    return responses[language] || responses.hi;
  }

  getGeneralResponse(language) {
    const responses = {
      hi: `नमस्ते! मैं मौसम मित्र हूं, आपका AI खेती सहायक। 🌾

मैं आपकी इन चीजों में मदद कर सकता हूं:
🌤️ **मौसम जानकारी** - किसी भी शहर का मौसम
💰 **मंडी भाव** - फसलों की वर्तमान कीमतें  
🌱 **खेती सलाह** - फसल की देखभाल की जानकारी
💬 **सवाल-जवाब** - खेती से जुड़े किसी भी सवाल का जवाब

आप मुझसे हिंदी, अंग्रेजी, मराठी या पंजाबी में बात कर सकते हैं। कुछ भी पूछिए!`,

      en: `Hello! I am Mausam Mitra, your AI farming assistant. 🌾

I can help you with:
🌤️ **Weather Information** - Weather for any city
💰 **Market Prices** - Current crop prices
🌱 **Farming Advice** - Crop care guidance  
💬 **Q&A** - Any farming-related questions

You can talk to me in Hindi, English, Marathi, or Punjabi. Ask me anything!`,

      mr: `नमस्कार! मी मौसम मित्र आहे, तुमचा AI शेती सहाय्यक। 🌾

मी तुम्हाला या गोष्टींमध्ये मदत करू शकतो:
🌤️ **हवामान माहिती** - कोणत्याही शहराचे हवामान
💰 **मंडी भाव** - पिकांच्या सध्याच्या किमती
🌱 **शेती सल्ला** - पिकांची काळजी
💬 **प्रश्न-उत्तर** - शेतीशी संबंधित कोणतेही प्रश्न`,

      pa: `ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਮੌਸਮ ਮਿੱਤਰ ਹਾਂ, ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ। 🌾

ਮੈਂ ਤੁਹਾਨੂੰ ਇਹਨਾਂ ਚੀਜ़ਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:
🌤️ **ਮੌਸਮ ਜਾਣਕਾਰੀ** - ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ ਦਾ ਮੌਸਮ
💰 **ਮੰਡੀ ਭਾਅ** - ਫਸਲਾਂ ਦੀਆਂ ਮੌਜੂਦਾ ਕੀਮਤਾਂ
🌱 **ਖੇਤੀ ਸਲਾਹ** - ਫਸਲ ਦੀ ਦੇਖਭਾਲ
💬 **ਸਵਾਲ-ਜਵਾਬ** - ਖੇਤੀ ਨਾਲ ਜੁੜੇ ਕੋਈ ਵੀ ਸਵਾਲ`
    };
    
    return responses[language] || responses.hi;
  }

  async getFarmingAdvice(crop, season, language = 'hi') {
    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return this.getFallbackFarmingAdvice(crop, season, language);
      }

      const prompt = `Provide farming advice for ${crop} in ${season} season. 
      Respond in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'pa' ? 'Punjabi' : 'English'}.
      Include: planting tips, care instructions, common problems, and harvest timing.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Farming advice error:', error);
      return this.getFallbackFarmingAdvice(crop, season, language);
    }
  }

  getFallbackFarmingAdvice(crop, season, language) {
    const cropLower = crop.toLowerCase();
    const seasonLower = season.toLowerCase();

    // Comprehensive farming advice database
    const adviceDatabase = {
      wheat: {
        hi: {
          rabi: `🌾 **गेहूं की खेती - रबी सीजन**

**बुआई का समय**: नवंबर-दिसंबर
**मिट्टी**: दोमट मिट्टी सबसे अच्छी
**बीज दर**: 100-125 किग्रा प्रति हेक्टेयर

**खेत की तैयारी**:
• 2-3 बार जुताई करें
• गोबर की खाद 10-15 टन प्रति हेक्टेयर

**सिंचाई**:
• पहली सिंचाई बुआई के 20-25 दिन बाद
• दूसरी सिंचाई कल्ले निकलते समय
• तीसरी सिंचाई बाली आते समय

**उर्वरक**:
• नाइट्रोजन: 120 किग्रा/हेक्टेयर
• फास्फोरस: 60 किग्रा/हेक्टेयर
• पोटाश: 40 किग्रा/हेक्टेयर

**कटाई**: मार्च-अप्रैल में जब दाने सुनहरे हो जाएं`,

          kharif: `गेहूं रबी की फसल है, खरीफ में नहीं उगाई जाती। खरीफ में धान, मक्का, ज्वार, बाजरा उगाएं।`
        },
        en: {
          rabi: `🌾 **Wheat Cultivation - Rabi Season**

**Sowing Time**: November-December
**Soil**: Loamy soil is best
**Seed Rate**: 100-125 kg per hectare

**Field Preparation**:
• Plow 2-3 times
• Apply 10-15 tons farmyard manure per hectare

**Irrigation**:
• First irrigation 20-25 days after sowing
• Second irrigation during tillering
• Third irrigation during ear formation

**Fertilizers**:
• Nitrogen: 120 kg/hectare
• Phosphorus: 60 kg/hectare
• Potash: 40 kg/hectare

**Harvesting**: March-April when grains turn golden`,

          kharif: `Wheat is a Rabi crop, not grown in Kharif season. Grow rice, maize, sorghum, or millet in Kharif.`
        }
      },
      rice: {
        hi: {
          kharif: `🌾 **धान की खेती - खरीफ सीजन**

**बुआई का समय**: जून-जुलाई
**मिट्टी**: चिकनी दोमट मिट्टी
**बीज दर**: 20-25 किग्रा प्रति हेक्टेयर

**नर्सरी तैयारी**:
• बीज को 24 घंटे पानी में भिगोएं
• नर्सरी में बुआई करें
• 25-30 दिन बाद रोपाई करें

**खेत की तैयारी**:
• खेत में 2-3 इंच पानी भरें
• 2-3 बार जुताई करें
• समतल करें

**रोपाई**:
• पौधे से पौधे की दूरी: 20 सेमी
• कतार से कतार की दूरी: 20 सेमी

**सिंचाई**:
• खेत में हमेशा 2-3 इंच पानी रखें
• फूल आने के समय पानी की कमी न होने दें

**कटाई**: अक्टूबर-नवंबर में`,

          rabi: `धान मुख्यतः खरीफ की फसल है। रबी में गेहूं, जौ, चना उगाएं।`
        },
        en: {
          kharif: `🌾 **Rice Cultivation - Kharif Season**

**Sowing Time**: June-July
**Soil**: Clay loam soil
**Seed Rate**: 20-25 kg per hectare

**Nursery Preparation**:
• Soak seeds for 24 hours
• Sow in nursery
• Transplant after 25-30 days

**Field Preparation**:
• Maintain 2-3 inches water in field
• Plow 2-3 times
• Level the field

**Transplanting**:
• Plant to plant distance: 20 cm
• Row to row distance: 20 cm

**Irrigation**:
• Always maintain 2-3 inches water
• Ensure no water stress during flowering

**Harvesting**: October-November`,

          rabi: `Rice is mainly a Kharif crop. Grow wheat, barley, or gram in Rabi season.`
        }
      }
    };

    // Get advice for the specific crop and season
    if (adviceDatabase[cropLower] && adviceDatabase[cropLower][language] && adviceDatabase[cropLower][language][seasonLower]) {
      return adviceDatabase[cropLower][language][seasonLower];
    }

    // Fallback to general advice
    const generalAdvice = {
      hi: `🌱 **${crop} की खेती - ${season} सीजन**

**सामान्य सुझाव**:
• मिट्टी की जांच कराएं
• गुणवत्तापूर्ण बीज का प्रयोग करें
• उचित समय पर बुआई करें
• नियमित सिंचाई करें
• संतुलित उर्वरक का प्रयोग करें
• कीट-पतंगों से बचाव करें

**अधिक जानकारी के लिए**:
• स्थानीय कृषि विशेषज्ञ से सलाह लें
• कृषि विभाग से संपर्क करें
• अनुभवी किसानों से बात करें

नोट: विस्तृत सलाह के लिए Gemini API key कॉन्फ़िगर करें।`,

      en: `🌱 **${crop} Cultivation - ${season} Season**

**General Guidelines**:
• Test your soil
• Use quality seeds
• Sow at the right time
• Irrigate regularly
• Apply balanced fertilizers
• Protect from pests

**For More Information**:
• Consult local agricultural experts
• Contact agriculture department
• Talk to experienced farmers

Note: Configure Gemini API key for detailed advice.`,

      mr: `🌱 **${crop} शेती - ${season} हंगाम**

**सामान्य सूचना**:
• मातीची तपासणी करा
• दर्जेदार बियाणे वापरा
• योग्य वेळी पेरणी करा
• नियमित पाणी द्या

अधिक माहितीसाठी स्थानिक शेती तज्ञांचा सल्ला घ्या।`,

      pa: `🌱 **${crop} ਦੀ ਖੇਤੀ - ${season} ਸੀਜ਼ਨ**

**ਆਮ ਸੁਝਾਅ**:
• ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਕਰਵਾਓ
• ਚੰਗੇ ਬੀਜ ਵਰਤੋ
• ਸਹੀ ਸਮੇਂ ਬੀਜਾਈ ਕਰੋ
• ਨਿਯਮਿਤ ਪਾਣੀ ਦਿਓ

ਹੋਰ ਜਾਣਕਾਰੀ ਲਈ ਸਥਾਨਕ ਖੇਤੀ ਮਾਹਿਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰੋ।`
    };

    return generalAdvice[language] || generalAdvice.hi;
  }

  async analyzeImage(imageData, question, language = 'hi') {
    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return this.getFallbackImageAnalysis(question, language);
      }

      // Convert base64 image to the format Gemini expects
      const imageBase64 = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const prompt = this.buildImageAnalysisPrompt(question, language);
      
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.visionModel.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
      
    } catch (error) {
      console.error('Image analysis error:', error);
      return this.getFallbackImageAnalysis(question, language);
    }
  }

  buildImageAnalysisPrompt(question, language) {
    const languageMap = {
      'hi': 'Hindi',
      'en': 'English',
      'mr': 'Marathi', 
      'pa': 'Punjabi'
    };

    return `You are Mausam Mitra, an expert agricultural AI assistant for Indian farmers.

Analyze this crop/plant image and answer the user's question.

User Question: ${question}
Response Language: ${languageMap[language] || 'Hindi'}

Instructions:
1. Respond in ${languageMap[language] || 'Hindi'} language
2. Identify the crop/plant if possible
3. Look for signs of disease, pests, nutrient deficiency, or other problems
4. Provide specific diagnosis and treatment recommendations
5. Include preventive measures
6. Use simple language that farmers can understand
7. Be practical and actionable in your advice
8. If you cannot identify specific issues, provide general crop care advice

Focus on:
- Disease identification and treatment
- Pest control measures
- Nutrient deficiency symptoms
- Irrigation and care recommendations
- Organic and chemical treatment options
- Prevention strategies

Response:`;
  }

  getFallbackImageAnalysis(question, language) {
    const responses = {
      hi: `मैं आपकी तस्वीर देख सकता हूं। हालांकि मैं विस्तृत विश्लेषण नहीं कर सकता, यहाँ कुछ सामान्य सुझाव हैं:

🌱 **सामान्य फसल समस्याएं और समाधान:**

**पत्तियों में पीलापन:**
• नाइट्रोजन की कमी हो सकती है
• संतुलित उर्वरक का प्रयोग करें (NPK 19:19:19)
• हरी खाद का उपयोग करें

**पत्तियों पर धब्बे/दाग:**
• फंगल संक्रमण की संभावना
• बोर्डो मिश्रण का छिड़काव करें
• प्रभावित पत्तियों को हटा दें

**कीट-पतंगे की समस्या:**
• नीम का तेल का प्रयोग करें (5ml/लीटर पानी)
• जैविक कीटनाशक का उपयोग करें
• फेरोमोन ट्रैप लगाएं

**पौधे की वृद्धि रुकना:**
• मिट्टी की जांच कराएं
• जैविक खाद डालें
• उचित सिंचाई करें

**तत्काल करने योग्य कार्य:**
• प्रभावित भागों को अलग करें
• स्थानीय कृषि विशेषज्ञ से मिलें
• मिट्टी और पानी की जांच कराएं

**बचाव के उपाय:**
• फसल चक्र अपनाएं
• साफ-सफाई रखें
• नियमित निरीक्षण करें

नोट: सटीक विश्लेषण के लिए Gemini Vision API कॉन्फ़िगर करें।`,

      en: `I can see your image. While I cannot provide detailed analysis, here are some general suggestions:

🌱 **Common Crop Problems and Solutions:**

**Yellowing Leaves:**
• May indicate nitrogen deficiency
• Apply balanced fertilizer (NPK 19:19:19)
• Use green manure

**Spots/Patches on Leaves:**
• Possible fungal infection
• Spray Bordeaux mixture
• Remove affected leaves

**Pest Infestation:**
• Use neem oil spray (5ml/liter water)
• Apply organic pesticides
• Install pheromone traps

**Stunted Growth:**
• Test soil condition
• Apply organic manure
• Ensure proper irrigation

**Immediate Actions:**
• Isolate affected parts
• Consult local agricultural experts
• Test soil and water quality

**Prevention Measures:**
• Practice crop rotation
• Maintain cleanliness
• Regular monitoring

Note: Configure Gemini Vision API for accurate analysis.`,

      mr: `मी तुमची प्रतिमा पाहू शकतो. तपशीलवार विश्लेषण करू शकत नसलो तरी, येथे काही सामान्य सूचना आहेत:

🌱 **सामान्य पीक समस्या आणि उपाय:**

**पानांमध्ये पिवळेपणा:**
• नायट्रोजनची कमतरता असू शकते
• संतुलित खत वापरा
• हिरवी खत वापरा

**पानांवर डाग:**
• बुरशीजन्य संसर्गाची शक्यता
• बोर्डो मिश्रणाची फवारणी करा
• प्रभावित पाने काढून टाका

**कीड-पतंगांची समस्या:**
• कडुलिंबाच्या तेलाची फवारणी करा
• जैविक कीटकनाशक वापरा

चांगल्या विश्लेषणासाठी स्थानिक शेती तज्ञांचा सल्ला घ्या.`,

      pa: `ਮੈਂ ਤੁਹਾਡੀ ਤਸਵੀਰ ਦੇਖ ਸਕਦਾ ਹਾਂ। ਹਾਲਾਂਕਿ ਮੈਂ ਵਿਸਤ੍ਰਿਤ ਵਿਸ਼ਲੇਸ਼ਣ ਨਹੀਂ ਕਰ ਸਕਦਾ, ਇੱਥੇ ਕੁਝ ਆਮ ਸੁਝਾਅ ਹਨ:

🌱 **ਆਮ ਫਸਲ ਸਮੱਸਿਆਵਾਂ ਅਤੇ ਹੱਲ:**

**ਪੱਤਿਆਂ ਵਿੱਚ ਪੀਲਾਪਨ:**
• ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ ਹੋ ਸਕਦੀ ਹੈ
• ਸੰਤੁਲਿਤ ਖਾਦ ਦਾ ਪ੍ਰਯੋਗ ਕਰੋ
• ਹਰੀ ਖਾਦ ਵਰਤੋ

**ਪੱਤਿਆਂ ਉੱਤੇ ਧੱਬੇ:**
• ਫੰਗਲ ਇਨਫੈਕਸ਼ਨ ਦੀ ਸੰਭਾਵਨਾ
• ਬੋਰਡੋ ਮਿਸ਼ਰਣ ਦਾ ਛਿੜਕਾਅ ਕਰੋ

**ਕੀੜੇ-ਮਕੌੜਿਆਂ ਦੀ ਸਮੱਸਿਆ:**
• ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ
• ਜੈਵਿਕ ਕੀੜੇਮਾਰ ਦਵਾਈ ਵਰਤੋ

ਬਿਹਤਰ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਸਥਾਨਕ ਖੇਤੀ ਮਾਹਿਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰੋ।`
    };
    
    return responses[language] || responses.hi;
  }
}

module.exports = new GeminiService();