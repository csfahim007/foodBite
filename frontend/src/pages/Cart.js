import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';


const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="empty-cart">
        <h2>Please login to view your cart</h2>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet</p>
        <Link to="/restaurants" className="btn-primary">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items-container">
          <div className="cart-header">
            <h2>Your Order from {cart.restaurant.name}</h2>
            <button onClick={clearCart} className="btn-clear">
              Clear Cart
            </button>
          </div>
          
          <div className="cart-items-list">
            {cart.items.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.menuItem.image || '/images/food-placeholder.jpg'} 
                    alt={item.menuItem.name}
                  />
                </div>
                <div className="cart-item-details">
                  <h3>{item.menuItem.name}</h3>
                  <p className="item-description">{item.menuItem.description}</p>
                  <div className="item-price">${item.menuItem.price.toFixed(2)}</div>
                  
                  <div className="item-controls">
                    <div className="quantity-control">
                      <button 
                        onClick={() => updateCartItem(item._id, { quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateCartItem(item._id, { quantity: item.quantity + 1 })}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="btn-remove"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>$5.99</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(calculateTotal() + 5.99).toFixed(2)}</span>
            </div>
            
            <Link 
              to="/checkout" 
              className="btn-checkout"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;