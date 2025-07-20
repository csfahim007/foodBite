const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, cartController.getCart);

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post(
  '/items',
  [
    auth,
    [
      check('menuItemId', 'Menu item ID is required').not().isEmpty(),
      check('quantity', 'Quantity must be at least 1').isInt({ min: 1 })
    ]
  ],
  cartController.addToCart
);

// @route   PUT /api/cart/items/:id
// @desc    Update cart item
// @access  Private
router.put(
  '/items/:id',
  [
    auth,
    [
      check('quantity', 'Quantity must be at least 1').optional().isInt({ min: 1 })
    ]
  ],
  cartController.updateCartItem
);

// @route   DELETE /api/cart/items/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:id', auth, cartController.removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', auth, cartController.clearCart);

module.exports = router;