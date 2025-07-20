const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('paymentMethod', 'Payment method is required').not().isEmpty(),
      check('deliveryAddress', 'Delivery address is required').not().isEmpty()
    ]
  ],
  orderController.createOrder
);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, orderController.getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, orderController.getOrderById);

module.exports = router;