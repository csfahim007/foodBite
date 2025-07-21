// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`);
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCart({ items: [], restaurant: null });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async ({ menuItemId, quantity, restaurantId }) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/cart/items`, {
        menuItemId,
        quantity,
        restaurantId
      });
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  const updateCartItem = async (itemId, updates) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/items/${itemId}`, updates);
      setCart(res.data);
    } catch (err) {
      console.error('Error updating cart item:', err);
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/items/${itemId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Error removing from cart:', err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart`);
      setCart({ items: [], restaurant: null });
    } catch (err) {
      console.error('Error clearing cart:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
 
export const useCart = () => useContext(CartContext);