import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Food Delivery Website - MERN Stack</p>
      </div>
    </footer>
  );
};

export default Footer;