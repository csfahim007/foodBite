const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Search restaurants by name, cuisine, or location
// @route   GET /api/restaurants/search
// @access  Public
exports.searchRestaurants = async (req, res) => {
  try {
    const { query, cuisine, city } = req.query;
    let searchQuery = { isActive: true };
    
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    if (cuisine) {
      searchQuery.cuisineType = { $in: [cuisine] };
    }
    
    if (city) {
      searchQuery['address.city'] = { $regex: city, $options: 'i' };
    }
    
    const restaurants = await Restaurant.find(searchQuery);
    res.json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get menu for a restaurant
// @route   GET /api/restaurants/:id/menu
// @access  Public
exports.getRestaurantMenu = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    // Find all menu items for the restaurant
    const menuItems = await MenuItem.find({ 
      restaurant: restaurantId,
      isAvailable: true
    });
    
    if (!menuItems || menuItems.length === 0) {
      return res.status(404).json({ msg: 'No menu items found for this restaurant' });
    }
    
    // Group menu items by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    
    res.json(menuByCategory);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.status(500).send('Server error');
  }
};