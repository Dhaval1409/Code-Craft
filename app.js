// ===============================
// 🌐 Imports and Config
// ===============================
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const multer = require("multer");
const Tesseract = require("tesseract.js");
const mongoose = require('mongoose');
const session = require('express-session');


const authRoutes = require('./routes/auth');
const mandiItemsRouter = require('./routes/items');

// ===============================
// ⚙️ Load Environment Variables
// ===============================
dotenv.config();
console.log('OpenRouter API key:', process.env.OPENROUTER_API_KEY ? 'FOUND' : 'NOT FOUND');

// ===============================
// 🔗 Connect MongoDB
// ===============================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mandiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ===============================
// 🚀 Initialize App
// ===============================
const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

// ===============================
// 🔧 Middleware
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// ===============================
// 🔑 Session Setup
// ===============================
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false
}));

// ===============================
// 🔒 Authentication Middleware
// ===============================
function isAuthenticated(req, res, next) {
  if (req.session.user) next();
  else res.redirect('/login.html');
}

// ===============================
// 🛣️ Routes
// ===============================

// ✅ Serve login page manually
app.get('/login.html', (req, res) => {
  res.render('login');
});

app.get('/student.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

// ✅ Auth routes
app.use('/auth', authRoutes);

// ✅ Protected items API
app.use('/api/mandi-items', isAuthenticated, mandiItemsRouter);

// ✅ Protected index route
app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Example protected farmer route (implement getItemsFromDB)
app.get('/farmer', isAuthenticated, async (req, res) => {
  const items = await getItemsFromDB(); // Define this function in your code
  res.render('farmer', { items });
});

// ===============================
// 🤖 OpenRouter Chat Route
// ===============================
app.post('/ask', isAuthenticated, async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenRouter API error:', err.response?.data || err.message);
    res.status(500).json({ reply: 'OpenRouter error: ' + JSON.stringify(err.response?.data || err.message) });
  }
});

// ===============================
// 🌤️ Weather API Route
// ===============================
app.get("/weather", isAuthenticated, async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!lat || !lon) return res.status(400).json({ error: "Latitude and Longitude required" });

  try {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await axios.get(weatherURL);
    res.json(response.data);
    console.log("🛰️ Weather route hit with:", req.query);
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// ===============================
// 🖼️ Image Upload & OCR Route
// ===============================
app.post("/upload-image", isAuthenticated, upload.single("image"), async (req, res) => {
  console.log("Image upload request received");

  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ reply: "No file uploaded" });
    }

    const imagePath = req.file.path;
    console.log("Image saved at:", imagePath);

    // OCR with Tesseract
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
    console.log("Extracted Text:", text);

    // Call OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: text }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log("OpenRouter reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("Error in /upload-image:", err);
    res.status(500).json({ reply: "Failed to process the image." });
  }
});

// ===============================
// 🚀 Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
