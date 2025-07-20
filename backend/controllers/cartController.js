const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.menuItem',
        model: 'MenuItem'
      })
      .populate('restaurant');
    
    if (!cart) {
      return res.json({ items: [], restaurant: null });
    }
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity, specialInstructions } = req.body;
    
    // Get menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    
    // Get restaurant
    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        restaurant: restaurant._id,
        items: []
      });
    }
    
    // Check if adding from same restaurant
    if (cart.restaurant && cart.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(400).json({ 
        msg: 'Cannot add items from different restaurants. Clear your cart first.' 
      });
    }
    
    // Set restaurant if not set
    if (!cart.restaurant) {
      cart.restaurant = restaurant._id;
    }
    
    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItemId
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if already exists
      cart.items[existingItemIndex].quantity += quantity;
      if (specialInstructions) {
        cart.items[existingItemIndex].specialInstructions = specialInstructions;
      }
    } else {
      // Add new item
      cart.items.push({
        menuItem: menuItemId,
        quantity,
        specialInstructions: specialInstructions || ''
      });
    }
    
    await cart.save();
    
    // Populate before returning
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.menuItem',
        model: 'MenuItem'
      })
      .populate('restaurant');
    
    res.json(populatedCart);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity, specialInstructions } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.id
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
    
    if (quantity) {
      cart.items[itemIndex].quantity = quantity;
    }
    
    if (specialInstructions !== undefined) {
      cart.items[itemIndex].specialInstructions = specialInstructions;
    }
    
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.menuItem',
        model: 'MenuItem'
      })
      .populate('restaurant');
    
    res.json(populatedCart);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.id
    );
    
    // If cart is empty, remove restaurant reference
    if (cart.items.length === 0) {
      cart.restaurant = null;
    }
    
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.menuItem',
        model: 'MenuItem'
      })
      .populate('restaurant');
    
    res.json(populatedCart);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ msg: 'Cart cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};