// src/utils/setAuthToken.js
import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // Set x-auth-token as default header for all requests
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    // Remove the header if no token
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;