#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌾 Setting up Mausam Mitra...\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file...');
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created from .env.example');
    console.log('⚠️  Please add your Gemini API key to the .env file\n');
} else {
    console.log('✅ .env file already exists\n');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.log('📦 Please run "npm install" to install dependencies\n');
} else {
    console.log('✅ Dependencies are installed\n');
}

console.log('🚀 Setup complete! Next steps:');
console.log('1. Add your Gemini API key to .env file');
console.log('2. Run "npm start" to start the server');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n🌟 Happy farming with Mausam Mitra!');