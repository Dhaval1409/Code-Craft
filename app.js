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
const session = require('express-session');

const schemeRoutes = require('./routes/schemes');
const authRoutes = require('./routes/auth');
const mandiItemsRouter = require('./routes/items');

// ===============================
// ⚙️ Load Environment Variables
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1); // Stop the app if URI is not provided
}

mongoose.connect(mongoURI, {

}).then(() => {
  console.log(`✅ MongoDB connected to cloud at ${mongoURI}`);
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});
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
app.set('views', path.join(__dirname, 'views')); // Ensure views directory set

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
  else res.redirect('/login');
}

// ✅ Apply authentication globally except for login routes
app.use((req, res, next) => {
  if (req.path === '/login' || req.path.startsWith('/auth')) {
    return next();
  }
  isAuthenticated(req, res, next);
});

// ===============================
// 🛣️ Routes
// ===============================

// ✅ Render login page
app.get('/login', (req, res) => {
  res.render('index'); // views/login.ejs
});

// ✅ Auth routes
app.use('/auth', authRoutes);

// ✅ Scheme API routes
app.use('/api/schemes', schemeRoutes);

// ✅ Protected mandi items API
app.use('/api/mandi-items', mandiItemsRouter);

// ✅ Student page
app.get('/student', (req, res) => {
  res.render('student'); // views/student.ejs
});

// ✅ Index route
app.get('/', (req, res) => {
  res.render('index'); // views/index.ejs
});

// ✅ Farmer route (example)
app.get('/farmer', async (req, res) => {
// //   / Implement getItemsFromDB()
//   res.render('farmer', { items });
res.render('farmer');
});

app.get('/add-item', (req, res) => {
  res.render('add-item'); // This renders views/add-item.ejs
});
app.get('/schem', (req, res) => {
  res.render('schem'); // views/schem.ejs
});
app.get('/helth', (req, res) => {
  res.render('helth'); // views/index.ejs
});
// ===============================
// 🤖 OpenRouter Chat Route
// ===============================
app.post('/ask', async (req, res) => {
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
app.get("/weather", async (req, res) => {
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
app.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log("📷 Image upload request received");

  try {
    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ reply: "No file uploaded" });
    }

    const imagePath = req.file.path;
    console.log("✅ Image saved at:", imagePath);

    // 📝 OCR with Tesseract
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
    console.log("🔍 Extracted Text:", text);

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
    console.log("🤖 OpenRouter reply:", reply);
    res.json({ reply });

  } catch (err) {
    console.error("❌ Error in /upload-image:", err.response?.data || err.message);
    res.status(500).json({ reply: "Failed to process the image." });
  }
});

// ===============================
// 🚀 Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
