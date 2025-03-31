import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { FaArrowRight, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const AboutSection5 = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  const stats = [
    { label: "Client Satisfaction", value: "97%" },
    { label: "Assets Under Management", value: "$150M+" },
    { label: "Investment Specialists", value: "50+" },
    { label: "Global Markets", value: "24" }
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-b from-primary-900/40 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Join Thousands of Satisfied Investors
              </h2>
              
              <p className="text-gray-300 text-lg mb-8">
                Take the first step towards financial freedom with Fidelity First Brokers. Our expert team is ready to help you build and grow your investment portfolio.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700"
                  >
                    <p className="text-primary-500 font-bold text-3xl mb-1">{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  Open an Account <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  Contact Sales Team
                </Link>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Contact Us</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="john.doe@example.com"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Message</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white min-h-[120px]"
                  placeholder="I'm interested in learning more about..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-4">Or reach us directly:</p>
              
              <div className="space-y-3">
                <a href="tel:+15551234567" className="flex items-center text-gray-300 hover:text-primary-500 transition-colors">
                  <FaPhoneAlt className="mr-3 text-primary-500" />
                  +1 (555) 123-4567
                </a>
                <a href="mailto:info@fidelityfirst.com" className="flex items-center text-gray-300 hover:text-primary-500 transition-colors">
                  <FaEnvelope className="mr-3 text-primary-500" />
                  info@fidelityfirst.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection5;