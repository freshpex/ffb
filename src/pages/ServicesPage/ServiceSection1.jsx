import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ServiceSection1 = () => {
  const { darkMode } = useDarkMode();
  const containerRef = useRef(null);

  const services = [
    {
      icon: FaChartLine,
      title: "Stock Trading",
      description: "Access global stock markets with our advanced trading platform offering competitive fees and real-time market data.",
      link: "/services/stocks",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaExchangeAlt,
      title: "Forex Trading",
      description: "Trade major, minor, and exotic currency pairs with tight spreads and leveraged positions on our secure platform.",
      link: "/services/forex",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: FaCoins,
      title: "Cryptocurrency",
      description: "Invest in digital assets with our secure cryptocurrency trading platform offering a wide range of altcoins.",
      link: "/services/crypto",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: FaLandmark,
      title: "Retirement Planning",
      description: "Secure your future with our tailored retirement plans designed to provide long-term growth and financial security.",
      link: "/services/retirement",
      color: "red",
      gradient: "from-red-500 to-rose-500",
    },
    {
      icon: FaChartBar,
      title: "Portfolio Management",
      description: "Let our experts manage your investments with personalized strategies aligned with your financial goals and risk tolerance.",
      link: "/services/portfolio",
      color: "orange",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: FaShieldAlt,
      title: "Wealth Protection",
      description: "Safeguard your assets with our comprehensive wealth protection strategies, including insurance and risk management.",
      link: "/services/protection",
      color: "teal",
      gradient: "from-teal-500 to-cyan-500",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".service-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className={`py-24 px-4 relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      ref={containerRef}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="grid-background opacity-20" />
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                darkMode
                  ? "bg-primary-900/50 text-primary-400 border border-primary-700/50"
                  : "bg-primary-50 text-primary-700 border border-primary-200"
              }`}
            >
              🚀 Our Services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Our Investment <span className="gradient-text-animated">Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-3xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Discover our comprehensive range of investment and trading services
            designed to help you achieve your financial goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`service-card group relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 ${
                darkMode
                  ? "bg-gray-800/50 border border-gray-700 hover:border-primary-500/50 backdrop-blur-sm"
                  : "bg-white border border-gray-200 hover:border-primary-500/50 shadow-lg hover:shadow-xl"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                style={{
                  background: `radial-gradient(circle at 50% 50%, var(--tw-gradient-from) 0%, transparent 70%)`,
                  opacity: 0,
                }}
              />

              <div className={`relative z-10`}>
                <motion.div 
                  className={`bg-gradient-to-br ${service.gradient} w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl mb-5 transition-all duration-300 group-hover:scale-110`}
                  whileHover={{ rotate: 5 }}
                  style={{
                    boxShadow: `0 10px 30px -10px var(--tw-gradient-from)`,
                  }}
                >
                  <service.icon />
                </motion.div>

                <h3
                  className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {service.title}
                </h3>

                <p
                  className={`mb-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {service.description}
                </p>

                <Link
                  to={service.link}
                  className="inline-flex items-center text-primary-500 hover:text-primary-400 transition-colors font-medium group/link"
                >
                  Learn more 
                  <FaArrowRight className="ml-2 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection1;
