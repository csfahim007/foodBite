import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants`);
        
        console.log('Full API response:', res); // Debug log
        
        if (res.data && Array.isArray(res.data)) {
          setRestaurants(res.data);
        } else {
          console.error('Unexpected response format:', res.data);
          setRestaurants([]);
        }
      } catch (err) {
        console.error('API Error:', {
          message: err.message,
          response: err.response?.data
        });
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const filtered = restaurants.filter(restaurant => {
      const matchName = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCuisine = cuisineFilter === '' || 
        (restaurant.cuisineType && restaurant.cuisineType.includes(cuisineFilter));
      const matchCity = cityFilter === '' || 
        (restaurant.address && restaurant.address.city.toLowerCase() === cityFilter.toLowerCase());
      
      return matchName && matchCuisine && matchCity;
    });
    
    setRestaurants(filtered);
  };

  const handleReset = async () => {
    setSearchQuery('');
    setCuisineFilter('');
    setCityFilter('');
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/restaurants`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading restaurants...</div>;
  }

  return (
    <div className="restaurant-list-container">
      <h1>Restaurants</h1>
      
      <div className="search-form">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search restaurants"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)}>
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="American">American</option>
            <option value="Japanese">Japanese</option>
            <option value="Mexican">Mexican</option>
            <option value="Indian">Indian</option>
          </select>
          
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="">All Locations</option>
            <option value="New York">New York</option>
            <option value="Chicago">Chicago</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="San Francisco">San Francisco</option>
          </select>
          
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
        </form>
      </div>
      
      <div className="restaurant-grid">
        {restaurants.length === 0 ? (
          <div className="no-results">
            <p>No restaurants found. Try different search criteria.</p>
            <button className="btn btn-outline" onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <div key={restaurant._id} className="restaurant-card">
              <img
                src={restaurant.image || 'https://via.placeholder.com/300x200?text=Restaurant'}
                alt={restaurant.name}
                className="restaurant-card-img"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant';
                }}
              />
              <div className="restaurant-card-body">
                <h3>{restaurant.name}</h3>
                <div className="cuisine-tags">
                  {restaurant.cuisineType?.map((type, index) => (
                    <span key={index} className="cuisine-tag">{type}</span>
                  ))}
                </div>
                <div className="rating">
                  <FaStar className="star-icon" />
                  <span>{restaurant.rating} ({restaurant.numReviews || 0} reviews)</span>
                </div>
                <p className="description">
                  {restaurant.description?.substring(0, 100)}...
                </p>
                <Link 
                  to={`/restaurants/${restaurant._id}`} 
                  className="btn btn-primary view-menu-btn"
                >
                  View Menu
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RestaurantList;