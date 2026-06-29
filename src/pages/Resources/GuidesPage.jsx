import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowRight,
  FaBookOpen,
  FaUserPlus,
  FaShieldAlt,
  FaWallet,
  FaChartLine,
  FaCogs,
  FaMoneyCheckAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

const onboardingSteps = [
  {
    id: "01",
    title: "Create Your Account",
    icon: FaUserPlus,
    description:
      "Sign up with your legal name, active email, and a strong password. Confirm your email before continuing.",
    tips: [
      "Use a unique password that you do not reuse elsewhere",
      "Enable two-factor authentication immediately after login",
      "Keep your recovery codes in a safe offline location",
    ],
  },
  {
    id: "02",
    title: "Complete Verification (KYC)",
    icon: FaShieldAlt,
    description:
      "Upload valid identity documents and profile details to unlock full account functionality.",
    tips: [
      "Ensure document details match your profile information exactly",
      "Use clear, uncropped photos with good lighting",
      "Verification timelines vary based on regional compliance checks",
    ],
  },
  {
    id: "03",
    title: "Fund Your Wallet",
    icon: FaWallet,
    description:
      "Deposit funds using supported payment options in your dashboard before trading or investing.",
    tips: [
      "Always deposit from an account in your own name",
      "Check minimum/maximum limits and processing times",
      "Review transaction status in the wallet history section",
    ],
  },
  {
    id: "04",
    title: "Choose an Investment Plan",
    icon: FaChartLine,
    description:
      "Select a plan based on your risk profile and capital allocation. Current ranges are from $100 up to $100,000.",
    tips: [
      "Never invest money you cannot afford to lose",
      "Start smaller while learning platform behavior",
      "Diversify instead of concentrating all funds into one decision",
    ],
  },
  {
    id: "05",
    title: "Start Trading Wisely",
    icon: FaCogs,
    description:
      "Use market tools, set entry/exit plans, and apply risk controls before placing trades.",
    tips: [
      "Define stop-loss and take-profit levels before execution",
      "Avoid emotional trading after rapid market movement",
      "Track performance weekly and refine your strategy",
    ],
  },
  {
    id: "06",
    title: "Withdraw & Keep Records",
    icon: FaMoneyCheckAlt,
    description:
      "Request withdrawals from your dashboard and maintain personal records for accounting and tax purposes.",
    tips: [
      "Ensure your payout details are accurate before submitting",
      "Expect additional verification for security when needed",
      "Store transaction receipts and monthly statements",
    ],
  },
];

const safetyRules = [
  "Treat all investments and trades as high risk activities.",
  "Past performance does not guarantee future results.",
  "Do independent research before committing capital.",
  "Use only official XTX channels for support and notices.",
  "Never share your password, OTP, or private recovery data.",
];

const GuidesPage = () => {
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
            <span className="text-primary-300">Guides</span>
          </div>

          <Link
            to="/disclaimer"
            className="inline-flex items-center bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
          >
            Read Disclaimer
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-primary-500 p-3 rounded-full mr-4">
                <FaBookOpen className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Resources: Getting Started Guides</h1>
                <p className="text-gray-400 mt-2">Last updated: April 15, 2026</p>
              </div>
            </div>

            <div className="bg-primary-900/30 p-4 rounded-lg border-l-4 border-primary-500 mb-8 text-sm text-gray-200">
              These guides are designed to help you move from registration to funding, investing, and trading in a safe, structured way. They are educational in nature and should not be interpreted as guaranteed financial outcomes.
            </div>

            <div className="space-y-6">
              {onboardingSteps.map((step) => (
                <section key={step.id} className="bg-gray-700/40 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-primary-700/70 flex items-center justify-center flex-shrink-0">
                      <step.icon className="text-primary-300" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-primary-300 mb-1">
                        {step.id}. {step.title}
                      </h2>
                      <p className="text-gray-300 mb-3">{step.description}</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                        {step.tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-10 bg-amber-900/20 border border-amber-700/40 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                Safety & Risk Rules You Should Follow
              </h2>
              <ul className="space-y-2">
                {safetyRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-gray-200">
                    <FaCheckCircle className="text-amber-300 mt-1 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10 border-t border-gray-700 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Need personalized help?</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Contact support if you need help with onboarding, deposits, investment setup, or trade execution workflows.
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
                  to="/disclaimer"
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Review Disclaimer
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GuidesPage;
