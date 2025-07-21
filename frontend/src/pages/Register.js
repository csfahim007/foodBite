import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [alert, setAlert] = useState('');

  const { name, email, password, password2, phone, address } = user;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    if (error) {
      setAlert(error);
      clearErrors();
    }
  }, [error, isAuthenticated, navigate, clearErrors]);

  const onChange = e => {
    if (e.target.name.includes('.')) {
      const [parent, child] = e.target.name.split('.');
      setUser({
        ...user,
        [parent]: {
          ...user[parent],
          [child]: e.target.value
        }
      });
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    
    if (password !== password2) {
      setAlert('Passwords do not match');
    } else {
      register({
        name,
        email,
        password,
        phone,
        address
      });
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      
      {alert && <div className="alert">{alert}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={onChange}
          />
        </div>
        
        <h3>Address Information</h3>
        
        <div className="form-group">
          <label htmlFor="address.street">Street</label>
          <input
            type="text"
            name="address.street"
            value={address.street}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address.city">City</label>
          <input
            type="text"
            name="address.city"
            value={address.city}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address.state">State</label>
          <input
            type="text"
            name="address.state"
            value={address.state}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address.zipCode">Zip Code</label>
          <input
            type="text"
            name="address.zipCode"
            value={address.zipCode}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address.country">Country</label>
          <input
            type="text"
            name="address.country"
            value={address.country}
            onChange={onChange}
          />
        </div>
        
        <input
          type="submit"
          value="Register"
          className="btn btn-primary btn-block"
        />
      </form>
      <p className="text-center">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;