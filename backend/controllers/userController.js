const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { dietaryPreferences, allergies } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update preferences
    if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;
    if (allergies) user.allergies = allergies;
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add restaurant to favorites
// @route   POST /api/users/favorites/restaurants/:id
// @access  Private
exports.addFavoriteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if restaurant already in favorites
    if (user.favoriteRestaurants.includes(restaurantId)) {
      return res.status(400).json({ msg: 'Restaurant already in favorites' });
    }
    
    user.favoriteRestaurants.push(restaurantId);
    await user.save();
    
    // Populate restaurant details before returning
    const updatedUser = await User.findById(req.user.id)
      .populate('favoriteRestaurants')
      .select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Remove restaurant from favorites
// @route   DELETE /api/users/favorites/restaurants/:id
// @access  Private
exports.removeFavoriteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if restaurant in favorites
    if (!user.favoriteRestaurants.includes(restaurantId)) {
      return res.status(400).json({ msg: 'Restaurant not in favorites' });
    }
    
    // Remove from favorites
    user.favoriteRestaurants = user.favoriteRestaurants.filter(
      id => id.toString() !== restaurantId
    );
    
    await user.save();
    
    // Populate restaurant details before returning
    const updatedUser = await User.findById(req.user.id)
      .populate('favoriteRestaurants')
      .select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Get user's favorite restaurants
// @route   GET /api/users/favorites/restaurants
// @access  Private
exports.getFavoriteRestaurants = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favoriteRestaurants')
      .select('favoriteRestaurants');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user.favoriteRestaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add or increment frequent item
// @route   POST /api/users/frequent-items/:id
// @access  Private
exports.addFrequentItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if item already in frequent items
    const existingItemIndex = user.frequentItems.findIndex(
      item => item.item.toString() === itemId
    );
    
    if (existingItemIndex !== -1) {
      // Increment count if already exists
      user.frequentItems[existingItemIndex].orderCount += 1;
    } else {
      // Add new frequent item
      user.frequentItems.push({ item: itemId, orderCount: 1 });
    }
    
    await user.save();
    
    // Populate item details before returning
    const updatedUser = await User.findById(req.user.id)
      .populate({
        path: 'frequentItems.item',
        model: 'MenuItem'
      })
      .select('frequentItems');
    
    res.json(updatedUser.frequentItems);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Get user's frequent items
// @route   GET /api/users/frequent-items
// @access  Private
exports.getFrequentItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'frequentItems.item',
        model: 'MenuItem'
      })
      .select('frequentItems');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Sort by order count (descending)
    const sortedItems = user.frequentItems.sort((a, b) => b.orderCount - a.orderCount);
    
    res.json(sortedItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};