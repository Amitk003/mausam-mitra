const axios = require('axios');

class WeatherService {
  constructor() {
    // Multiple weather API sources for better reliability
    this.apis = [
      {
        name: 'wttr.in',
        baseURL: 'https://wttr.in',
        apiKey: null
      },
      {
        name: 'openweathermap',
        baseURL: 'https://api.openweathermap.org/data/2.5',
        apiKey: process.env.OPENWEATHER_API_KEY
      }
    ];
  }

  async getWeather(city, language = 'hi') {
    console.log(`Fetching weather for: ${city}`);
    
    // Try multiple weather APIs
    for (const api of this.apis) {
      try {
        const data = await this.fetchFromAPI(api, city);
        if (data) {
          return this.formatWeatherData(data, language, api.name);
        }
      } catch (error) {
        console.error(`Error with ${api.name}:`, error.message);
        continue;
      }
    }

    // If all APIs fail, return mock weather data
    return this.getMockWeatherData(city, language);
  }

  async fetchFromAPI(api, city) {
    if (api.name === 'wttr.in') {
      return await this.fetchFromWttr(api, city);
    } else if (api.name === 'openweathermap' && api.apiKey) {
      return await this.fetchFromOpenWeather(api, city);
    }
    return null;
  }

  async fetchFromWttr(api, city) {
    const response = await axios.get(`${api.baseURL}/${encodeURIComponent(city)}?format=j1`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'MausamMitra/1.0'
      }
    });
    return response.data;
  }

  async fetchFromOpenWeather(api, city) {
    const currentResponse = await axios.get(
      `${api.baseURL}/weather?q=${encodeURIComponent(city)}&appid=${api.apiKey}&units=metric`,
      { timeout: 10000 }
    );
    
    const forecastResponse = await axios.get(
      `${api.baseURL}/forecast?q=${encodeURIComponent(city)}&appid=${api.apiKey}&units=metric`,
      { timeout: 10000 }
    );

    return {
      current: currentResponse.data,
      forecast: forecastResponse.data,
      source: 'openweathermap'
    };
  }

  formatWeatherData(data, language, source = 'wttr.in') {
    if (source === 'openweathermap') {
      return this.formatOpenWeatherData(data, language);
    }
    
    // Format wttr.in data
    const current = data.current_condition[0];
    const today = data.weather[0];
    
    const weatherInfo = {
      city: data.nearest_area[0].areaName[0].value,
      current: {
        temperature: current.temp_C,
        feelsLike: current.FeelsLikeC,
        humidity: current.humidity,
        windSpeed: current.windspeedKmph,
        description: current.weatherDesc[0].value,
        visibility: current.visibility
      },
      today: {
        maxTemp: today.maxtempC,
        minTemp: today.mintempC,
        sunrise: today.astronomy[0].sunrise,
        sunset: today.astronomy[0].sunset,
        uvIndex: today.uvIndex
      },
      forecast: data.weather.slice(0, 3).map(day => ({
        date: day.date,
        maxTemp: day.maxtempC,
        minTemp: day.mintempC,
        description: day.hourly[0].weatherDesc[0].value,
        chanceOfRain: day.hourly[0].chanceofrain
      }))
    };

    return this.translateWeatherData(weatherInfo, language);
  }

  formatOpenWeatherData(data, language) {
    const current = data.current;
    const forecast = data.forecast;
    
    const weatherInfo = {
      city: current.name,
      current: {
        temperature: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
        description: current.weather[0].description,
        visibility: Math.round((current.visibility || 10000) / 1000) // Convert to km
      },
      today: {
        maxTemp: Math.round(current.main.temp_max),
        minTemp: Math.round(current.main.temp_min),
        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
          hour12: true, hour: '2-digit', minute: '2-digit' 
        }),
        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { 
          hour12: true, hour: '2-digit', minute: '2-digit' 
        }),
        uvIndex: 'N/A'
      },
      forecast: forecast.list.slice(0, 3).map(item => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        maxTemp: Math.round(item.main.temp_max),
        minTemp: Math.round(item.main.temp_min),
        description: item.weather[0].description,
        chanceOfRain: item.pop ? Math.round(item.pop * 100) : 0
      }))
    };

    return this.translateWeatherData(weatherInfo, language);
  }

  getMockWeatherData(city, language) {
    console.log(`Generating mock weather data for: ${city}`);
    
    const mockWeather = {
      city: city,
      current: {
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        feelsLike: Math.floor(Math.random() * 15) + 22,
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        description: 'Partly cloudy',
        visibility: Math.floor(Math.random() * 5) + 5 // 5-10 km
      },
      today: {
        maxTemp: Math.floor(Math.random() * 10) + 30,
        minTemp: Math.floor(Math.random() * 10) + 18,
        sunrise: '06:30 AM',
        sunset: '06:45 PM',
        uvIndex: Math.floor(Math.random() * 8) + 3
      },
      forecast: [
        {
          date: new Date().toISOString().split('T')[0],
          maxTemp: Math.floor(Math.random() * 10) + 30,
          minTemp: Math.floor(Math.random() * 10) + 18,
          description: 'Sunny',
          chanceOfRain: Math.floor(Math.random() * 30)
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          maxTemp: Math.floor(Math.random() * 10) + 28,
          minTemp: Math.floor(Math.random() * 10) + 16,
          description: 'Cloudy',
          chanceOfRain: Math.floor(Math.random() * 50) + 20
        },
        {
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          maxTemp: Math.floor(Math.random() * 10) + 26,
          minTemp: Math.floor(Math.random() * 10) + 15,
          description: 'Light rain',
          chanceOfRain: Math.floor(Math.random() * 30) + 60
        }
      ]
    };

    return this.translateWeatherData(mockWeather, language);
  }

  translateWeatherData(data, language) {
    if (language === 'en') return data;

    const translations = {
      hi: {
        'Sunny': 'धूप',
        'Cloudy': 'बादल',
        'Rainy': 'बारिश',
        'Partly cloudy': 'आंशिक बादल',
        'Clear': 'साफ',
        'Overcast': 'घने बादल'
      },
      mr: {
        'Sunny': 'सनी',
        'Cloudy': 'ढगाळ',
        'Rainy': 'पावसाळी',
        'Partly cloudy': 'अर्धवट ढगाळ',
        'Clear': 'स्वच्छ',
        'Overcast': 'घने ढग'
      },
      pa: {
        'Sunny': 'ਧੁੱਪ',
        'Cloudy': 'ਬੱਦਲ',
        'Rainy': 'ਬਾਰਿਸ਼',
        'Partly cloudy': 'ਅੰਸ਼ਿਕ ਬੱਦਲ',
        'Clear': 'ਸਾਫ਼',
        'Overcast': 'ਘਨੇ ਬੱਦਲ'
      }
    };

    // Translate weather descriptions
    const langTranslations = translations[language] || {};
    
    if (langTranslations[data.current.description]) {
      data.current.description = langTranslations[data.current.description];
    }

    data.forecast.forEach(day => {
      if (langTranslations[day.description]) {
        day.description = langTranslations[day.description];
      }
    });

    return data;
  }

  async getWeatherAlert(city) {
    try {
      const response = await axios.get(`${this.baseURL}/${city}?format=j1`);
      const data = response.data;
      
      const alerts = [];
      const current = data.current_condition[0];
      
      // Check for extreme weather conditions
      if (parseInt(current.temp_C) > 40) {
        alerts.push({ type: 'heat', message: 'Extreme heat warning' });
      }
      
      if (parseInt(current.windspeedKmph) > 50) {
        alerts.push({ type: 'wind', message: 'High wind speed alert' });
      }
      
      if (parseInt(current.humidity) > 90) {
        alerts.push({ type: 'humidity', message: 'Very high humidity' });
      }

      return alerts;
    } catch (error) {
      console.error('Weather alert error:', error);
      return [];
    }
  }
}

module.exports = new WeatherService();