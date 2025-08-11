const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// Get farming advice
router.post('/advice', async (req, res) => {
  try {
    const { crop, season, language = 'hi' } = req.body;
    
    if (!crop) {
      return res.status(400).json({
        success: false,
        message: 'Crop name is required'
      });
    }
    
    const advice = await geminiService.getFarmingAdvice(crop, season, language);
    
    res.json({
      success: true,
      data: {
        crop,
        season,
        advice,
        language
      },
      message: 'Farming advice retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get farming advice'
    });
  }
});

// Get seasonal calendar
router.get('/calendar', async (req, res) => {
  try {
    const { month, language = 'hi' } = req.query;
    
    // Mock seasonal calendar data
    const calendar = {
      'January': {
        crops: ['Wheat', 'Mustard', 'Gram'],
        activities: ['Harvesting Rabi crops', 'Irrigation management'],
        weather: 'Cool and dry'
      },
      'April': {
        crops: ['Rice', 'Cotton', 'Sugarcane'],
        activities: ['Land preparation', 'Seed sowing'],
        weather: 'Hot and dry'
      },
      'July': {
        crops: ['Rice', 'Maize', 'Cotton'],
        activities: ['Monsoon sowing', 'Weed management'],
        weather: 'Monsoon season'
      },
      'October': {
        crops: ['Wheat', 'Barley', 'Peas'],
        activities: ['Post-monsoon sowing', 'Harvesting Kharif'],
        weather: 'Post-monsoon'
      }
    };
    
    const currentMonth = month || new Date().toLocaleString('en-US', { month: 'long' });
    
    res.json({
      success: true,
      data: {
        month: currentMonth,
        calendar: calendar[currentMonth] || calendar['January'],
        language
      },
      message: 'Farming calendar retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get farming calendar'
    });
  }
});

module.exports = router;