// src/context/AuthContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import authReducer from '../reducers/authReducer';
import setAuthToken from '../utils/setAuthToken';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: localStorage.getItem('token') ? true : false, // Changed from null to a boolean
  loading: true,
  user: null,
  error: null
};

// Create context
export const AuthContext = createContext(initialState);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    } else {
      // If no token is found, dispatch AUTH_ERROR
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`);
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      console.error('Error loading user:', err);
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Initial load - wrapped in useEffect with proper dependency
  useEffect(() => {
    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData, config);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      
      // Set the token in axios headers
      setAuthToken(res.data.token);
      
      // Load user immediately after registration
      await loadUser();
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Registration failed'
      });
    }
  };

  // Login user
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData, config);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      // Set the token in axios headers
      setAuthToken(res.data.token);
      
      // Load user immediately after login
      await loadUser();
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Login failed'
      });
    }
  };

  // Logout
  const logout = () => {
    // Remove token from headers
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // Update preferences
  const updatePreferences = async (preferences) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/preferences`, preferences, config);
      dispatch({
        type: 'UPDATE_USER',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'USER_ERROR',
        payload: err.response?.data?.msg || 'Error updating preferences'
      });
    }
  };

  // Add favorite restaurant
  const addFavoriteRestaurant = async (restaurantId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/favorites/restaurants/${restaurantId}`);
      dispatch({
        type: 'UPDATE_FAVORITES'
      });
      return true;
    } catch (err) {
      dispatch({
        type: 'USER_ERROR',
        payload: err.response?.data?.msg || 'Error adding favorite'
      });
      return false;
    }
  };

  // Remove favorite restaurant
  const removeFavoriteRestaurant = async (restaurantId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/favorites/restaurants/${restaurantId}`);
      dispatch({
        type: 'UPDATE_FAVORITES'
      });
      return true;
    } catch (err) {
      dispatch({
        type: 'USER_ERROR',
        payload: err.response?.data?.msg || 'Error removing favorite'
      });
      return false;
    }
  };

  // Get favorite restaurants
  const getFavoriteRestaurants = async () => {
    try {
      const res = await axios.get('/api/users/favorites/restaurants');
      return res.data;
    } catch (err) {
      dispatch({
        type: 'USER_ERROR',
        payload: err.response?.data?.msg || 'Error fetching favorites'
      });
      return [];
    }
  };

  // Add frequent item
  const addFrequentItem = async (itemId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/frequent-items/${itemId}`);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Get frequent items
  const getFrequentItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/frequent-items`);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        updatePreferences,
        addFavoriteRestaurant,
        removeFavoriteRestaurant,
        getFavoriteRestaurants,
        addFrequentItem,
        getFrequentItems,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};