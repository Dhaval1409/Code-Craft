
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const multer = require("multer");
const Tesseract = require("tesseract.js");
const upload = multer({ dest: "uploads/" });
require('dotenv').config();
console.log('OpenRouter API key:', process.env.OPENROUTER_API_KEY ? 'FOUND' : 'NOT FOUND');

dotenv.config();
console.log('OpenRouter API key loaded:', !!process.env.OPENROUTER_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST route using OpenRouter
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
}
,
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenRouter API error details:', err.response?.data || err.message);

    
    res.status(500).json({
      reply: 'OpenRouter error: ' + JSON.stringify(err.response?.data || err.message)
    });
  }
});

//img to answer
app.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // OCR using Tesseract
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
    console.log("📸 Extracted Text:", text);

    // Send to OpenRouter
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
    res.json({ reply });
  } catch (err) {
    console.error("Image processing error:", err);
    res.status(500).json({ reply: "❌ Failed to process the image." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
