import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 bg-gray-900/95 backdrop-blur-md shadow-lg`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="flex items-center gap-2">
            <img src="/favicon.ico" alt="Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-white text-xl font-bold">Fidelity First</h1>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-primary-500 transition-colors font-medium">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-primary-500 transition-colors font-medium">
            About
          </Link>
          <Link to="/services" className="text-white hover:text-primary-500 transition-colors font-medium">
            Services
          </Link>
          <Link to="/pricing" className="text-white hover:text-primary-500 transition-colors font-medium">
            Pricing
          </Link>
          <Link to="/contact" className="text-white hover:text-primary-500 transition-colors font-medium">
            Contact
          </Link>
          <div className="flex space-x-3">
            <Link to="/login" className="px-6 py-2 rounded-full text-white hover:bg-white/10 border border-white/30 transition-all duration-300">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-300">
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white py-2 hover:text-primary-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-white py-2 hover:text-primary-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/services" 
                className="text-white py-2 hover:text-primary-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/pricing" 
                className="text-white py-2 hover:text-primary-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className="text-white py-2 hover:text-primary-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-700">
                <Link 
                  to="/login" 
                  className="px-6 py-3 rounded-full text-white text-center hover:bg-white/10 border border-white/30 transition-all duration-300"
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
