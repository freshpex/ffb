import { useRef, useEffect } from "react";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../css/animations.css";

gsap.registerPlugin(ScrollTrigger);

// Glowing orb background component
const GlowingOrb = ({ color, size, position, delay }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{
      width: size,
      height: size,
      background: color,
      ...position,
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 4,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const ServiceSection2 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const cardsRef = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".advantage-card");
      
      gsap.fromTo(
        cards,
        { 
          y: 60, 
          opacity: 0,
          rotateY: -15,
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const advantages = [
    {
      id: 1,
      title: "Advanced Trading Platform",
      description:
        "Our intuitive and powerful trading platform provides real-time data, advanced charting tools, and seamless execution.",
      icon: <FaLaptop />,
      gradient: "from-blue-500 to-cyan-400",
      glowColor: "rgba(59, 130, 246, 0.4)",
    },
    {
      id: 2,
      title: "Expert Financial Advisors",
      description:
        "Our team of experienced financial advisors provides personalized guidance tailored to your investment goals.",
      icon: <FaUserTie />,
      gradient: "from-purple-500 to-pink-400",
      glowColor: "rgba(168, 85, 247, 0.4)",
    },
    {
      id: 3,
      title: "Market Intelligence",
      description:
        "Access proprietary research, market insights, and analysis to help you make informed investment decisions.",
      icon: <FaChartLine />,
      gradient: "from-green-500 to-emerald-400",
      glowColor: "rgba(34, 197, 94, 0.4)",
    },
    {
      id: 4,
      title: "Secure Investments",
      description:
        "Your investments are protected by industry-leading security measures and regulatory compliance standards.",
      icon: <FaShieldAlt />,
      gradient: "from-red-500 to-orange-400",
      glowColor: "rgba(239, 68, 68, 0.4)",
    },
    {
      id: 5,
      title: "24/7 Customer Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions or concerns.",
      icon: <FaHeadset />,
      gradient: "from-yellow-500 to-amber-400",
      glowColor: "rgba(234, 179, 8, 0.4)",
    },
    {
      id: 6,
      title: "Global Market Access",
      description:
        "Trade in markets worldwide with our comprehensive platform covering stocks, forex, cryptocurrencies, and more.",
      icon: <FaGlobe />,
      gradient: "from-indigo-500 to-violet-400",
      glowColor: "rgba(99, 102, 241, 0.4)",
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-20 px-4 relative overflow-hidden ${darkMode ? "bg-gradient-to-b from-gray-800 to-gray-900" : "bg-gradient-to-b from-gray-100 to-white"}`}
    >
      {/* Animated background orbs */}
      <GlowingOrb 
        color={darkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)"} 
        size="400px" 
        position={{ top: "10%", left: "-10%" }} 
        delay={0} 
      />
      <GlowingOrb 
        color={darkMode ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.1)"} 
        size="300px" 
        position={{ bottom: "20%", right: "-5%" }} 
        delay={2} 
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              darkMode 
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                : "bg-cyan-100 text-cyan-600"
            }`}>
              Why Choose Us
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-3xl md:text-5xl font-bold mb-4`}
          >
            <span className={darkMode ? "text-white" : "text-gray-900"}>Why Choose </span>
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Our Services
            </span>
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

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.id}
              className="advantage-card group"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className={`relative h-full p-6 rounded-2xl overflow-hidden transition-all duration-500 ${
                  darkMode
                    ? "bg-gray-800/60 backdrop-blur-xl border border-gray-700/50"
                    : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl"
                }`}
                style={{
                  boxShadow: `0 15px 40px -10px ${advantage.glowColor}`,
                }}
              >
                {/* Hover gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${advantage.glowColor}, transparent)`,
                  }}
                />
                
                {/* Icon container with gradient and glow */}
                <div className="relative mb-5">
                  <div 
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${advantage.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <span className="text-white text-2xl">{advantage.icon}</span>
                  </div>
                  {/* Icon glow */}
                  <div 
                    className="absolute inset-0 w-14 h-14 rounded-xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                    style={{ background: advantage.glowColor }}
                  />
                </div>
                
                <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-3`}>
                  {advantage.title}
                </h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
                  {advantage.description}
                </p>
                
                {/* Bottom accent line */}
                <div 
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${advantage.gradient} w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section with electric border */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 relative"
        >
          <div className="electric-border rounded-2xl p-[2px]">
            <div
              className={`p-8 rounded-2xl text-center ${
                darkMode
                  ? "bg-gray-900"
                  : "bg-white"
              }`}
            >
              <h3 className={`text-2xl md:text-3xl font-bold mb-4`}>
                <span className={darkMode ? "text-white" : "text-gray-900"}>Ready to Start </span>
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Investing with Us?
                </span>
              </h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto mb-6`}>
                Join thousands of satisfied clients who trust Fidelity First Brokers
                for their investment needs. Open an account today and experience the
                difference.
              </p>
              <Link
                to="/signup"
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <span className="relative z-10">Open an Account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceSection2;
