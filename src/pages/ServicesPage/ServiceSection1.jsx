import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChartLine,
  FaCoins,
  FaExchangeAlt,
  FaLandmark,
  FaChartBar,
  FaShieldAlt,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const ServiceSection1 = () => {
  const { darkMode } = useDarkMode();

  return (
    <section
      className={`py-24 px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Our Investment <span className="text-primary-500">Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg max-w-3xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Discover our comprehensive range of investment and trading services
            designed to help you achieve your financial goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Stock Trading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${
              darkMode
                ? "bg-gray-800 border border-gray-700 hover:border-primary-500"
                : "bg-white border border-gray-200 hover:border-primary-500 shadow-lg hover:shadow-xl"
            } rounded-xl p-6 transition-all duration-300`}
          >
            <div className="bg-blue-500/20 w-14 h-14 rounded-lg flex items-center justify-center text-blue-500 text-2xl mb-5">
              <FaChartLine />
            </div>

            <h3
              className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Stock Trading
            </h3>

            <p
              className={`mb-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Access global stock markets with our advanced trading platform
              offering competitive fees and real-time market data.
            </p>

            <Link
              to="/services/stocks"
              className="flex items-center text-primary-500 hover:text-primary-600 transition-colors"
            >
              Learn more <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>

          {/* Forex Trading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${
              darkMode
                ? "bg-gray-800 border border-gray-700 hover:border-primary-500"
                : "bg-white border border-gray-200 hover:border-primary-500 shadow-lg hover:shadow-xl"
            } rounded-xl p-6 transition-all duration-300`}
          >
            <div className="bg-green-500/20 w-14 h-14 rounded-lg flex items-center justify-center text-green-500 text-2xl mb-5">
              <FaExchangeAlt />
            </div>

            <h3
              className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Forex Trading
            </h3>

            <p
              className={`mb-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Trade major, minor, and exotic currency pairs with tight spreads
              and leveraged positions on our secure platform.
            </p>

            <Link
              to="/services/forex"
              className="flex items-center text-primary-500 hover:text-primary-600 transition-colors"
            >
              Learn more <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>

          {/* Crypto Trading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${
              darkMode
                ? "bg-gray-800 border border-gray-700 hover:border-primary-500"
                : "bg-white border border-gray-200 hover:border-primary-500 shadow-lg hover:shadow-xl"
            } rounded-xl p-6 transition-all duration-300`}
          >
            <div className="bg-purple-500/20 w-14 h-14 rounded-lg flex items-center justify-center text-purple-500 text-2xl mb-5">
              <FaCoins />
            </div>

            <h3
              className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Cryptocurrency
            </h3>

            <p
              className={`mb-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Invest in digital assets with our secure cryptocurrency trading
              platform offering a wide range of altcoins.
            </p>

            <Link
              to="/services/crypto"
              className="flex items-center text-primary-500 hover:text-primary-600 transition-colors"
            >
              Learn more <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>

          {/* Retirement Planning */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`${
              darkMode
                ? "bg-gray-800 border border-gray-700 hover:border-primary-500"
                : "bg-white border border-gray-200 hover:border-primary-500 shadow-lg hover:shadow-xl"
            } rounded-xl p-6 transition-all duration-300`}
          >
            <div className="bg-red-500/20 w-14 h-14 rounded-lg flex items-center justify-center text-red-500 text-2xl mb-5">
              <FaLandmark />
            </div>

            <h3
              className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Retirement Planning
            </h3>

            <p
              className={`mb-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Secure your future with our tailored retirement plans designed to
              provide long-term growth and financial security.
            </p>

            <Link
              to="/services/retirement"
              className="flex items-center text-primary-500 hover:text-primary-600 transition-colors"
            >
              Learn more <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>

          {/* Portfolio Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`${
              darkMode
                ? "bg-gray-800 border border-gray-700 hover:border-primary-500"
                : "bg-white border border-gray-200 hover:border-primary-500 shadow-lg hover:shadow-xl"
            } rounded-xl p-6 transition-all duration-300`}
          >
            <div className="bg-orange-500/20 w-14 h-14 rounded-lg flex items-center justify-center text-orange-500 text-2xl mb-5">
              <FaChartBar />
            </div>

            <h3
              className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Portfolio Management
            </h3>

            <p
              className={`mb-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Let our experts manage your investments with personalized
              strategies aligned with your financial goals and risk tolerance.
            </p>

            <Link
              to="/services/portfolio"
              className="flex items-center text-primary-500 hover:text-primary-600 transition-colors"
            >
              Learn more <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>

          {/* Wealth Protection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`${
              darkMode
                ? "bg-gray-800 border border-gray-700 hover:border-primary-500"
                : "bg-white border border-gray-200 hover:border-primary-500 shadow-lg hover:shadow-xl"
            } rounded-xl p-6 transition-all duration-300`}
          >
            <div className="bg-teal-500/20 w-14 h-14 rounded-lg flex items-center justify-center text-teal-500 text-2xl mb-5">
              <FaShieldAlt />
            </div>

            <h3
              className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Wealth Protection
            </h3>

            <p
              className={`mb-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Safeguard your assets with our comprehensive wealth protection
              strategies, including insurance and risk management.
            </p>

            <Link
              to="/services/protection"
              className="flex items-center text-primary-500 hover:text-primary-600 transition-colors"
            >
              Learn more <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection1;
