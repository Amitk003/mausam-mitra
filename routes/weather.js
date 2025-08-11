const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// Get weather for a city
router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { language = 'hi' } = req.query;
    
    const weather = await weatherService.getWeather(city, language);
    
    res.json({
      success: true,
      data: weather,
      message: 'Weather data retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch weather data'
    });
  }
});

// Get weather alerts
router.get('/:city/alerts', async (req, res) => {
  try {
    const { city } = req.params;
    
    const alerts = await weatherService.getWeatherAlert(city);
    
    res.json({
      success: true,
      data: alerts,
      message: 'Weather alerts retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch weather alerts'
    });
  }
});

module.exports = router;