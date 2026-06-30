import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaGlobeAmericas,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../css/animations.css";

gsap.registerPlugin(ScrollTrigger);

// Floating particles component
const FloatingParticle = ({ delay, size, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: color,
      filter: "blur(1px)",
    }}
    initial={{ opacity: 0, y: 100, x: Math.random() * 200 - 100 }}
    animate={{
      opacity: [0, 0.6, 0],
      y: [100, -100],
      x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      delay: delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const AboutSection2 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const cardsRef = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".value-card");
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, rotateX: 15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
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

  const values = [
    {
      id: 1,
      title: "Client-Centric Approach",
      description:
        "We prioritize our clients' needs and goals, ensuring personalized solutions and exceptional service.",
      icon: <FaUsers />,
      gradient: "from-blue-500 to-cyan-400",
      glowColor: "rgba(59, 130, 246, 0.5)",
    },
    {
      id: 2,
      title: "Integrity & Transparency",
      description:
        "We operate with the highest ethical standards, ensuring complete transparency in all our dealings.",
      icon: <FaShieldAlt />,
      gradient: "from-green-500 to-emerald-400",
      glowColor: "rgba(34, 197, 94, 0.5)",
    },
    {
      id: 3,
      title: "Innovation & Excellence",
      description:
        "We continuously innovate and improve our services to deliver exceptional investment solutions.",
      icon: <FaChartLine />,
      gradient: "from-purple-500 to-pink-400",
      glowColor: "rgba(168, 85, 247, 0.5)",
    },
    {
      id: 4,
      title: "Global Perspective",
      description:
        "We leverage our global network and expertise to identify the best investment opportunities worldwide.",
      icon: <FaGlobeAmericas />,
      gradient: "from-orange-500 to-red-400",
      glowColor: "rgba(249, 115, 22, 0.5)",
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-20 px-4 relative overflow-hidden ${darkMode ? "bg-gray-900/80" : "bg-gray-100"}`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            size={`${4 + Math.random() * 6}px`}
            color={darkMode ? "rgba(147, 51, 234, 0.4)" : "rgba(79, 70, 229, 0.3)"}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-block mb-4"
          >
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              darkMode 
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                : "bg-purple-100 text-purple-600"
            }`}>
              Our Core Values
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-3xl md:text-5xl font-bold mb-6`}
          >
            <span className={darkMode ? "text-white" : "text-gray-900"}>Our Values & </span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Mission
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg mb-6`}>
              At Fidelity First Brokers, we are guided by our commitment to
              excellence, integrity, and client success. Our mission is to
              empower individuals and organizations to achieve their financial
              aspirations.
            </p>
          </motion.div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              className="value-card group"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className={`relative p-8 rounded-2xl overflow-hidden transition-all duration-500 ${
                  darkMode
                    ? "bg-gray-800/70 backdrop-blur-xl border border-gray-700/50"
                    : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl"
                }`}
                style={{
                  boxShadow: `0 0 0 1px transparent, 0 20px 50px -15px ${value.glowColor}`,
                }}
              >
                {/* Gradient border on hover */}
                <div 
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: `linear-gradient(135deg, ${value.glowColor}, transparent, ${value.glowColor})`,
                    padding: "1px",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                  }}
                />
                
                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  {/* Glow effect behind icon */}
                  <div 
                    className="absolute inset-0 w-16 h-16 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${value.glowColor}, transparent)` }}
                  />
                </div>
                
                <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${value.gradient} group-hover:bg-clip-text transition-all duration-300`}>
                  {value.title}
                </h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
                  {value.description}
                </p>
                
                {/* Animated corner accent */}
                <div className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-40 group-hover:scale-150 transition-all duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection2;
