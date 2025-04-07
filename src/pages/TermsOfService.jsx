import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaArrowRight, FaShieldAlt, FaBalanceScale, FaUserLock, FaExclamationTriangle } from "react-icons/fa";

const TermsOfService = () => {
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  const containerVariants = {
    initial: { y: 20, opacity: 0 },
    in: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      className="bg-gradient-to-b from-gray-900 to-primary-900 min-h-screen text-white"
    >
      {/* Header */}
      <div className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center text-white hover:text-primary-400 transition-colors">
              <FaHome className="mr-2" />
              <span>Home</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-primary-400">Terms of Service</span>
          </div>
          <Link to="/privacy" className="flex items-center text-white bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors">
            <span>Privacy Policy</span>
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          variants={containerVariants}
          className="max-w-4xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              <div className="bg-primary-500 p-3 rounded-full mr-4">
                <FaBalanceScale className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
            </div>

            <div className="text-gray-300 space-y-6">
              <p className="mb-6">
                Last Updated: April 7, 2025
              </p>

              <div className="bg-gray-700/50 p-4 rounded-lg border-l-4 border-primary-500 mb-8">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>IMPORTANT NOTICE:</strong> These Terms of Service govern your use of Fidelity First Brokers' trading services. 
                    By accessing or using our services, you agree to be bound by these terms. Trading financial instruments involves significant risk and may result in the loss of your invested capital. 
                    Please read these terms carefully and consider seeking independent financial advice before trading.
                  </p>
                </div>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">1. Introduction</h2>
                <p>
                  Welcome to Fidelity First Brokers ("FFB," "we," "us," or "our"). These Terms of Service ("Terms") constitute a legally binding agreement between you and Fidelity First Brokers governing your access to and use of our website, mobile application, and services (collectively, the "Platform").
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">2. Eligibility</h2>
                <p>
                  To use our Platform, you must be at least 18 years old and have the legal capacity to enter into a binding agreement. By using our Platform, you represent and warrant that you meet these eligibility requirements.
                </p>
                <p className="mt-2">
                  Our services are not available to residents of certain jurisdictions where online trading is prohibited or restricted. It is your responsibility to ensure that your use of our Platform complies with the laws and regulations applicable to you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">3. Registration and Account Security</h2>
                <p>
                  To access certain features of our Platform, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                <p className="mt-2">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
                </p>
                <p className="mt-2">
                  We reserve the right to suspend or terminate your account if we suspect that your account is being used for unauthorized or fraudulent activities.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">4. Trading Services</h2>
                <p>
                  Fidelity First Brokers provides an online platform for trading financial instruments, including but not limited to stocks, cryptocurrencies, forex, and commodities. Our services include:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Access to market data and analysis tools</li>
                  <li>Execution of trading orders</li>
                  <li>Management of trading accounts</li>
                  <li>Educational resources</li>
                  <li>Customer support</li>
                </ul>
                <p className="mt-2">
                  All trading services are subject to applicable regulations and may vary based on your location and account type.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">5. Risk Disclosure</h2>
                <div className="bg-red-900/20 p-4 rounded-lg">
                  <p>
                    <strong className="text-red-400">Trading involves significant risk:</strong> Trading financial instruments involves a high level of risk and may not be suitable for all investors. You should carefully consider your investment objectives, level of experience, and risk appetite before trading.
                  </p>
                  <p className="mt-2">
                    <strong className="text-red-400">Potential for loss:</strong> You may lose some or all of your invested capital. Never invest money that you cannot afford to lose.
                  </p>
                  <p className="mt-2">
                    <strong className="text-red-400">Market volatility:</strong> Financial markets can fluctuate rapidly, resulting in substantial gains or losses in a short period.
                  </p>
                  <p className="mt-2">
                    <strong className="text-red-400">Leverage risk:</strong> Trading with leverage can magnify both profits and losses. You may lose more than your initial investment.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">6. Fees and Payments</h2>
                <p>
                  We charge fees for certain services provided through our Platform, including trading commissions, account maintenance fees, and other service fees. Our fee structure is available on our Platform and may be updated from time to time.
                </p>
                <p className="mt-2">
                  You are responsible for paying all fees associated with your use of our Platform. All fees are non-refundable unless otherwise stated in these Terms or required by applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">7. Deposits and Withdrawals</h2>
                <p>
                  You may deposit funds into your account using the payment methods available on our Platform. All deposits must be made from accounts or payment methods in your name.
                </p>
                <p className="mt-2">
                  Withdrawal requests are subject to our verification procedures. We reserve the right to request additional information or documentation to verify your identity and the source of funds before processing a withdrawal.
                </p>
                <p className="mt-2">
                  Withdrawal processing times may vary depending on the payment method and other factors. We strive to process all withdrawal requests within a reasonable timeframe.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">8. Prohibited Activities</h2>
                <p>
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Using our Platform for any illegal purposes</li>
                  <li>Engaging in market manipulation or other fraudulent activities</li>
                  <li>Using automated systems or software to interact with our Platform without our express permission</li>
                  <li>Attempting to access unauthorized areas of our Platform</li>
                  <li>Interfering with the proper functioning of our Platform</li>
                  <li>Impersonating another person or entity</li>
                  <li>Sharing your account credentials with third parties</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">9. Intellectual Property</h2>
                <p>
                  All content, features, and functionality on our Platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Fidelity First Brokers or our licensors.
                </p>
                <p className="mt-2">
                  You may not copy, modify, distribute, sell, or lease any part of our Platform without our express permission. You may not reverse engineer or attempt to extract the source code of our software.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">10. Privacy and Data Protection</h2>
                <p>
                  We collect, use, and protect your personal information in accordance with our <Link to="/privacy" className="text-primary-400 hover:underline">Privacy Policy</Link>, which is incorporated by reference into these Terms.
                </p>
                <p className="mt-2">
                  By using our Platform, you consent to our collection and use of your personal information as described in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">11. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, Fidelity First Brokers and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your use of our Platform.
                </p>
                <p className="mt-2">
                  Our total liability for all claims related to these Terms shall not exceed the amount of fees paid by you to us during the twelve (12) months preceding the event giving rise to the claim.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">12. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless Fidelity First Brokers and its affiliates, officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from or relating to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Your violation of these Terms</li>
                  <li>Your use of our Platform</li>
                  <li>Your violation of any rights of another person or entity</li>
                  <li>Your violation of any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">13. Termination</h2>
                <p>
                  We may terminate or suspend your account and access to our Platform at any time, with or without notice, for any reason, including but not limited to your violation of these Terms.
                </p>
                <p className="mt-2">
                  You may terminate your account at any time by contacting us and requesting account closure. Upon termination, you remain liable for all obligations related to your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">14. Changes to Terms</h2>
                <p>
                  We may modify these Terms at any time by posting the revised Terms on our Platform. Your continued use of our Platform after the posting of revised Terms constitutes your acceptance of such changes.
                </p>
                <p className="mt-2">
                  We will provide notice of material changes to these Terms by displaying a prominent notice on our Platform or sending you an email notification.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">15. Governing Law and Dispute Resolution</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles.
                </p>
                <p className="mt-2">
                  Any dispute arising out of or relating to these Terms or your use of our Platform shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization]. The arbitration shall take place in [Location] and shall be conducted in English.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400">16. Contact Information</h2>
                <p>
                  If you have any questions, concerns, or feedback about these Terms, please contact us at:
                </p>
                <div className="mt-2 bg-gray-700/50 p-4 rounded-lg">
                  <p>Fidelity First Brokers</p>
                  <p>Email: legal@fidelityfirstbrokers.com</p>
                  <p>Address: 123 Financial Street, Suite 4500</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
              </section>
            </div>

            <div className="mt-12 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-8">
              <div className="flex items-center mb-4 md:mb-0">
                <FaUserLock className="text-primary-500 text-2xl mr-3" />
                <div>
                  <h3 className="font-semibold">Secure & Compliant</h3>
                  <p className="text-gray-400 text-sm">All data is encrypted and protected</p>
                </div>
              </div>
              <Link 
                to="/privacy"
                className="bg-primary-700 hover:bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
              >
                <FaShieldAlt className="mr-2" />
                View Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
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

export default TermsOfService;