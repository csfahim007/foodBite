// routes/restaurants.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', restaurantController.getAllRestaurants);

// @route   GET /api/restaurants/search
// @desc    Search restaurants
// @access  Public
router.get('/search', restaurantController.searchRestaurants);

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
router.get('/:id', restaurantController.getRestaurantById);

// @route   GET /api/restaurants/:id/menu
// @desc    Get menu for a restaurant
// @access  Public
router.get('/:id/menu', restaurantController.getRestaurantMenu);

module.exports = router;