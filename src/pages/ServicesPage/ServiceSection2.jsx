import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLaptop,
  FaUserTie,
  FaChartLine,
  FaShieldAlt,
  FaHeadset,
  FaGlobe,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const ServiceSection2 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const advantages = [
    {
      id: 1,
      title: "Advanced Trading Platform",
      description:
        "Our intuitive and powerful trading platform provides real-time data, advanced charting tools, and seamless execution.",
      icon: <FaLaptop />,
      color: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      id: 2,
      title: "Expert Financial Advisors",
      description:
        "Our team of experienced financial advisors provides personalized guidance tailored to your investment goals.",
      icon: <FaUserTie />,
      color: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      id: 3,
      title: "Market Intelligence",
      description:
        "Access proprietary research, market insights, and analysis to help you make informed investment decisions.",
      icon: <FaChartLine />,
      color: "bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      id: 4,
      title: "Secure Investments",
      description:
        "Your investments are protected by industry-leading security measures and regulatory compliance standards.",
      icon: <FaShieldAlt />,
      color: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    {
      id: 5,
      title: "24/7 Customer Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions or concerns.",
      icon: <FaHeadset />,
      color: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
    },
    {
      id: 6,
      title: "Global Market Access",
      description:
        "Trade in markets worldwide with our comprehensive platform covering stocks, forex, cryptocurrencies, and more.",
      icon: <FaGlobe />,
      color: "bg-indigo-500/20",
      iconColor: "text-indigo-500",
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-20 px-4 ${darkMode ? "bg-gradient-to-b from-gray-800 to-gray-900" : "bg-gradient-to-b from-gray-100 to-white"}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
          >
            Why Choose Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${darkMode ? "text-gray-400" : "text-gray-600"} max-w-3xl mx-auto text-lg`}
          >
            Discover the advantages that make Fidelity First Brokers the
            preferred choice for investors worldwide.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${
                darkMode
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-primary-500"
                  : "bg-white backdrop-blur-sm border border-gray-200 hover:border-primary-500 shadow-lg"
              } p-6 rounded-xl transition-all duration-300`}
            >
              <div
                className={`${advantage.color} w-14 h-14 rounded-lg flex items-center justify-center mb-5`}
              >
                <span className={`${advantage.iconColor} text-2xl`}>
                  {advantage.icon}
                </span>
              </div>
              <h3
                className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-3`}
              >
                {advantage.title}
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div
          className={`mt-16 p-8 rounded-xl text-center ${
            darkMode
              ? "bg-gradient-to-r from-primary-900/40 to-gray-800 border border-primary-800/50"
              : "bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100"
          }`}
        >
          <h3
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
          >
            Ready to Start Investing with Us?
          </h3>
          <p
            className={`${darkMode ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto mb-6`}
          >
            Join thousands of satisfied clients who trust Fidelity First Brokers
            for their investment needs. Open an account today and experience the
            difference.
          </p>
          <Link
            to="/signup"
            className={`inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-600 hover:bg-primary-700 ${darkMode ? "text-gray-300" : "text-gray-600"} transition-colors duration-300`}
          >
            Open an Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection2;
