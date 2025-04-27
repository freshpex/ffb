import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const TradingPlan = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      description:
        "Perfect for beginners looking to start their investment journey",
      price: "$0",
      period: "Free forever",
      features: [
        "Basic market analysis tools",
        "Standard trading platform",
        "Email support",
        "Market news & updates",
        "Up to 5 simultaneous trades",
      ],
      limitations: [
        "Limited portfolio diversification",
        "No advanced analytics",
        "No personal advisor",
      ],
      buttonText: "Get Started Free",
      popular: false,
    },
    {
      id: "standard",
      name: "Standard Plan",
      description:
        "Ideal for active traders seeking enhanced tools and features",
      price: "$29",
      period: "per month",
      features: [
        "Advanced trading tools",
        "Premium market analysis",
        "Priority email & chat support",
        "Real-time market alerts",
        "Up to 20 simultaneous trades",
        "Portfolio optimization tools",
        "Trading signals",
      ],
      limitations: [],
      buttonText: "Choose Standard",
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Plan",
      description:
        "Comprehensive solution for serious investors and professionals",
      price: "$99",
      period: "per month",
      features: [
        "Full-suite professional tools",
        "Expert market analysis",
        "24/7 dedicated support",
        "Personalized investment advisor",
        "Unlimited simultaneous trades",
        "Advanced risk management",
        "Exclusive investment opportunities",
        "Priority execution",
      ],
      limitations: [],
      buttonText: "Choose Premium",
      popular: false,
    },
  ];

  return (
    <section
      className={`py-20 px-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}
      ref={ref}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
          >
            Trading Plans & Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${darkMode ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto`}
          >
            Choose the right plan for your investment needs with our transparent
            pricing and feature-rich offerings.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`rounded-xl ${
                plan.popular
                  ? `border-2 border-primary-500 shadow-lg ${
                      darkMode
                        ? "shadow-primary-500/10 relative z-10 bg-gray-800"
                        : "bg-gray-100 hover:bg-gray-100 text-gray-700"
                    }`
                  : `border ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-white"}`
              } transition-all duration-300 overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-semibold py-1 px-3 uppercase">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                <h3
                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4 h-12`}
                >
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span
                    className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} ml-1`}
                  >
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <p
                    className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Includes:
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-2">
                      <p
                        className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Not included:
                      </p>
                      <ul className="space-y-2 mt-2">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start">
                            <span
                              className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                            >
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Link
                  to="/signup"
                  className={`block w-full py-3 rounded-lg text-center font-semibold transition-colors duration-300 ${
                    plan.popular
                      ? darkMode
                        ? "bg-primary-800 hover:bg-primary-700 text-white"
                        : "bg-gray-100 hover:bg-gray-100 text-gray-700"
                      : darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {plan.buttonText} <FaArrowRight className="ml-1 inline" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div
          className={`mt-12 text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          <p>
            All plans include our core trading platform and educational
            resources.
            <Link
              to="/pricing"
              className="text-primary-500 hover:text-primary-600 ml-1"
            >
              View full plan comparison
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TradingPlan;
