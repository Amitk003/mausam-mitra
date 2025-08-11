const express = require('express');
const router = express.Router();
const mandiService = require('../services/mandiService');

// Get mandi prices for a commodity
router.get('/prices/:commodity', async (req, res) => {
  try {
    const { commodity } = req.params;
    const { state, district, language = 'hi' } = req.query;
    
    const prices = await mandiService.getMandiPrices(commodity, state, district);
    
    res.json({
      success: true,
      data: prices,
      message: 'Mandi prices retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch mandi prices'
    });
  }
});

// Get list of commodities
router.get('/commodities', async (req, res) => {
  try {
    const commodities = await mandiService.getCommodityList();
    
    res.json({
      success: true,
      data: commodities,
      message: 'Commodities list retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch commodities list'
    });
  }
});

module.exports = router;