import { useState, useEffect } from "react";
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
  FaTimesCircle,
  FaGlobe,
  FaBriefcase,
  FaIdCard,
  FaBirthdayCake,
  FaUserTie,
  FaAddressBook
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
    referralCode: "",
    dateOfBirth: "",
    occupation: "",
    address: "",
    city: "",
    postalCode: "",
    taxId: "",
    howDidYouHearAboutUs: "",
    experienceLevel: "beginner"
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToDataPolicy, setAgreeToDataPolicy] = useState(false);
  const navigate = useNavigate();

  const { createUser } = useAuth();

  const countries = countryList.getData().map((country) => ({
    value: country.code,
    label: country.name
  }));

  const accountTypes = [
    { value: "individual", label: "Individual Investor" },
    { value: "corporate", label: "Corporate Entity" },
    { value: "joint", label: "Joint Account" },
    { value: "retirement", label: "Retirement Account" }
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner - New to investing" },
    { value: "intermediate", label: "Intermediate - Some experience" },
    { value: "advanced", label: "Advanced - Experienced investor" },
    { value: "professional", label: "Professional - Industry professional" }
  ];

  const referralSources = [
    { value: "search", label: "Search Engine" },
    { value: "social", label: "Social Media" },
    { value: "friend", label: "Friend or Family" },
    { value: "advertisement", label: "Advertisement" },
    { value: "news", label: "News Article" },
    { value: "other", label: "Other" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!agreeToTerms) {
      setError("You must agree to the Terms and Conditions");
      return;
    }

    if (!agreeToDataPolicy) {
      setError("You must agree to the Data Protection Policy");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordScore < 2) {
      setError("Please choose a stronger password");
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError("First name, last name, and email are required");
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
        formData.referralCode,
        {
          dateOfBirth: formData.dateOfBirth,
          occupation: formData.occupation,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          taxId: formData.taxId,
          howDidYouHearAboutUs: formData.howDidYouHearAboutUs,
          experienceLevel: formData.experienceLevel
        }
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
        className="w-full max-w-4xl"
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-white text-lg font-medium mb-4 pb-2 border-b border-gray-700">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-gray-400 text-sm font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
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

                <div>
                  <label htmlFor="lastName" className="block text-gray-400 text-sm font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
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

                <div>
                  <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
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

                <div>
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

                <div>
                  <label htmlFor="dateOfBirth" className="block text-gray-400 text-sm font-medium mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <FaBirthdayCake className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 18 years old</p>
                </div>

                <div>
                  <label htmlFor="occupation" className="block text-gray-400 text-sm font-medium mb-2">
                    Occupation
                  </label>
                  <div className="relative">
                    <FaUserTie className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                    <input
                      id="occupation"
                      name="occupation"
                      type="text"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Stock Broker"
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-white text-lg font-medium mt-8 mb-4 pb-2 border-b border-gray-700">Location & Account Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
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
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: '#374151',
                        borderColor: '#4B5563',
                        color: '#F9FAFB'
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: '#374151'
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#4B5563' : '#374151',
                        color: '#F9FAFB'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: '#F9FAFB'
                      }),
                      input: (base) => ({
                        ...base,
                        color: '#F9FAFB'
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: '#9CA3AF'
                      })
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="accountType" className="block text-gray-400 text-sm font-medium mb-2">
                    Account Type
                  </label>
                  <Select
                    id="accountType"
                    name="accountType"
                    options={accountTypes}
                    onChange={(selected) =>
                      setFormData((prev) => ({ ...prev, accountType: selected.value }))
                    }
                    className="text-gray-900"
                    placeholder="Select account type"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: '#374151',
                        borderColor: '#4B5563',
                        color: '#F9FAFB'
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: '#374151'
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#4B5563' : '#374151',
                        color: '#F9FAFB'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: '#F9FAFB'
                      }),
                      input: (base) => ({
                        ...base,
                        color: '#F9FAFB'
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: '#9CA3AF'
                      })
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-gray-400 text-sm font-medium mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <FaAddressBook className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="123 Main St"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="city" className="block text-gray-400 text-sm font-medium mb-2">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-gray-400 text-sm font-medium mb-2">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="taxId" className="block text-gray-400 text-sm font-medium mb-2">
                    Tax ID (Optional)
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500" />
                    <input
                      id="taxId"
                      name="taxId"
                      type="text"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="SSN or Tax ID Number"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For tax reporting purposes (optional)</p>
                </div>

                <div>
                  <label htmlFor="experienceLevel" className="block text-gray-400 text-sm font-medium mb-2">
                    Trading Experience
                  </label>
                  <Select
                    id="experienceLevel"
                    name="experienceLevel"
                    options={experienceLevels}
                    defaultValue={experienceLevels[0]}
                    onChange={(selected) =>
                      setFormData((prev) => ({ ...prev, experienceLevel: selected.value }))
                    }
                    className="text-gray-900"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: '#374151',
                        borderColor: '#4B5563',
                        color: '#F9FAFB'
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: '#374151'
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#4B5563' : '#374151',
                        color: '#F9FAFB'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: '#F9FAFB'
                      }),
                      input: (base) => ({
                        ...base,
                        color: '#F9FAFB'
                      })
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                <div>
                  <label htmlFor="howDidYouHearAboutUs" className="block text-gray-400 text-sm font-medium mb-2">
                    How did you hear about us?
                  </label>
                  <Select
                    id="howDidYouHearAboutUs"
                    name="howDidYouHearAboutUs"
                    options={referralSources}
                    onChange={(selected) =>
                      setFormData((prev) => ({ ...prev, howDidYouHearAboutUs: selected.value }))
                    }
                    className="text-gray-900"
                    placeholder="Select an option"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: '#374151',
                        borderColor: '#4B5563',
                        color: '#F9FAFB'
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: '#374151'
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#4B5563' : '#374151',
                        color: '#F9FAFB'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: '#F9FAFB'
                      }),
                      input: (base) => ({
                        ...base,
                        color: '#F9FAFB'
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: '#9CA3AF'
                      })
                    }}
                  />
                </div>

                <div>
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
              </div>

              <h3 className="text-white text-lg font-medium mt-8 mb-4 pb-2 border-b border-gray-700">Security</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="password" className="block text-gray-400 text-sm font-medium mb-2">
                    Password <span className="text-red-500">*</span>
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-400 text-sm font-medium mb-2">
                    Confirm Password <span className="text-red-500">*</span>
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
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                    checked={agreeToTerms}
                    onChange={() => setAgreeToTerms(!agreeToTerms)}
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                    I agree to the <Link to="/terms" className="text-primary-400 hover:underline">Terms and Conditions</Link> <span className="text-red-500">*</span>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="dataPolicy"
                    type="checkbox"
                    className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                    checked={agreeToDataPolicy}
                    onChange={() => setAgreeToDataPolicy(!agreeToDataPolicy)}
                    required
                  />
                  <label htmlFor="dataPolicy" className="ml-2 block text-sm text-gray-400">
                    I agree to the <Link to="/privacy" className="text-primary-400 hover:underline">Data Protection Policy</Link> <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg mt-6">
                <p className="text-sm text-gray-400">
                  <span className="text-red-500">*</span> Indicates required fields
                </p>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                className="py-3 text-base font-medium mt-4"
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
