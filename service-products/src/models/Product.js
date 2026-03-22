const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0              // prix ne peut pas être négatif
  },
  description: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ['electronics', 'clothing', 'food', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);