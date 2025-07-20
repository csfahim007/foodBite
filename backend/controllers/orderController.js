const Order = require('../models/Order');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentMethod, deliveryAddress } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.menuItem',
        model: 'MenuItem',
        select: 'name price restaurant'
      })
      .populate('restaurant');
    
    if (!cart) {
      return res.status(400).json({ msg: 'No cart found' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }
    
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.menuItem.price * item.quantity);
    }, 0);
    
    const deliveryFee = 5.99;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + deliveryFee + tax;
    
    const order = new Order({
      user: req.user.id,
      restaurant: cart.restaurant,
      items: cart.items.map(item => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
        priceAtOrder: item.menuItem.price
      })),
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      estimatedDeliveryTime: new Date(Date.now() + 45*60000)
    });
    
    await order.save();
    
    await Cart.findOneAndDelete({ user: req.user.id });
    
    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: err.errors 
      });
    }
    res.status(500).send('Server error');
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant')
      .populate('items.menuItem')
      .sort('-createdAt');
    
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant')
      .populate('items.menuItem')
      .populate('driver');
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
};