import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import {
  FaLightbulb,
  FaLock,
  FaUserFriends,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const ContactSection3 = () => {
  const { darkMode } = useDarkMode();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const faqs = [
    {
      id: 1,
      question: "How do I open a trading account?",
      answer:
        'Opening an account is simple. Click the "Sign Up" button, fill in your details, verify your email, and complete our KYC process. Once approved, you can deposit funds and start trading.',
      icon: <FaUserFriends />,
    },
    {
      id: 2,
      question: "Is my personal and financial information secure?",
      answer:
        "Yes, we use enterprise-grade security measures including encryption and secure data storage. We also employ strict verification protocols and regular security audits to protect your information.",
      icon: <FaLock />,
    },
    {
      id: 3,
      question: "What are the minimum deposit requirements?",
      answer:
        "Our standard accounts have a minimum deposit of $100. Premium accounts require $10,000, and VIP accounts start at $50,000. Different investment plans may have their own minimums.",
      icon: <FaMoneyBillWave />,
    },
    {
      id: 4,
      question: "How can I learn more about trading?",
      answer:
        "We offer extensive educational resources including webinars, tutorials, market analysis, and one-on-one coaching sessions with experienced traders. Visit our Learning Center for more information.",
      icon: <FaLightbulb />,
    },
  ];

  return (
    <section
      id="faq"
      ref={ref}
      className={`py-20 px-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Frequently Asked Questions
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Find quick answers to common questions about our services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className={`flex p-6 rounded-xl ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white shadow-lg border border-gray-100"
              } transition-all duration-300 hover:border-primary-500`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`w-14 h-14 rounded-full ${
                  darkMode ? "bg-primary-900/30" : "bg-primary-100"
                } flex items-center justify-center text-primary-500 text-xl flex-shrink-0 mr-4`}
              >
                {faq.icon}
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {faq.question}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Still have questions? Check our{" "}
            <a
              href="/help-center"
              className="text-primary-500 hover:text-primary-600 transition-colors"
            >
              Help Center
            </a>{" "}
            or contact our support team.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection3;
