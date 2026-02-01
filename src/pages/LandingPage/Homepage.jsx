import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChartLine,
  FaLock,
  FaHeadset,
  FaGlobeAmericas,
  FaShieldAlt,
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteRight,
  FaPlay,
  FaStar,
  FaRocket,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 15 + Math.random() * 10,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Animated Counter Component with better animation
const AnimatedCounter = ({ value, suffix = "", prefix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const end = parseInt(value);
          const duration = 2500;
          const startTime = performance.now();

          const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.floor(easedProgress * end);
            
            setDisplayValue(currentValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="count-up-glow">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const { darkMode } = useDarkMode();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const stats = [
    { value: 25, suffix: "k+", label: "Active Investors" },
    { value: 150, suffix: "M+", prefix: "$", label: "Assets Managed" },
    { value: 12, suffix: "+", label: "Years Experience" },
    { value: 97, suffix: "%", label: "Client Satisfaction" },
  ];

  const partners = [
    "/images/partner-1.png",
    "/images/partner-2.png",
    "/images/partner-3.png",
    "/images/partner-4.png",
    "/images/partner-5.png",
    "/images/partner-6.png",
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Investment Professional",
      image: "/images/testimonial-1.jpg",
      text: "Fidelity First Brokers transformed my investment strategy. Their platform is intuitive and the returns have exceeded my expectations.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      image: "/images/testimonial-2.jpg",
      text: "The level of support and expertise I've received has been exceptional. My portfolio has grown significantly since joining.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Financial Analyst",
      image: "/images/testimonial-3.jpg",
      text: "As a financial professional, I appreciate the transparency and advanced tools. This platform sets the standard for modern investing.",
      rating: 5,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".hero-buttons",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.6,
          ease: "power3.out",
        }
      );

      // Features animation on scroll
      gsap.utils.toArray(".feature-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Stats counter animation
      gsap.utils.toArray(".stat-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.8, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "back.out(1.7)",
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

  // Mouse tracking for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen relative overflow-hidden ${
        darkMode
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-b from-blue-50 via-white to-blue-50"
      }`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid Pattern */}
        <div className="grid-background opacity-50" />

        {/* Floating Orbs */}
        <motion.div
          className="floating-orb floating-orb-1"
          style={{ y: backgroundY }}
        />
        <motion.div
          className="floating-orb floating-orb-2"
          style={{ y: backgroundY }}
        />
        <motion.div
          className="floating-orb floating-orb-3"
          style={{ y: backgroundY }}
        />

        {/* Particles */}
        <FloatingParticles />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`pt-24 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl relative z-10 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 ${
                darkMode
                  ? "bg-primary-900/50 text-primary-400 border border-primary-700/50"
                  : "bg-primary-50 text-primary-700 border border-primary-200"
              } shimmer`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Trusted by 25,000+ investors worldwide
            </motion.div>

            {/* Title */}
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Unleash Your{" "}
              <span className="relative inline-block">
                <span className="gradient-text-animated">Financial</span>
              </span>
              <br />
              <span className="relative inline-block mt-2">
                <span className="gradient-text-animated">Potential</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M0,6 Q50,0 100,6 T200,6"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`hero-subtitle text-lg md:text-xl mb-10 max-w-xl mx-auto md:mx-0 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Experience secure investing, transparent trading, and competitive
              returns with Fidelity First Brokers. Your journey to financial
              freedom starts here.
            </p>

            {/* CTA Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <MagneticButton>
                <Link
                  to="/signup"
                  className="btn-fire-glow text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2 text-lg transition-all duration-300 hover:scale-105"
                >
                  <FaRocket className="text-lg" />
                  Start Investing Now
                  <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  to="/about"
                  className={`font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2 text-lg transition-all duration-300 ${
                    darkMode
                      ? "glass-card-dark hover:bg-white/10 text-white border border-gray-600/50"
                      : "glass-card hover:bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                >
                  <FaPlay className="text-sm" />
                  Watch Demo
                </Link>
              </MagneticButton>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-6 justify-center md:justify-start">
              {[
                { icon: FaShieldAlt, text: "Bank-Level Security" },
                { icon: FaGlobeAmericas, text: "Global Access" },
                { icon: FaHeadset, text: "24/7 Support" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`flex items-center gap-2 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <item.icon className="text-primary-500" />
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden md:block perspective-1000"
          >
            <div className="relative">
              {/* Main Card */}
              <div
                className={`relative rounded-3xl overflow-hidden ${
                  darkMode ? "glass-card-dark" : "glass-card"
                } p-2`}
              >
                <div className="gradient-border-animated rounded-2xl overflow-hidden">
                  <img
                    src="/images/pexels-rdne-stock-project-8369687.jpg"
                    alt="Investment Platform"
                    className="w-full rounded-2xl"
                  />
                </div>
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                className={`absolute -top-6 -right-6 p-4 rounded-2xl ${
                  darkMode ? "glass-card-dark" : "glass-card"
                } card-glow`}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="text-green-500 font-bold text-2xl price-glow">
                  +12.5%
                </div>
                <div
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Portfolio Growth
                </div>
                <div className="mt-2 h-8 flex items-end gap-1">
                  {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-green-500/60 rounded-full"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                className={`absolute -bottom-6 -left-6 p-4 rounded-2xl ${
                  darkMode ? "glass-card-dark" : "glass-card"
                } card-glow`}
                animate={{ y: [0, 15, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="text-primary-500 font-bold text-2xl price-glow">
                  $24,680
                </div>
                <div
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Investment Value
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full border-2 ${
                          darkMode ? "border-gray-800 bg-gray-600" : "border-white bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    +2.5k investors
                  </span>
                </div>
              </motion.div>

              {/* Notification Popup */}
              <motion.div
                className={`absolute top-1/2 -right-4 p-3 rounded-xl ${
                  darkMode ? "bg-gray-800/90" : "bg-white/90"
                } backdrop-blur-lg shadow-xl border ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FaChartLine className="text-green-500" />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Trade Executed
                    </div>
                    <div
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      BTC +$1,234.56
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-20 px-4 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaChartLine,
                title: "High Returns",
                description:
                  "Our investment plans are designed to maximize your returns while managing risk effectively.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: FaLock,
                title: "Secure Platform",
                description:
                  "Advanced encryption and security measures to keep your investments and data protected.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: FaHeadset,
                title: "24/7 Support",
                description:
                  "Our dedicated team is always available to assist you with any questions or concerns.",
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`feature-card p-8 rounded-2xl transition-all duration-500 hover-lift ${
                  darkMode
                    ? "glass-card-dark hover:border-primary-500/50"
                    : "glass-card hover:border-primary-500/50"
                } feature-card-animated`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 icon-glow-hover`}
                >
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3
                  className={`text-xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


        <section
          ref={statsRef}
          className={`py-24 px-4 relative overflow-hidden ${
            darkMode ? "bg-gray-900/50" : "bg-gray-50/50"
          }`}
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
            >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Trusted{" "}
            <span className="gradient-text-animated">Worldwide</span>
          </h2>
          <p
            className={`max-w-3xl mx-auto text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Join thousands of satisfied clients who trust Fidelity First
            Brokers with their financial future.
          </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`stat-card text-center p-8 rounded-2xl transition-all duration-500 hover-lift ${
            darkMode ? "glass-card-dark" : "glass-card"
              }`}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: "backOut" }}
            >
              <div className="mb-3">
            <motion.h3
              className={`text-4xl md:text-5xl font-bold leading-none relative inline-block z-10`}
              initial={{ scale: 0.98, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 14, duration: 0.6, delay: index * 0.12 }}
              style={{
                color: darkMode ? "#fff" : undefined,
                textShadow: darkMode
              ? "0 6px 18px rgba(99,102,241,0.08), 0 2px 6px rgba(0,0,0,0.6)"
              : "0 6px 18px rgba(59,130,246,0.08)",
              }}
            >
              {/* Shimmer overlay for dark mode to improve readability */}
              <div className="relative inline-block">
                {darkMode && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded"
                style={{
                  background:
                "linear-gradient(120deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01), rgba(255,255,255,0.04))",
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              />
                )}

                <motion.span
              className="inline-block z-20"
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 140, damping: 12, duration: 0.6, delay: index * 0.14 }}
                >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix || ""}
              />
                </motion.span>
              </div>
            </motion.h3>
              </div>

              <p
            className={`text-sm md:text-base ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
              >
            {stat.label}
              </p>
            </motion.div>
          ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
      <section
        className={`py-24 px-4 relative ${
          darkMode ? "bg-gradient-to-b from-gray-900 to-gray-950" : "bg-white"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              What Our{" "}
              <span className="gradient-text-animated">Clients Say</span>
            </h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className={`p-8 md:p-12 rounded-3xl ${
                  darkMode ? "glass-card-dark" : "glass-card"
                } text-center`}
              >
                <FaQuoteRight
                  className={`text-5xl mb-6 mx-auto ${
                    darkMode ? "text-primary-500/30" : "text-primary-200"
                  }`}
                />
                <p
                  className={`text-xl md:text-2xl mb-8 leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map(
                    (_, i) => (
                      <FaStar key={i} className="text-yellow-500 text-xl" />
                    )
                  )}
                </div>
                <div
                  className={`font-bold text-lg ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {testimonials[activeTestimonial].name}
                </div>
                <div
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {testimonials[activeTestimonial].role}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className={`p-3 rounded-full transition-all ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <FaChevronLeft />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeTestimonial
                        ? "bg-primary-500 w-8"
                        : darkMode
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className={`p-3 rounded-full transition-all ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - Scrolling Marquee */}
      <section
        className={`py-20 px-4 relative overflow-hidden ${darkMode ? "bg-gray-900/80" : "bg-gray-50"}`}
        style={{ "--marquee-bg": darkMode ? "#111827" : "#f9fafb" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Trusted by Leading Companies
            </h2>
          </motion.div>

          {/* Scrolling Marquee Container */}
          <div className="marquee-container">
            <div className="marquee-content">
              {/* First set of logos */}
              {[...partners, ...partners].map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-8 md:mx-12"
                >
                  <div className="company-logo w-24 md:w-32 h-16 flex items-center justify-center">
                    {logo ? (
                      <img
                        src={logo}
                        alt={`Partner ${(index % partners.length) + 1}`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className={`text-lg font-bold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Partner {(index % partners.length) + 1}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second row scrolling in opposite direction */}
          <div className="marquee-container marquee-reverse mt-8">
            <div className="marquee-content">
              {[...partners, ...partners].reverse().map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-8 md:mx-12"
                >
                  <div className="company-logo w-24 md:w-32 h-16 flex items-center justify-center">
                    {logo ? (
                      <img
                        src={logo}
                        alt={`Partner ${(index % partners.length) + 1}`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className={`text-lg font-bold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Partner {(index % partners.length) + 1}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-32 px-4 relative overflow-hidden ${
          darkMode
            ? "bg-gradient-to-br from-primary-900/50 via-gray-900 to-gray-950"
            : "bg-gradient-to-br from-primary-100 via-blue-50 to-white"
        }`}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className={`text-4xl md:text-6xl font-bold mb-8 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Ready to Start Your{" "}
              <span className="gradient-text-animated">Investment Journey?</span>
            </h2>

            <p
              className={`text-xl mb-12 max-w-2xl mx-auto ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join thousands of investors who trust Fidelity First Brokers with
              their financial goals. Start investing today and secure your future.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton>
                <Link
                  to="/signup"
                  className="btn-primary-glow text-white font-semibold py-5 px-10 rounded-full flex items-center justify-center gap-3 text-lg"
                >
                  <FaRocket />
                  Create Free Account
                  <FaArrowRight />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  to="/contact"
                  className={`font-semibold py-5 px-10 rounded-full flex items-center justify-center gap-3 text-lg transition-all ${
                    darkMode
                      ? "glass-card-dark text-white hover:bg-white/10"
                      : "glass-card text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FaHeadset />
                  Talk to an Advisor
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
