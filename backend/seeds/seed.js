const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant.js');
const MenuItem = require('../models/MenuItem.js');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample restaurant data
const restaurants = [
  {
    name: 'Pizza Palace',
    description: 'Authentic Italian pizzas crafted with traditional recipes.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    cuisineType: ['Italian', 'Pizza'],
    rating: 4.5,
    numReviews: 120,
    contactEmail: 'info@pizzapalace.com',
    contactPhone: '555-123-4567',
    isActive: true
  },
  {
    name: 'Burger Joint',
    description: 'Handcrafted burgers with fresh, local ingredients.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
    address: {
      street: '456 Oak Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60007',
      country: 'USA',
    },
    cuisineType: ['American', 'Burgers'],
    rating: 4.2,
    numReviews: 85,
    contactEmail: 'info@burgerjoint.com',
    contactPhone: '555-987-6543',
    isActive: true
  },
  {
    name: 'Sushi World',
    description: 'Fresh sushi and Japanese delicacies in an authentic setting.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
    address: {
      street: '789 Pine St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA',
    },
    cuisineType: ['Japanese', 'Sushi'],
    rating: 4.7,
    numReviews: 150,
    contactEmail: 'info@sushiworld.com',
    contactPhone: '555-456-7890',
    isActive: true
  },
  {
    name: 'Taco Haven',
    description: 'Bold Mexican tacos with vibrant flavors and fresh salsas.',
    image: 'https://images.unsplash.com/photo-1586996292898-71f4036c4e07',
    address: {
      street: '321 Maple Rd',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
    },
    cuisineType: ['Mexican', 'Tacos'],
    rating: 4.4,
    numReviews: 95,
    contactEmail: 'info@tacohaven.com',
    contactPhone: '555-321-9876',
    isActive: true
  },
  {
    name: 'Curry Corner',
    description: 'Rich and aromatic Indian curries with traditional spices.',
    image: 'https://images.unsplash.com/photo-1606380588787-8df71f764c00?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    address: {
      street: '654 Cedar Ln',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
    },
    cuisineType: ['Indian', 'Curry'],
    rating: 4.6,
    numReviews: 110,
    contactEmail: 'info@currycorner.com',
    contactPhone: '555-654-1234',
    isActive: true
  },
  {
    name: 'Thai Bliss',
    description: 'Spicy and fragrant Thai dishes with a modern twist.',
    image: 'https://images.unsplash.com/photo-1471253794676-0f039a6aae9d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    address: {
      street: '987 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33131',
      country: 'USA',
    },
    cuisineType: ['Thai', 'Asian'],
    rating: 4.3,
    numReviews: 75,
    contactEmail: 'info@thaibliss.com',
    contactPhone: '555-789-0123',
    isActive: true
  },
  {
    name: 'Mediterranean Breeze',
    description: 'Fresh Mediterranean flavors with hummus, falafel, and more.',
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8',
    address: {
      street: '147 Birch Dr',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    cuisineType: ['Mediterranean', 'Greek'],
    rating: 4.8,
    numReviews: 130,
    contactEmail: 'info@medbreeze.com',
    contactPhone: '555-147-2583',
    isActive: true
  },
  {
    name: 'Dragon Wok',
    description: 'Classic Chinese dishes with bold flavors and fresh ingredients.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    address: {
      street: '258 Walnut Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA',
    },
    cuisineType: ['Chinese', 'Asian'],
    rating: 4.1,
    numReviews: 90,
    contactEmail: 'info@dragonwok.com',
    contactPhone: '555-369-1470',
    isActive: true
  },
  {
    name: 'Le Bistro',
    description: 'Elegant French cuisine with a cozy Parisian vibe.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    address: {
      street: '369 Spruce Ct',
      city: 'New Orleans',
      state: 'LA',
      zipCode: '70112',
      country: 'USA',
    },
    cuisineType: ['French', 'European'],
    rating: 3.00,
    numReviews: 100,
    contactEmail: 'info@lebistro.com',
    contactPhone: '555-258-3691',
    isActive: true
  },
  {
    name: 'Smokehouse BBQ',
    description: 'Hearty Southern BBQ with slow-smoked meats and tangy sauces.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    address: {
      street: '741 Ash Blvd',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
      country: 'USA',
    },
    cuisineType: ['American', 'BBQ'],
    rating: 4.5,
    numReviews: 115,
    contactEmail: 'info@smokehousebbq.com',
    contactPhone: '555-741-8520',
    isActive: true
  }
];

// Menu items for each restaurant with added rating field
const menuItems = [
  // Pizza Palace
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94',
    category: 'Pizzas',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Gluten', 'Dairy'],
    isAvailable: true,
    rating: 4.8
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Classic pizza topped with pepperoni slices.',
    price: 14.99,
    image: 'https://plus.unsplash.com/premium_photo-1663036447682-8f0d918adbed?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Pizzas',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Gluten', 'Dairy'],
    isAvailable: true,
    rating: 4.5
  },
  {
    name: 'Garlic Breadsticks',
    description: 'Freshly baked breadsticks with garlic butter.',
    price: 5.99,
    image: 'https://plus.unsplash.com/premium_photo-1726877140485-70692aafe655?q=80&w=2119&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Sides',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Gluten', 'Dairy'],
    isAvailable: true,
    rating: 4.2
  },
  {
    name: 'Tiramisu',
    description: 'Creamy Italian dessert with coffee and mascarpone.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1652690772450-2cc9c53060f5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Desserts',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Dairy', 'Eggs'],
    isAvailable: true,
    rating: 4.9
  },
  // Burger Joint
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar, lettuce, and tomato.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234',
    category: 'Burgers',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Gluten', 'Dairy'],
    isAvailable: true,
    rating: 4.6
  },
  {
    name: 'Veggie Burger',
    description: 'Plant-based patty with avocado and sprouts.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1652690772837-4f270f7f87a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8',
    category: 'Burgers',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    allergens: ['Gluten'],
    isAvailable: true,
    rating: 4.3
  },
  {
    name: 'Sweet Potato Fries',
    description: 'Crispy fries with a sweet and savory flavor.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1681072530653-db8fe2538631?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Sides',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.4
  },
  {
    name: 'Milkshake',
    description: 'Creamy vanilla milkshake topped with whipped cream.',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1653565922895-4c08e12ea9f5?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Drinks',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Dairy'],
    isAvailable: true,
    rating: 4.7
  },
  // Sushi World
  {
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber wrapped in rice.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a',
    category: 'Sushi',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Shellfish', 'Gluten'],
    isAvailable: true,
    rating: 4.5
  },
  {
    name: 'Spicy Tuna Roll',
    description: 'Tuna with spicy mayo and sesame seeds.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1691105724826-fc49c4ca558d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGZvb2QlMjBzcGljeSUyMHR1bmElMjByb2xsfGVufDB8fDB8fHww',
    category: 'Sushi',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Fish', 'Gluten'],
    isAvailable: true,
    rating: 4.6
  },
  {
    name: 'Miso Soup',
    description: 'Traditional soup with tofu and seaweed.',
    price: 3.99,
    image: 'https://plus.unsplash.com/premium_photo-1723669629687-0e618541c49e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudCUyMGZvb2QlMjBtaXNvJTIwc291cHxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Sides',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: ['Soy'],
    isAvailable: true,
    rating: 4.1
  },
  {
    name: 'Green Tea Ice Cream',
    description: 'Refreshing matcha-flavored dessert.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1583052606401-ba82199fffc9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJlc3RhdXJhbnQlMjBmb29kJTIwZ3JlZW4lMjB0ZWElMjBpY2UlMjBjcmVhbXxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Desserts',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Dairy'],
    isAvailable: true,
    rating: 4.8
  },
  // Taco Haven
  {
    name: 'Carne Asada Taco',
    description: 'Grilled steak with cilantro and onion.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1665111915476-b91b328a3c37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGZvb2QlMjBncmlsbGVkJTIwc3RpY2t8ZW58MHx8MHx8fDA%3D',
    category: 'Tacos',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.4
  },
  {
    name: 'Veggie Taco',
    description: 'Grilled veggies with avocado and salsa.',
    price: 3.49,
    image: 'https://plus.unsplash.com/premium_photo-1664391919722-b5d05b5c366d?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Tacos',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.2
  },
  {
    name: 'Churros',
    description: 'Crispy fried dough with cinnamon sugar.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1690915475862-336b65f571a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlc3RhdXJhbnQlMjBmb29kJTIwY3Jpc3B5JTIwZnJpZWQlMjBkb3VnaHxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Desserts',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Gluten', 'Dairy'],
    isAvailable: true,
    rating: 4.7
  },
  {
    name: 'Horchata',
    description: 'Sweet rice milk drink with cinnamon.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1709755983145-e14c45be5397?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJlc3RhdXJhbnQlMjBmb29kJTIwcmljJTIwbWlsayUyMGRyaW5rfGVufDB8fDB8fHww',
    category: 'Drinks',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.5
  },
  // Curry Corner
  {
    name: 'Butter Chicken',
    description: 'Creamy tomato curry with tender chicken.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1660470619179-7a8fd44719aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudCUyMGZvb2QlMjBidXR0ZXIlMjBjaGlja2VufGVufDB8fDB8fHww',
    category: 'Curries',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Dairy'],
    isAvailable: true,
    rating: 4.9
  },
  {
    name: 'Palak Paneer',
    description: 'Spinach curry with soft paneer cubes.',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1734313252461-7ed90c07befc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Curries',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Dairy'],
    isAvailable: true,
    rating: 4.6
  },
  {
    name: 'Naan Bread',
    description: 'Soft, fluffy bread baked in a tandoor.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1695205962564-43ba2b18b075?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Sides',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Gluten', 'Dairy'],
    isAvailable: true,
    rating: 4.3
  },
  {
    name: 'Mango Lassi',
    description: 'Sweet yogurt drink with mango puree.',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1708782343593-c89fbb1e176c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Drinks',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Dairy'],
    isAvailable: true,
    rating: 4.8
  },
  // Thai Bliss
  {
    name: 'Pad Thai',
    description: 'Stir-fried noodles with shrimp and peanuts.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1589213304227-696919b05ebb',
    category: 'Noodles',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Shellfish', 'Peanuts'],
    isAvailable: true,
    rating: 4.7
  },
  {
    name: 'Green Curry',
    description: 'Spicy coconut curry with vegetables.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1593775880718-d8e1a6c14307',
    category: 'Curries',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.5
  },
  {
    name: 'Spring Rolls',
    description: 'Crispy rolls with veggies and dipping sauce.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1601322492492-058a1e3518b5',
    category: 'Appetizers',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    allergens: ['Gluten'],
    isAvailable: true,
    rating: 4.3
  },
  {
    name: 'Thai Iced Tea',
    description: 'Sweet tea with condensed milk.',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84aaf2',
    category: 'Drinks',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Dairy'],
    isAvailable: true,
    rating: 4.6
  },
  // Mediterranean Breeze
  {
    name: 'Falafel Wrap',
    description: 'Crispy falafel with tahini and veggies in pita.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1590759745957-9577d427ea1b',
    category: 'Wraps',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    allergens: ['Gluten'],
    isAvailable: true,
    rating: 4.4
  },
  {
    name: 'Hummus Plate',
    description: 'Creamy hummus with pita and veggies.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1642783947936-5c7e3e057bac',
    category: 'Appetizers',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    allergens: ['Gluten'],
    isAvailable: true,
    rating: 4.5
  },
  {
    name: 'Baklava',
    description: 'Sweet pastry with nuts and honey.',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb7',
    category: 'Desserts',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Gluten', 'Nuts'],
    isAvailable: true,
    rating: 4.8
  },
  {
    name: 'Mint Lemonade',
    description: 'Refreshing lemonade with fresh mint.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625',
    category: 'Drinks',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.3
  },
  // Dragon Wok
  {
    name: 'Kung Pao Chicken',
    description: 'Spicy stir-fry with peanuts and veggies.',
    price: 11.49,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a',
    category: 'Mains',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Peanuts', 'Soy'],
    isAvailable: true,
    rating: 4.6
  },
  {
    name: 'Vegetable Fried Rice',
    description: 'Fried rice with mixed vegetables.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84d6',
    category: 'Rice',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    allergens: ['Soy'],
    isAvailable: true,
    rating: 4.2
  },
  {
    name: 'Egg Drop Soup',
    description: 'Warm soup with egg ribbons.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1598516803637-3f7c242d7d60',
    category: 'Soups',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Eggs'],
    isAvailable: true,
    rating: 4.1
  },
  {
    name: 'Fortune Cookie',
    description: 'Crispy cookie with a message inside.',
    price: 1.49,
    image: 'https://images.unsplash.com/photo-1590998748521-4db839f881d6',
    category: 'Desserts',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    allergens: ['Gluten'],
    isAvailable: true,
    rating: 4.0
  },
  // Le Bistro
  {
    name: 'Coq au Vin',
    description: 'Chicken braised in red wine with mushrooms.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1657036666958-3c423e4c03b8',
    category: 'Mains',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.7
  },
  {
    name: 'Ratatouille',
    description: 'Vegetable stew with eggplant and zucchini.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1643040227513-2c6de68e3e9f',
    category: 'Mains',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.4
  },
  {
    name: 'Crème Brûlée',
    description: 'Creamy custard with caramelized sugar top.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1618886614636-3331743e747c',
    category: 'Desserts',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Dairy', 'Eggs'],
    isAvailable: true,
    rating: 4.9
  },
  {
    name: 'French Onion Soup',
    description: 'Rich soup with caramelized onions and cheese.',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1545018596-2c76ef7f8dc6',
    category: 'Soups',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Dairy', 'Gluten'],
    isAvailable: true,
    rating: 4.5
  },
  // Smokehouse BBQ
  {
    name: 'Brisket Plate',
    description: 'Slow-smoked brisket with BBQ sauce.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462',
    category: 'Mains',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.8
  },
  {
    name: 'BBQ Ribs',
    description: 'Tender pork ribs with tangy glaze.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1591622629888-783626d17593',
    category: 'Mains',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    allergens: [],
    isAvailable: true,
    rating: 4.6
  },
  {
    name: 'Coleslaw',
    description: 'Creamy cabbage salad with a tangy dressing.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1559054663-e8d7d0ce3e86',
    category: 'Sides',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['Dairy'],
    isAvailable: true,
    rating: 4.2
  },
  {
    name: 'Cornbread',
    description: 'Warm, sweet cornbread with butter.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1603048297172-c285f3b77d5a',
    category: 'Sides',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['Gluten', 'Dairy'],
    isAvailable: true,
    rating: 4.4
  }
];

// Seed the database
const seedDB = async () => {
  try {
    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    
    // Add restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`${createdRestaurants.length} restaurants created`);
    
    // Add menu items with restaurant IDs
    const menuItemsWithRestaurant = menuItems.map((item, index) => {
      // Distribute items across restaurants (4 items per restaurant)
      const restaurantIndex = Math.floor(index / 4);
      return {
        ...item,
        restaurant: createdRestaurants[restaurantIndex]._id
      };
    });
    
    const createdMenuItems = await MenuItem.insertMany(menuItemsWithRestaurant);
    console.log(`${createdMenuItems.length} menu items created`);
     
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();