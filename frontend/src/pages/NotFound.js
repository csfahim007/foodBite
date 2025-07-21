import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found" style={{
      textAlign: 'center',
      padding: '2rem',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        style={{
          padding: '0.8rem 1.5rem',
          background: '#ff6b6b',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'background 0.3s'
        }}
        onMouseOver={(e) => e.target.style.background = '#ff5252'}
        onMouseOut={(e) => e.target.style.background = '#ff6b6b'}
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;