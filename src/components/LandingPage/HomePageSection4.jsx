import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { FaQuestionCircle, FaBookOpen, FaChartLine, FaArrowRight } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const HomePageSection4 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  const resources = [
    {
      id: 1,
      title: "Investment Guides",
      description: "Comprehensive guides and tutorials on various investment strategies and market analysis.",
      icon: <FaBookOpen />,
      link: "/resources/guides"
    },
    {
      id: 2,
      title: "FAQs",
      description: "Answers to commonly asked questions about our platform, services, and investment processes.",
      icon: <FaQuestionCircle />,
      link: "/resources/faqs"
    },
    {
      id: 3,
      title: "Market Analysis",
      description: "Regular market updates, trend analysis, and investment opportunities from our expert team.",
      icon: <FaChartLine />,
      link: "/resources/market-analysis"
    }
  ];

  return (
    <section className={`py-20 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}
          >
            Resources & Learning
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}
          >
            Access educational materials and resources to enhance your investment knowledge and make informed decisions.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl p-6 ${
                darkMode 
                  ? 'bg-gray-800/50 border border-gray-700 hover:border-primary-500' 
                  : 'bg-white border border-gray-200 hover:border-primary-500 shadow-lg hover:shadow-xl'
              } transition-all duration-300`}
            >
              <div className="w-14 h-14 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-500 text-2xl mb-5">
                {resource.icon}
              </div>
              
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                {resource.title}
              </h3>
              
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-5`}>
                {resource.description}
              </p>
              
              <Link 
                to={resource.link} 
                className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors"
              >
                Learn More <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className={`mt-16 p-8 rounded-xl text-center ${
          darkMode 
            ? 'bg-gradient-to-r from-primary-900/50 to-gray-800 border border-primary-800' 
            : 'bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100'
        }`}>
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Need Personalized Guidance?
          </h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto mb-6`}>
            Our team of investment experts is available to provide personalized advice and support to help you achieve your financial goals.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-300"
          >
            Schedule a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePageSection4;