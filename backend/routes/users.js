// routes/users.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put(
  '/preferences',
  auth,
  [
    check('dietaryPreferences', 'Dietary preferences must be an array').optional().isArray(),
    check('allergies', 'Allergies must be an array').optional().isArray()
  ],
  userController.updatePreferences
);

// @route   POST /api/users/favorites/restaurants/:id
// @desc    Add restaurant to favorites
// @access  Private
router.post('/favorites/restaurants/:id', auth, userController.addFavoriteRestaurant);

// @route   DELETE /api/users/favorites/restaurants/:id
// @desc    Remove restaurant from favorites
// @access  Private
router.delete('/favorites/restaurants/:id', auth, userController.removeFavoriteRestaurant);

// @route   GET /api/users/favorites/restaurants
// @desc    Get user's favorite restaurants
// @access  Private
router.get('/favorites/restaurants', auth, userController.getFavoriteRestaurants);

// @route   POST /api/users/frequent-items/:id
// @desc    Add or increment frequent item
// @access  Private
router.post('/frequent-items/:id', auth, userController.addFrequentItem);

// @route   GET /api/users/frequent-items
// @desc    Get user's frequent items
// @access  Private
router.get('/frequent-items', auth, userController.getFrequentItems);

module.exports = router;