import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaGlobeAmericas,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const AboutSection2 = () => {
  const { darkMode } = useDarkMode();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const values = [
    {
      id: 1,
      title: "Client-Centric Approach",
      description:
        "We prioritize our clients' needs and goals, ensuring personalized solutions and exceptional service.",
      icon: <FaUsers />,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      id: 2,
      title: "Integrity & Transparency",
      description:
        "We operate with the highest ethical standards, ensuring complete transparency in all our dealings.",
      icon: <FaShieldAlt />,
      color: "bg-green-500/20 text-green-400",
    },
    {
      id: 3,
      title: "Innovation & Excellence",
      description:
        "We continuously innovate and improve our services to deliver exceptional investment solutions.",
      icon: <FaChartLine />,
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      id: 4,
      title: "Global Perspective",
      description:
        "We leverage our global network and expertise to identify the best investment opportunities worldwide.",
      icon: <FaGlobeAmericas />,
      color: "bg-red-500/20 text-red-400",
    },
  ];

  return (
    <section
      className={`py-20 px-4 ${darkMode ? "bg-gray-900/80" : "bg-gray-100"}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`text-3xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
          >
            Our Values & Mission
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg mb-6`}
            >
              At Fidelity First Brokers, we are guided by our commitment to
              excellence, integrity, and client success. Our mission is to
              empower individuals and organizations to achieve their financial
              aspirations through intelligent investment strategies and
              personalized guidance.
            </p>
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg`}
            >
              We believe in building long-term relationships with our clients
              based on trust, transparency, and consistent results. Our values
              shape every aspect of our business and ensure that we always put
              our clients first.
            </p>
          </motion.div>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {values.map((value) => (
            <motion.div
              key={value.id}
              variants={itemVariants}
              className={`${
                darkMode
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-primary-500"
                  : "bg-white backdrop-blur-sm border border-gray-200 hover:border-primary-500 shadow-lg"
              } p-6 rounded-xl transition-all duration-300`}
            >
              <div
                className={`w-16 h-16 rounded-full ${value.color} flex items-center justify-center mb-5 text-2xl`}
              >
                {value.icon}
              </div>
              <h3
                className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-3`}
              >
                {value.title}
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection2;
