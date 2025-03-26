import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaHome, 
  FaArrowRight, 
  FaCheckCircle, 
  FaTimesCircle 
} from "react-icons/fa";
import Button from "../common/Button";
import PasswordStrengthMeter from "../common/PasswordStrengthMeter";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const navigate = useNavigate();
  
  // Get the correct authentication function from context
  const { createUser } = useAuth();

  // Password validation criteria
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
  const hasMinLength = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordScore < 2) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);

    try {
      // Split the name into first and last name
      let firstName = name;
      let lastName = '';
      
      if (name.includes(' ')) {
        const nameParts = name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
      
      // Use createUser with all required parameters
      await createUser(email, password, firstName, lastName);
      
      setSuccessMessage("Account created successfully! Redirecting to login...");
      
      // Simulate a delay before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message.includes("auth/email-already-in-use")
          ? "This email is already registered. Please use a different email or try logging in."
          : err.message.includes("auth/invalid-email")
          ? "Invalid email address. Please check and try again."
          : "Failed to create account. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-primary-900 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4"
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
            Create Account
          </motion.h1>
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join Fidelity First Brokers and start trading
          </motion.p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6 text-sm"
              >
                <FaCheckCircle className="inline-block mr-2" /> {successMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="block text-gray-400 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
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
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block text-gray-400 text-sm font-medium mb-2">
                  Password
                </label>
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
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                <PasswordStrengthMeter password={password} onScoreChange={setPasswordScore} />
                
                <div className="mt-2 text-xs grid grid-cols-2 gap-2">
                  <div className={`flex items-center ${hasMinLength ? 'text-green-400' : 'text-gray-400'}`}>
                    {hasMinLength ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center ${hasUpperCase ? 'text-green-400' : 'text-gray-400'}`}>
                    {hasUpperCase ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center ${hasLowerCase ? 'text-green-400' : 'text-gray-400'}`}>
                    {hasLowerCase ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                    <span>Lowercase letter</span>
                  </div>
                  <div className={`flex items-center ${hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                    {hasNumber ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center ${hasSpecialChar ? 'text-green-400' : 'text-gray-400'}`}>
                    {hasSpecialChar ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                    <span>Special character</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-400 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-gray-700 text-white border rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                className="py-3 text-base font-medium"
              >
                Create Account <FaArrowRight className="ml-2" />
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-900 text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <a href="#" className="text-primary-400 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
