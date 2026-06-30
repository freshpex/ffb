import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  FaChartLine,
  FaLightbulb,
  FaChartBar,
  FaHandshake,
  FaShieldAlt,
  FaUserTie,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Tilt Card Component
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    rotateX.set(mouseY * -0.05);
    rotateY.set(mouseX * 0.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const HomePageSection3 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: "Advanced Analytics",
      description:
        "Access real-time data analytics and market insights to make informed investment decisions.",
      icon: FaChartLine,
      gradient: "from-blue-500 to-cyan-500",
      shadowColor: "rgba(59, 130, 246, 0.4)",
      stats: { value: "99.9%", label: "Accuracy" },
    },
    {
      id: 2,
      title: "Expert Guidance",
      description:
        "Get personalized advice from our team of experienced financial advisors and market experts.",
      icon: FaLightbulb,
      gradient: "from-yellow-500 to-amber-500",
      shadowColor: "rgba(234, 179, 8, 0.4)",
      stats: { value: "150+", label: "Experts" },
    },
    {
      id: 3,
      title: "Portfolio Diversification",
      description:
        "Spread your investments across multiple assets to minimize risk and maximize returns.",
      icon: FaChartBar,
      gradient: "from-green-500 to-emerald-500",
      shadowColor: "rgba(34, 197, 94, 0.4)",
      stats: { value: "500+", label: "Assets" },
    },
    {
      id: 4,
      title: "Transparent Fees",
      description:
        "We believe in full transparency with no hidden fees or commissions on your investments.",
      icon: FaHandshake,
      gradient: "from-purple-500 to-violet-500",
      shadowColor: "rgba(139, 92, 246, 0.4)",
      stats: { value: "0%", label: "Hidden Fees" },
    },
    {
      id: 5,
      title: "Enhanced Security",
      description:
        "Advanced encryption and security protocols to keep your funds and personal data safe.",
      icon: FaShieldAlt,
      gradient: "from-red-500 to-rose-500",
      shadowColor: "rgba(239, 68, 68, 0.4)",
      stats: { value: "256-bit", label: "Encryption" },
    },
    {
      id: 6,
      title: "Dedicated Support",
      description:
        "Our customer service team is available 24/7 to assist you with any questions or concerns.",
      icon: FaUserTie,
      gradient: "from-indigo-500 to-blue-500",
      shadowColor: "rgba(99, 102, 241, 0.4)",
      stats: { value: "24/7", label: "Support" },
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".feature-box").forEach((box, i) => {
        gsap.fromTo(
          box,
          {
            opacity: 0,
            y: 80,
            scale: 0.9,
            rotateY: -10,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: box,
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
      className={`py-24 px-4 relative overflow-hidden ${
        darkMode
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-b from-white via-gray-50 to-white"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="grid-background opacity-20" />

        {/* Animated gradient blobs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                darkMode
                  ? "bg-purple-900/50 text-purple-400 border border-purple-700/50"
                  : "bg-purple-50 text-purple-700 border border-purple-200"
              }`}
            >
              ✨ Why Choose Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why Choose{" "}
            <span className="gradient-text-animated">Fidelity First</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-3xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            We combine cutting-edge technology with financial expertise to
            deliver an exceptional investment experience.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <TiltCard
              key={feature.id}
              className={`feature-box relative rounded-2xl overflow-hidden transition-all duration-500 hover-lift ${
                darkMode ? "glass-card-dark" : "glass-card"
              }`}
            >
              <div
                className="p-8 relative z-10"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Hover Glow Effect */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${feature.shadowColor} 0%, transparent 70%)`,
                    opacity: hoveredFeature === feature.id ? 0.3 : 0,
                  }}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    style={{
                      boxShadow:
                        hoveredFeature === feature.id
                          ? `0 20px 40px ${feature.shadowColor}`
                          : "none",
                    }}
                  >
                    <feature.icon className="text-white text-2xl" />
                  </motion.div>

                  {/* Stats Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      hoveredFeature === feature.id
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${
                      darkMode
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "bg-white text-gray-900 border border-gray-200 shadow-lg"
                    }`}
                  >
                    {feature.stats.value}
                  </motion.div>
                </div>

                {/* Content */}
                <h3
                  className={`text-xl font-bold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>

                {/* Bottom Stats */}
                <div
                  className={`mt-6 pt-6 border-t ${
                    darkMode ? "border-gray-700/50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs uppercase tracking-wider ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {feature.stats.label}
                    </span>
                    <span
                      className={`text-lg font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                    >
                      {feature.stats.value}
                    </span>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 opacity-10 bg-gradient-to-br ${feature.gradient}`}
                  style={{
                    clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                  }}
                />
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`mt-20 p-8 md:p-12 rounded-3xl text-center relative overflow-hidden ${
            darkMode
              ? "bg-gradient-to-r from-gray-800/50 via-gray-900/50 to-gray-800/50 border border-gray-700/50"
              : "bg-gradient-to-r from-gray-100 via-white to-gray-100 border border-gray-200"
          }`}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h3
              className={`text-2xl md:text-3xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Ready to Experience the{" "}
              <span className="gradient-text-animated">Difference?</span>
            </h3>
            <p
              className={`text-lg mb-8 max-w-2xl mx-auto ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Join thousands of satisfied investors and start your journey to
              financial freedom today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary-glow text-white font-semibold py-4 px-10 rounded-full text-lg"
            >
              Get Started Now →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePageSection3;
