import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { FaArrowRight, FaPhoneAlt, FaEnvelope, FaRocket } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import "../../css/animations.css";

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const isInView = useInView(counterRef, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = performance.now();
      const numericTarget = parseFloat(target.toString().replace(/[^0-9.]/g, ''));
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * numericTarget);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(numericTarget);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, target, duration]);

  return (
    <span ref={counterRef} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

const AboutSection5 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const stats = [
    { label: "Client Satisfaction", value: 97, suffix: "%", gradient: "from-green-500 to-emerald-400" },
    { label: "Assets Under Management", value: 150, suffix: "M+", prefix: "$", gradient: "from-blue-500 to-cyan-400" },
    { label: "Investment Specialists", value: 50, suffix: "+", gradient: "from-purple-500 to-pink-400" },
    { label: "Global Markets", value: 24, suffix: "", gradient: "from-orange-500 to-red-400" },
  ];

  return (
    <section
      ref={ref}
      className={`py-20 px-4 ${
        darkMode
          ? "bg-gradient-to-b from-primary-900/40 to-gray-900"
          : "bg-gradient-to-b from-gray-50 to-white"
      } relative overflow-hidden`}
    >
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-24 -right-24 w-96 h-96 ${darkMode ? "bg-primary-600/20" : "bg-primary-600/10"} rounded-full blur-3xl`}
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className={`absolute -bottom-24 -left-24 w-96 h-96 ${darkMode ? "bg-blue-600/20" : "bg-blue-600/10"} rounded-full blur-3xl`}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, type: "spring" }}
                className="inline-block mb-4"
              >
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  darkMode 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : "bg-green-100 text-green-600"
                }`}>
                  <FaRocket className="text-xs" /> Get Started
                </span>
              </motion.div>
              
              <h2 className={`text-3xl md:text-5xl font-bold mb-6`}>
                <span className={darkMode ? "text-white" : "text-gray-900"}>Join Thousands of </span>
                <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Satisfied Investors
                </span>
              </h2>

              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-lg mb-8`}>
                Take the first step towards financial freedom with Fidelity
                First Brokers. Our expert team is ready to help you build and
                grow your investment portfolio.
              </p>

              {/* Animated Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`relative group ${
                      darkMode
                        ? "bg-gray-800/70 backdrop-blur-xl border border-gray-700/50"
                        : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg"
                    } p-5 rounded-2xl overflow-hidden`}
                  >
                    {/* Gradient accent on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <p className={`font-bold text-3xl md:text-4xl mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.prefix || ''}<AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2000} />
                    </p>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm font-medium`}>
                      {stat.label}
                    </p>
                    
                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.gradient} w-0 group-hover:w-full transition-all duration-500`} />
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="group relative px-8 py-4 rounded-full overflow-hidden text-white font-semibold inline-flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center">
                      Open an Account <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className={`px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-blue-500"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 hover:border-blue-500"
                    }`}
                  >
                    Contact Sales Team
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form with electric border */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="electric-border rounded-2xl p-[2px]">
              <div
                className={`${
                  darkMode
                    ? "bg-gray-900"
                    : "bg-white"
                } p-8 rounded-2xl`}
              >
                <h3 className={`text-2xl font-bold mb-6`}>
                  <span className={darkMode ? "text-white" : "text-gray-900"}>Contact </span>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Us</span>
                </h3>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block ${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-1`}>
                        First Name
                      </label>
                      <input
                        type="text"
                        className={`w-full px-4 py-3 ${
                          darkMode
                            ? "bg-gray-800 border border-gray-700 text-white focus:border-blue-500"
                            : "bg-gray-50 border border-gray-200 text-gray-800 focus:border-blue-500"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className={`block ${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-1`}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        className={`w-full px-4 py-3 ${
                          darkMode
                            ? "bg-gray-800 border border-gray-700 text-white focus:border-blue-500"
                            : "bg-gray-50 border border-gray-200 text-gray-800 focus:border-blue-500"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block ${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-1`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-gray-800 border border-gray-700 text-white focus:border-blue-500"
                          : "bg-gray-50 border border-gray-200 text-gray-800 focus:border-blue-500"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div>
                    <label className={`block ${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-1`}>
                      Message
                    </label>
                    <textarea
                      className={`w-full px-4 py-3 ${
                        darkMode
                          ? "bg-gray-800 border border-gray-700 text-white focus:border-blue-500"
                          : "bg-gray-50 border border-gray-200 text-gray-800 focus:border-blue-500"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 min-h-[120px] resize-none`}
                      placeholder="I'm interested in learning more about..."
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative group py-4 px-6 rounded-xl overflow-hidden text-white font-semibold"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Send Message</span>
                  </motion.button>
                </form>

                <div className={`mt-8 pt-6 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>
                    Or reach us directly:
                  </p>

                  <div className="space-y-3">
                    <motion.a
                      href="tel:+447878472046"
                      whileHover={{ x: 5 }}
                      className={`flex items-center ${
                        darkMode
                          ? "text-gray-300 hover:text-blue-400"
                          : "text-gray-600 hover:text-blue-600"
                      } transition-colors`}
                    >
                      <div className={`w-10 h-10 rounded-full ${darkMode ? "bg-blue-500/20" : "bg-blue-100"} flex items-center justify-center mr-3`}>
                        <FaPhoneAlt className="text-blue-500" />
                      </div>
                      +44 (787) 847 2046
                    </motion.a>
                    <motion.a
                      href="mailto:info@fidelityfirst.com"
                      whileHover={{ x: 5 }}
                      className={`flex items-center ${
                        darkMode
                          ? "text-gray-300 hover:text-purple-400"
                          : "text-gray-600 hover:text-purple-600"
                      } transition-colors`}
                    >
                      <div className={`w-10 h-10 rounded-full ${darkMode ? "bg-purple-500/20" : "bg-purple-100"} flex items-center justify-center mr-3`}>
                        <FaEnvelope className="text-purple-500" />
                      </div>
                      info@fidelityfirst.com
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection5;
