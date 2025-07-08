
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
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



app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
