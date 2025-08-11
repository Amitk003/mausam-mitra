const axios = require('axios');

class MandiService {
  constructor() {
    // Multiple API endpoints for better data coverage
    this.apis = [
      {
        name: 'data.gov.in',
        baseURL: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
        apiKey: process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'
      },
      {
        name: 'agmarknet',
        baseURL: 'https://enam.gov.in/web/resources/price-data',
        apiKey: null
      }
    ];
  }

  async getMandiPrices(commodity, state = '', district = '') {
    console.log(`Fetching prices for: ${commodity}, State: ${state}, District: ${district}`);
    
    // Try multiple data sources
    for (const api of this.apis) {
      try {
        const data = await this.fetchFromAPI(api, commodity, state, district);
        if (data && data.length > 0) {
          return this.filterByLocation(data, state, district);
        }
      } catch (error) {
        console.error(`Error with ${api.name}:`, error.message);
        continue;
      }
    }

    // If all APIs fail, return location-specific mock data
    return this.getLocationSpecificMockData(commodity, state, district);
  }

  async fetchFromAPI(api, commodity, state, district) {
    if (api.name === 'data.gov.in') {
      return await this.fetchFromDataGovIn(api, commodity, state, district);
    }
    // Add more API implementations here
    return null;
  }

  async fetchFromDataGovIn(api, commodity, state, district) {
    let url = `${api.baseURL}?api-key=${api.apiKey}&format=json&limit=50`;
    
    // Add filters
    if (commodity) {
      url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
    }
    
    if (state) {
      url += `&filters[state]=${encodeURIComponent(state)}`;
    }
    
    if (district) {
      url += `&filters[district]=${encodeURIComponent(district)}`;
    }

    console.log('API URL:', url);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'MausamMitra/1.0'
      }
    });

    if (response.data && response.data.records) {
      return this.formatMandiData(response.data.records);
    }
    
    return null;
  }

  filterByLocation(data, state, district) {
    let filteredData = data;

    // Filter by state if provided
    if (state && state.trim()) {
      filteredData = filteredData.filter(item => 
        item.state && item.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    // Filter by district if provided
    if (district && district.trim()) {
      filteredData = filteredData.filter(item => 
        item.district && item.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    // If no results after filtering, return original data
    return filteredData.length > 0 ? filteredData : data;
  }

  formatMandiData(records) {
    return records.map(record => ({
      commodity: record.commodity,
      variety: record.variety || 'Standard',
      market: record.market,
      district: record.district,
      state: record.state,
      minPrice: record.min_price,
      maxPrice: record.max_price,
      modalPrice: record.modal_price,
      priceUnit: 'per quintal',
      date: record.price_date,
      trend: this.calculateTrend(record.min_price, record.max_price)
    }));
  }

  getLocationSpecificMockData(commodity, state = '', district = '') {
    console.log(`Generating mock data for: ${commodity} in ${state}, ${district}`);
    
    // Comprehensive mock data with real Indian locations and realistic prices
    const mockDataByLocation = {
      'wheat': {
        'haryana': [
          { market: 'Kaithal', district: 'Kaithal', minPrice: '2100', maxPrice: '2180', modalPrice: '2140' },
          { market: 'Karnal', district: 'Karnal', minPrice: '2080', maxPrice: '2160', modalPrice: '2120' },
          { market: 'Ambala', district: 'Ambala', minPrice: '2090', maxPrice: '2170', modalPrice: '2130' }
        ],
        'punjab': [
          { market: 'Ludhiana', district: 'Ludhiana', minPrice: '2110', maxPrice: '2190', modalPrice: '2150' },
          { market: 'Amritsar', district: 'Amritsar', minPrice: '2105', maxPrice: '2185', modalPrice: '2145' },
          { market: 'Jalandhar', district: 'Jalandhar', minPrice: '2095', maxPrice: '2175', modalPrice: '2135' }
        ],
        'uttar pradesh': [
          { market: 'Meerut', district: 'Meerut', minPrice: '2070', maxPrice: '2150', modalPrice: '2110' },
          { market: 'Agra', district: 'Agra', minPrice: '2060', maxPrice: '2140', modalPrice: '2100' },
          { market: 'Kanpur', district: 'Kanpur', minPrice: '2065', maxPrice: '2145', modalPrice: '2105' }
        ],
        'gujarat': [
          { market: 'Ahmedabad', district: 'Ahmedabad', minPrice: '2050', maxPrice: '2130', modalPrice: '2090' },
          { market: 'Vadodara', district: 'Vadodara', minPrice: '2055', maxPrice: '2135', modalPrice: '2095' },
          { market: 'Rajkot', district: 'Rajkot', minPrice: '2045', maxPrice: '2125', modalPrice: '2085' }
        ]
      },
      'rice': {
        'haryana': [
          { market: 'Karnal', district: 'Karnal', minPrice: '3500', maxPrice: '4200', modalPrice: '3850' },
          { market: 'Kaithal', district: 'Kaithal', minPrice: '3480', maxPrice: '4180', modalPrice: '3830' }
        ],
        'punjab': [
          { market: 'Ludhiana', district: 'Ludhiana', minPrice: '3520', maxPrice: '4220', modalPrice: '3870' },
          { market: 'Amritsar', district: 'Amritsar', minPrice: '3510', maxPrice: '4210', modalPrice: '3860' }
        ],
        'west bengal': [
          { market: 'Kolkata', district: 'Kolkata', minPrice: '3200', maxPrice: '3800', modalPrice: '3500' },
          { market: 'Howrah', district: 'Howrah', minPrice: '3180', maxPrice: '3780', modalPrice: '3480' }
        ],
        'gujarat': [
          { market: 'Ahmedabad', district: 'Ahmedabad', minPrice: '3300', maxPrice: '3900', modalPrice: '3600' },
          { market: 'Surat', district: 'Surat', minPrice: '3280', maxPrice: '3880', modalPrice: '3580' }
        ]
      },
      'onion': {
        'maharashtra': [
          { market: 'Nashik', district: 'Nashik', minPrice: '800', maxPrice: '1200', modalPrice: '1000' },
          { market: 'Pune', district: 'Pune', minPrice: '820', maxPrice: '1220', modalPrice: '1020' },
          { market: 'Mumbai', district: 'Mumbai', minPrice: '850', maxPrice: '1250', modalPrice: '1050' }
        ],
        'gujarat': [
          { market: 'Ahmedabad', district: 'Ahmedabad', minPrice: '780', maxPrice: '1180', modalPrice: '980' },
          { market: 'Rajkot', district: 'Rajkot', minPrice: '790', maxPrice: '1190', modalPrice: '990' }
        ],
        'karnataka': [
          { market: 'Bangalore', district: 'Bangalore', minPrice: '810', maxPrice: '1210', modalPrice: '1010' },
          { market: 'Mysore', district: 'Mysore', minPrice: '800', maxPrice: '1200', modalPrice: '1000' }
        ]
      }
    };

    const commodityKey = commodity.toLowerCase();
    const stateKey = state.toLowerCase();
    
    let selectedData = [];
    
    // Try to find data for the specific state
    if (mockDataByLocation[commodityKey] && mockDataByLocation[commodityKey][stateKey]) {
      selectedData = mockDataByLocation[commodityKey][stateKey];
    } else if (mockDataByLocation[commodityKey]) {
      // If state not found, get data from all states for that commodity
      selectedData = Object.values(mockDataByLocation[commodityKey]).flat();
    } else {
      // Generic fallback data
      selectedData = [{
        market: 'Local Market',
        district: district || 'Various',
        minPrice: '1000',
        maxPrice: '1500',
        modalPrice: '1250'
      }];
    }

    // Filter by district if provided
    if (district && district.trim()) {
      const districtFiltered = selectedData.filter(item => 
        item.district.toLowerCase().includes(district.toLowerCase())
      );
      if (districtFiltered.length > 0) {
        selectedData = districtFiltered;
      }
    }

    // Format the data
    return selectedData.map(item => ({
      commodity: this.capitalizeFirst(commodity),
      variety: this.getVarietyForCommodity(commodity),
      market: item.market,
      district: item.district,
      state: this.capitalizeFirst(state) || this.getStateForMarket(item.market),
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      modalPrice: item.modalPrice,
      priceUnit: 'per quintal',
      date: new Date().toISOString().split('T')[0],
      trend: this.calculateTrend(item.minPrice, item.maxPrice)
    }));
  }

  capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  getVarietyForCommodity(commodity) {
    const varieties = {
      'wheat': 'Dara',
      'rice': 'Basmati',
      'onion': 'Red',
      'potato': 'Local',
      'tomato': 'Hybrid'
    };
    return varieties[commodity.toLowerCase()] || 'Standard';
  }

  getStateForMarket(market) {
    const marketToState = {
      'Kaithal': 'Haryana',
      'Karnal': 'Haryana',
      'Ambala': 'Haryana',
      'Ludhiana': 'Punjab',
      'Amritsar': 'Punjab',
      'Jalandhar': 'Punjab',
      'Meerut': 'Uttar Pradesh',
      'Agra': 'Uttar Pradesh',
      'Kanpur': 'Uttar Pradesh',
      'Ahmedabad': 'Gujarat',
      'Vadodara': 'Gujarat',
      'Rajkot': 'Gujarat',
      'Nashik': 'Maharashtra',
      'Pune': 'Maharashtra',
      'Mumbai': 'Maharashtra',
      'Bangalore': 'Karnataka',
      'Mysore': 'Karnataka',
      'Kolkata': 'West Bengal',
      'Howrah': 'West Bengal'
    };
    return marketToState[market] || 'India';
  }

  calculateTrend(minPrice, maxPrice) {
    const avg = (parseInt(minPrice) + parseInt(maxPrice)) / 2;
    // Simple trend calculation - in real app, compare with historical data
    if (avg > 2000) return 'rising';
    if (avg < 1000) return 'falling';
    return 'stable';
  }

  async getCommodityList() {
    return [
      'Wheat', 'Rice', 'Onion', 'Potato', 'Tomato', 'Garlic', 'Ginger',
      'Turmeric', 'Coriander', 'Cumin', 'Mustard', 'Groundnut', 'Soybean',
      'Cotton', 'Sugarcane', 'Maize', 'Bajra', 'Jowar', 'Arhar', 'Moong'
    ];
  }

  translateCommodity(commodity, language) {
    const translations = {
      hi: {
        'Wheat': 'गेहूं',
        'Rice': 'चावल',
        'Onion': 'प्याज',
        'Potato': 'आलू',
        'Tomato': 'टमाटर'
      },
      mr: {
        'Wheat': 'गहू',
        'Rice': 'तांदूळ',
        'Onion': 'कांदा',
        'Potato': 'बटाटा',
        'Tomato': 'टोमॅटो'
      },
      pa: {
        'Wheat': 'ਕਣਕ',
        'Rice': 'ਚਾਵਲ',
        'Onion': 'ਪਿਆਜ਼',
        'Potato': 'ਆਲੂ',
        'Tomato': 'ਟਮਾਟਰ'
      }
    };

    return translations[language]?.[commodity] || commodity;
  }
}

module.exports = new MandiService();