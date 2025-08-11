const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const weatherService = require('../services/weatherService');
const mandiService = require('../services/mandiService');

// Process natural language conversation
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'hi', context = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Detect intent and gather relevant context
    const enrichedContext = await enrichContextWithData(message, context);
    
    const response = await geminiService.processConversation(message, language, enrichedContext);
    
    res.json({
      success: true,
      data: {
        message,
        response,
        language,
        context: enrichedContext
      },
      message: 'Conversation processed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to process conversation'
    });
  }
});

// Analyze image with AI
router.post('/analyze-image', async (req, res) => {
  try {
    const { image, question, language = 'hi' } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const response = await geminiService.analyzeImage(image, question, language);
    
    res.json({
      success: true,
      data: {
        question,
        response,
        language
      },
      message: 'Image analyzed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to analyze image'
    });
  }
});

// Helper function to enrich context with relevant data
async function enrichContextWithData(message, context) {
  const enrichedContext = { ...context };
  
  // Check if message is about weather
  const weatherKeywords = ['weather', 'barish', 'mausam', 'पाऊस', 'ਬਾਰਿਸ਼', 'बारिश'];
  const isWeatherQuery = weatherKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (isWeatherQuery) {
    // Extract city name (simple approach)
    const cities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'pune', 'hyderabad'];
    const mentionedCity = cities.find(city => 
      message.toLowerCase().includes(city)
    );
    
    if (mentionedCity) {
      try {
        const weatherData = await weatherService.getWeather(mentionedCity);
        enrichedContext.weather = weatherData;
      } catch (error) {
        console.error('Failed to fetch weather for context:', error);
      }
    }
  }
  
  // Check if message is about market prices
  const priceKeywords = ['price', 'rate', 'mandi', 'भाव', 'दर', 'ਰੇਟ', 'किमत'];
  const isPriceQuery = priceKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (isPriceQuery) {
    const commodities = ['wheat', 'rice', 'onion', 'potato', 'tomato'];
    const mentionedCommodity = commodities.find(commodity => 
      message.toLowerCase().includes(commodity)
    );
    
    if (mentionedCommodity) {
      try {
        const priceData = await mandiService.getMandiPrices(mentionedCommodity);
        enrichedContext.prices = priceData;
      } catch (error) {
        console.error('Failed to fetch prices for context:', error);
      }
    }
  }
  
  return enrichedContext;
}

module.exports = router;