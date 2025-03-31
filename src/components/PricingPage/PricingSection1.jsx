import { motion } from "framer-motion";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";

const PricingSection1 = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className={`pt-28 pb-16 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className={`text-4xl lg:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Transparent Pricing, <span className="text-primary-500">Exceptional Value</span>
          </h1>
          <p className={`text-lg max-w-3xl mx-auto mb-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose the right plan for your investment needs. Our pricing is designed to grow with you, 
            from beginning investors to seasoned professionals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`p-6 rounded-xl ${darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200 shadow-lg'}`}
            >
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Basic</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Perfect for beginners</p>
              <p className="mb-6">
                <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$0</span>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>/month</span>
              </p>
              
              <ul className="mb-6 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Basic trading tools</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Market news</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Email support</span>
                </li>
              </ul>
              
              <Link to="/signup" className={`block w-full py-3 px-4 rounded-lg text-center transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                Get Started <FaArrowRight className="ml-1 inline" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`p-6 rounded-xl relative border-2 border-primary-500 ${
                darkMode ? 'bg-gray-800' : 'bg-white shadow-xl'}`}
            >
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                <div className="bg-primary-500 text-white text-xs font-semibold py-1 px-3 rounded-full">
                  POPULAR
                </div>
              </div>
              
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pro</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>For active traders</p>
              <p className="mb-6">
                <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$29</span>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>/month</span>
              </p>
              
              <ul className="mb-6 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Advanced trading tools</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Real-time market data</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Priority support</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Performance analytics</span>
                </li>
              </ul>
              
              <Link to="/signup" className="block w-full py-3 px-4 rounded-lg text-center bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                Choose Pro <FaArrowRight className="ml-1 inline" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`p-6 rounded-xl ${darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200 shadow-lg'}`}
            >
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enterprise</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>For professionals</p>
              <p className="mb-6">
                <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$99</span>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>/month</span>
              </p>
              
              <ul className="mb-6 space-y-2">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>All Pro features</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Advanced API access</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Exclusive investment opportunities</span>
                </li>
              </ul>
              
              <Link to="/signup" className={`block w-full py-3 px-4 rounded-lg text-center transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                Contact Sales <FaArrowRight className="ml-1 inline" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingSection1;