import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { cart } = useCart();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const authLinks = (
    <>
      <li>
        <Link to="/favorites">My Favorites</Link>
      </li>
      <li>
        <Link to="/preferences">My Preferences</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </Link>
      </li>
      <li>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo main-logo " >
          FoodBite
        </Link>
        <ul className="nav-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/restaurants">Restaurants</Link>
          </li>
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;