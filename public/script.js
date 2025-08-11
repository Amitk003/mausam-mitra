// Global variables
let currentLanguage = 'hi';
const API_BASE = '/api';

// Voice functionality variables
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;
let autoSpeak = false;
let voices = [];

// Camera functionality variables
let cameraStream = null;
let capturedImageData = null;
let isCameraActive = false;

// Language translations
const translations = {
    hi: {
        quickActionsTitle: 'त्वरित सेवाएं',
        weatherAction: 'मौसम जानकारी',
        mandiAction: 'मंडी भाव',
        farmingAction: 'खेती सलाह',
        chatAction: 'AI सहायक',
        weatherTitle: 'मौसम जानकारी',
        mandiTitle: 'मंडी भाव',
        farmingTitle: 'खेती सलाह',
        chatTitle: 'AI सहायक से बात करें',
        getWeatherBtn: 'मौसम देखें',
        getMandiBtn: 'भाव देखें',
        getFarmingBtn: 'सलाह लें',
        sendBtn: 'भेजें',
        loadingText: 'कृपया प्रतीक्षा करें...',
        cityPlaceholder: 'शहर का नाम दर्ज करें',
        commodityPlaceholder: 'फसल का नाम दर्ज करें',
        cropPlaceholder: 'फसल का नाम दर्ज करें',
        chatPlaceholder: 'अपना सवाल यहाँ लिखें...',
        voiceListening: 'सुन रहा हूं... बोलिए',
        voiceError: 'आवाज़ समझ नहीं आई, फिर कोशिश करें',
        autoSpeakOn: 'ऑटो बोलें: चालू',
        autoSpeakOff: 'ऑटो बोलें: बंद',
        cameraNotSupported: 'कैमरा समर्थित नहीं है',
        cameraPermissionDenied: 'कैमरा एक्सेस नहीं मिला। कृपया कैमरा की अनुमति दें।'
    },
    en: {
        quickActionsTitle: 'Quick Services',
        weatherAction: 'Weather Info',
        mandiAction: 'Market Prices',
        farmingAction: 'Farming Advice',
        chatAction: 'AI Assistant',
        weatherTitle: 'Weather Information',
        mandiTitle: 'Market Prices',
        farmingTitle: 'Farming Advice',
        chatTitle: 'Chat with AI Assistant',
        getWeatherBtn: 'Get Weather',
        getMandiBtn: 'Get Prices',
        getFarmingBtn: 'Get Advice',
        sendBtn: 'Send',
        loadingText: 'Please wait...',
        cityPlaceholder: 'Enter city name',
        commodityPlaceholder: 'Enter crop name',
        cropPlaceholder: 'Enter crop name',
        chatPlaceholder: 'Type your question here...',
        voiceListening: 'Listening... Please speak',
        voiceError: 'Could not understand voice, please try again',
        autoSpeakOn: 'Auto Speak: ON',
        autoSpeakOff: 'Auto Speak: OFF',
        cameraNotSupported: 'Camera not supported',
        cameraPermissionDenied: 'Camera access denied. Please allow camera permission.',
        statePlaceholder: 'Enter state name (optional)',
        districtPlaceholder: 'Enter district name (optional)'
    },
    mr: {
        quickActionsTitle: 'त्वरित सेवा',
        weatherAction: 'हवामान माहिती',
        mandiAction: 'मंडी भाव',
        farmingAction: 'शेती सल्ला',
        chatAction: 'AI सहाय्यक',
        weatherTitle: 'हवामान माहिती',
        mandiTitle: 'मंडी भाव',
        farmingTitle: 'शेती सल्ला',
        chatTitle: 'AI सहाय्यकाशी बोला',
        getWeatherBtn: 'हवामान पहा',
        getMandiBtn: 'भाव पहा',
        getFarmingBtn: 'सल्ला घ्या',
        sendBtn: 'पाठवा',
        loadingText: 'कृपया प्रतीक्षा करा...',
        cityPlaceholder: 'शहराचे नाव टाका',
        commodityPlaceholder: 'पिकाचे नाव टाका',
        cropPlaceholder: 'पिकाचे नाव टाका',
        chatPlaceholder: 'तुमचा प्रश्न इथे लिहा...',
        voiceListening: 'ऐकत आहे... बोला',
        voiceError: 'आवाज समजला नाही, पुन्हा प्रयत्न करा',
        autoSpeakOn: 'ऑटो बोलणे: चालू',
        autoSpeakOff: 'ऑटो बोलणे: बंद',
        cameraNotSupported: 'कॅमेरा समर्थित नाही',
        cameraPermissionDenied: 'कॅमेरा अॅक्सेस नाकारला. कृपया कॅमेरा परवानगी द्या.'
    },
    pa: {
        quickActionsTitle: 'ਤੁਰੰਤ ਸੇਵਾਵਾਂ',
        weatherAction: 'ਮੌਸਮ ਜਾਣਕਾਰੀ',
        mandiAction: 'ਮੰਡੀ ਭਾਅ',
        farmingAction: 'ਖੇਤੀ ਸਲਾਹ',
        chatAction: 'AI ਸਹਾਇਕ',
        weatherTitle: 'ਮੌਸਮ ਜਾਣਕਾਰੀ',
        mandiTitle: 'ਮੰਡੀ ਭਾਅ',
        farmingTitle: 'ਖੇਤੀ ਸਲਾਹ',
        chatTitle: 'AI ਸਹਾਇਕ ਨਾਲ ਗੱਲ ਕਰੋ',
        getWeatherBtn: 'ਮੌਸਮ ਦੇਖੋ',
        getMandiBtn: 'ਭਾਅ ਦੇਖੋ',
        getFarmingBtn: 'ਸਲਾਹ ਲਓ',
        sendBtn: 'ਭੇਜੋ',
        loadingText: 'ਕਿਰਪਾ ਕਰਕੇ ਇੰਤਜ਼ਾਰ ਕਰੋ...',
        cityPlaceholder: 'ਸ਼ਹਿਰ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ',
        commodityPlaceholder: 'ਫਸਲ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ',
        cropPlaceholder: 'ਫਸਲ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ',
        chatPlaceholder: 'ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...',
        voiceListening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ',
        voiceError: 'ਆਵਾਜ਼ ਸਮਝ ਨਹੀਂ ਆਈ, ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
        autoSpeakOn: 'ਆਟੋ ਬੋਲਣਾ: ਚਾਲੂ',
        autoSpeakOff: 'ਆਟੋ ਬੋਲਣਾ: ਬੰਦ',
        cameraNotSupported: 'ਕੈਮਰਾ ਸਮਰਥਿਤ ਨਹੀਂ',
        cameraPermissionDenied: 'ਕੈਮਰਾ ਐਕਸੈਸ ਇਨਕਾਰ ਕੀਤਾ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਕੈਮਰਾ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ।'
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateLanguage();
    initializeVoice();
    registerServiceWorker();
});

// Register Service Worker for PWA
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

function setupEventListeners() {
    // Language selector
    document.getElementById('languageSelect').addEventListener('change', function() {
        currentLanguage = this.value;
        updateLanguage();
    });

    // Enter key listeners
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') getWeather();
    });

    document.getElementById('commodityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') getMandiPrices();
    });

    document.getElementById('cropInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') getFarmingAdvice();
    });

    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Update all text elements
    Object.keys(t).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.tagName === 'INPUT') {
                element.placeholder = t[key];
            } else {
                element.textContent = t[key];
            }
        }
    });

    // Update placeholders manually for inputs that might not have IDs matching translation keys
    document.getElementById('cityInput').placeholder = t.cityPlaceholder;
    document.getElementById('commodityInput').placeholder = t.commodityPlaceholder;
    document.getElementById('cropInput').placeholder = t.cropPlaceholder;
    document.getElementById('chatInput').placeholder = t.chatPlaceholder;
    document.getElementById('stateInput').placeholder = t.statePlaceholder || (currentLanguage === 'en' ? 'Enter state name' : 'राज्य का नाम दर्ज करें');
    document.getElementById('districtInput').placeholder = t.districtPlaceholder || (currentLanguage === 'en' ? 'Enter district name' : 'जिले का नाम दर्ज करें');
    
    // Update voice settings
    updateSpeechLanguage();
    
    // Update auto-speak button text and icon
    const speakText = document.getElementById('speakText');
    const speakIcon = document.getElementById('speakIcon');
    if (speakText && speakIcon) {
        if (autoSpeak) {
            speakIcon.className = 'fas fa-volume-up';
            speakText.textContent = currentLanguage === 'en' ? 'Auto Speak: ON' : 'ऑटो बोलें: चालू';
        } else {
            speakIcon.className = 'fas fa-volume-mute';
            speakText.textContent = currentLanguage === 'en' ? 'Auto Speak: OFF' : 'ऑटो बोलें: बंद';
        }
    }
}

// Section navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
}

function showWeatherSection() {
    showSection('weatherSection');
}

function showMandiSection() {
    showSection('mandiSection');
}

function showFarmingSection() {
    showSection('farmingSection');
}

function showChatSection() {
    showSection('chatSection');
    initializeChat();
}

function showWeatherSection() {
    showSection('weatherSection');
    // Add voice button to weather input if not already added
    setTimeout(() => addVoiceToInputIfNeeded('weatherSection', 'cityInput'), 100);
}

function showMandiSection() {
    showSection('mandiSection');
    // Add voice buttons to mandi inputs if not already added
    setTimeout(() => {
        addVoiceToInputIfNeeded('mandiSection', 'commodityInput');
    }, 100);
}

function showFarmingSection() {
    showSection('farmingSection');
    // Add voice button to farming input if not already added
    setTimeout(() => addVoiceToInputIfNeeded('farmingSection', 'cropInput'), 100);
}

function addVoiceToInputIfNeeded(sectionId, inputId) {
    const section = document.getElementById(sectionId);
    if (!section || !recognition) return;
    
    const inputGroup = section.querySelector('.input-group');
    if (!inputGroup) return;
    
    // Check if voice button already exists
    if (inputGroup.querySelector('.section-voice-btn')) return;
    
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'voice-btn section-voice-btn';
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceBtn.title = currentLanguage === 'en' ? 'Voice Input' : 'आवाज़ से लिखें';
    voiceBtn.onclick = () => startVoiceInputForField(inputId);
    
    inputGroup.appendChild(voiceBtn);
}

// Loading spinner
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

// Weather functionality
async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert('कृपया शहर का नाम दर्ज करें');
        return;
    }

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/weather/${encodeURIComponent(city)}?language=${currentLanguage}`);
        const data = await response.json();

        if (data.success) {
            displayWeatherData(data.data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Weather error:', error);
        document.getElementById('weatherResult').innerHTML = `
            <div class="error-message">
                <p>मौसम की जानकारी प्राप्त करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

function displayWeatherData(weather) {
    const resultDiv = document.getElementById('weatherResult');
    
    resultDiv.innerHTML = `
        <div class="weather-card">
            <h3>${weather.city} - वर्तमान मौसम</h3>
            <div class="weather-current">
                <div class="weather-stat">
                    <div class="value">${weather.current.temperature}°C</div>
                    <div class="label">तापमान</div>
                </div>
                <div class="weather-stat">
                    <div class="value">${weather.current.humidity}%</div>
                    <div class="label">नमी</div>
                </div>
                <div class="weather-stat">
                    <div class="value">${weather.current.windSpeed} km/h</div>
                    <div class="label">हवा की गति</div>
                </div>
                <div class="weather-stat">
                    <div class="value">${weather.current.description}</div>
                    <div class="label">मौसम</div>
                </div>
            </div>
            
            <h4>आज का मौसम</h4>
            <div class="weather-current">
                <div class="weather-stat">
                    <div class="value">${weather.today.maxTemp}°C</div>
                    <div class="label">अधिकतम तापमान</div>
                </div>
                <div class="weather-stat">
                    <div class="value">${weather.today.minTemp}°C</div>
                    <div class="label">न्यूनतम तापमान</div>
                </div>
                <div class="weather-stat">
                    <div class="value">${weather.today.sunrise}</div>
                    <div class="label">सूर्योदय</div>
                </div>
                <div class="weather-stat">
                    <div class="value">${weather.today.sunset}</div>
                    <div class="label">सूर्यास्त</div>
                </div>
            </div>
        </div>
        
        <div class="weather-card">
            <h4>3 दिन का पूर्वानुमान</h4>
            ${weather.forecast.map(day => `
                <div class="forecast-day">
                    <strong>${day.date}</strong> - 
                    ${day.maxTemp}°C/${day.minTemp}°C - 
                    ${day.description} 
                    (बारिश की संभावना: ${day.chanceOfRain}%)
                </div>
            `).join('')}
        </div>
    `;
}

// Mandi functionality
async function getMandiPrices() {
    const commodity = document.getElementById('commodityInput').value.trim();
    const state = document.getElementById('stateInput').value.trim();
    const district = document.getElementById('districtInput').value.trim();
    
    if (!commodity) {
        const alertMsg = currentLanguage === 'en' ? 'Please enter crop name' : 'कृपया फसल का नाम दर्ज करें';
        alert(alertMsg);
        return;
    }

    showLoading();
    try {
        let url = `${API_BASE}/mandi/prices/${encodeURIComponent(commodity)}?language=${currentLanguage}`;
        if (state) url += `&state=${encodeURIComponent(state)}`;
        if (district) url += `&district=${encodeURIComponent(district)}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            displayMandiData(data.data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Mandi error:', error);
        const errorMsg = currentLanguage === 'en' ? 
            'Error fetching market prices. Please try again later.' : 
            'मंडी भाव प्राप्त करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।';
        document.getElementById('mandiResult').innerHTML = `
            <div class="error-message">
                <p>${errorMsg}</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

function displayMandiData(prices) {
    const resultDiv = document.getElementById('mandiResult');
    
    if (prices.length === 0) {
        resultDiv.innerHTML = '<p>इस फसल के लिए कोई भाव उपलब्ध नहीं है।</p>';
        return;
    }

    resultDiv.innerHTML = prices.map(price => `
        <div class="price-card">
            <div class="price-header">
                <div class="commodity-name">${price.commodity} (${price.variety})</div>
                <div class="trend ${price.trend}">${getTrendText(price.trend)}</div>
            </div>
            <div class="price-details">
                <div class="weather-stat">
                    <div class="value">₹${price.minPrice}</div>
                    <div class="label">न्यूनतम भाव</div>
                </div>
                <div class="weather-stat">
                    <div class="value">₹${price.maxPrice}</div>
                    <div class="label">अधिकतम भाव</div>
                </div>
                <div class="weather-stat">
                    <div class="value">₹${price.modalPrice}</div>
                    <div class="label">मॉडल भाव</div>
                </div>
                <div class="weather-stat">
                    <div class="value">${price.market}</div>
                    <div class="label">मंडी</div>
                </div>
            </div>
            <p><small>${price.district}, ${price.state} - ${price.date}</small></p>
        </div>
    `).join('');
}

function getTrendText(trend) {
    const trendTexts = {
        hi: { rising: '↗️ बढ़ रहा', falling: '↘️ गिर रहा', stable: '➡️ स्थिर' },
        en: { rising: '↗️ Rising', falling: '↘️ Falling', stable: '➡️ Stable' },
        mr: { rising: '↗️ वाढत आहे', falling: '↘️ कमी होत आहे', stable: '➡️ स्थिर' },
        pa: { rising: '↗️ ਵਧ ਰਿਹਾ', falling: '↘️ ਘਟ ਰਿਹਾ', stable: '➡️ ਸਥਿਰ' }
    };
    
    return trendTexts[currentLanguage][trend] || trendTexts.hi[trend];
}

// Farming advice functionality
async function getFarmingAdvice() {
    const crop = document.getElementById('cropInput').value.trim();
    const season = document.getElementById('seasonSelect').value;
    
    if (!crop) {
        alert('कृपया फसल का नाम दर्ज करें');
        return;
    }

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/farming/advice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                crop: crop,
                season: season,
                language: currentLanguage
            })
        });

        const data = await response.json();

        if (data.success) {
            displayFarmingAdvice(data.data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Farming advice error:', error);
        document.getElementById('farmingResult').innerHTML = `
            <div class="error-message">
                <p>खेती सलाह प्राप्त करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

function displayFarmingAdvice(data) {
    const resultDiv = document.getElementById('farmingResult');
    
    resultDiv.innerHTML = `
        <div class="advice-card">
            <h3>${data.crop} - ${data.season} सीजन की सलाह</h3>
            <div class="advice-content">
                ${data.advice.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
        </div>
    `;
}

// Chat functionality
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/conversation/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                language: currentLanguage
            })
        });

        const data = await response.json();

        if (data.success) {
            addMessageToChat(data.data.response, 'assistant');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Chat error:', error);
        
        // Language-specific error messages
        const errorMessages = {
            hi: 'क्षमा करें, मैं अभी आपकी सहायता नहीं कर सकता। कृपया बाद में पुनः प्रयास करें।',
            en: 'Sorry, I cannot assist you right now. Please try again later.',
            mr: 'क्षमा करा, मी सध्या तुमची मदत करू शकत नाही. कृपया नंतर पुन्हा प्रयत्न करा.',
            pa: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਸ ਸਮੇਂ ਤੁਹਾਡੀ ਸਹਾਇਤਾ ਨਹੀਂ ਕਰ ਸਕਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
        };
        
        addMessageToChat(errorMessages[currentLanguage] || errorMessages.hi, 'assistant');
    } finally {
        hideLoading();
    }
}

// Initialize chat with welcome message
function initializeChat() {
    const welcomeMessages = {
        hi: 'नमस्ते! मैं मौसम मित्र हूं। मैं आपकी मौसम, मंडी भाव और खेती की जानकारी में मदद कर सकता हूं। आप मुझसे कुछ भी पूछ सकते हैं!',
        en: 'Hello! I am Mausam Mitra. I can help you with weather, market prices, and farming information. Feel free to ask me anything!',
        mr: 'नमस्कार! मी मौसम मित्र आहे. मी तुम्हाला हवामान, मंडी भाव आणि शेतीची माहिती देण्यात मदत करू शकतो. तुम्ही मला काहीही विचारू शकता!',
        pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਮੌਸਮ ਮਿੱਤਰ ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਮੌਸਮ, ਮੰਡੀ ਭਾਅ ਅਤੇ ਖੇਤੀ ਦੀ ਜਾਣਕਾਰੀ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ!'
    };
    
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages.children.length === 0) {
        addMessageToChat(welcomeMessages[currentLanguage] || welcomeMessages.hi, 'assistant');
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // Add speaker button for assistant messages
    if (sender === 'assistant') {
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
            <button class="speak-btn" onclick="speakText('${message.replace(/'/g, "\\'")}', '${currentLanguage}')" title="Speak this message">
                <i class="fas fa-volume-up"></i>
            </button>
        `;
        
        // Auto-speak if enabled
        if (autoSpeak) {
            setTimeout(() => speakText(message, currentLanguage), 500);
        }
    } else {
        messageDiv.textContent = message;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Voice functionality
function initializeVoice() {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = function() {
            isListening = true;
            updateVoiceButton();
            const t = translations[currentLanguage];
            showVoiceStatus('fas fa-microphone', t.voiceListening);
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
            hideVoiceStatus();
            
            // Auto-send if transcript is not empty
            if (transcript.trim()) {
                setTimeout(() => sendMessage(), 500);
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            hideVoiceStatus();
            const t = translations[currentLanguage];
            showVoiceStatus('fas fa-exclamation-triangle', t.voiceError, 2000);
        };
        
        recognition.onend = function() {
            isListening = false;
            updateVoiceButton();
            hideVoiceStatus();
        };
        
        // Set language based on current language
        updateSpeechLanguage();
    } else {
        console.warn('Speech Recognition not supported');
        document.getElementById('voiceBtn').style.display = 'none';
    }
    
    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
        // Load voices
        loadVoices();
        synthesis.onvoiceschanged = loadVoices;
    } else {
        console.warn('Speech Synthesis not supported');
        document.querySelector('.voice-controls').style.display = 'none';
    }
}

function loadVoices() {
    voices = synthesis.getVoices();
    console.log('Available voices:', voices.length);
}

function updateSpeechLanguage() {
    if (!recognition) return;
    
    const languageMap = {
        'hi': 'hi-IN',
        'en': 'en-US',
        'mr': 'mr-IN',
        'pa': 'pa-IN'
    };
    
    recognition.lang = languageMap[currentLanguage] || 'hi-IN';
}

function toggleVoiceInput() {
    if (!recognition) {
        alert('Voice input not supported in this browser');
        return;
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function updateVoiceButton() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceIcon = document.getElementById('voiceIcon');
    
    if (isListening) {
        voiceBtn.classList.add('listening');
        voiceIcon.textContent = '🔴';
    } else {
        voiceBtn.classList.remove('listening');
        voiceIcon.textContent = '🎤';
    }
}

function showVoiceStatus(iconClass, text, duration = 0) {
    hideVoiceStatus(); // Remove any existing status
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'voice-status';
    statusDiv.innerHTML = `
        <i class="status-icon ${iconClass}"></i>
        <span class="status-text">${text}</span>
    `;
    
    document.body.appendChild(statusDiv);
    
    if (duration > 0) {
        setTimeout(() => hideVoiceStatus(), duration);
    }
}

function hideVoiceStatus() {
    const existingStatus = document.querySelector('.voice-status');
    if (existingStatus) {
        existingStatus.remove();
    }
}

function toggleAutoSpeak() {
    autoSpeak = !autoSpeak;
    const autoSpeakBtn = document.getElementById('autoSpeakBtn');
    const speakIcon = document.getElementById('speakIcon');
    const speakText = document.getElementById('speakText');
    
    if (autoSpeak) {
        autoSpeakBtn.classList.add('active');
        speakIcon.textContent = '🔊';
        speakText.textContent = currentLanguage === 'en' ? 'Auto Speak: ON' : 'ऑटो बोलें: चालू';
    } else {
        autoSpeakBtn.classList.remove('active');
        speakIcon.textContent = '🔇';
        speakText.textContent = currentLanguage === 'en' ? 'Auto Speak: OFF' : 'ऑटो बोलें: बंद';
    }
}

function speakText(text, language = currentLanguage) {
    if (!synthesis || !text) return;
    
    // Stop any ongoing speech
    synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    const voice = getVoiceForLanguage(language);
    if (voice) {
        utterance.voice = voice;
    }
    
    // Set language
    const languageMap = {
        'hi': 'hi-IN',
        'en': 'en-US',
        'mr': 'mr-IN',
        'pa': 'pa-IN'
    };
    utterance.lang = languageMap[language] || 'hi-IN';
    
    // Set speech parameters
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Speak
    synthesis.speak(utterance);
}

function getVoiceForLanguage(language) {
    if (!voices.length) return null;
    
    const languageMap = {
        'hi': ['hi-IN', 'hi'],
        'en': ['en-US', 'en-GB', 'en'],
        'mr': ['mr-IN', 'mr'],
        'pa': ['pa-IN', 'pa']
    };
    
    const preferredLangs = languageMap[language] || ['en-US'];
    
    for (const lang of preferredLangs) {
        const voice = voices.find(v => v.lang.startsWith(lang));
        if (voice) return voice;
    }
    
    // Fallback to first available voice
    return voices[0];
}

// Add voice button to other sections
function addVoiceToSection(sectionId, inputId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const inputGroup = section.querySelector('.input-group');
    if (!inputGroup) return;
    
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'voice-btn';
    voiceBtn.innerHTML = '🎤';
    voiceBtn.onclick = () => startVoiceInputForField(inputId);
    
    inputGroup.appendChild(voiceBtn);
}

function startVoiceInputForField(inputId) {
    if (!recognition) return;
    
    const originalOnResult = recognition.onresult;
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById(inputId).value = transcript;
        hideVoiceStatus();
        
        // Restore original handler
        recognition.onresult = originalOnResult;
    };
    
    recognition.start();
}

// Camera functionality
function toggleCamera() {
    const cameraModal = document.getElementById('cameraModal');
    cameraModal.classList.remove('hidden');
    updateCameraLanguage();
}

function closeCameraModal() {
    const cameraModal = document.getElementById('cameraModal');
    cameraModal.classList.add('hidden');
    
    // Stop camera if active
    if (isCameraActive) {
        stopCamera();
    }
    
    // Reset states
    document.getElementById('liveCamera').classList.add('hidden');
    document.getElementById('imagePreview').classList.add('hidden');
    capturedImageData = null;
}

function updateCameraLanguage() {
    const translations = {
        hi: {
            cameraTitle: 'फसल की तस्वीर लें',
            liveCameraText: 'लाइव कैमरा',
            galleryText: 'गैलरी से चुनें',
            captureText: 'तस्वीर लें',
            stopCameraText: 'बंद करें',
            analyzeText: 'विश्लेषण करें',
            retakeText: 'दोबारा लें',
            imageQuestionPlaceholder: 'इस तस्वीर के बारे में पूछें...'
        },
        en: {
            cameraTitle: 'Take Crop Photo',
            liveCameraText: 'Live Camera',
            galleryText: 'Choose from Gallery',
            captureText: 'Capture Photo',
            stopCameraText: 'Stop Camera',
            analyzeText: 'Analyze Image',
            retakeText: 'Retake Photo',
            imageQuestionPlaceholder: 'Ask about this image...'
        },
        mr: {
            cameraTitle: 'पिकाचा फोटो घ्या',
            liveCameraText: 'लाइव्ह कॅमेरा',
            galleryText: 'गॅलरीतून निवडा',
            captureText: 'फोटो घ्या',
            stopCameraText: 'बंद करा',
            analyzeText: 'विश्लेषण करा',
            retakeText: 'पुन्हा घ्या',
            imageQuestionPlaceholder: 'या चित्राबद्दल विचारा...'
        },
        pa: {
            cameraTitle: 'ਫਸਲ ਦੀ ਫੋਟੋ ਲਓ',
            liveCameraText: 'ਲਾਈਵ ਕੈਮਰਾ',
            galleryText: 'ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ',
            captureText: 'ਫੋਟੋ ਲਓ',
            stopCameraText: 'ਬੰਦ ਕਰੋ',
            analyzeText: 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
            retakeText: 'ਦੁਬਾਰਾ ਲਓ',
            imageQuestionPlaceholder: 'ਇਸ ਤਸਵੀਰ ਬਾਰੇ ਪੁੱਛੋ...'
        }
    };

    const t = translations[currentLanguage] || translations.hi;
    
    document.getElementById('cameraTitle').textContent = t.cameraTitle;
    document.getElementById('liveCameraText').textContent = t.liveCameraText;
    document.getElementById('galleryText').textContent = t.galleryText;
    document.getElementById('captureText').textContent = t.captureText;
    document.getElementById('stopCameraText').textContent = t.stopCameraText;
    document.getElementById('analyzeText').textContent = t.analyzeText;
    document.getElementById('retakeText').textContent = t.retakeText;
    document.getElementById('imageQuestion').placeholder = t.imageQuestionPlaceholder;
}

async function startLiveCamera() {
    try {
        // Request camera permission
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        const video = document.getElementById('cameraVideo');
        video.srcObject = cameraStream;
        
        document.getElementById('liveCamera').classList.remove('hidden');
        document.getElementById('imagePreview').classList.add('hidden');
        
        isCameraActive = true;
        
        // Update camera button state
        const cameraBtn = document.getElementById('cameraBtn');
        cameraBtn.classList.add('active');
        
    } catch (error) {
        console.error('Camera access error:', error);
        const t = translations[currentLanguage];
        alert(t.cameraPermissionDenied);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    document.getElementById('liveCamera').classList.add('hidden');
    isCameraActive = false;
    
    // Update camera button state
    const cameraBtn = document.getElementById('cameraBtn');
    cameraBtn.classList.remove('active');
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Show preview
    const previewImage = document.getElementById('previewImage');
    previewImage.src = capturedImageData;
    
    document.getElementById('liveCamera').classList.add('hidden');
    document.getElementById('imagePreview').classList.remove('hidden');
    
    // Stop camera
    stopCamera();
}

function selectFromGallery() {
    document.getElementById('imageInput').click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        capturedImageData = e.target.result;
        
        const previewImage = document.getElementById('previewImage');
        previewImage.src = capturedImageData;
        
        document.getElementById('imagePreview').classList.remove('hidden');
        document.getElementById('liveCamera').classList.add('hidden');
    };
    
    reader.readAsDataURL(file);
}

function retakePhoto() {
    document.getElementById('imagePreview').classList.add('hidden');
    capturedImageData = null;
    
    // Clear the file input
    document.getElementById('imageInput').value = '';
}

async function analyzeImage() {
    if (!capturedImageData) {
        alert('कोई तस्वीर नहीं मिली');
        return;
    }
    
    const question = document.getElementById('imageQuestion').value.trim();
    const defaultQuestion = currentLanguage === 'en' ? 
        'What problem do you see in this crop? Please provide diagnosis and treatment suggestions.' :
        'इस फसल में क्या समस्या दिख रही है? कृपया निदान और उपचार के सुझाव दें।';
    
    const finalQuestion = question || defaultQuestion;
    
    showLoading();
    closeCameraModal();
    
    try {
        // Add image message to chat
        addImageToChat(capturedImageData, finalQuestion);
        
        // Send to AI for analysis
        const response = await fetch(`${API_BASE}/conversation/analyze-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: capturedImageData,
                question: finalQuestion,
                language: currentLanguage
            })
        });

        const data = await response.json();

        if (data.success) {
            addMessageToChat(data.data.response, 'assistant');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Image analysis error:', error);
        
        // Provide fallback analysis
        const fallbackResponse = getFallbackImageAnalysis(finalQuestion, currentLanguage);
        addMessageToChat(fallbackResponse, 'assistant');
    } finally {
        hideLoading();
        capturedImageData = null;
    }
}

function addImageToChat(imageData, question) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user image-message';
    
    messageDiv.innerHTML = `
        <div class="image-container">
            <img src="${imageData}" alt="Uploaded crop image" class="chat-image">
            <p class="image-question">${question}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getFallbackImageAnalysis(question, language) {
    const responses = {
        hi: `मैं आपकी तस्वीर देख सकता हूं। हालांकि मैं विस्तृत विश्लेषण नहीं कर सकता, यहाँ कुछ सामान्य सुझाव हैं:

🌱 **सामान्य फसल समस्याएं और समाधान:**

**पत्तियों में पीलापन:**
• नाइट्रोजन की कमी हो सकती है
• संतुलित उर्वरक का प्रयोग करें

**पत्तियों पर धब्बे:**
• फंगल संक्रमण की संभावना
• बोर्डो मिश्रण का छिड़काव करें

**कीट-पतंगे:**
• नीम का तेल का प्रयोग करें
• जैविक कीटनाशक का उपयोग करें

**बेहतर विश्लेषण के लिए:**
• स्थानीय कृषि विशेषज्ञ से मिलें
• कृषि विभाग से संपर्क करें

नोट: सटीक विश्लेषण के लिए Gemini Vision API कॉन्फ़िगर करें।`,

        en: `I can see your image. While I cannot provide detailed analysis, here are some general suggestions:

🌱 **Common Crop Problems and Solutions:**

**Yellowing Leaves:**
• May indicate nitrogen deficiency
• Apply balanced fertilizer

**Spots on Leaves:**
• Possible fungal infection
• Spray Bordeaux mixture

**Pest Infestation:**
• Use neem oil spray
• Apply organic pesticides

**For Better Analysis:**
• Consult local agricultural experts
• Contact agriculture department

Note: Configure Gemini Vision API for accurate analysis.`,

        mr: `मी तुमची प्रतिमा पाहू शकतो. तपशीलवार विश्लेषण करू शकत नसलो तरी, येथे काही सामान्य सूचना आहेत:

🌱 **सामान्य पीक समस्या आणि उपाय:**

**पानांमध्ये पिवळेपणा:**
• नायट्रोजनची कमतरता असू शकते
• संतुलित खत वापरा

**पानांवर डाग:**
• बुरशीजन्य संसर्गाची शक्यता
• बोर्डो मिश्रणाची फवारणी करा

चांगल्या विश्लेषणासाठी स्थानिक शेती तज्ञांचा सल्ला घ्या.`,

        pa: `ਮੈਂ ਤੁਹਾਡੀ ਤਸਵੀਰ ਦੇਖ ਸਕਦਾ ਹਾਂ। ਹਾਲਾਂਕਿ ਮੈਂ ਵਿਸਤ੍ਰਿਤ ਵਿਸ਼ਲੇਸ਼ਣ ਨਹੀਂ ਕਰ ਸਕਦਾ, ਇੱਥੇ ਕੁਝ ਆਮ ਸੁਝਾਅ ਹਨ:

🌱 **ਆਮ ਫਸਲ ਸਮੱਸਿਆਵਾਂ ਅਤੇ ਹੱਲ:**

**ਪੱਤਿਆਂ ਵਿੱਚ ਪੀਲਾਪਨ:**
• ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ ਹੋ ਸਕਦੀ ਹੈ
• ਸੰਤੁਲਿਤ ਖਾਦ ਦਾ ਪ੍ਰਯੋਗ ਕਰੋ

ਬਿਹਤਰ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਸਥਾਨਕ ਖੇਤੀ ਮਾਹਿਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰੋ।`
    };
    
    return responses[language] || responses.hi;
}

// Enhanced TTS with better language support
function getVoiceForLanguage(language) {
    if (!voices.length) return null;
    
    const languageMap = {
        'hi': ['hi-IN', 'hi'],
        'en': ['en-US', 'en-GB', 'en-AU', 'en'],
        'mr': ['mr-IN', 'mr'],
        'pa': ['pa-IN', 'pa']
    };
    
    const preferredLangs = languageMap[language] || ['en-US'];
    
    // Try to find exact language match
    for (const lang of preferredLangs) {
        const voice = voices.find(v => v.lang === lang);
        if (voice) return voice;
    }
    
    // Try partial match
    for (const lang of preferredLangs) {
        const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
        if (voice) return voice;
    }
    
    // Fallback to first available voice
    return voices[0];
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN');
}