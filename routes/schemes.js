const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// ➕ Add new scheme
router.post('/', async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(200).json(scheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔎 Get all schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
