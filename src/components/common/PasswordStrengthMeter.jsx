import PropTypes from 'prop-types';

const PasswordStrengthMeter = ({ password }) => {
  // Calculate password strength
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Uppercase letters check
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Numbers check
    if (/[0-9]/.test(password)) strength += 1;
    
    // Special characters check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const strength = calculateStrength(password);
  
  // Get color and label based on strength score
  const getStrengthInfo = () => {
    switch(strength) {
      case 0: return { color: '#ff4d4f', label: 'Very Weak' };
      case 1: return { color: '#ff7a45', label: 'Weak' };
      case 2: return { color: '#ffc53d', label: 'Medium' };
      case 3: return { color: '#73d13d', label: 'Strong' };
      case 4: return { color: '#52c41a', label: 'Very Strong' };
      default: return { color: '#ff4d4f', label: 'Very Weak' };
    }
  };
  
  const { color, label } = getStrengthInfo();

  return (
    <div className="password-strength">
      <div className="strength-meter">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className="meter-segment"
            style={{
              backgroundColor: index < strength ? color : '#e8e8e8',
              opacity: index < strength ? 1 : 0.5
            }}
          ></div>
        ))}
      </div>
      <span style={{ color: color }}>
        {label}
      </span>
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired
};

export default PasswordStrengthMeter;
