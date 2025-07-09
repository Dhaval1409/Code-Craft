const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// ➕ Add new scheme
router.post('/', async (req, res) => {
  try {
    const { name, description, image, link, category } = req.body;

    console.log("📥 New scheme received:", { name, description, image, link, category });

    const scheme = new Scheme({
      name,
      description,
      image,
      link,
      category
    });

    await scheme.save();

    console.log("✅ Scheme saved to MongoDB:", scheme);
    res.status(200).json(scheme);
  } catch (err) {
    console.error("❌ Scheme insert error:", err); // Log full error object
    res.status(500).json({ error: err.message });
  }
});

// 🔎 Get all schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (err) {
    console.error("❌ Scheme fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
