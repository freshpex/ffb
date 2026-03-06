import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaExclamationTriangle, FaBalanceScale } from "react-icons/fa";

const Disclaimer = () => {
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } },
  };

  const containerVariants = {
    initial: { y: 12, opacity: 0 },
    in: { y: 0, opacity: 1, transition: { duration: 0.35 } },
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center text-white hover:text-primary-400">
              <FaHome className="mr-2" />
              <span>Home</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-primary-400">Disclaimer</span>
          </div>
          <Link to="/terms" className="flex items-center text-white bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg">
            View Terms
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div variants={containerVariants} className="max-w-4xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-6">
              <div className="bg-primary-500 p-3 rounded-full mr-4">
                <FaBalanceScale className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Disclaimer</h1>
            </div>

            <div className="text-gray-300 space-y-6">
              <div className="bg-gray-700/50 p-4 rounded-lg border-l-4 border-red-600 mb-6">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-red-400 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>IMPORTANT:</strong> Fidelity First Brokers ("FFBroker", "we", "us" or "our") operates a trading and investment platform. Trading and investing in financial instruments involves substantial risk and may result in the loss of part or all of your invested funds.
                  </p>
                </div>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-primary-400">Risk Acknowledgement</h2>
                <p>
                  By signing in, registering, or otherwise using our Platform you acknowledge and accept that trading and investment activities carry a significant risk of loss. You are solely responsible for any investment decisions and for monitoring your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-primary-400">No Guarantee of Returns</h2>
                <p>
                  FFBroker does not guarantee any profits or returns. Past performance is not indicative of future results. Any examples or illustrations provided on the Platform are for informational purposes only and should not be considered investment advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-primary-400">Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, FFBroker, its affiliates, officers, directors, employees and agents shall not be liable for any direct, indirect, incidental, consequential, special or punitive damages, including loss of profits, trading losses or other financial losses arising out of or in connection with your use of the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-primary-400">User Responsibility</h2>
                <p>
                  You should consider seeking independent financial, tax or legal advice before making any investment or trading decision. Never invest money you cannot afford to lose. You are responsible for complying with all laws and regulations applicable to your use of the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-primary-400">Contact</h2>
                <p className="mt-2 bg-gray-700/50 p-4 rounded-lg">If you have questions about this Disclaimer or our services, contact us at: legal@ffbroker.cam</p>
              </section>
            </div>

            <div className="mt-10 text-sm text-gray-400">
              <p>
                By continuing to use or access the Platform after viewing this Disclaimer you confirm that you understand and accept the risks described herein.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-gray-900 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Fidelity First Brokers. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/terms" className="text-primary-400 hover:underline mx-2">Terms of Service</Link>
            <Link to="/privacy" className="text-primary-400 hover:underline mx-2">Privacy Policy</Link>
            <Link to="/contact" className="text-primary-400 hover:underline mx-2">Contact Us</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Disclaimer;
