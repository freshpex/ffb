import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaHome, 
  FaArrowRight, 
  FaGoogle, 
  FaShieldAlt, 
  FaInfoCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import Button from "../common/Button";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showSecurityTips, setShowSecurityTips] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { logIn, signInWithGoogle, verifyTwoFactorCode } = useAuth();

  // Check if we were redirected here after successful signup
  useEffect(() => {
    if (location.state?.from === "signup" && location.state?.message) {
      setSuccessMessage(location.state.message);
      // Pre-fill email if provided
      if (location.state?.email) {
        setEmail(location.state.email);
      }
    }
    
    // Check local storage for stored email if remember me was checked
    const storedEmail = localStorage.getItem('ffb_remembered_email');
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
    
    // Check for mobile view
    const checkForMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkForMobile();
    window.addEventListener('resize', checkForMobile);
    
    return () => {
      window.removeEventListener('resize', checkForMobile);
    };
  }, [location]);

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      
      await signInWithGoogle();
      
      setTimeout(() => {
        const token = localStorage.getItem('ffb_auth_token');
        
        if (token) {
          navigate("/login/dashboardpage");
        } else {
          setError("Authentication successful but token could not be created. Please try again.");
          setLoading(false);
        }
      }, 300);
    } catch (err) {
      console.error("Google login error:", err);
      setError(
        err.message.includes("popup-closed-by-user")
          ? "Google login was cancelled. Please try again."
          : "Failed to login with Google. Please try again later."
      );
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Security check - require CAPTCHA after 3 failed attempts
    if (loginAttempts >= 3 && !captchaVerified) {
      setError("Please verify that you're not a robot before continuing.");
      setLoading(false);
      return;
    }

    try {
      const response = await logIn(email, password);
      
      // Handle 2FA if needed
      if (response?.requiresTwoFactor) {
        setShowTwoFactorModal(true);
        setLoading(false);
        return;
      }
      
      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('ffb_remembered_email', email);
      } else {
        localStorage.removeItem('ffb_remembered_email');
      }
      
      // Reset login attempts on success
      setLoginAttempts(0);
      
      // Wait a bit to ensure token is set
      setTimeout(() => {
        const token = localStorage.getItem('ffb_auth_token');
        
        if (token) {
          navigate("/login/dashboardpage");
        } else {
          setError("Authentication successful but token could not be created. Please try again.");
          setLoading(false);
        }
      }, 300);
    } catch (err) {
      console.error("Login error:", err);
      setLoginAttempts(prev => prev + 1);
      
      setError(
        err.message.includes("auth/user-not-found") ||
        err.message.includes("auth/wrong-password")
          ? "Invalid email or password. Please try again."
          : err.message.includes("auth/too-many-requests")
          ? "Access temporarily disabled due to many failed login attempts. Try again later or reset your password."
          : err.message.includes("timed out") 
          ? "Login request timed out. Server may be busy. Please try again."
          : err.message.includes("network-request-failed") || err.code === "ERR_NETWORK"
          ? "Network connection error. Please check your internet connection."
          : err.message.includes("Unable to synchronize")
          ? "Backend synchronization failed. Please try again later."
          : "Failed to login. Please check your credentials and try again."
      );
      setLoading(false);
    }
  };

  const handleVerifyTwoFactor = async () => {
    if (!twoFactorCode || twoFactorCode.length < 6) {
      setError("Please enter a valid verification code");
      return;
    }
    
    setLoading(true);
    
    try {
      await verifyTwoFactorCode(email, twoFactorCode);
      
      // Reset login attempts on success
      setLoginAttempts(0);
      
      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('ffb_remembered_email', email);
      } else {
        localStorage.removeItem('ffb_remembered_email');
      }
      
      setShowTwoFactorModal(false);
      
      // Navigate to dashboard
      setTimeout(() => {
        const token = localStorage.getItem('ffb_auth_token');
        if (token) {
          navigate("/login/dashboardpage");
        } else {
          setError("Authentication successful but token could not be created. Please try again.");
          setLoading(false);
        }
      }, 300);
    } catch (err) {
      console.error("2FA verification error:", err);
      setError("Invalid verification code. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary-900 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 z-10"
      >
        <Link 
          to="/" 
          className="flex items-center text-white bg-gray-800/50 hover:bg-gray-800/80 px-4 py-2 rounded-lg transition-colors"
        >
          <FaHome className="mr-2" /> Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Log in to access your trading dashboard
          </motion.p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6 text-sm"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm flex items-start"
                >
                  <FaExclamationTriangle className="mt-0.5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Tips Callout - Shows if there were multiple login attempts */}
            <AnimatePresence>
              {(loginAttempts >= 2 || showSecurityTips) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-500/20 text-blue-400 p-4 rounded-lg mb-6 text-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FaShieldAlt className="mr-2" />
                      <span className="font-medium">Security Tips</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowSecurityTips(!showSecurityTips)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {showSecurityTips ? "Hide" : "Show more"}
                    </button>
                  </div>
                  
                  {showSecurityTips && (
                    <ul className="ml-6 list-disc text-xs space-y-1 mt-2">
                      <li>Ensure you're on the official Fidelity First Brokers website</li>
                      <li>Use a strong, unique password for your trading account</li>
                      <li>Enable two-factor authentication for enhanced security</li>
                      <li>Never share your login credentials with anyone</li>
                      <li>Be cautious of phishing attempts via email or SMS</li>
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-gray-400 text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              {/* Show CAPTCHA after 3 failed login attempts */}
              {loginAttempts >= 3 && (
                <div className="mb-6 flex justify-center">
                  <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Replace with your actual site key
                    onChange={handleCaptchaChange}
                    theme="dark"
                    size={isMobileView ? "compact" : "normal"}
                  />
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                className="py-3 text-base font-medium mb-4"
                disabled={loginAttempts >= 3 && !captchaVerified}
              >
                Log In <FaArrowRight className="ml-2" />
              </Button>
              
              {/* Social Login Divider */}
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-gray-700 w-full"></div>
                <div className="bg-gray-800 px-2 text-sm text-gray-500 absolute">OR</div>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FaGoogle className="mr-2" /> Continue with Google
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-900 text-center">
            <p className="text-xs text-gray-500">
              By logging in, you agree to our{" "}
              <Link to="/terms" className="text-primary-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* 2FA Modal */}
      <AnimatePresence>
        {showTwoFactorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Two-Factor Authentication</h2>
              <p className="text-gray-300 mb-4">
                Please enter the verification code from your authenticator app.
              </p>
              
              <div className="mb-6">
                <label htmlFor="twoFactorCode" className="block text-gray-400 text-sm font-medium mb-2">
                  Verification Code
                </label>
                <input
                  id="twoFactorCode"
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-xl tracking-widest"
                  placeholder="000000"
                  autoComplete="one-time-code"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  fullWidth
                  variant="outline"
                  onClick={() => setShowTwoFactorModal(false)}
                  className="py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  fullWidth
                  isLoading={loading}
                  onClick={handleVerifyTwoFactor}
                  className="py-2"
                >
                  Verify
                </Button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <FaInfoCircle className="mr-2 flex-shrink-0" />
                <span>
                  Having trouble? Contact our <Link to="/support" className="text-primary-400 hover:underline">Support Team</Link> for assistance.
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
