import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${darkMode ? "bg-gray-900/95" : "bg-white/95"} backdrop-blur-md shadow-lg`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="flex items-center gap-2">
            <img src="/favicon.ico" alt="Logo" className="h-10 w-auto" />
            <div>
              <h1
                className={`${darkMode ? "text-white" : "text-gray-900"} text-xl font-bold`}
              >
                Fidelity First
              </h1>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} transition-colors font-medium`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} transition-colors font-medium`}
          >
            About
          </Link>
          <Link
            to="/services"
            className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} transition-colors font-medium`}
          >
            Services
          </Link>
          <Link
            to="/pricing"
            className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} transition-colors font-medium`}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} transition-colors font-medium`}
          >
            Contact
          </Link>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          <div className="flex space-x-3">
            <Link
              to="/login"
              className={`px-6 py-2 rounded-full ${darkMode ? "text-white hover:bg-white/10 border border-white/30" : "text-gray-800 hover:bg-gray-100 border border-gray-300"} transition-all duration-300`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-6 py-2 rounded-full ${darkMode ? "text-white hover:bg-white/10 border border-green/30" : "text-gray-800 hover:bg-gray-100 border border-gray-300"} transition-all duration-200`}
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation Button & Dark Mode Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-gray-700"} transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          <button
            className={`${darkMode ? "text-white" : "text-gray-800"} p-2`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden ${darkMode ? "bg-gray-900/95" : "bg-white/95"} backdrop-blur-md`}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                to="/"
                className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} py-2 transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} py-2 transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} py-2 transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/pricing"
                className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} py-2 transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className={`${darkMode ? "text-white hover:text-primary-500" : "text-gray-800 hover:text-primary-600"} py-2 transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div
                className={`flex flex-col space-y-2 pt-3 ${darkMode ? "border-gray-700" : "border-gray-200"} border-t`}
              >
                <Link
                  to="/login"
                  className={`px-6 py-3 rounded-full text-center ${
                    darkMode
                      ? "text-white hover:bg-white/10 border border-white/30"
                      : "text-gray-800 hover:bg-gray-100 border border-gray-300"
                  } transition-all duration-300`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-center transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
