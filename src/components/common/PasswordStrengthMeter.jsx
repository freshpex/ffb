import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');
  
  useEffect(() => {
    calculateStrength(password);
  }, [password]);
  
  const calculateStrength = (password) => {
    // Start with a base score
    let score = 0;
    
    // If password is empty, return score of 0
    if (!password) {
      setStrength(0);
      setLabel('');
      return;
    }
    
    // Award points based on complexity
    
    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) score += 1;
    
    // Contains numbers
    if (/\d/.test(password)) score += 1;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set strength label based on score
    let strengthLabel = '';
    if (score <= 2) {
      strengthLabel = 'Weak';
    } else if (score <= 4) {
      strengthLabel = 'Moderate';
    } else {
      strengthLabel = 'Strong';
    }
    
    // Normalize score to 0-100 range
    const normalizedScore = Math.min(100, Math.round((score / 6) * 100));
    
    setStrength(normalizedScore);
    setLabel(strengthLabel);
  };
  
  // Get color based on strength
  const getColor = () => {
    if (strength < 33) return '#ff4b5c'; // Red for weak
    if (strength < 66) return '#ff9800'; // Orange/amber for moderate
    return '#4caf50'; // Green for strong
  };
  
  if (!password) return null;
  
  return (
    <div className="password-strength-meter">
      <div className="strength-bar-container">
        <div 
          className="strength-bar" 
          style={{ 
            width: `${strength}%`,
            backgroundColor: getColor()
          }}
        ></div>
      </div>
      <div className="strength-text" style={{ color: getColor() }}>
        {label}
      </div>
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired
};

export default PasswordStrengthMeter;
