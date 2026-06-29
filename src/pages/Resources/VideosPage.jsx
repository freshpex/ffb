import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowRight,
  FaPlay,
  FaVideo,
  FaClock,
  FaCheckCircle,
  FaGraduationCap,
  FaShieldAlt,
} from "react-icons/fa";

const learningTracks = [
  {
    title: "Beginner Track",
    duration: "2.5 hours total",
    focus: "Account setup, KYC, deposits, and first investment steps",
  },
  {
    title: "Intermediate Track",
    duration: "4 hours total",
    focus: "Risk controls, plan selection, position sizing, and execution discipline",
  },
  {
    title: "Advanced Track",
    duration: "6+ hours total",
    focus: "Multi-market strategy planning, trade journaling, and performance review",
  },
];

const featuredVideos = [
  {
    title: "From Sign-Up to First Deposit",
    length: "12:40",
    category: "Onboarding",
    summary:
      "A complete walkthrough of creating an account, securing it with 2FA, and funding your wallet safely.",
  },
  {
    title: "How to Select the Right Plan",
    length: "09:15",
    category: "Investing",
    summary:
      "How to evaluate plans by amount range, duration, and your personal risk tolerance.",
  },
  {
    title: "Trading Risk Management Essentials",
    length: "14:05",
    category: "Risk Management",
    summary:
      "Practical rules for stop-losses, capital allocation, and avoiding overexposure.",
  },
  {
    title: "Withdrawal Requests & Record Keeping",
    length: "08:25",
    category: "Operations",
    summary:
      "Best practices for making withdrawals and maintaining clean tax/accounting records.",
  },
];

const studyTips = [
  "Watch videos in order, then apply each step inside your dashboard.",
  "Pause and practice with small amounts before increasing exposure.",
  "Use a trading/investment journal to capture what worked and what failed.",
  "Revisit risk-management videos weekly until the process becomes routine.",
];

const VideosPage = () => {
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
            <span className="text-primary-300">Videos</span>
          </div>

          <Link
            to="/resources/guides"
            className="inline-flex items-center bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
          >
            Open Guides
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-purple-600 p-3 rounded-full mr-4">
                <FaVideo className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Video Tutorials</h1>
                <p className="text-gray-400 mt-2">Structured video learning from registration to active trading</p>
              </div>
            </div>

            <div className="bg-primary-900/30 p-4 rounded-lg border-l-4 border-primary-500 mb-8 text-sm text-gray-200">
              These tutorials are educational and operational guidance only. They do not guarantee profit and should be used alongside your own risk assessment.
            </div>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-primary-300 mb-4 flex items-center">
                <FaGraduationCap className="mr-2" />
                Learning Tracks
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {learningTracks.map((track) => (
                  <div key={track.title} className="bg-gray-700/40 border border-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">{track.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{track.focus}</p>
                    <p className="text-xs text-primary-300 flex items-center gap-2">
                      <FaClock />
                      {track.duration}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-primary-300 mb-4 flex items-center">
                <FaPlay className="mr-2" />
                Featured Tutorials
              </h2>
              <div className="space-y-4">
                {featuredVideos.map((video) => (
                  <div
                    key={video.title}
                    className="bg-gray-700/40 border border-gray-700 rounded-xl p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{video.title}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-primary-900/60 text-primary-300">
                        {video.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{video.summary}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <FaClock />
                      Duration: {video.length}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-semibold text-amber-300 mb-3 flex items-center">
                <FaShieldAlt className="mr-2" />
                How to Use Tutorials Effectively
              </h2>
              <ul className="space-y-2">
                {studyTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-gray-200">
                    <FaCheckCircle className="text-amber-300 mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-gray-700 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Next step</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Continue with market context and FAQs before placing bigger positions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/resources/market-analysis"
                  className="bg-primary-700 hover:bg-primary-600 px-5 py-2.5 rounded-lg transition-colors"
                >
                  Market Analysis
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

export default VideosPage;
