import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const HomeFooter = () => {
  const { darkMode } = useDarkMode();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} pt-16 pb-8`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/favicon.ico" alt="Logo" className="h-10 w-auto" />
              <div>
                <h3
                  className={`${darkMode ? "text-white" : "text-gray-900"} text-lg font-bold`}
                >
                  Fidelity First
                </h3>
                <span className="text-primary-500 text-xs">
                  Brokers & Investment
                </span>
              </div>
            </div>
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}
            >
              Our mission is to provide reliable and profitable investment
              opportunities for all our clients while maintaining the highest
              standards of transparency and security.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-500 hover:text-primary-600"} transition-colors`}
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-500 hover:text-primary-600"} transition-colors`}
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-500 hover:text-primary-600"} transition-colors`}
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-500 hover:text-primary-600"} transition-colors`}
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-500 hover:text-primary-600"} transition-colors`}
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Services
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Our Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Investment Plans
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Forex Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Cryptocurrency Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Stock Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`${darkMode ? "text-gray-400 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} transition-colors flex items-center`}
                >
                  <span className="mr-2">→</span> Retirement Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt
                  className={`mt-1 mr-3 text-primary-500 flex-shrink-0`}
                />
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  1234 Wall Street, New York, NY 10005, United States
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className={`mr-3 text-primary-500 flex-shrink-0`} />
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className={`mr-3 text-primary-500 flex-shrink-0`} />
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  info@fidelityfirstbrokers.com
                </span>
              </li>
            </ul>
            <div className="pt-4">
              <Link
                to="/contact"
                className="px-6 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-300 inline-block"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`border-t ${darkMode ? "border-gray-800" : "border-gray-200"} my-8`}
        ></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p
            className={`${darkMode ? "text-gray-500" : "text-gray-600"} text-sm`}
          >
            © {currentYear} Fidelity First Brokers. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className={`${darkMode ? "text-gray-500 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} text-sm transition-colors`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className={`${darkMode ? "text-gray-500 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} text-sm transition-colors`}
            >
              Terms of Service
            </Link>
            <Link
              to="/disclaimer"
              className={`${darkMode ? "text-gray-500 hover:text-primary-500" : "text-gray-600 hover:text-primary-600"} text-sm transition-colors`}
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
