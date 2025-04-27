import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowRight,
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaDatabase,
  FaGlobe,
  FaEnvelope,
  FaCookieBite,
  FaFingerprint,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const containerVariants = {
    initial: { y: 20, opacity: 0 },
    in: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
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
      {/* Header */}
      <div className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="flex items-center text-white hover:text-primary-400 transition-colors"
            >
              <FaHome className="mr-2" />
              <span>Home</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-primary-400">Privacy Policy</span>
          </div>
          <Link
            to="/terms"
            className="flex items-center text-white bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
          >
            <span>Terms of Service</span>
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
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            </div>

            <div className="text-gray-300 space-y-6">
              <p className="mb-6">Last Updated: April 7, 2025</p>

              <div className="bg-primary-900/30 p-4 rounded-lg border-l-4 border-primary-500 mb-8">
                <p className="text-sm">
                  <strong>At Fidelity First Brokers</strong>, we are committed
                  to protecting your privacy and ensuring the security of your
                  personal information. This Privacy Policy outlines how we
                  collect, use, disclose, and safeguard your data when you use
                  our platform and services. By accessing or using Fidelity
                  First Brokers, you consent to the practices described in this
                  policy.
                </p>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaDatabase className="mr-2" />
                  1. Information We Collect
                </h2>
                <div className="space-y-3">
                  <h3 className="font-medium text-white">
                    1.1 Personal Information
                  </h3>
                  <p>
                    We collect personal information that you provide directly to
                    us, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Contact information (name, email address, phone number)
                    </li>
                    <li>Account credentials (username, password)</li>
                    <li>
                      Financial information (bank account details, payment
                      methods)
                    </li>
                    <li>
                      Identification documents (passport, driver's license,
                      national ID)
                    </li>
                    <li>
                      Demographic information (date of birth, residential
                      address)
                    </li>
                    <li>
                      Professional information (occupation, employer details)
                    </li>
                    <li>
                      Tax information (tax identification number, tax residency)
                    </li>
                  </ul>

                  <h3 className="font-medium text-white mt-4">
                    1.2 Automatically Collected Information
                  </h3>
                  <p>
                    When you use our platform, we automatically collect certain
                    information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Device information (IP address, browser type, operating
                      system)
                    </li>
                    <li>
                      Usage data (pages visited, time spent on the platform,
                      trading activities)
                    </li>
                    <li>
                      Location information (general location based on IP
                      address)
                    </li>
                    <li>Log data (access times, error reports)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>

                  <h3 className="font-medium text-white mt-4">
                    1.3 Information from Third Parties
                  </h3>
                  <p>
                    We may receive information about you from third parties,
                    including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Identity verification services</li>
                    <li>Credit reference agencies</li>
                    <li>Public databases</li>
                    <li>Financial partners and service providers</li>
                    <li>Marketing partners</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaUserShield className="mr-2" />
                  2. How We Use Your Information
                </h2>
                <p>
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>To provide and maintain our services</li>
                  <li>To process and execute your trading transactions</li>
                  <li>To verify your identity and prevent fraud</li>
                  <li>To comply with legal and regulatory requirements</li>
                  <li>
                    To communicate with you about your account and our services
                  </li>
                  <li>To personalize your experience on our platform</li>
                  <li>To improve and develop our services</li>
                  <li>To analyze usage patterns and trends</li>
                  <li>To provide customer support</li>
                  <li>
                    To market our products and services to you (subject to your
                    preferences)
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaGlobe className="mr-2" />
                  3. Information Sharing and Disclosure
                </h2>
                <p>
                  We may share your personal information with the following
                  categories of recipients:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> Third-party vendors who
                    provide services on our behalf, such as payment processing,
                    data analysis, email delivery, hosting, and customer
                    service.
                  </li>
                  <li>
                    <strong>Financial Partners:</strong> Banks, payment
                    processors, and other financial institutions necessary to
                    facilitate transactions.
                  </li>
                  <li>
                    <strong>Identity Verification Services:</strong> Services
                    that help us verify your identity and comply with anti-money
                    laundering regulations.
                  </li>
                  <li>
                    <strong>Regulators and Authorities:</strong> Government
                    authorities, regulatory bodies, law enforcement agencies
                    when required by law or to protect our rights.
                  </li>
                  <li>
                    <strong>Business Partners:</strong> Companies with whom we
                    partner to offer integrated services or promotions.
                  </li>
                  <li>
                    <strong>Professional Advisors:</strong> Lawyers, auditors,
                    and other professional advisors in connection with the
                    services they provide to us.
                  </li>
                </ul>
                <p className="mt-3">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaLock className="mr-2" />
                  4. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, accidental loss, alteration, or disclosure. These
                  measures include:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Encryption of sensitive data</li>
                  <li>Secure Sockets Layer (SSL) technology</li>
                  <li>Firewalls and intrusion detection systems</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Access controls and authentication procedures</li>
                  <li>Employee training on data security practices</li>
                </ul>
                <p className="mt-3">
                  While we strive to protect your personal information, no
                  security system is impenetrable. We cannot guarantee the
                  absolute security of your data transmitted to our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaCookieBite className="mr-2" />
                  5. Cookies and Tracking Technologies
                </h2>
                <p>
                  We use cookies and similar tracking technologies to collect
                  information about your browsing activities on our platform.
                  Cookies are small text files stored on your device that help
                  us provide and improve our services.
                </p>
                <p className="mt-2">Types of cookies we use:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    <strong>Essential cookies:</strong> Required for the
                    operation of our platform (e.g., session management).
                  </li>
                  <li>
                    <strong>Analytical/performance cookies:</strong> Help us
                    understand how visitors interact with our platform.
                  </li>
                  <li>
                    <strong>Functionality cookies:</strong> Remember your
                    preferences and settings.
                  </li>
                  <li>
                    <strong>Targeting cookies:</strong> Deliver more relevant
                    advertisements.
                  </li>
                </ul>
                <p className="mt-3">
                  You can manage your cookie preferences through your browser
                  settings. Please note that disabling certain cookies may
                  affect the functionality of our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaFingerprint className="mr-2" />
                  6. Your Privacy Rights
                </h2>
                <p>
                  Depending on your jurisdiction, you may have the following
                  rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    <strong>Right to Access:</strong> You may request access to
                    the personal information we hold about you.
                  </li>
                  <li>
                    <strong>Right to Rectification:</strong> You may request
                    that we correct inaccurate or incomplete information.
                  </li>
                  <li>
                    <strong>Right to Erasure:</strong> You may request that we
                    delete your personal information in certain circumstances.
                  </li>
                  <li>
                    <strong>Right to Restrict Processing:</strong> You may
                    request that we restrict the processing of your personal
                    information.
                  </li>
                  <li>
                    <strong>Right to Data Portability:</strong> You may request
                    a copy of your personal information in a structured,
                    machine-readable format.
                  </li>
                  <li>
                    <strong>Right to Object:</strong> You may object to our
                    processing of your personal information for certain
                    purposes.
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us using the
                  information provided in the "Contact Us" section below.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaGlobe className="mr-2" />
                  7. International Data Transfers
                </h2>
                <p>
                  Fidelity First Brokers operates globally, and your personal
                  information may be transferred to, stored, and processed in
                  countries other than your country of residence. These
                  countries may have different data protection laws than your
                  country.
                </p>
                <p className="mt-2">
                  When we transfer your personal information internationally, we
                  implement appropriate safeguards to ensure that your
                  information receives an adequate level of protection,
                  including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    Standard contractual clauses approved by relevant data
                    protection authorities
                  </li>
                  <li>Privacy certifications</li>
                  <li>Corporate rules and policies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaShieldAlt className="mr-2" />
                  8. Data Retention
                </h2>
                <p>
                  We retain your personal information for as long as necessary
                  to fulfill the purposes outlined in this Privacy Policy,
                  unless a longer retention period is required or permitted by
                  law. The criteria used to determine our retention periods
                  include:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>The duration of our relationship with you</li>
                  <li>Legal obligations to retain data for certain periods</li>
                  <li>Relevant statutes of limitations</li>
                  <li>Potential disputes</li>
                  <li>Guidelines from regulatory authorities</li>
                </ul>
                <p className="mt-3">
                  When personal information is no longer necessary, we securely
                  delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaEnvelope className="mr-2" />
                  9. Marketing Communications
                </h2>
                <p>
                  We may send you marketing communications about our products
                  and services that may be of interest to you. You can opt out
                  of receiving marketing communications at any time by:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    Clicking the "unsubscribe" link in our marketing emails
                  </li>
                  <li>
                    Adjusting your communication preferences in your account
                    settings
                  </li>
                  <li>Contacting our customer support team</li>
                </ul>
                <p className="mt-3">
                  Please note that even if you opt out of marketing
                  communications, we may still send you non-marketing
                  communications related to your account and our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaUserShield className="mr-2" />
                  10. Children's Privacy
                </h2>
                <p>
                  Our services are not directed to individuals under the age of
                  18. We do not knowingly collect personal information from
                  children. If you are a parent or guardian and believe that
                  your child has provided us with personal information, please
                  contact us, and we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaGlobe className="mr-2" />
                  11. Third-Party Links and Services
                </h2>
                <p>
                  Our platform may contain links to third-party websites,
                  services, or applications that are not operated by us. We are
                  not responsible for the privacy practices of these third
                  parties. We encourage you to review the privacy policies of
                  any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaShieldAlt className="mr-2" />
                  12. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or legal requirements. We will notify
                  you of any material changes by posting the new Privacy Policy
                  on our platform and updating the "Last Updated" date.
                </p>
                <p className="mt-2">
                  We encourage you to review this Privacy Policy periodically
                  for the latest information on our privacy practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-primary-400 flex items-center">
                  <FaEnvelope className="mr-2" />
                  13. Contact Us
                </h2>
                <p>
                  If you have any questions, concerns, or requests regarding
                  this Privacy Policy or our privacy practices, please contact
                  our Data Protection Officer at:
                </p>
                <div className="mt-2 bg-gray-700/50 p-4 rounded-lg">
                  <p>Fidelity First Brokers</p>
                  <p>Email: privacy@fidelityfirstbrokers.com</p>
                  <p>Address: 123 Financial Street, Suite 4500</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
                <p className="mt-3">
                  We will respond to your inquiries as soon as possible and
                  within the timeframe required by applicable law.
                </p>
              </section>
            </div>

            <div className="mt-12 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-8">
              <div className="flex items-center mb-4 md:mb-0">
                <FaUserShield className="text-primary-500 text-2xl mr-3" />
                <div>
                  <h3 className="font-semibold">Your Privacy Matters</h3>
                  <p className="text-gray-400 text-sm">
                    We're committed to protecting your data
                  </p>
                </div>
              </div>
              <Link
                to="/terms"
                className="bg-primary-700 hover:bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
              >
                <FaShieldAlt className="mr-2" />
                View Terms of Service
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
            <Link to="/terms" className="text-primary-400 hover:underline mx-2">
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-primary-400 hover:underline mx-2"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="text-primary-400 hover:underline mx-2"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
