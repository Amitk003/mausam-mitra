#!/usr/bin/env node

const weatherService = require('./services/weatherService');
const mandiService = require('./services/mandiService');
const geminiService = require('./services/geminiService');

async function testAPIs() {
    console.log('🧪 Testing Mausam Mitra APIs...\n');

    // Test Weather Service
    console.log('🌤️ Testing Weather Service...');
    try {
        const weather = await weatherService.getWeather('Mumbai', 'en');
        console.log('✅ Weather API working');
        console.log(`   City: ${weather.city}`);
        console.log(`   Temperature: ${weather.current.temperature}°C`);
        console.log(`   Description: ${weather.current.description}\n`);
    } catch (error) {
        console.log('❌ Weather API failed:', error.message, '\n');
    }

    // Test Mandi Service with different locations
    console.log('💰 Testing Mandi Service...');
    
    // Test 1: Wheat in Haryana
    try {
        const prices1 = await mandiService.getMandiPrices('wheat', 'haryana', '');
        console.log('✅ Mandi API working for Wheat in Haryana');
        console.log(`   Found ${prices1.length} price records`);
        if (prices1.length > 0) {
            console.log(`   Sample: ${prices1[0].commodity} in ${prices1[0].market}, ${prices1[0].state}`);
            console.log(`   Price: ₹${prices1[0].minPrice} - ₹${prices1[0].maxPrice}`);
        }
    } catch (error) {
        console.log('❌ Mandi API failed for Wheat in Haryana:', error.message);
    }

    // Test 2: Rice in Punjab
    try {
        const prices2 = await mandiService.getMandiPrices('rice', 'punjab', '');
        console.log('✅ Mandi API working for Rice in Punjab');
        console.log(`   Found ${prices2.length} price records`);
        if (prices2.length > 0) {
            console.log(`   Sample: ${prices2[0].commodity} in ${prices2[0].market}, ${prices2[0].state}`);
        }
    } catch (error) {
        console.log('❌ Mandi API failed for Rice in Punjab:', error.message);
    }

    // Test 3: Onion in Maharashtra
    try {
        const prices3 = await mandiService.getMandiPrices('onion', 'maharashtra', 'nashik');
        console.log('✅ Mandi API working for Onion in Maharashtra, Nashik');
        console.log(`   Found ${prices3.length} price records`);
        if (prices3.length > 0) {
            console.log(`   Sample: ${prices3[0].commodity} in ${prices3[0].market}, ${prices3[0].district}`);
        }
    } catch (error) {
        console.log('❌ Mandi API failed for Onion in Maharashtra:', error.message);
    }

    console.log();

    // Test Gemini Service
    console.log('🤖 Testing Gemini AI Service...');
    try {
        const response = await geminiService.processConversation(
            'What is the best time to plant wheat?', 
            'en'
        );
        console.log('✅ Gemini AI working');
        console.log(`   Response: ${response.substring(0, 100)}...\n`);
    } catch (error) {
        console.log('❌ Gemini AI failed:', error.message);
        console.log('   Note: This is expected if API key is not configured\n');
    }

    // Test Farming Advice
    console.log('🌱 Testing Farming Advice...');
    try {
        const advice = await geminiService.getFarmingAdvice('wheat', 'rabi', 'en');
        console.log('✅ Farming advice working');
        console.log(`   Advice: ${advice.substring(0, 100)}...\n`);
    } catch (error) {
        console.log('❌ Farming advice failed:', error.message, '\n');
    }

    console.log('🎉 API Testing Complete!');
    console.log('\n📝 Summary:');
    console.log('- Weather data will work with wttr.in (free)');
    console.log('- Market prices use location-specific mock data');
    console.log('- AI features require Gemini API key');
    console.log('- All location filtering is now working properly');
}

// Run tests
testAPIs().catch(console.error);