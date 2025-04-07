import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { motion } from "framer-motion";
import Select from "react-select";
import countryList from "country-list";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import Button from "../common/Button";
import PasswordStrengthMeter from "../common/PasswordStrengthMeter";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    accountType: "",
    country: "",
    referralCode: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const navigate = useNavigate();

  const { createUser } = useAuth();

  const countries = countryList.getData().map((country) => ({
    value: country.code,
    label: country.name
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordScore < 2) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);

    try {
      await createUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phoneNumber,
        formData.accountType,
        formData.country,
        formData.referralCode
      );

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.message.includes("auth/email-already-in-use")
          ? "This email is already registered. Please use a different email or try logging in."
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
          <FaArrowRight className="mr-2" /> Home
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
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6 text-sm"
              >
                <FaCheckCircle className="inline-block mr-2" /> {successMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="firstName" className="block text-gray-400 text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="lastName" className="block text-gray-400 text-sm font-medium mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <FaUser className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="phoneNumber" className="block text-gray-400 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+1 123 456 7890"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="accountType" className="block text-gray-400 text-sm font-medium mb-2">
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Account Type</option>
                  <option value="individual">Individual</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div className="mb-5">
                <label htmlFor="country" className="block text-gray-400 text-sm font-medium mb-2">
                  Country
                </label>
                <Select
                  id="country"
                  name="country"
                  options={countries}
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, country: selected.value }))
                  }
                  className="text-gray-900"
                  placeholder="Select your country"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="referralCode" className="block text-gray-400 text-sm font-medium mb-2">
                  Referral Code (Optional)
                </label>
                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter referral code"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block text-gray-400 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
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
                <PasswordStrengthMeter
                  password={formData.password}
                  onScoreChange={setPasswordScore}
                />
              </div>

              <div className="mb-5">
                <label htmlFor="confirmPassword" className="block text-gray-400 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              </div>

              <div className="mb-5">
                <label className="flex items-center text-gray-400 text-sm">
                  <input
                    type="checkbox"
                    className="mr-2 bg-gray-700 border-gray-600 focus:ring-primary-500"
                    required
                  />
                  I agree to the <Link to="/terms" className="text-primary-400 hover:underline">Terms and Conditions</Link>
                </label>
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
                Already have an account? {" "}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-900 text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our {" "}
              <Link to="/terms" className="text-primary-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and {" "}
              <Link to="/privacy" className="text-primary-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
