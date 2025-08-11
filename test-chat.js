#!/usr/bin/env node

const geminiService = require('./services/geminiService');

async function testChatFunctionality() {
    console.log('🧪 Testing Chat Functionality...\n');

    const testMessages = [
        { message: "Hi i think it's gonna rain in my area", language: 'en' },
        { message: "why my crop is getting damaged", language: 'en' },
        { message: "मुंबई में बारिश होगी क्या?", language: 'hi' },
        { message: "गेहूं का भाव क्या है?", language: 'hi' },
        { message: "धान की खेती कैसे करें?", language: 'hi' },
        { message: "Hello", language: 'en' }
    ];

    for (const test of testMessages) {
        console.log(`🔍 Testing: "${test.message}" (${test.language})`);
        try {
            const response = await geminiService.processConversation(test.message, test.language);
            console.log(`✅ Response: ${response.substring(0, 150)}...\n`);
        } catch (error) {
            console.log(`❌ Error: ${error.message}\n`);
        }
    }

    console.log('🎉 Chat testing complete!');
}

testChatFunctionality().catch(console.error);