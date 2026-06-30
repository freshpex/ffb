import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowRight,
  FaQuestionCircle,
  FaUserShield,
  FaWallet,
  FaChartLine,
  FaMoneyCheckAlt,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

const faqGroups = [
  {
    title: "Account & Security",
    icon: FaUserShield,
    items: [
      {
        q: "How do I secure my account after registration?",
        a: "Enable two-factor authentication, use a unique strong password, and never share OTP or recovery details with anyone.",
      },
      {
        q: "Why is KYC required?",
        a: "KYC helps meet regulatory requirements, prevent fraud, and protect account ownership for deposits and withdrawals.",
      },
      {
        q: "Can I have multiple accounts?",
        a: "No. Unless explicitly approved in writing, each user should maintain one verified account to avoid compliance issues.",
      },
    ],
  },
  {
    title: "Deposits, Plans & Trading",
    icon: FaWallet,
    items: [
      {
        q: "What is the minimum amount to start?",
        a: "The current plan structure starts from $100 and goes up to $100,000 depending on plan category and limits.",
      },
      {
        q: "Are returns guaranteed?",
        a: "No. Investment and trading outcomes are not guaranteed. Market conditions can lead to gains or losses.",
      },
      {
        q: "How should I choose a plan?",
        a: "Choose based on your risk tolerance, available capital, timeline, and your ability to absorb potential losses.",
      },
      {
        q: "Do I need experience before trading?",
        a: "Experience helps significantly. Start with educational resources, begin with smaller sizes, and apply strict risk controls.",
      },
    ],
  },
  {
    title: "Withdrawals & Compliance",
    icon: FaMoneyCheckAlt,
    items: [
      {
        q: "How long do withdrawals take?",
        a: "Processing times vary by payment channel, verification status, and security checks. You can monitor status in your dashboard.",
      },
      {
        q: "Why was extra verification requested for withdrawal?",
        a: "Additional verification may be required to prevent unauthorized access, protect your funds, and satisfy compliance obligations.",
      },
      {
        q: "Can I withdraw to a third-party account?",
        a: "No. Withdrawals should generally go to payment methods/accounts in your own verified name.",
      },
    ],
  },
  {
    title: "Risk & Responsibility",
    icon: FaChartLine,
    items: [
      {
        q: "Can I lose all my funds?",
        a: "Yes. Depending on market conditions and risk management, partial or total loss is possible.",
      },
      {
        q: "Who is responsible for my trading decisions?",
        a: "You are responsible for all investment and trading decisions made on your account.",
      },
      {
        q: "What should I read before investing?",
        a: "Review the Guides, Market Analysis resources, Terms of Service, and Disclaimer before committing capital.",
      },
    ],
  },
];

const FaqsPage = () => {
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
            <span className="text-primary-300">FAQs</span>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
          >
            Contact Support
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-orange-600 p-3 rounded-full mr-4">
                <FaQuestionCircle className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
                <p className="text-gray-400 mt-2">Clear answers on onboarding, funding, plans, trading, withdrawals, and risk</p>
              </div>
            </div>

            <div className="bg-primary-900/30 p-4 rounded-lg border-l-4 border-primary-500 mb-8 text-sm text-gray-200">
              If your question impacts account safety or funds movement, contact support directly instead of relying on third-party advice.
            </div>

            <div className="space-y-6">
              {faqGroups.map((group) => (
                <section key={group.title} className="bg-gray-700/40 border border-gray-700 rounded-xl p-5">
                  <h2 className="text-xl font-semibold text-primary-300 mb-4 flex items-center">
                    <group.icon className="mr-2" />
                    {group.title}
                  </h2>

                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <details
                        key={item.q}
                        className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 group"
                      >
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                          <span className="font-medium text-white">{item.q}</span>
                          <span className="text-primary-300 text-xs group-open:rotate-90 transition-transform">
                            ▶
                          </span>
                        </summary>
                        <p className="text-gray-300 mt-3 text-sm leading-relaxed">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-10 border-t border-gray-700 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaLock className="text-primary-300" />
                  Still need help?
                </h3>
                <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                  <FaEnvelope className="text-primary-300" />
                  Reach support with your account email and transaction/reference details.
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
                  to="/resources/market-analysis"
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Market Analysis
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

export default FaqsPage;
