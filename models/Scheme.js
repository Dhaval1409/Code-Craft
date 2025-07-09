const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Kids'],
    required: true
  }
});

module.exports = mongoose.model('Scheme', schemeSchema);
