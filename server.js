const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const weatherRoutes = require('./routes/weather');
const mandiRoutes = require('./routes/mandi');
const farmingRoutes = require('./routes/farming');
const conversationRoutes = require('./routes/conversation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/farming', farmingRoutes);
app.use('/api/conversation', conversationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mausam Mitra API is running' });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`🌾 Mausam Mitra server running on port ${PORT}`);
  console.log(`🌍 Access the app at http://localhost:${PORT}`);
});

module.exports = app;