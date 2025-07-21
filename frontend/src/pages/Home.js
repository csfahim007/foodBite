import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants?limit=6`);
        setFeaturedRestaurants(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured restaurants:', err);
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Delicious Food Delivered To Your Door</h1>
          <p>Discover restaurants in your area and order with ease</p>
          <Link to="/restaurants" className="btn btn-primary">
            Find Restaurants
          </Link>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Restaurants</h2>
        <div className="restaurant-grid">
          {featuredRestaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card">
              <img 
                src={restaurant.image || 'https://via.placeholder.com/300x200?text=Restaurant'} 
                alt={restaurant.name} 
              />
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.cuisineType.join(', ')}</p>
                <div className="rating">
                  {Array(Math.round(restaurant.rating))
                    .fill()
                    .map((_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                </div>
                <Link to={`/restaurants/${restaurant._id}`} className="btn btn-secondary">
                  View Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all">
          <Link to="/restaurants" className="btn btn-outline">
            View All Restaurants
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">🔍</div>
            <h3>Find Restaurants</h3>
            <p>Discover restaurants near you or search for your favorites</p>
          </div>
          <div className="step">
            <div className="step-icon">🍔</div>
            <h3>Choose Your Food</h3>
            <p>Browse menus and select the items you want</p>
          </div>
          <div className="step">
            <div className="step-icon">📝</div>
            <h3>Set Preferences</h3>
            <p>Mark your dietary preferences and allergies</p>
          </div>
          <div className="step">
            <div className="step-icon">⭐</div>
            <h3>Save Favorites</h3>
            <p>Mark restaurants and items as favorites for quick access</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;