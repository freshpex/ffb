import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaChartPie,
  FaRegClock,
  FaArrowRight,
  FaFire,
  FaBolt,
  FaRocket,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
          const startTime = performance.now();
          const duration = 2500;

          const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.floor(easedProgress * numericValue);
            
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
    <span ref={ref} className="count-up-glow tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Fire Border Investment Card
const FireBorderInvestmentCard = ({ children, isFeatured, darkMode, shadowColor }) => {
  return (
    <div className="relative group h-full">
      {/* Fire Glow Layers for Featured */}
      {isFeatured && (
        <>
          {/* Outer intense glow */}
          <div
            className="absolute -inset-2 rounded-3xl opacity-60 blur-xl transition-all duration-500 group-hover:opacity-90 group-hover:blur-2xl"
            style={{
              background: `linear-gradient(45deg, #ff0000, #ff4500, #ff8c00, #ffa500, #ffcc00, #ffa500, #ff8c00, #ff4500, #ff0000)`,
              backgroundSize: "300% 300%",
              animation: "fireGlow 3s ease infinite",
            }}
          />
          {/* Rotating conic gradient border */}
          <div
            className="absolute -inset-1 rounded-3xl opacity-90"
            style={{
              background: `conic-gradient(from 0deg, #ff0000, #ff4500, #ff8c00, #ffa500, #ffcc00, #ffa500, #ff8c00, #ff4500, #ff0000)`,
              animation: "spin 4s linear infinite",
            }}
          />
          {/* Ember particles */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: "0",
                  background: "#ffcc00",
                  boxShadow: "0 0 6px #ff8c00, 0 0 12px #ff4500",
                  animation: `emberFloat ${1.5 + Math.random()}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Non-featured card border with gradient */}
      {!isFeatured && (
        <div
          className="absolute -inset-px rounded-3xl opacity-40 transition-opacity duration-300 group-hover:opacity-70"
          style={{
            background: `linear-gradient(135deg, ${shadowColor || "rgba(59, 130, 246, 0.5)"}, ${shadowColor || "rgba(139, 92, 246, 0.5)"})`,
          }}
        />
      )}
      
      {/* Card content container */}
      <div
        className={`relative rounded-3xl overflow-hidden h-full ${
          darkMode
            ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-white via-white to-gray-50"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const HomePageSection2 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const investmentOptions = [
    {
      id: 1,
      title: "Starter Plan",
      minInvestment: "500",
      return: "5-8%",
      duration: "7 days",
      icon: FaMoneyBillWave,
      gradient: "from-blue-600 to-cyan-500",
      shadowColor: "rgba(59, 130, 246, 0.4)",
      badge: null,
      featured: false,
      features: ["Basic analytics", "Email support", "Daily reports"],
    },
    {
      id: 2,
      title: "Premium Plan",
      minInvestment: "5,000",
      return: "10-15%",
      duration: "30 days",
      icon: FaChartLine,
      gradient: "from-orange-500 to-amber-400",
      shadowColor: "rgba(249, 115, 22, 0.5)",
      featured: true,
      badge: "🔥 Most Popular",
      features: [
        "Advanced analytics",
        "Priority support",
        "Real-time alerts",
        "Personal advisor",
      ],
    },
    {
      id: 3,
      title: "Expert Plan",
      minInvestment: "25,000",
      return: "18-25%",
      duration: "90 days",
      icon: FaChartPie,
      gradient: "from-purple-600 to-pink-500",
      shadowColor: "rgba(139, 92, 246, 0.4)",
      badge: "⭐ Premium",
      featured: false,
      features: [
        "AI-powered insights",
        "24/7 dedicated support",
        "Custom strategies",
        "VIP access",
      ],
    },
  ];

  const stats = [
    { value: "150", prefix: "$", suffix: "M+", label: "Total Invested", icon: "💰" },
    { value: "25", prefix: "", suffix: "K+", label: "Active Investors", icon: "👥" },
    { value: "15", prefix: "", suffix: "%", label: "Avg. Returns", icon: "📈" },
    { value: "99", prefix: "", suffix: ".9%", label: "Uptime", icon: "⚡" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".investment-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            rotateX: -20,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className={`py-24 px-4 relative overflow-hidden ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900"
          : "bg-gradient-to-b from-gray-100 via-white to-gray-100"
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="grid-background opacity-20" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                darkMode
                  ? "bg-green-900/50 text-green-400 border border-green-700/50"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              <FaBolt className="text-yellow-500" />
              High-Yield Investment Plans
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
            Investment Plans for{" "}
            <span className="gradient-text-animated">Every Investor</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-3xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Choose from our diverse range of investment options designed to meet
            your financial goals and risk tolerance.
          </motion.p>
        </div>

        {/* Investment Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {investmentOptions.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`investment-card transition-all duration-500 ${
                plan.featured
                  ? "md:scale-105 md:-my-4 z-10"
                  : "hover:scale-[1.02]"
              }`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{ perspective: "1000px" }}
            >
              <FireBorderInvestmentCard 
                isFeatured={plan.featured} 
                darkMode={darkMode}
                shadowColor={plan.shadowColor}
              >
                <div className="p-8 h-full flex flex-col">
                  {/* Badge */}
                  {plan.badge && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div
                        className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${
                          plan.featured ? "" : "bg-purple-600"
                        }`}
                        style={plan.featured ? {
                          background: "linear-gradient(135deg, #f97316, #fbbf24)",
                          boxShadow: "0 0 20px rgba(249, 115, 22, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)",
                          animation: "badgePulse 2s ease-in-out infinite",
                        } : {}}
                      >
                        {plan.badge}
                      </div>
                    </motion.div>
                  )}

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center transition-all duration-300 ${
                        hoveredPlan === plan.id ? "scale-110" : ""
                      }`}
                      style={{
                        boxShadow: hoveredPlan === plan.id
                          ? `0 20px 40px ${plan.shadowColor}`
                          : "none",
                      }}
                    >
                      <plan.icon className="text-white text-3xl" />
                    </div>
                    {plan.featured && (
                      <div className="absolute -top-2 -right-2">
                        <FaFire className="text-orange-500 text-2xl animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-2xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.title}
                  </h3>

                  {/* Stats Grid */}
                  <div
                    className={`grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl ${
                      darkMode ? "bg-gray-800/50" : "bg-gray-100/80"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-xs uppercase tracking-wider mb-1 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Min Investment
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${plan.minInvestment}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs uppercase tracking-wider mb-1 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Expected Return
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          plan.featured ? "text-orange-500" : "text-green-500"
                        }`}
                        style={{
                          textShadow: plan.featured 
                            ? "0 0 20px rgba(249, 115, 22, 0.5)"
                            : "none"
                        }}
                      >
                        {plan.return}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div
                    className={`flex items-center gap-2 mb-6 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <FaRegClock className="text-primary-500" />
                    <span>Duration: {plan.duration}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className={`flex items-center gap-2 text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to="/signup"
                    className={`block w-full py-4 rounded-xl text-center font-bold text-lg transition-all duration-300 group ${
                      plan.featured
                        ? "text-white hover:scale-105"
                        : darkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
                    }`}
                    style={plan.featured ? {
                      background: "linear-gradient(135deg, #ff4500, #ff8c00, #ffa500)",
                      boxShadow: "0 0 20px rgba(255, 69, 0, 0.4), 0 0 40px rgba(255, 140, 0, 0.2)"
                    } : {}}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FaRocket
                        className={`transition-transform group-hover:-translate-y-1 ${
                          plan.featured ? "" : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                      Start Investing
                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </FireBorderInvestmentCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats with Animated Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                darkMode ? "glass-card-dark" : "glass-card"
              }`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div
                className={`text-2xl md:text-3xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <AnimatedCounter 
                  value={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                />
              </div>
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes emberFloat {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) translateX(20px) scale(0);
            opacity: 0;
          }
        }
        @keyframes badgePulse {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
          }
          50% { 
            box-shadow: 0 0 25px rgba(249, 115, 22, 0.8), 0 0 50px rgba(251, 191, 36, 0.5);
          }
        }
      `}</style>
    </section>
  );
};

export default HomePageSection2;
