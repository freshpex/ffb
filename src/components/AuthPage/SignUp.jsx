import { Link, useNavigate } from "react-router-dom";
import "../../css/auth.css";
import { useState, useEffect } from "react";
import { UserAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaGlobe, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { MdLock } from "react-icons/md";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeFinancial, setAgreeFinancial] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState({
    firstname: false,
    lastname: false,
    email: false,
    password: false,
    country: false
  });
  
  const { createUser } = UserAuth();
  const navigate = useNavigate();

  // Monitor window resize for responsive animations
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);
  
  // Get password strength color and label
  const getPasswordStrengthInfo = () => {
    switch(passwordStrength) {
      case 0: return { color: '#ff4d4f', label: 'Very Weak' };
      case 1: return { color: '#ff7a45', label: 'Weak' };
      case 2: return { color: '#ffc53d', label: 'Medium' };
      case 3: return { color: '#73d13d', label: 'Strong' };
      case 4: return { color: '#52c41a', label: 'Very Strong' };
      default: return { color: '#ff4d4f', label: 'Very Weak' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Simple email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Password strength check
    if (passwordStrength < 2) {
      setError("Please choose a stronger password");
      return;
    }

    // Validate checkbox agreement
    if (!agreeTerms || !agreePrivacy || !agreeFinancial) {
      setError("You must agree to all terms to continue");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createUser(email, password, firstname, lastname, country);
      navigate("/login/dashboardpage");
    } catch (e) {
      setError(e.message);
      console.log(e.message);
      setIsSubmitting(false);
    }
  };

  // Field validation
  const validateField = (field, value) => {
    if (!formTouched[field]) return null;
    
    switch(field) {
      case 'email':
        return /^\S+@\S+\.\S+$/.test(value) 
          ? { valid: true, message: 'Valid email' }
          : { valid: false, message: 'Please enter a valid email' };
      case 'password':
        return value.length >= 8 
          ? { valid: true, message: 'Password meets requirements' }
          : { valid: false, message: 'Password must be at least 8 characters' };
      default:
        return value.trim() !== '' 
          ? { valid: true, message: 'Looks good!' }
          : { valid: false, message: 'This field is required' };
    }
  };

  // Simpler animations for mobile
  const isMobile = windowWidth <= 760;

  return (
    <motion.section 
      className="signup__page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="signup__container">
        <motion.div 
          className="signup__logo-container"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link className="link" to={"/"}>
            <div className="signup__logo">
              <h1>FFB</h1>
              <p>Fidelity First Brokers</p>
            </div>
          </Link>
        </motion.div>
        
        <div className="signup__content">
          <motion.div 
            className="signup__form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="signup__header">
              <h1>Create Your Account</h1>
              <p>Join thousands of investors on our platform</p>
            </div>

            <form className="signup__form" onSubmit={handleSubmit}>
              <div className="form__row name-fields">
                <div className="form__group">
                  <label htmlFor="firstname">
                    <FaUser /> First Name
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    value={firstname}
                    name="firstname"
                    placeholder="John"
                    onChange={(e) => setFirstname(e.target.value)}
                    onBlur={() => setFormTouched({...formTouched, firstname: true})}
                    className={formTouched.firstname ? (firstname ? 'valid' : 'invalid') : ''}
                    required
                  />
                  {formTouched.firstname && !firstname && 
                    <div className="field-error">First name is required</div>
                  }
                </div>
                
                <div className="form__group">
                  <label htmlFor="lastname">
                    <FaUser /> Last Name
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    value={lastname}
                    name="lastname"
                    placeholder="Doe"
                    onChange={(e) => setLastname(e.target.value)}
                    onBlur={() => setFormTouched({...formTouched, lastname: true})}
                    className={formTouched.lastname ? (lastname ? 'valid' : 'invalid') : ''}
                    required
                  />
                  {formTouched.lastname && !lastname && 
                    <div className="field-error">Last name is required</div>
                  }
                </div>
              </div>

              <div className="form__group">
                <label htmlFor="email">
                  <FaEnvelope /> Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  name="email"
                  placeholder="johndoe@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setFormTouched({...formTouched, email: true})}
                  className={formTouched.email ? (/^\S+@\S+\.\S+$/.test(email) ? 'valid' : 'invalid') : ''}
                  required
                />
                {formTouched.email && email && !(/^\S+@\S+\.\S+$/.test(email)) && 
                  <div className="field-error">Please enter a valid email address</div>
                }
              </div>

              <div className="form__group password-group">
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
                <div className="password-input-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    name="password"
                    placeholder="Create a secure password"
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setFormTouched({...formTouched, password: true})}
                    className={formTouched.password ? (password.length >= 8 ? 'valid' : 'invalid') : ''}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      {[...Array(4)].map((_, index) => (
                        <div 
                          key={index} 
                          className="meter-segment"
                          style={{
                            backgroundColor: index < passwordStrength ? getPasswordStrengthInfo().color : '#e8e8e8',
                            opacity: index < passwordStrength ? 1 : 0.5
                          }}
                        ></div>
                      ))}
                    </div>
                    <span style={{ color: getPasswordStrengthInfo().color }}>
                      {getPasswordStrengthInfo().label}
                    </span>
                  </div>
                )}
                {formTouched.password && password && password.length < 8 && 
                  <div className="field-error">Password must be at least 8 characters</div>
                }
              </div>

              <div className="form__group">
                <label htmlFor="country">
                  <FaGlobe /> Country of Residence
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  name="country"
                  placeholder="United States"
                  onChange={(e) => setCountry(e.target.value)}
                  onBlur={() => setFormTouched({...formTouched, country: true})}
                  className={formTouched.country ? (country ? 'valid' : 'invalid') : ''}
                  required
                />
                {formTouched.country && !country && 
                  <div className="field-error">Country is required</div>
                }
              </div>
              
              <div className="form__help">
                <p>Can`t find your country? <a href="#">Contact support</a></p>
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FaTimes /> {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="form__agreements">
                <div className="agreement-item">
                  <label className="custom-checkbox">
                    <input 
                      type="checkbox" 
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">
                      I agree to the <a href="#">FFB Terms & Conditions</a>
                    </span>
                  </label>
                </div>
                
                <div className="agreement-item">
                  <label className="custom-checkbox">
                    <input 
                      type="checkbox" 
                      checked={agreePrivacy}
                      onChange={() => setAgreePrivacy(!agreePrivacy)}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">
                      I agree to the <a href="#">Privacy Policy</a>
                    </span>
                  </label>
                </div>
                
                <div className="agreement-item">
                  <label className="custom-checkbox">
                    <input 
                      type="checkbox" 
                      checked={agreeFinancial}
                      onChange={() => setAgreeFinancial(!agreeFinancial)}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">
                      I accept the Financial Services T&Cs
                    </span>
                  </label>
                </div>
              </div>
              
              <motion.button
                className="signup-submit-btn"
                whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <MdLock /> Create Secure Account
                  </>
                )}
              </motion.button>
              
              <div className="form__footer">
                <p>
                  Already have an account? <Link to="/login">Log In</Link>
                </p>
              </div>
            </form>
          </motion.div>
          
          <motion.div 
            className="signup__info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="info-content">
              <h2>Why join FFB?</h2>
              
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7.5 12.5L10.5 15.5L16.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>Professional Trading Platform</h3>
                  <p>Access our world-class trading platform from anywhere</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.2 5.8C18.8 6.4 19.7 6.4 20.3 5.8C20.9 5.2 20.9 4.3 20.3 3.7C19.7 3.1 18.8 3.1 18.2 3.7C17.6 4.3 17.6 5.2 18.2 5.8Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M18.2 20.3C18.8 19.7 19.7 19.7 20.3 20.3C20.9 20.9 20.9 21.8 20.3 22.4C19.7 23 18.8 23 18.2 22.4C17.6 21.8 17.6 20.9 18.2 20.3Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5.8 20.3C5.2 19.7 4.3 19.7 3.7 20.3C3.1 20.9 3.1 21.8 3.7 22.4C4.3 23 5.2 23 5.8 22.4C6.4 21.8 6.4 20.9 5.8 20.3Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5.8 5.8C5.2 5.2 4.3 5.2 3.7 5.8C3.1 6.4 3.1 7.3 3.7 7.9C4.3 8.5 5.2 8.5 5.8 7.9C6.4 7.3 6.4 6.4 5.8 5.8Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>24/7 Expert Support</h3>
                  <p>Get help from our team whenever you need it</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11.5L11.5 13L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3>Secure Investments</h3>
                  <p>Your assets are protected by advanced security</p>
                </div>
              </div>
              
              <div className="testimonial">
                <p>FFB has transformed the way I approach my investments. The platform is intuitive and powerful.</p>
                <div className="testimonial-author">
                  <div className="author-avatar"></div>
                  <div>
                    <strong>Michael R.</strong>
                    <span>Verified Member</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default SignUp;
