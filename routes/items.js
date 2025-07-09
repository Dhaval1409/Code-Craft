const express = require('express');
const router = express.Router();
const MandiItem = require('../models/MandiItem');


// Add new mandi item
router.post('/', async (req, res) => {
  try {
    const { name, imageUrl, category, price } = req.body;
    const newItem = new MandiItem({ name, imageUrl, category, price });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all mandi items
router.get('/', async (req, res) => {
  try {
    const items = await MandiItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item by id
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, imageUrl, category, price } = req.body;
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.name = name || item.name;
  item.imageUrl = imageUrl || item.imageUrl;
  item.category = category || item.category;
  item.price = price || item.price;

  res.json({ message: 'Item updated', item });
});

// Delete item by id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ message: 'Item not found' });

  items.splice(index, 1);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
