import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaArrowRight, 
  FaChartLine, 
  FaLock, 
  FaHeadset, 
  FaMoon, 
  FaSun, 
  FaGlobeAmericas, 
  FaShieldAlt, 
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteRight
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const HomePage = () => {
  const { darkMode } = useDarkMode();
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const statsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  
  const [hasAnimated, setHasAnimated] = useState(false);
  const [stats, setStats] = useState([
    { value: 0, target: 25, suffix: "k+", label: "Active Investors" },
    { value: 0, target: 150, suffix: "M+", prefix: "$", label: "Assets Managed" },
    { value: 0, target: 12, suffix: "+", label: "Years Experience" },
    { value: 0, target: 97, suffix: "%", label: "Client Satisfaction" }
  ]);
  
  const partners = [
    "/images/partner-1.png",
    "/images/partner-2.png",
    "/images/partner-3.png",
    "/images/partner-4.png",
    "/images/partner-5.png",
    "/images/partner-6.png"
  ];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateStats();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const animateStats = () => {
    let frameCount = 0;
    const framesToCount = 100;
    
    const interval = setInterval(() => {
      frameCount++;
      const progress = frameCount / framesToCount;
      
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: Math.floor(progress * stat.target)
        }))
      );
      
      if (frameCount >= framesToCount) {
        clearInterval(interval);
      }
    }, 15);
  };
  
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-white'}`}>      
      <section className={`pt-20 pb-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl relative overflow-hidden ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
              darkMode ? 'bg-primary-900/50 text-primary-400 border border-primary-700' : 'bg-primary-50 text-primary-700 border border-primary-200'
            }`}>
              Trusted by 25,000+ investors worldwide
            </div>
            
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Unleash Your Financial <span className="text-primary-500 relative">
                Potential
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path 
                    d="M0,5 Q40,0 55,5 T100,5" 
                    fill="none" 
                    stroke={darkMode ? "#3b82f6" : "#2563eb"} 
                    strokeWidth="3"
                  />
                </svg>
              </span>
            </h1>
            
            <p className={`text-lg mb-8 max-w-xl mx-auto md:mx-0 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Experience secure investing, transparent trading, and competitive returns with Fidelity First Brokers. Your journey to financial freedom starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/signup"
                className={`${
                  darkMode 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                } font-medium py-3 px-8 rounded-full transition-all duration-300 flex items-center justify-center`}
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
              
              <Link
                to="/about"
                className={`${
                  darkMode
                    ? 'bg-transparent border border-gray-600 hover:border-primary-500 text-white' 
                    : 'bg-transparent border border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600'
                } font-medium py-3 px-8 rounded-full transition-all duration-300 flex items-center justify-center`}
              >
                Learn More
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className={`relative ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/80'
            } p-6 rounded-2xl backdrop-blur-sm shadow-xl`}>
              <img
                src="/images/pexels-rdne-stock-project-8369687.jpg"
                alt="Investment Platform"
                className="w-full max-w-lg mx-auto relative z-10"
              />
              
              <motion.div 
                className="absolute -top-5 -right-5 bg-green-500/20 p-4 rounded-lg backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              >
                <div className="text-green-500 font-bold">+12.5%</div>
                <div className="text-xs text-green-400">Portfolio Growth</div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-5 -left-5 bg-blue-500/20 p-4 rounded-lg backdrop-blur-sm"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
              >
                <div className="text-blue-500 font-bold">$24,680</div>
                <div className="text-xs text-blue-400">Investment Value</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`${
              darkMode
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-primary-500'
                : 'bg-white backdrop-blur-sm border border-gray-200 hover:border-primary-500 shadow-lg'
            } p-6 rounded-xl transition-all duration-300`}
          >
            <div className={`${
              darkMode ? 'bg-primary-500/20' : 'bg-primary-100'
            } w-14 h-14 rounded-lg flex items-center justify-center mb-5`}>
              <FaChartLine className="text-primary-500 text-2xl" />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>High Returns</h3>
            <p className={
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }>
              Our investment plans are designed to maximize your returns while managing risk effectively.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className={`${
              darkMode
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-primary-500'
                : 'bg-white backdrop-blur-sm border border-gray-200 hover:border-primary-500 shadow-lg'
            } p-6 rounded-xl transition-all duration-300`}
          >
            <div className={`${
              darkMode ? 'bg-primary-500/20' : 'bg-primary-100'
            } w-14 h-14 rounded-lg flex items-center justify-center mb-5`}>
              <FaLock className="text-primary-500 text-2xl" />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Secure Platform</h3>
            <p className={
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }>
              Advanced encryption and security measures to keep your investments and data protected.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className={`${
              darkMode
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-primary-500'
                : 'bg-white backdrop-blur-sm border border-gray-200 hover:border-primary-500 shadow-lg'
            } p-6 rounded-xl transition-all duration-300`}
          >
            <div className={`${
              darkMode ? 'bg-primary-500/20' : 'bg-primary-100'
            } w-14 h-14 rounded-lg flex items-center justify-center mb-5`}>
              <FaHeadset className="text-primary-500 text-2xl" />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>24/7 Support</h3>
            <p className={
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }>
              Our dedicated team is always available to assist you with any questions or concerns.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section 
        ref={statsRef}
        className={`py-20 px-4 ${
          darkMode ? 'bg-gray-900/80' : 'bg-gray-50'
        } relative overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            style={{ opacity, y }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Trusted Worldwide
            </h2>
            <p className={`max-w-3xl mx-auto ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Join thousands of satisfied clients who trust Fidelity First Brokers with their financial future. Our proven track record speaks for itself.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center p-6 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
                    : 'bg-white shadow-lg border border-gray-100'
                }`}
              >
                <h3 className={`text-4xl font-bold mb-2 ${
                  darkMode ? 'text-primary-500' : 'text-primary-600'
                }`}>
                  {stat.prefix || ''}{stat.value}{stat.suffix}
                </h3>
                <p className={
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      
      <section className={`py-16 px-4 ${
        darkMode ? 'bg-gray-900/95' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>
              Trusted by Leading Companies
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {partners.map((logo, index) => (
              <div 
                key={index}
                className={`grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 ${
                  logo ? 'w-28 md:w-32' : 'w-24 h-12 bg-gray-300/10 rounded'
                }`}
              >
                {logo ? (
                  <img 
                    src={logo} 
                    alt={`Partner logo ${index+1}`} 
                    className="max-w-full h-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className={`py-24 px-4 ${
        darkMode ? 'bg-gradient-to-br from-primary-900/80 to-gray-900' : 'bg-gradient-to-br from-primary-100 to-blue-50'
      } relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill={darkMode ? '#FFFFFF' : '#3B82F6'} d="M47.5,-61.7C59.9,-51.5,67.3,-35.1,71.2,-18.1C75.2,-1.1,75.7,16.5,68.3,29.8C60.9,43.1,45.6,52.2,30,58.1C14.3,64.1,-1.9,66.9,-19.7,64.5C-37.5,62.1,-56.9,54.5,-66.4,40.3C-75.9,26.2,-75.4,5.5,-70.8,-13.2C-66.1,-31.9,-57.3,-48.7,-44.1,-58.8C-30.8,-68.9,-13.1,-72.3,2.9,-75.9C18.9,-79.5,35.1,-71.9,47.5,-61.7Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Start Your Investment Journey?
          </h2>
          
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Join thousands of investors who trust Fidelity First Brokers with their financial goals. Start investing today and secure your future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center justify-center text-lg"
            >
              Create Free Account <FaArrowRight className="ml-2" />
            </Link>
            
            <Link
              to="/contact"
              className={`${
                darkMode
                  ? 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white' 
                  : 'bg-white hover:bg-gray-100 text-primary-700 border border-primary-100 shadow-md'
              } font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center justify-center text-lg`}
            >
              <FaHeadset className="mr-2" /> Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
