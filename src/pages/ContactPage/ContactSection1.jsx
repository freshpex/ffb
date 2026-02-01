import { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";
import { gsap } from "gsap";
import "../../css/animations.css";

// Animated particles for background
const FloatingParticle = ({ delay, size, startX }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      background: `linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(168, 85, 247, 0.6))`,
      left: startX,
      bottom: 0,
    }}
    animate={{
      y: [0, -500],
      x: [0, Math.random() * 100 - 50],
      opacity: [0, 0.8, 0],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 6 + Math.random() * 4,
      delay: delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const ContactSection1 = () => {
  const { darkMode } = useDarkMode();
  const heroRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".animate-item"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className={`py-28 px-4 relative overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      } flex items-center min-h-[60vh]`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.4}
            size={`${6 + Math.random() * 10}px`}
            startX={`${Math.random() * 100}%`}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      
      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div ref={heroRef} className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="animate-item">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                darkMode 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                  : "bg-blue-100 text-blue-600"
              }`}>
                Contact Us
              </span>
            </div>
            
            <h1 className="animate-item text-4xl md:text-6xl font-bold mb-6">
              <span className={darkMode ? "text-white" : "text-gray-900"}>
                Get in{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            
            <p className={`animate-item text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              We're here to help with any questions you might have about our
              services, platform, or investment opportunities.
            </p>
            
            <div className="animate-item flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full overflow-hidden text-white font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Contact Us</span>
              </motion.a>
              
              <motion.a
                href="#faq"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full transition-all duration-300 font-semibold inline-flex items-center justify-center ${
                  darkMode
                    ? "bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-600 hover:border-purple-500"
                    : "bg-white/80 hover:bg-gray-100 text-gray-800 border border-gray-200 hover:border-purple-500 shadow-lg"
                }`}
              >
                View FAQs
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={
              inView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.8, rotateY: -15 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Decorative elements around image */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl opacity-60" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-purple-500 rounded-br-2xl opacity-60" />
            
            {/* Image with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30" />
              <img
                src="/src/assets/images/meric-dagli-XR5Fudiw1Z4-unsplash.jpg"
                alt="Customer Support"
                className="relative max-w-full mx-auto rounded-2xl shadow-2xl"
                style={{ maxHeight: "450px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400?text=Contact+Us";
                }}
              />
            </div>
            
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -bottom-6 -left-6 px-6 py-3 rounded-xl ${
                darkMode ? "bg-gray-800 border border-gray-700" : "bg-white shadow-xl"
              }`}
            >
              <p className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                24/7 Support Available
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection1;
