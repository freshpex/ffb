import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { FaArrowRight, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const AboutSection5 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  const stats = [
    { label: "Client Satisfaction", value: "97%" },
    { label: "Assets Under Management", value: "$150M+" },
    { label: "Investment Specialists", value: "50+" },
    { label: "Global Markets", value: "24" }
  ];

  return (
    <section ref={ref} className={`py-20 px-4 ${
      darkMode 
        ? 'bg-gradient-to-b from-primary-900/40 to-gray-900' 
        : 'bg-white'
    } relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -right-24 w-96 h-96 ${darkMode ? 'bg-primary-600/10' : 'bg-primary-600/5'} rounded-full blur-3xl`}></div>
        <div className={`absolute -bottom-24 -left-24 w-96 h-96 ${darkMode ? 'bg-blue-600/10' : 'bg-blue-600/5'} rounded-full blur-3xl`}></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Join Thousands of Satisfied Investors
              </h2>
              
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg mb-8`}>
                Take the first step towards financial freedom with Fidelity First Brokers. Our expert team is ready to help you build and grow your investment portfolio.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`${
                      darkMode
                        ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
                        : 'bg-white backdrop-blur-sm border border-gray-200 shadow-md'
                    } p-4 rounded-lg`}
                  >
                    <p className="text-primary-500 font-bold text-3xl mb-1">{stat.value}</p>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className={`${
                    darkMode
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'hover:bg-gray-300 text-gray-800'
                  } text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center`}
                >
                  Open an Account <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className={`${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center`}
                >
                  Contact Sales Team
                </Link>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${
              darkMode
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
                : 'bg-white backdrop-blur-sm border border-gray-200 shadow-xl'
            } p-8 rounded-xl`}
          >
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Contact Us</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>First Name</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 ${
                      darkMode
                        ? 'bg-gray-700 border border-gray-600 text-white focus:ring-primary-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-800 focus:ring-primary-500'
                    } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Last Name</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 ${
                      darkMode
                        ? 'bg-gray-700 border border-gray-600 text-white focus:ring-primary-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-800 focus:ring-primary-500'
                    } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Email Address</label>
                <input
                  type="email"
                  className={`w-full px-4 py-2 ${
                    darkMode
                      ? 'bg-gray-700 border border-gray-600 text-white focus:ring-primary-500'
                      : 'bg-gray-50 border border-gray-200 text-gray-800 focus:ring-primary-500'
                  } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="john.doe@example.com"
                />
              </div>
              
              <div>
                <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Message</label>
                <textarea
                  className={`w-full px-4 py-2 ${
                    darkMode
                      ? 'bg-gray-700 border border-gray-600 text-white focus:ring-primary-500'
                      : 'bg-gray-50 border border-gray-200 text-gray-800 focus:ring-primary-500'
                  } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent min-h-[120px]`}
                  placeholder="I'm interested in learning more about..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
            
            <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>Or reach us directly:</p>
              
              <div className="space-y-3">
                <a href="tel:+15551234567" className={`flex items-center ${
                  darkMode 
                    ? 'text-gray-300 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                } transition-colors`}>
                  <FaPhoneAlt className="mr-3 text-primary-500" />
                  +1 (555) 123-4567
                </a>
                <a href="mailto:info@fidelityfirst.com" className={`flex items-center ${
                  darkMode 
                    ? 'text-gray-300 hover:text-primary-500' 
                    : 'text-gray-600 hover:text-primary-600'
                } transition-colors`}>
                  <FaEnvelope className="mr-3 text-primary-500" />
                  info@fidelityfirst.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection5;