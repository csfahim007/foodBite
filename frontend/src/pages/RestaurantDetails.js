import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaHeart, FaRegStar, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { user, addFavoriteRestaurant, removeFavoriteRestaurant } = useContext(AuthContext);
  const { addToCart } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantities, setQuantities] = useState({});
  
  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const restaurantResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants/${id}`);
        setRestaurant(restaurantResponse.data);
        
        const menuResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants/${id}/menu`);
        setMenu(menuResponse.data);
        
        const initialQuantities = {};
        Object.keys(menuResponse.data).forEach(category => {
          menuResponse.data[category].forEach(item => {
            initialQuantities[item._id] = 1;
          });
        });
        setQuantities(initialQuantities);
        
        const categories = Object.keys(menuResponse.data);
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        setLoading(false);
      }
    };
    
    fetchRestaurantAndMenu();
  }, [id]);
  
  useEffect(() => {
    if (user && restaurant && user.favoriteRestaurants) {
      const favorite = user.favoriteRestaurants.some(
        favId => typeof favId === 'object' 
          ? favId._id === restaurant._id 
          : favId === restaurant._id
      );
      setIsFavorite(favorite);
    }
  }, [user, restaurant]);

  const toggleFavorite = async () => {
    if (!user) return;
    
    try {
      if (isFavorite) {
        await removeFavoriteRestaurant(restaurant._id);
      } else {
        await addFavoriteRestaurant(restaurant._id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart({
        menuItemId: item._id,
        quantity: quantities[item._id] || 1,
        restaurantId: restaurant._id
      });
      alert(`${item.name} (${quantities[item._id] || 1}x) added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, newQuantity)
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star-half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-empty" />);
      }
    }
    
    return (
      <div className="menu-item-rating">
        {stars}
        <span className="rating-value">({rating.toFixed(1)})</span>
      </div>
    );
  };
  
  if (loading) {
    return <div className="restaurant-details__loading">Loading...</div>;
  }
  
  if (!restaurant) {
    return <div className="restaurant-details__not-found">Restaurant not found.</div>;
  }
  
  return (
    <div className="restaurant-details">
      <img
        src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80'}
        alt={restaurant.name}
        className="restaurant-details__banner"
      />
      
      <div className="restaurant-details__info">
        <div className="restaurant-details__info-main">
          <h1 className="restaurant-details__name">{restaurant.name}</h1>
          
          <div className="restaurant-details__cuisine">
            {restaurant.cuisine && restaurant.cuisine.map((type, index) => (
              <span key={index}>{type}</span>
            ))}
          </div>
          
          <div className="restaurant-details__rating">
            <FaStar className="star-filled" />
            <span>
              {restaurant.rating} ({restaurant.numReviews || 0} reviews)
            </span>
          </div>
          
          <p className="restaurant-details__description">{restaurant.description}</p>
          
          {user && (
            <button
              onClick={toggleFavorite}
              className={`restaurant-details__favorite-btn ${isFavorite ? 'restaurant-details__favorite-btn--active' : ''}`}
            >
              <FaHeart style={{ marginRight: '5px' }} />
              {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>
        
        <div className="restaurant-details__info-side">
          <div className="restaurant-details__address">
            <h4>Address</h4>
            {restaurant.address && (
              <>
                <p>{restaurant.address.street}</p>
                <p>
                  {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
                </p>
                <p>{restaurant.address.country}</p>
              </>
            )}
          </div>
          
          {restaurant.operatingHours && (
            <div className="restaurant-details__hours">
              <h4>Opening Hours</h4>
              <ul className="restaurant-details__hours-list">
                {Object.entries(restaurant.operatingHours).map(([day, hours]) => (
                  <li key={day} className="restaurant-details__hours-item">
                    <span>{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                    <span>
                      {hours.open} - {hours.close}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="restaurant-details__menu">
        <h2 className="restaurant-details__menu-title">Menu</h2>
        
        {Object.keys(menu).length === 0 ? (
          <div className="restaurant-details__menu-empty">
            <p>No menu items available for this restaurant.</p>
          </div>
        ) : (
          <>
            <div className="restaurant-details__menu-categories">
              {Object.keys(menu).map((category) => (
                <button
                  key={category}
                  className={`restaurant-details__menu-category ${activeCategory === category ? 'restaurant-details__menu-category--active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="restaurant-details__menu-items">
              {menu[activeCategory] && menu[activeCategory].map((item) => (
                <div key={item._id} className="restaurant-details__menu-item">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80'}
                    alt={item.name}
                    className="restaurant-details__menu-item-img"
                  />
                  <div className="restaurant-details__menu-item-content">
                    <div className="restaurant-details__menu-item-header">
                      <div>
                        <h3 className="restaurant-details__menu-item-title">{item.name}</h3>
                        {item.rating && renderStars(item.rating)}
                      </div>
                      <span className="restaurant-details__menu-item-price">${item.price?.toFixed(2)}</span>
                    </div>
                    <p className="restaurant-details__menu-item-description">{item.description}</p>
                    <div className="restaurant-details__menu-item-tags">
                      {item.isVegetarian && (
                        <span className="restaurant-details__menu-item-tag restaurant-details__menu-item-tag--vegetarian">Vegetarian</span>
                      )}
                      {item.isVegan && <span className="restaurant-details__menu-item-tag restaurant-details__menu-item-tag--vegan">Vegan</span>}
                      {item.isGlutenFree && (
                        <span className="restaurant-details__menu-item-tag restaurant-details__menu-item-tag--gluten-free">Gluten-Free</span>
                      )}
                    </div>
                    <div className="restaurant-details__menu-item-allergens">
                      {item.allergens && item.allergens.length > 0 && (
                        <p><strong>Contains:</strong> {item.allergens.join(', ')}</p>
                      )}
                    </div>

                    {/* Cart Controls */}
                    <div className="menu-item-cart-controls">
                      <div className="quantity-selector">
                        <button 
                          onClick={() => updateQuantity(item._id, (quantities[item._id] || 1) - 1)}
                          aria-label="Decrease quantity"
                        >
                          <FaMinus />
                        </button>
                        <span>{quantities[item._id] || 1}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, (quantities[item._id] || 1) + 1)}
                          aria-label="Increase quantity"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="add-to-cart-button"
                      >
                        <FaShoppingCart /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;