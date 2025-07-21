import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, loading, getFrequentItems } = useContext(AuthContext);
  const [frequentItems, setFrequentItems] = useState([]);
  
  useEffect(() => {
    const fetchFrequentItems = async () => {
      try {
        const items = await getFrequentItems();
        setFrequentItems(items);
      } catch (err) {
        console.error('Error fetching frequent items:', err);
      }
    };
    
    if (!loading && user) {
      fetchFrequentItems();
    }
  }, [loading, user, getFrequentItems]);
  
  if (loading || !user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-dashboard">
      <h1 className="dashboard-title">My Profile</h1>

      <div className="dashboard-grid">
        <div className="profile-card profile-info">
          <div className="profile-header">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>

          <div className="profile-section">
            <h3>Contact Information</h3>
            <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
          </div>

          <div className="profile-section">
            <h3>Address</h3>
            {user.address && (
              <address>
                {user.address.street}<br />
                {user.address.city}, {user.address.state} {user.address.zipCode}<br />
                {user.address.country}
              </address>
            )}
          </div>
        </div>

        <div className="profile-card">
          <h3>Dietary Preferences</h3>
          {user.dietaryPreferences?.length > 0 ? (
            <ul className="preferences-list">
              {user.dietaryPreferences.map((pref, index) => (
                <li key={index}>{pref}</li>
              ))}
            </ul>
          ) : (
            <p>No dietary preferences set</p>
          )}
          <Link to="/preferences" className="btn btn-outline">
            Update Preferences
          </Link>

          <h3>Allergies</h3>
          {user.allergies?.length > 0 ? (
            <ul className="allergies-list">
              {user.allergies.map((allergy, index) => (
                <li key={index}>{allergy}</li>
              ))}
            </ul>
          ) : (
            <p>No allergies set</p>
          )}
          <Link to="/preferences" className="btn btn-outline">
            Update Allergies
          </Link>
        </div>

        <div className="profile-card">
          <h3>Favorite Restaurants</h3>
          <Link to="/favorites" className="btn btn-outline">
            View Favorites
          </Link>

          <h3>Frequently Ordered Items</h3>
          {frequentItems.length > 0 ? (
            <div className="frequent-items-grid">
              {frequentItems.map((freqItem) => (
                <div key={freqItem.item._id} className="frequent-item-card">
                  <img 
                    src={freqItem.item.image || 'https://via.placeholder.com/100?text=Food'} 
                    alt={freqItem.item.name} 
                  />
                  <div className="frequent-item-info">
                    <h4>{freqItem.item.name}</h4>
                    <p>{freqItem.item.description}</p>
                    <p><strong>Ordered {freqItem.orderCount} times</strong></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No frequently ordered items yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
