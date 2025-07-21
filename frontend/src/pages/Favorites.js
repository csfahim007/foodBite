// src/pages/Favorites.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';

const Favorites = () => {
  const { user, getFavoriteRestaurants, removeFavoriteRestaurant } = useContext(AuthContext) || {};
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // If getFavoriteRestaurants is available, use it
        if (getFavoriteRestaurants) {
          const favs = await getFavoriteRestaurants();
          setFavorites(favs);
        } else {
          // Fallback if context method not available (for development)
          const response = await fetch('/api/users/favorites');
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user, getFavoriteRestaurants]);

  const handleRemoveFavorite = async (restaurantId) => {
    try {
      if (removeFavoriteRestaurant) {
        await removeFavoriteRestaurant(restaurantId);
        // Update the favorites list
        setFavorites(favorites.filter(restaurant => restaurant._id !== restaurantId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="favorites-container">
        <h1>My Favorite Restaurants</h1>
        <div className="no-favorites">
          <p>Please log in to view your favorite restaurants.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>My Favorite Restaurants</h1>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You don't have any favorite restaurants yet.</p>
          <Link to="/restaurants" className="btn btn-primary">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map((restaurant) => (
            <div key={restaurant._id} className="card restaurant-card">
              <img
                src={restaurant.image || 'https://via.placeholder.com/300x200?text=Restaurant'}
                alt={restaurant.name}
                className="restaurant-card-img"
              />
              <div className="restaurant-card-body">
                <h3 className="restaurant-card-title">{restaurant.name}</h3>
                <div className="restaurant-card-cuisine">
                  {restaurant.cuisine && restaurant.cuisine.map((type, index) => (
                    <span key={index}>{type}</span>
                  ))}
                </div>
                <div className="restaurant-card-rating">
                  <FaStar style={{ color: '#ffc107' }} />
                  <span>{restaurant.rating} ({restaurant.numReviews || 0} reviews)</span>
                </div>
                <p className="restaurant-card-text">
                  {restaurant.description?.substring(0, 100)}...
                </p>
                <div className="restaurant-card-actions">
                  <Link to={`/restaurants/${restaurant._id}`} className="btn btn-primary">
                    View Menu
                  </Link>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleRemoveFavorite(restaurant._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;