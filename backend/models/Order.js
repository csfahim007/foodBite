const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    specialInstructions: String,
    priceAtOrder: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedDeliveryTime: Date,
  paymentDetails: {
    paymentIntentId: String,
    paymentId: String,
    last4: String,
    cardBrand: String,
    status: String
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);