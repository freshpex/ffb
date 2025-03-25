import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "./AuthContext";
import { motion } from "framer-motion";
import "../../css/auth.css";
import PageTransition from "../common/PageTransition";
import PasswordStrengthMeter from "../common/PasswordStrengthMeter";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });
  
  const navigate = useNavigate();
  const { createUser, authError, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/login/dashboardpage");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (authError) {
      setError(formatErrorMessage(authError));
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (!agreements.terms || !agreements.privacy) {
      setError("You must accept the Terms of Service and Privacy Policy");
      return;
    }
    
    try {
      setError("");
      setLoading(true);
      await createUser(email, password, firstName, lastName);
      navigate("/login/dashboardpage");
    } catch (err) {
      console.error("Registration error:", err);
      setError(formatErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleAgreement = (key) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatErrorMessage = (errorMessage) => {
    if (errorMessage.includes("email-already-in-use")) {
      return "This email is already registered. Try logging in instead";
    }
    if (errorMessage.includes("weak-password")) {
      return "Password is too weak. Use a stronger password";
    }
    if (errorMessage.includes("invalid-email")) {
      return "Please enter a valid email address";
    }
    return errorMessage;
  };

  return (
    <PageTransition>
      <div className="auth-container">
        <div className="auth-card signup-card">
          <motion.div 
            className="auth-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="auth-header">
              <h2>Create an Account</h2>
              <p>Join our platform to start trading</p>
            </div>
            
            {error && (
              <div className="auth-error">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group half">
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="form-group half">
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {password && <PasswordStrengthMeter password={password} />}
              </div>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="form-agreements">
                <div className="agreement-item">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreements.terms}
                    onChange={() => toggleAgreement("terms")}
                    disabled={loading}
                  />
                  <label htmlFor="terms">
                    I agree to the <a href="/terms">Terms of Service</a>
                  </label>
                </div>
                
                <div className="agreement-item">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={agreements.privacy}
                    onChange={() => toggleAgreement("privacy")}
                    disabled={loading}
                  />
                  <label htmlFor="privacy">
                    I have read and understand the <a href="/privacy">Privacy Policy</a>
                  </label>
                </div>
                
                <div className="agreement-item">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={agreements.marketing}
                    onChange={() => toggleAgreement("marketing")}
                    disabled={loading}
                  />
                  <label htmlFor="marketing">
                    I agree to receive marketing communications
                  </label>
                </div>
              </div>
              
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : "Create Account"}
              </button>
              
              <div className="auth-links">
                <span>Already have an account?</span>
                <Link to="/login" className="link-button">Sign In</Link>
              </div>
              
              <div className="auth-divider">
                <span>or</span>
              </div>
              
              <button type="button" className="auth-social-button">
                <FaGoogle className="social-icon" />
                Sign up with Google
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignUp;
