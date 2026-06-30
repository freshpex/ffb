import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowRight,
  FaExclamationTriangle,
  FaShieldAlt,
  FaBalanceScale,
  FaChartLine,
  FaTools,
  FaUserCheck,
} from "react-icons/fa";

const disclaimerSections = [
  {
    title: "1. Educational Content, Not Financial Advice",
    icon: FaBalanceScale,
    body: [
      "All content provided on XTX, including guides, market commentary, tutorials, and strategy examples, is for informational and educational purposes only.",
      "Nothing on this platform constitutes investment, legal, accounting, or tax advice. You are solely responsible for your decisions.",
    ],
  },
  {
    title: "2. High Risk of Loss",
    icon: FaChartLine,
    body: [
      "Investing and trading involve substantial risk. The value of assets can rise or fall quickly due to market volatility, liquidity constraints, economic events, and geopolitical developments.",
      "You may lose part or all of your funds. Only trade or invest capital you can afford to lose without affecting essential living expenses.",
    ],
  },
  {
    title: "3. No Guaranteed Returns",
    icon: FaShieldAlt,
    body: [
      "Past performance does not guarantee future results.",
      "Any projected returns, examples, or historical outcomes are illustrative only and should not be interpreted as promises of profit.",
    ],
  },
  {
    title: "4. Platform & Technical Risks",
    icon: FaTools,
    body: [
      "Execution speed, pricing, and order fills may be affected by internet connectivity, third-party services, device issues, market gaps, and system maintenance.",
      "XTX is not liable for losses caused by technical interruptions, user-side security lapses, incorrect order input, or unauthorized access resulting from compromised credentials.",
    ],
  },
  {
    title: "5. Your Responsibility and Acknowledgment",
    icon: FaUserCheck,
    body: [
      "By using XTX, you acknowledge that you understand and accept all investment and trading risks.",
      "You agree that any profit or loss outcome from your investment/trading activity remains your responsibility, and you will not hold XTX, its affiliates, officers, employees, or partners liable for ordinary market losses, except where required by applicable law.",
    ],
  },
];

const Disclaimer = () => {
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
            <span className="text-primary-400">Disclaimer</span>
          </div>

          <Link
            to="/resources/guides"
            className="inline-flex items-center bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
          >
            Open User Guides
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-red-600/80 p-3 rounded-full mr-4">
                <FaExclamationTriangle className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Investment & Trading Disclaimer</h1>
                <p className="text-gray-400 mt-2">Effective date: April 15, 2026</p>
              </div>
            </div>

            <div className="bg-red-900/25 border border-red-700/40 rounded-lg p-5 mb-8">
              <p className="text-red-100 text-sm leading-relaxed">
                <strong className="text-red-300">Important:</strong> XTX is an investment and trading platform. Use it responsibly and only after understanding the risks. You must be prepared for possible losses, including total loss of funds. If you are not comfortable with that possibility, do not invest or trade.
              </p>
            </div>

            <div className="space-y-6">
              {disclaimerSections.map((section) => (
                <section key={section.title} className="bg-gray-700/40 rounded-xl p-5 border border-gray-700">
                  <h2 className="text-xl font-semibold text-primary-300 mb-3 flex items-center">
                    <section.icon className="mr-2" />
                    {section.title}
                  </h2>
                  <div className="space-y-2 text-gray-300">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-10 bg-amber-900/20 border border-amber-700/30 rounded-xl p-6">
              <h3 className="font-semibold text-amber-300 mb-2">Before You Continue</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-200 text-sm">
                <li>Assess your financial capacity and risk tolerance honestly.</li>
                <li>Use risk controls (position sizing, stop-loss, diversification).</li>
                <li>Consult an independent licensed advisor if needed.</li>
                <li>Read the Terms of Service and Privacy Policy in full.</li>
              </ul>
            </section>

            <section className="mt-10 border-t border-gray-700 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Need clarification?</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Contact our support team before funding your account if anything in this disclaimer is unclear.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="bg-primary-700 hover:bg-primary-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  to="/terms"
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/privacy"
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Disclaimer;
