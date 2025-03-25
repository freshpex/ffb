import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaEnvelope, FaLock, FaGoogle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import "../../css/auth.css";
import PageTransition from "../common/PageTransition";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { signIn, resetPassword, authError, user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
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
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      setError("");
      setLoading(true);
      await signIn(email, password);
      navigate("/login/dashboardpage");
    } catch (err) {
      console.error("Login error:", err);
      setError(formatErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    try {
      setError("");
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(formatErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatErrorMessage = (errorMessage) => {
    if (errorMessage.includes("Unable to synchronize your account")) {
      return errorMessage;
    }
    if (errorMessage.includes("user-not-found")) {
      return "No account found with this email address";
    }
    if (errorMessage.includes("wrong-password")) {
      return "Invalid password. Please try again";
    }
    if (errorMessage.includes("too-many-requests")) {
      return "Too many login attempts. Please try again later";
    }
    return errorMessage;
  };

  return (
    <PageTransition>
      <div className="auth-container">
        <div className="auth-card">
          <motion.div 
            className="auth-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="auth-header">
              <h2>{forgotPassword ? "Reset Password" : "Welcome Back"}</h2>
              <p>{forgotPassword 
                ? "Enter your email to receive a password reset link" 
                : "Sign in to access your account"}</p>
            </div>
            
            {error && (
              <div className="auth-error">
                <p>{error}</p>
              </div>
            )}
            
            {forgotPassword ? (
              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading || resetSent}
                    />
                  </div>
                </div>
                
                {resetSent ? (
                  <div className="reset-success">
                    <p>Password reset link sent to your email!</p>
                    <button 
                      type="button" 
                      onClick={() => {
                        setForgotPassword(false);
                        setResetSent(false);
                      }}
                      className="link-button"
                    >
                      Return to login
                    </button>
                  </div>
                ) : (
                  <>
                    <button type="submit" className="auth-button" disabled={loading}>
                      {loading ? <FaSpinner className="spinner" /> : "Send Reset Link"}
                    </button>
                    
                    <div className="auth-links">
                      <button 
                        type="button"
                        onClick={() => setForgotPassword(false)} 
                        className="link-button"
                      >
                        Back to login
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
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
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? <FaSpinner className="spinner" /> : "Sign In"}
                </button>
                
                <div className="auth-links">
                  <button 
                    type="button"
                    onClick={() => setForgotPassword(true)} 
                    className="link-button"
                  >
                    Forgot password?
                  </button>
                  <span className="auth-separator">•</span>
                  <Link to="/signup" className="link-button">Create account</Link>
                </div>
                
                <div className="auth-divider">
                  <span>or</span>
                </div>
                
                <button type="button" className="auth-social-button">
                  <FaGoogle className="social-icon" />
                  Sign in with Google
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
