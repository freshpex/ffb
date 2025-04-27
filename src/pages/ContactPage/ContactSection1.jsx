import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";

const ContactSection1 = () => {
  const { darkMode } = useDarkMode();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`py-28 px-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
      } flex items-center`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className={darkMode ? "text-white" : "text-gray-900"}>
                Get in{" "}
              </span>
              <span className="text-primary-500">Touch</span>
            </h1>
            <p
              className={`text-lg mb-8 max-w-lg mx-auto md:mx-0 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              We're here to help with any questions you might have about our
              services, platform, or investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#contact-form"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300 inline-flex items-center justify-center"
              >
                Contact Us
              </a>
              <a
                href="#faq"
                className={`px-6 py-3 rounded-lg transition-colors duration-300 inline-flex items-center justify-center ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                View FAQs
              </a>
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src="/src/assets/images/meric-dagli-XR5Fudiw1Z4-unsplash.jpg"
              alt="Customer Support"
              className="max-w-full mx-auto"
              style={{ maxHeight: "400px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Contact+Us";
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection1;
