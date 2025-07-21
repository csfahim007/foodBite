import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserPreferences = () => {
  const { user, updatePreferences, error } = useContext(AuthContext);
  
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [customPreference, setCustomPreference] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo',
    'Low-Carb', 'Low-Fat', 'Pescatarian', 'Dairy-Free', 'Nut-Free'
  ];
  
  const commonAllergies = [
    'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish',
    'Shellfish', 'Soy', 'Wheat', 'Gluten', 'Sesame'
  ];
  
  useEffect(() => {
    if (user) {
      setDietaryPreferences(user.dietaryPreferences || []);
      setAllergies(user.allergies || []);
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (error) {
      setAlert(error);
      setSuccessMessage('');
    }
  }, [error]);
  
  const handlePreferenceChange = (preference) => {
    if (dietaryPreferences.includes(preference)) {
      setDietaryPreferences(dietaryPreferences.filter(p => p !== preference));
    } else {
      setDietaryPreferences([...dietaryPreferences, preference]);
    }
  };
  
  const handleAllergyChange = (allergy) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter(a => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };
  
  const addCustomPreference = () => {
    if (customPreference.trim() !== '' && !dietaryPreferences.includes(customPreference)) {
      setDietaryPreferences([...dietaryPreferences, customPreference]);
      setCustomPreference('');
    }
  };
  
  const addCustomAllergy = () => {
    if (customAllergy.trim() !== '' && !allergies.includes(customAllergy)) {
      setAllergies([...allergies, customAllergy]);
      setCustomAllergy('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updatePreferences({
        dietaryPreferences,
        allergies
      });
      
      // Show success message
      setSuccessMessage('Your preferences have been successfully saved!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      setAlert('');
    } catch (err) {
      setAlert('Failed to update preferences');
      setSuccessMessage('');
    }
  };
  
  if (loading) {
    return <div className="loading">Loading preferences...</div>;
  }
  
  return (
    <div className="preferences-container">
      <h2>My Preferences</h2>
      
      {alert && <div className="alert-message">{alert}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form className="preferences-form" onSubmit={handleSubmit}>
        <div className="preference-section">
          <h3>Dietary Preferences</h3>
          <p>Select all that apply to your diet:</p>
          
          <div className="preference-tags">
            {dietaryOptions.map(option => (
              <div
                key={option}
                className={`preference-tag ${dietaryPreferences.includes(option) ? 'selected' : ''}`}
                onClick={() => handlePreferenceChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
          
          <div className="custom-input-container">
            <input
              type="text"
              className="custom-input"
              placeholder="Add custom dietary preference"
              value={customPreference}
              onChange={(e) => setCustomPreference(e.target.value)}
            />
            <button
              type="button"
              className="add-button"
              onClick={addCustomPreference}
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="preference-section">
          <h3>Food Allergies</h3>
          <p>Select all allergens that you need to avoid:</p>
          
          <div className="preference-tags">
            {commonAllergies.map(allergy => (
              <div
                key={allergy}
                className={`preference-tag allergy ${allergies.includes(allergy) ? 'selected' : ''}`}
                onClick={() => handleAllergyChange(allergy)}
              >
                {allergy}
              </div>
            ))}
          </div>
          
          <div className="custom-input-container">
            <input
              type="text"
              className="custom-input"
              placeholder="Add custom allergy"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
            />
            <button
              type="button"
              className="add-button"
              onClick={addCustomAllergy}
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="submit-container">
          <button type="submit" className="submit-button">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserPreferences;