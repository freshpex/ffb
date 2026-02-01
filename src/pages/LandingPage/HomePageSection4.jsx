import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaBookOpen,
  FaChartLine,
  FaArrowRight,
  FaPlay,
  FaNewspaper,
  FaGraduationCap,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomePageSection4 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [activeVideo, setActiveVideo] = useState(null);

  const resources = [
    {
      id: 1,
      title: "Investment Guides",
      description:
        "Comprehensive guides and tutorials on various investment strategies and market analysis.",
      icon: FaBookOpen,
      gradient: "from-blue-500 to-cyan-500",
      shadowColor: "rgba(59, 130, 246, 0.4)",
      link: "/resources/guides",
      badge: "📚 Popular",
      stats: "50+ Guides",
    },
    {
      id: 2,
      title: "Video Tutorials",
      description:
        "Watch expert-led video tutorials covering everything from basics to advanced trading.",
      icon: FaPlay,
      gradient: "from-purple-500 to-pink-500",
      shadowColor: "rgba(139, 92, 246, 0.4)",
      link: "/resources/videos",
      badge: "🎬 New",
      stats: "100+ Videos",
    },
    {
      id: 3,
      title: "Market Analysis",
      description:
        "Regular market updates, trend analysis, and investment opportunities from our expert team.",
      icon: FaChartLine,
      gradient: "from-green-500 to-emerald-500",
      shadowColor: "rgba(34, 197, 94, 0.4)",
      link: "/resources/market-analysis",
      badge: "📈 Daily",
      stats: "Live Updates",
    },
    {
      id: 4,
      title: "FAQs & Support",
      description:
        "Answers to commonly asked questions about our platform, services, and processes.",
      icon: FaQuestionCircle,
      gradient: "from-orange-500 to-amber-500",
      shadowColor: "rgba(249, 115, 22, 0.4)",
      link: "/resources/faqs",
      badge: "❓ Help",
      stats: "24/7 Support",
    },
  ];

  const latestArticles = [
    {
      id: 1,
      title: "Understanding Market Volatility in 2024",
      category: "Market Insights",
      readTime: "5 min read",
      image: "/images/article-1.jpg",
    },
    {
      id: 2,
      title: "Building a Diversified Investment Portfolio",
      category: "Strategy",
      readTime: "8 min read",
      image: "/images/article-2.jpg",
    },
    {
      id: 3,
      title: "Cryptocurrency: Risks and Opportunities",
      category: "Crypto",
      readTime: "6 min read",
      image: "/images/article-3.jpg",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".resource-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray(".article-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
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
          : "bg-gradient-to-b from-gray-50 via-white to-gray-50"
      }`}
      ref={ref}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="grid-background opacity-20" />
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 3 }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                darkMode
                  ? "bg-blue-900/50 text-blue-400 border border-blue-700/50"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              <FaGraduationCap />
              Education Hub
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
            Resources &{" "}
            <span className="gradient-text-animated">Learning</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-3xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Access educational materials and resources to enhance your
            investment knowledge and make informed decisions.
          </motion.p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              className={`resource-card group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                darkMode
                  ? "glass-card-dark hover:border-primary-500/50"
                  : "glass-card hover:border-primary-500/50"
              }`}
              whileHover={{ y: -8 }}
            >
              <Link to={resource.link} className="block p-8">
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      darkMode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {resource.badge}
                  </span>
                </div>

                <div className="flex gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${resource.gradient} flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      style={{
                        boxShadow: `0 20px 40px ${resource.shadowColor}`,
                      }}
                    >
                      <resource.icon className="text-white text-2xl" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {resource.title}
                    </h3>
                    <p
                      className={`text-sm mb-4 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {resource.stats}
                      </span>
                      <span className="text-primary-500 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                        Explore
                        <FaArrowRight className="text-xs" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${resource.shadowColor} 0%, transparent 100%)`,
                  }}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Latest Articles Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h3
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FaNewspaper className="inline-block mr-3 text-primary-500" />
              Latest Articles
            </h3>
            <Link
              to="/blog"
              className="text-primary-500 hover:text-primary-400 flex items-center gap-2 text-sm font-medium"
            >
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((article, index) => (
              <motion.div
                key={article.id}
                className={`article-card group rounded-2xl overflow-hidden transition-all duration-500 hover-lift ${
                  darkMode ? "glass-card-dark" : "glass-card"
                }`}
              >
                <div
                  className={`h-40 relative overflow-hidden ${
                    darkMode ? "bg-gray-800" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      index === 0
                        ? "from-blue-500/20 to-purple-500/20"
                        : index === 1
                        ? "from-green-500/20 to-cyan-500/20"
                        : "from-orange-500/20 to-pink-500/20"
                    }`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaLightbulb
                      className={`text-4xl ${
                        darkMode ? "text-gray-700" : "text-gray-300"
                      }`}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        darkMode
                          ? "bg-primary-900/50 text-primary-400"
                          : "bg-primary-50 text-primary-700"
                      }`}
                    >
                      {article.category}
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {article.readTime}
                    </span>
                  </div>
                  <h4
                    className={`font-bold group-hover:text-primary-500 transition-colors ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {article.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Consultation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Animated Background */}
          <div
            className={`absolute inset-0 ${
              darkMode
                ? "bg-gradient-to-r from-primary-900/80 via-purple-900/80 to-primary-900/80"
                : "bg-gradient-to-r from-primary-100 via-purple-100 to-primary-100"
            }`}
          />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10"
              animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
              transition={{ duration: 25, repeat: Infinity }}
            />
          </div>

          <div className="relative p-8 md:p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                  darkMode ? "bg-white/10" : "bg-white/50"
                }`}
              >
                <FaRocket
                  className={`text-2xl ${
                    darkMode ? "text-white" : "text-primary-600"
                  }`}
                />
              </div>
            </motion.div>

            <h3
              className={`text-2xl md:text-4xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Need{" "}
              <span className="gradient-text-animated">
                Personalized Guidance?
              </span>
            </h3>
            <p
              className={`text-lg mb-8 max-w-2xl mx-auto ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Our team of investment experts is available to provide
              personalized advice and support to help you achieve your financial
              goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="btn-fire-glow inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold text-lg"
                >
                  Schedule a Consultation
                  <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/demo"
                  className={`inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all ${
                    darkMode
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-white text-gray-900 hover:bg-gray-50 shadow-lg"
                  }`}
                >
                  <FaPlay className="mr-2" />
                  Watch Demo
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePageSection4;
