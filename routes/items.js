const express = require('express');
const router = express.Router();
const MandiItem = require('../models/MandiItem');

// ➕ Add new mandi item
router.post('/', async (req, res) => {
  try {
    const { name, imageUrl, category, price } = req.body;
    const newItem = new MandiItem({ name, imageUrl, category, price });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 📦 Get all mandi items
router.get('/', async (req, res) => {
  try {
    const items = await MandiItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✏️ Update item by MongoDB _id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, category, price } = req.body;

    const updatedItem = await MandiItem.findByIdAndUpdate(
      id,
      { name, imageUrl, category, price },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item updated', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🗑️ Delete item by MongoDB _id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await MandiItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted', item: deletedItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
