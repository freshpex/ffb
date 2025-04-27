import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaSpinner } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

const ComponentLoader = ({
  height = "200px",
  message = "Loading...",
  type = "default",
}) => {
  const { darkMode } = useDarkMode();

  // Different loader styles for different components
  const loaderTypes = {
    default: {
      bg: darkMode ? "bg-gray-800" : "bg-gray-100",
      textColor: darkMode ? "text-gray-300" : "text-gray-600",
      spinner: "text-primary-500",
    },
    card: {
      bg: darkMode ? "bg-gray-800" : "bg-gray-100/50",
      textColor: darkMode ? "text-gray-300" : "text-gray-600",
      spinner: "text-primary-500",
    },
    chart: {
      bg: darkMode ? "bg-gray-800/50" : "bg-gray-100/30",
      textColor: darkMode ? "text-gray-400" : "text-gray-500",
      spinner: "text-primary-400",
    },
    table: {
      bg: darkMode ? "bg-gray-800/70" : "bg-gray-100/50",
      textColor: darkMode ? "text-gray-400" : "text-gray-500",
      spinner: "text-primary-400",
    },
  };

  const style = loaderTypes[type];

  return (
    <motion.div
      className={`w-full rounded-lg ${style.bg} ${darkMode ? "shadow-none" : "shadow-md"} flex flex-col items-center justify-center overflow-hidden`}
      style={{ height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-3"
      >
        <FaSpinner className={`text-3xl ${style.spinner}`} />
      </motion.div>
      <p className={`${style.textColor} text-sm`}>{message}</p>
    </motion.div>
  );
};

ComponentLoader.propTypes = {
  height: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(["default", "card", "chart", "table"]),
};

export default ComponentLoader;
