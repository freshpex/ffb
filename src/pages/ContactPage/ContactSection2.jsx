import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaComment,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const ContactSection2 = () => {
  const { darkMode } = useDarkMode();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real app, you would send the form data to your backend
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to send your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact-form"
      ref={ref}
      className={`py-20 px-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
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
            Contact Form
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Fill out this form and we'll get back to you as soon as possible
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            className={`w-full md:w-1/3 ${
              darkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200 shadow-lg"
            } rounded-xl p-6`}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8">
              <div className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-full ${
                    darkMode ? "bg-primary-900/50" : "bg-primary-100"
                  } flex items-center justify-center mr-4 flex-shrink-0`}
                >
                  <FaEnvelope className="text-primary-500" />
                </div>
                <div>
                  <h4
                    className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Email
                  </h4>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}
                  >
                    support@fidelityfirstbrokers.com
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    info@fidelityfirstbrokers.com
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-full ${
                    darkMode ? "bg-primary-900/50" : "bg-primary-100"
                  } flex items-center justify-center mr-4 flex-shrink-0`}
                >
                  <FaPhone className="text-primary-500" />
                </div>
                <div>
                  <h4
                    className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Phone
                  </h4>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}
                  >
                    +44 (787) 847 2046
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Mon-SAT: 8am - 8pm UST
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-full ${
                    darkMode ? "bg-primary-900/50" : "bg-primary-100"
                  } flex items-center justify-center mr-4 flex-shrink-0`}
                >
                  <FaMapMarkerAlt className="text-primary-500" />
                </div>
                <div>
                  <h4
                    className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Office
                  </h4>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}
                  >
                    13 Poland Street
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    London, WIF7BJ
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`w-full md:w-2/3 ${
              darkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200 shadow-lg"
            } rounded-xl p-6`}
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FaCheckCircle
                  className={`text-6xl mb-6 ${darkMode ? "text-green-400" : "text-green-500"}`}
                />
                <h3
                  className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Message Sent!
                </h3>
                <p
                  className={`text-center max-w-md ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Thank you for contacting us. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaUser
                          className={
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }
                        />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`block w-full pl-10 py-3 ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                            : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                        } rounded-lg border`}
                        placeholder="Your name"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaEnvelope
                          className={
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }
                        />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`block w-full pl-10 py-3 ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                            : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                        } rounded-lg border`}
                        placeholder="your.email@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaComment
                        className={darkMode ? "text-gray-500" : "text-gray-400"}
                      />
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-10 py-3 ${
                        darkMode
                          ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                      } rounded-lg border`}
                      placeholder="How can we help you?"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className={`block w-full py-3 px-4 ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600"
                    } rounded-lg border`}
                    placeholder="Your message here..."
                    disabled={loading}
                  ></textarea>
                </div>

                {error && (
                  <div className="px-4 py-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center justify-center py-3 px-6 w-full ${
                    loading
                      ? "bg-primary-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  } rounded-lg text-white font-medium transition-colors duration-300`}
                >
                  {loading && <FaSpinner className="animate-spin mr-2" />}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection2;
