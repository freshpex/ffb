import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { FaCheck, FaArrowRight, FaTimes, FaCrown, FaRocket, FaGem, FaStar, FaBolt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PricingSection1 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      id: "basic",
      name: "Basic",
      description: "Perfect for beginners starting their investment journey",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: FaRocket,
      gradient: "from-blue-500 to-cyan-500",
      shadowColor: "rgba(59, 130, 246, 0.3)",
      features: [
        { text: "Basic trading tools", included: true },
        { text: "Market news", included: true },
        { text: "Email support", included: true },
        { text: "Up to 5 trades", included: true },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false },
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "For active traders who need advanced features",
      monthlyPrice: 29,
      yearlyPrice: 290,
      icon: FaCrown,
      gradient: "from-orange-500 to-amber-400",
      shadowColor: "rgba(249, 115, 22, 0.4)",
      features: [
        { text: "Advanced trading tools", included: true },
        { text: "Real-time market data", included: true },
        { text: "Priority support", included: true },
        { text: "Performance analytics", included: true },
        { text: "Portfolio optimization", included: true },
        { text: "Trading signals", included: true },
      ],
      buttonText: "Choose Pro",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Maximum capabilities for professional traders",
      monthlyPrice: 99,
      yearlyPrice: 990,
      icon: FaGem,
      gradient: "from-purple-500 to-pink-500",
      shadowColor: "rgba(139, 92, 246, 0.3)",
      features: [
        { text: "All Pro features", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Advanced API access", included: true },
        { text: "Exclusive opportunities", included: true },
        { text: "Custom strategies", included: true },
        { text: "White-glove onboarding", included: true },
      ],
      buttonText: "Contact Sales",
      popular: false,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".pricing-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, scale: 0.9, rotateY: -10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
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
    <div
      ref={ref}
      className={`pt-28 pb-20 px-4 relative overflow-hidden ${
        darkMode
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-b from-gray-50 via-white to-gray-50"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="grid-background opacity-30" />
        <motion.div
          className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)",
          }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 3 }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              darkMode
                ? "bg-primary-900/50 text-primary-400 border border-primary-700/50"
                : "bg-primary-50 text-primary-700 border border-primary-200"
            }`}
          >
            <FaBolt className="text-yellow-500" />
            Simple & Transparent
          </motion.span>

          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Transparent Pricing,{" "}
            <span className="gradient-text-animated">Exceptional Value</span>
          </h1>
          <p
            className={`text-lg md:text-xl max-w-3xl mx-auto mb-10 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Choose the right plan for your investment needs. Our pricing is
            designed to grow with you, from beginning investors to seasoned
            professionals.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
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
              <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`pricing-card relative rounded-3xl overflow-hidden transition-all duration-500 ${
                plan.popular ? "md:scale-105 md:-my-4 z-10" : "hover:scale-[1.02]"
              }`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Animated Border for Popular */}
              {plan.popular && (
                <div className="absolute inset-0 rounded-3xl p-[3px]">
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: "linear-gradient(135deg, #f97316, #fbbf24, #f97316)",
                      backgroundSize: "200% 200%",
                      animation: "gradientShift 4s ease infinite",
                    }}
                  />
                </div>
              )}

              {/* Card Content */}
              <div
                className={`relative rounded-3xl p-8 h-full ${
                  darkMode
                    ? "bg-gradient-to-b from-gray-900 to-gray-950"
                    : "bg-gradient-to-b from-white to-gray-50"
                } ${!plan.popular && (darkMode ? "border border-gray-700" : "border border-gray-200 shadow-lg")}`}
                style={{ margin: plan.popular ? "3px" : "0" }}
              >
                {/* Glow Effect */}
                {plan.popular && (
                  <div
                    className="absolute inset-0 rounded-3xl opacity-30"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${plan.shadowColor} 0%, transparent 50%)`,
                    }}
                  />
                )}

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="badge-glow px-6 py-2 rounded-full text-sm font-bold text-white flex items-center gap-2">
                      <FaStar className="text-xs" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="relative mb-6">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      boxShadow: hoveredPlan === plan.id ? `0 20px 40px ${plan.shadowColor}` : "none",
                    }}
                  >
                    <plan.icon className="text-white text-2xl" />
                  </motion.div>
                </div>

                {/* Name & Description */}
                <h3
                  className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 h-12 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-5xl font-bold ${
                        plan.popular
                          ? "text-orange-500 price-glow-orange"
                          : darkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      ${billingCycle === "monthly" ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12)}
                    </span>
                    <span className={`text-lg mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {plan.monthlyPrice === 0 ? "" : "/month"}
                    </span>
                  </div>
                  {plan.monthlyPrice > 0 && billingCycle === "yearly" && (
                    <p className="text-sm text-green-500 mt-1">
                      Billed ${plan.yearlyPrice}/year
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <FaCheck className="text-green-500 text-xs" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
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
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to="/signup"
                  className={`block w-full py-4 rounded-xl text-center font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? "btn-fire-glow text-white hover:scale-105"
                      : darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
                  }`}
                >
                  {plan.buttonText}
                  <FaArrowRight className="inline-block ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
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

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default PricingSection1;
