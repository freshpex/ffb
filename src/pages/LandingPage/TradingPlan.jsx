import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaArrowRight,
  FaTimes,
  FaCrown,
  FaRocket,
  FaStar,
  FaBolt,
  FaGem,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Fire Ember Particle Component
const FireEmber = ({ delay }) => (
  <div
    className="absolute w-1 h-1 rounded-full"
    style={{
      left: `${Math.random() * 100}%`,
      bottom: "0",
      background: "#ffcc00",
      boxShadow: "0 0 6px #ff8c00, 0 0 12px #ff4500",
      animation: `emberFloat ${1.5 + Math.random()}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

// Fire Border Card Component
const FireBorderCard = ({ children, isPopular, darkMode }) => {
  return (
    <div className="relative group">
      {/* Fire Glow Layers for Popular */}
      {isPopular && (
        <>
          {/* Outer intense glow */}
          <div
            className="absolute -inset-2 rounded-3xl opacity-75 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl"
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
          {/* Fire shimmer overlay */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
            style={{
              background: `linear-gradient(45deg, transparent 40%, rgba(255, 200, 100, 0.3) 50%, transparent 60%)`,
              backgroundSize: "200% 200%",
              animation: "shimmerMove 2s ease-in-out infinite",
            }}
          />
          {/* Ember particles */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <FireEmber key={i} delay={i * 0.3} />
            ))}
          </div>
        </>
      )}
      
      {/* Non-popular card border */}
      {!isPopular && (
        <div
          className="absolute -inset-px rounded-3xl opacity-50 transition-opacity duration-300 group-hover:opacity-80"
          style={{
            background: darkMode 
              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5))"
              : "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))",
          }}
        />
      )}
      
      {/* Card content container */}
      <div
        className={`relative rounded-3xl overflow-hidden ${
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

const TradingPlan = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      id: "basic",
      name: "Basic",
      description: "Perfect for beginners looking to start their investment journey",
      monthlyPrice: 0,
      yearlyPrice: 0,
      period: "Free forever",
      icon: FaRocket,
      iconBg: "from-blue-500 to-cyan-500",
      features: [
        { text: "Basic market analysis tools", included: true },
        { text: "Standard trading platform", included: true },
        { text: "Email support", included: true },
        { text: "Market news & updates", included: true },
        { text: "Up to 5 simultaneous trades", included: true },
        { text: "Portfolio diversification", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Personal advisor", included: false },
      ],
      buttonText: "Get Started Free",
      popular: false,
    },
    {
      id: "standard",
      name: "Epic",
      description: "Ideal for active traders seeking enhanced tools and features",
      monthlyPrice: 99,
      yearlyPrice: 990,
      period: "/monthly",
      icon: FaCrown,
      iconBg: "from-orange-500 to-amber-500",
      features: [
        { text: "Advanced trading tools", included: true },
        { text: "Premium market analysis", included: true },
        { text: "Priority email & chat support", included: true },
        { text: "Real-time market alerts", included: true },
        { text: "Up to 20 simultaneous trades", included: true },
        { text: "Portfolio optimization tools", included: true },
        { text: "Trading signals", included: true },
        { text: "Unlimited Huly Objects", included: true },
        { text: "1TB Storage", included: true },
        { text: "500GB Video/Audio Traffic", included: true },
        { text: "AI — TBD", included: true },
      ],
      buttonText: "Start Free",
      popular: true,
    },
    {
      id: "premium",
      name: "Legendary",
      description: "Best for large multiple teams that need maximum capabilities",
      monthlyPrice: 399,
      yearlyPrice: 3990,
      period: "/monthly",
      icon: FaGem,
      iconBg: "from-purple-500 to-pink-500",
      features: [
        { text: "Full-suite professional tools", included: true },
        { text: "Expert market analysis", included: true },
        { text: "24/7 dedicated support", included: true },
        { text: "Personalized investment advisor", included: true },
        { text: "Unlimited simultaneous trades", included: true },
        { text: "Advanced risk management", included: true },
        { text: "Exclusive investment opportunities", included: true },
        { text: "Priority execution", included: true },
        { text: "Unlimited users", included: true },
        { text: "Unlimited Huly Objects", included: true },
        { text: "10TB Storage", included: true },
        { text: "2TB Video/Audio Traffic", included: true },
        { text: "AI — TBD", included: true },
      ],
      buttonText: "Start Free",
      popular: false,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".plan-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 100, rotateY: -15, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.2,
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
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-b from-gray-50 via-white to-gray-50"
      }`}
      ref={ref}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="grid-background opacity-30" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                darkMode
                  ? "bg-primary-900/50 text-primary-400 border border-primary-700/50"
                  : "bg-primary-50 text-primary-700 border border-primary-200"
              }`}
            >
              💎 Premium Plans
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Trading Plans &{" "}
            <span className="gradient-text-animated">Pricing</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Choose the right plan for your investment needs with our transparent
            pricing and feature-rich offerings.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly"
                  ? darkMode ? "text-white" : "text-gray-900"
                  : darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                animate={{ left: billingCycle === "monthly" ? "4px" : "36px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={`text-sm font-medium flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? darkMode ? "text-white" : "text-gray-900"
                  : darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`plan-card transition-all duration-500 ${
                plan.popular ? "lg:scale-105 lg:-my-4 z-10" : "hover:scale-[1.02]"
              }`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{ perspective: "1000px" }}
            >
              <FireBorderCard isPopular={plan.popular} darkMode={darkMode}>
                <div className="p-8 md:p-10">
                  {/* Popular Badge */}
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div 
                        className="px-6 py-2 rounded-full text-sm font-bold text-white flex items-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #f97316, #fbbf24)",
                          boxShadow: "0 0 20px rgba(249, 115, 22, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)",
                          animation: "badgePulse 2s ease-in-out infinite",
                        }}
                      >
                        <FaStar className="text-xs" />
                        MOST POPULAR
                        <FaStar className="text-xs" />
                      </div>
                    </motion.div>
                  )}

                  {/* Plan Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.iconBg} flex items-center justify-center mb-6 transition-all duration-300 ${
                      hoveredPlan === plan.id ? "scale-110" : ""
                    }`}
                    style={{
                      boxShadow: hoveredPlan === plan.id 
                        ? `0 0 30px ${plan.popular ? "rgba(249, 115, 22, 0.5)" : "rgba(59, 130, 246, 0.5)"}`
                        : "none"
                    }}
                  >
                    <plan.icon className="text-white text-2xl" />
                  </div>

                  {/* Plan Name */}
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm mb-6 h-12 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span
                        className={`text-5xl md:text-6xl font-bold transition-all duration-300 ${
                          plan.popular
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500"
                            : darkMode ? "text-white" : "text-gray-900"
                        }`}
                        style={{
                          textShadow: plan.popular 
                            ? "0 0 30px rgba(249, 115, 22, 0.5), 0 0 60px rgba(251, 191, 36, 0.3)"
                            : "none",
                          filter: plan.popular ? "drop-shadow(0 0 20px rgba(249, 115, 22, 0.5))" : "none"
                        }}
                      >
                        ${billingCycle === "monthly" ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12)}
                      </span>
                      <span
                        className={`text-lg mb-2 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {plan.monthlyPrice === 0 ? "" : plan.period}
                      </span>
                    </div>
                    {plan.monthlyPrice > 0 && billingCycle === "yearly" && (
                      <p className="text-sm text-green-500 mt-1">
                        Billed ${plan.yearlyPrice}/year
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/signup"
                    className={`block w-full py-4 rounded-xl text-center font-bold text-lg transition-all duration-300 mb-8 relative overflow-hidden ${
                      plan.popular
                        ? "text-white hover:scale-105"
                        : darkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
                    }`}
                    style={{
                      background: plan.popular 
                        ? "linear-gradient(135deg, #ff4500, #ff8c00, #ffa500)"
                        : undefined,
                      boxShadow: plan.popular
                        ? "0 0 20px rgba(255, 69, 0, 0.4), 0 0 40px rgba(255, 140, 0, 0.2)"
                        : undefined
                    }}
                  >
                    {plan.buttonText}
                    <FaArrowRight className="inline-block ml-2" />
                  </Link>

                  {/* Features List */}
                  <div className="space-y-4">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      What's included:
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          {feature.included ? (
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FaCheck className="text-green-500 text-xs" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FaTimes className="text-gray-500 text-xs" />
                            </div>
                          )}
                          <span
                            className={`text-sm ${
                              feature.included
                                ? darkMode ? "text-gray-300" : "text-gray-700"
                                : darkMode ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FireBorderCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className={`mt-16 text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <p className="flex flex-wrap items-center justify-center gap-2">
            <span>All plans include our core trading platform and educational resources.</span>
            <Link
              to="/pricing"
              className="text-primary-500 hover:text-primary-400 font-medium inline-flex items-center gap-1 group"
            >
              View full plan comparison
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-12 flex flex-wrap justify-center gap-8"
        >
          {[
            { icon: "🔒", text: "SSL Secured" },
            { icon: "💳", text: "Safe Payments" },
            { icon: "🔄", text: "30-Day Refund" },
            { icon: "⚡", text: "Instant Access" },
          ].map((badge, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Keyframes for animations */}
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

export default TradingPlan;
