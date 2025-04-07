import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";

const ContactSection4 = () => {
  const { darkMode } = useDarkMode();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      ref={ref}
      className="py-20 px-4 bg-gradient-to-r from-primary-500 to-primary-700"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          className="text-center text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Trading with Confidence
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of traders worldwide who trust our platform for their investment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className={`px-8 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center ${
                darkMode 
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-white hover:bg-gray-100 text-primary-600'
              }`}
            >
              Open Account <FaArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/demo" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              Try Demo Account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection4;