import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowRight,
  FaChartLine,
  FaCalendarAlt,
  FaGlobe,
  FaBell,
  FaSearchDollar,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const dailyChecklist = [
  "Review macroeconomic calendar (rate decisions, CPI, employment, GDP).",
  "Check overnight market sentiment across crypto, forex, commodities, and equities.",
  "Mark key support/resistance zones before opening any position.",
  "Define invalidation levels (where your trade idea is considered wrong).",
  "Limit total daily risk and stop trading after the pre-defined max drawdown.",
];

const analysisFramework = [
  {
    title: "Macro Context",
    icon: FaGlobe,
    points: [
      "Central bank policy direction",
      "Inflation trend and labor-market strength",
      "Risk-on vs risk-off capital flows",
    ],
  },
  {
    title: "Technical Structure",
    icon: FaChartLine,
    points: [
      "Trend alignment on higher timeframes",
      "Liquidity zones and breakout/retest behavior",
      "Volume confirmation at major levels",
    ],
  },
  {
    title: "Event & News Risk",
    icon: FaBell,
    points: [
      "High-impact releases within your holding window",
      "Headline risk and geopolitical shock events",
      "Position adjustments ahead of binary events",
    ],
  },
];

const watchlistGuidelines = [
  "Track only instruments you understand and can monitor properly.",
  "Avoid overtrading correlated assets in the same direction.",
  "Size positions by risk-per-trade, not by confidence or emotion.",
  "Document trade thesis, entry, stop, target, and review outcome weekly.",
];

const MarketAnalysisPage = () => {
  const pageVariants = {
    initial: { opacity: 0 },
    in: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      className="bg-gradient-to-b from-gray-900 to-primary-900 min-h-screen text-white"
    >
      <div className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center flex-wrap gap-2 text-sm">
            <Link
              to="/"
              className="flex items-center text-white hover:text-primary-400 transition-colors"
            >
              <FaHome className="mr-2" />
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-primary-400">Resources</span>
            <span className="text-gray-500">/</span>
            <span className="text-primary-300">Market Analysis</span>
          </div>

          <Link
            to="/resources/videos"
            className="inline-flex items-center bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
          >
            Watch Tutorials
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-green-600 p-3 rounded-full mr-4">
                <FaSearchDollar className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Market Analysis Hub</h1>
                <p className="text-gray-400 mt-2">A practical framework to evaluate opportunities before you commit capital</p>
              </div>
            </div>

            <div className="bg-primary-900/30 p-4 rounded-lg border-l-4 border-primary-500 mb-8 text-sm text-gray-200">
              Analysis improves decision quality but does not eliminate risk. Treat every setup as probabilistic, not certain.
            </div>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-primary-300 mb-4 flex items-center">
                <FaCalendarAlt className="mr-2" />
                Daily Pre-Trade Checklist
              </h2>
              <ul className="space-y-2">
                {dailyChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-200">
                    <FaCheckCircle className="text-primary-300 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-primary-300 mb-4">Three-Layer Analysis Framework</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {analysisFramework.map((layer) => (
                  <div key={layer.title} className="bg-gray-700/40 border border-gray-700 rounded-xl p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <layer.icon className="text-primary-300" />
                      {layer.title}
                    </h3>
                    <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                      {layer.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10 bg-amber-900/20 border border-amber-700/40 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-amber-300 mb-3 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                Watchlist & Risk Discipline
              </h2>
              <ul className="space-y-2">
                {watchlistGuidelines.map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-gray-200">
                    <FaCheckCircle className="text-amber-300 mt-1 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-gray-700 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Keep building context</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Combine analysis with tutorials, operational guides, and FAQ clarifications before scaling size.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/resources/guides"
                  className="bg-primary-700 hover:bg-primary-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Guides
                </Link>
                <Link
                  to="/resources/faqs"
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  FAQs
                </Link>
                <Link
                  to="/disclaimer"
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Disclaimer
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketAnalysisPage;
